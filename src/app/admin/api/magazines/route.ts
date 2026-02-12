import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { confirmAdmin } from "@/lib/auth-utils";
import { REGIONS } from "@/lib/constants";

const PAGE_SIZE = 12;

export async function GET(request: NextRequest) {
    const admin = await confirmAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? undefined;
    const region = searchParams.get("region") ?? undefined;
    const pref = searchParams.get("pref") ?? undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

    const where: Prisma.MagazineWhereInput = {};
    if (q) where.title = { contains: q, mode: "insensitive" };
    if (pref) where.region = { equals: pref };
    else if (region && region in REGIONS) where.region = { in: REGIONS[region as keyof typeof REGIONS] };

    const [magazines, total] = await Promise.all([
        prisma.magazine.findMany({
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
        }),
        prisma.magazine.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    return NextResponse.json({ magazines, total, totalPages, page });
}
