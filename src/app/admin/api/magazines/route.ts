import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { confirmAdmin } from "@/lib/auth-utils";
import { REGIONS } from "@/lib/constants";
import { getPrefectureIndex } from "@/lib/prefecture-order";

const PAGE_SIZE = 12;

export async function GET(request: NextRequest) {
    const admin = await confirmAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? undefined;
    const region = searchParams.get("region") ?? undefined;
    const pref = searchParams.get("pref") ?? undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const sort = searchParams.get("sort") === "time" ? "time" : "area";

    const where: Prisma.MagazineWhereInput = {};
    if (q) where.title = { contains: q, mode: "insensitive" };
    if (pref) where.region = { equals: pref };
    else if (region && region in REGIONS) where.region = { in: REGIONS[region as keyof typeof REGIONS] };

    const total = await prisma.magazine.count({ where });

    let magazines: Awaited<ReturnType<typeof prisma.magazine.findMany>>;
    if (sort === "area") {
        const all = await prisma.magazine.findMany({
            where,
            select: {
                id: true,
                title: true,
                slug: true,
                region: true,
                coverImage: true,
                pdfUrl: true,
                issueDate: true,
                published: true,
            },
        });
        all.sort((a, b) => getPrefectureIndex(a.region) - getPrefectureIndex(b.region));
        magazines = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    } else {
        magazines = await prisma.magazine.findMany({
            where,
            orderBy: { issueDate: "desc" },
            take: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
            select: {
                id: true,
                title: true,
                slug: true,
                region: true,
                coverImage: true,
                pdfUrl: true,
                issueDate: true,
                published: true,
            },
        });
    }

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    return NextResponse.json({ magazines, total, totalPages, page });
}
