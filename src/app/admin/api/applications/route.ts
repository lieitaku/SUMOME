import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { confirmAdmin } from "@/lib/auth-utils";

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
    const admin = await confirmAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const apps = await prisma.application.findMany({
        orderBy: { createdAt: "desc" },
        select: APP_SELECT,
    });

    return NextResponse.json(apps);
}
