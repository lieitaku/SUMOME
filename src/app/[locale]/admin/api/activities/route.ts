import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { confirmAdmin } from "@/lib/auth-utils";
import { REGIONS } from "@/lib/constants";

export async function GET(request: NextRequest) {
    const admin = await confirmAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? undefined;
    const category = searchParams.get("category") ?? undefined;
    const region = searchParams.get("region") ?? undefined;
    const pref = searchParams.get("pref") ?? undefined;

    const where: Prisma.ActivityWhereInput = {};
    if (q) where.title = { contains: q, mode: "insensitive" };
    if (category && category !== "all") where.category = { equals: category };
    if (pref) where.club = { area: { equals: pref } };
    else if (region && region in REGIONS) where.club = { area: { in: REGIONS[region as keyof typeof REGIONS] } };

    const activities = await prisma.activity.findMany({
        where,
        select: {
            id: true,
            title: true,
            category: true,
            date: true,
            published: true,
            club: { select: { name: true, area: true } },
        },
        orderBy: { date: "desc" },
    });

    return NextResponse.json(activities);
}
