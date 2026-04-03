import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { confirmAdmin } from "@/lib/auth-utils";
import { BannerCategory } from "@prisma/client";

export async function GET(request: NextRequest) {
    const admin = await confirmAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;

    const whereClause = category && (category === "club" || category === "sponsor")
        ? { category: category as BannerCategory }
        : {};

    const orderBy = category && (category === "club" || category === "sponsor")
        ? { sortOrder: "asc" as const }
        : [{ category: "asc" as const }, { sortOrder: "asc" as const }];

    const [banners, allBanners] = await Promise.all([
        prisma.banner.findMany({
            where: whereClause,
            orderBy,
        }),
        prisma.banner.findMany({
            orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
        }),
    ]);

    const clubBanners = allBanners.filter(b => b.category === "club");
    const sponsorBanners = allBanners.filter(b => b.category === "sponsor");
    const activeCount = allBanners.filter(b => b.isActive).length;

    return NextResponse.json({
        banners,
        stats: {
            total: allBanners.length,
            club: clubBanners.length,
            sponsor: sponsorBanners.length,
            active: activeCount,
        },
    });
}
