import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

const APP_SELECT = {
    id: true,
    clubName: true,
    name: true,
    email: true,
    phone: true,
    experience: true,
    message: true,
    status: true,
    createdAt: true,
} as const;

export async function GET() {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (user.role === "ADMIN") {
        const apps = await prisma.application.findMany({
            orderBy: { createdAt: "desc" },
            select: APP_SELECT,
        });
        return NextResponse.json(apps);
    }

    const myClubIds = await prisma.club.findMany({
        where: { ownerId: user.id },
        select: { id: true },
    }).then((rows) => rows.map((r) => r.id));
    if (myClubIds.length === 0) {
        return NextResponse.json([]);
    }

    const apps = await prisma.application.findMany({
        where: { clubId: { in: myClubIds } },
        orderBy: { createdAt: "desc" },
        select: APP_SELECT,
    });
    return NextResponse.json(apps);
}
