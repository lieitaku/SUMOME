import { prisma } from "@/lib/db";
import type { InquiryStatus } from "@prisma/client";

export const INQUIRY_ADMIN_PAGE_SIZE = 20;

export type InquiryStatusCounts = {
    unread: number;
    read: number;
    replied: number;
    closed: number;
};

export async function getInquiryStatusCounts(): Promise<InquiryStatusCounts> {
    const rows = await prisma.inquiry.groupBy({
        by: ["status"],
        _count: { _all: true },
    });
    const base: InquiryStatusCounts = { unread: 0, read: 0, replied: 0, closed: 0 };
    for (const r of rows) {
        base[r.status] = r._count._all;
    }
    return base;
}

export type InquiryAdminListRow = {
    id: string;
    inquiryType: string;
    name: string;
    furigana: string | null;
    email: string;
    phone: string | null;
    message: string;
    status: InquiryStatus;
    createdAt: Date;
    repliedAt: Date | null;
};

/**
 * 列表：DB 端截断 message，不选 lastReplyBody（大字段按需 GET /admin/api/inquiries/[id]）
 */
export async function fetchInquiriesAdminPage(page: number): Promise<{
    inquiries: InquiryAdminListRow[];
    total: number;
    totalPages: number;
    page: number;
}> {
    const total = await prisma.inquiry.count();
    const totalPages = Math.max(1, Math.ceil(total / INQUIRY_ADMIN_PAGE_SIZE));
    const p = Math.min(Math.max(1, page), totalPages);
    const skip = (p - 1) * INQUIRY_ADMIN_PAGE_SIZE;

    const rows = await prisma.$queryRaw<
        {
            id: string;
            inquiryType: string;
            name: string;
            furigana: string | null;
            email: string;
            phone: string | null;
            message: string;
            status: string;
            createdAt: Date;
            repliedAt: Date | null;
        }[]
    >`
        SELECT
            "Inquiry"."id",
            "Inquiry"."inquiryType",
            "Inquiry"."name",
            "Inquiry"."furigana",
            "Inquiry"."email",
            "Inquiry"."phone",
            LEFT("Inquiry"."message", 400) AS message,
            "Inquiry"."status"::text AS status,
            "Inquiry"."createdAt",
            "Inquiry"."repliedAt"
        FROM "Inquiry"
        ORDER BY "Inquiry"."createdAt" DESC
        LIMIT ${INQUIRY_ADMIN_PAGE_SIZE} OFFSET ${skip}
    `;

    const inquiries: InquiryAdminListRow[] = rows.map((r) => ({
        id: r.id,
        inquiryType: r.inquiryType,
        name: r.name,
        furigana: r.furigana,
        email: r.email,
        phone: r.phone,
        message: r.message,
        status: r.status as InquiryStatus,
        createdAt: r.createdAt,
        repliedAt: r.repliedAt,
    }));

    return { inquiries, total, totalPages, page: p };
}
