import { NextRequest, NextResponse } from "next/server";
import { confirmAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const admin = await confirmAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const row = await prisma.inquiry.findUnique({
        where: { id },
        select: { lastReplyBody: true, message: true },
    });
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
        lastReplyBody: row.lastReplyBody,
        message: row.message,
    });
}
