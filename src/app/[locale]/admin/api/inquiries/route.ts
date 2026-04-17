import { NextRequest, NextResponse } from "next/server";
import { confirmAdmin } from "@/lib/auth-utils";
import {
    fetchInquiriesAdminPage,
    getInquiryStatusCounts,
} from "@/lib/admin-inquiries-list";

export async function GET(request: NextRequest) {
    const admin = await confirmAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const page = Math.max(
        1,
        parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10) || 1,
    );

    const [statusCounts, pageData] = await Promise.all([
        getInquiryStatusCounts(),
        fetchInquiriesAdminPage(page),
    ]);

    const inquiries = pageData.inquiries.map((inq) => ({
        id: inq.id,
        inquiryType: inq.inquiryType,
        name: inq.name,
        furigana: inq.furigana,
        email: inq.email,
        phone: inq.phone,
        message: inq.message.length === 400 ? `${inq.message}…` : inq.message,
        status: inq.status,
        createdAt: inq.createdAt.toISOString(),
        repliedAt: inq.repliedAt ? inq.repliedAt.toISOString() : null,
        lastReplyBody: null as string | null,
    }));

    return NextResponse.json({
        inquiries,
        total: pageData.total,
        totalPages: pageData.totalPages,
        page: pageData.page,
        statusCounts,
    });
}
