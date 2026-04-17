import { prisma } from "@/lib/db";
import { REGIONS } from "@/lib/constants";
import { Prisma } from "@prisma/client";
import { sqlPrefectureOrderCase } from "@/lib/prefecture-order";

export const MAGAZINE_ADMIN_PAGE_SIZE = 12;

const magazineAdminListSelect = {
    id: true,
    title: true,
    slug: true,
    region: true,
    coverImage: true,
    pdfUrl: true,
    issueDate: true,
    published: true,
    hidden: true,
} satisfies Prisma.MagazineSelect;

export type MagazineAdminListRow = Prisma.MagazineGetPayload<{
    select: typeof magazineAdminListSelect;
}>;

/** Admin 杂志列表 WHERE（与 Prisma where 语义一致） */
export function buildMagazineAdminWherePrisma(
    q?: string,
    pref?: string,
    region?: string,
): Prisma.MagazineWhereInput {
    const where: Prisma.MagazineWhereInput = {};
    if (q) where.title = { contains: q, mode: "insensitive" };
    if (pref) where.region = { equals: pref };
    else if (region && region in REGIONS) {
        where.region = { in: REGIONS[region as keyof typeof REGIONS] };
    }
    return where;
}

/** 与 buildMagazineAdminWherePrisma 一致，供 $queryRaw 使用 */
export function buildMagazineAdminWhereSql(q?: string, pref?: string, region?: string): Prisma.Sql {
    const parts: Prisma.Sql[] = [];
    if (q) {
        parts.push(Prisma.sql`"Magazine"."title" ILIKE ${"%" + q + "%"}`);
    }
    if (pref) {
        parts.push(Prisma.sql`"Magazine"."region" = ${pref}`);
    } else if (region && region in REGIONS) {
        const prefs = REGIONS[region as keyof typeof REGIONS];
        parts.push(Prisma.sql`"Magazine"."region" IN (${Prisma.join(prefs)})`);
    }
    if (parts.length === 0) return Prisma.empty;
    return Prisma.sql`WHERE ${Prisma.join(parts, " AND ")}`;
}

export async function fetchMagazinesAdminList(params: {
    q?: string;
    pref?: string;
    region?: string;
    page: number;
    sort: "time" | "area";
}): Promise<{
    magazines: MagazineAdminListRow[];
    total: number;
    totalPages: number;
    page: number;
}> {
    const { q, pref, region, page, sort } = params;
    const where = buildMagazineAdminWherePrisma(q, pref, region);
    const total = await prisma.magazine.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / MAGAZINE_ADMIN_PAGE_SIZE));
    const skip = (page - 1) * MAGAZINE_ADMIN_PAGE_SIZE;

    let magazines: MagazineAdminListRow[];
    if (sort === "area") {
        const whereSql = buildMagazineAdminWhereSql(q, pref, region);
        const orderCase = sqlPrefectureOrderCase();
        magazines = await prisma.$queryRaw<MagazineAdminListRow[]>`
            SELECT
                "Magazine"."id",
                "Magazine"."title",
                "Magazine"."slug",
                "Magazine"."region",
                "Magazine"."coverImage",
                "Magazine"."pdfUrl",
                "Magazine"."issueDate",
                "Magazine"."published",
                "Magazine"."hidden"
            FROM "Magazine"
            ${whereSql}
            ORDER BY ${orderCase} ASC, "Magazine"."issueDate" DESC
            LIMIT ${MAGAZINE_ADMIN_PAGE_SIZE} OFFSET ${skip}
        `;
    } else {
        magazines = await prisma.magazine.findMany({
            where,
            orderBy: { issueDate: "desc" },
            take: MAGAZINE_ADMIN_PAGE_SIZE,
            skip,
            select: magazineAdminListSelect,
        });
    }

    return { magazines, total, totalPages, page };
}
