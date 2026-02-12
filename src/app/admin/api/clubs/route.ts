import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { confirmAdmin } from "@/lib/auth-utils";
import { REGIONS } from "@/lib/constants";

const LIST_SELECT = {
    id: true,
    name: true,
    slug: true,
    area: true,
    city: true,
    updatedAt: true,
} as const;

export async function GET(request: NextRequest) {
    const admin = await confirmAdmin();
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? undefined;
    const region = searchParams.get("region") ?? undefined;
    const pref = searchParams.get("pref") ?? undefined;

    const where: Prisma.ClubWhereInput = { id: { not: "official-hq" } };
    if (q) where.name = { contains: q, mode: "insensitive" };
    if (pref) where.area = { equals: pref };
    else if (region && region in REGIONS) where.area = { in: REGIONS[region as keyof typeof REGIONS] };

    const clubs = await prisma.club.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        select: LIST_SELECT,
    });

    return NextResponse.json(clubs);
}
