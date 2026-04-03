import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { confirmAdmin } from "@/lib/auth-utils";

const INQUIRY_SELECT = {
    id: true,
    inquiryType: true,
    name: true,
    furigana: true,
    email: true,
    phone: true,
    message: true,
    status: true,
    createdAt: true,
} as const;

export async function GET() {
    const admin = await confirmAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const inquiries = await prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        select: INQUIRY_SELECT,
    });

    return NextResponse.json(inquiries);
}
