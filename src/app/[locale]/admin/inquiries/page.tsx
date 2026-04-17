import React from "react";
import InquiriesListClient from "@/components/admin/inquiries/InquiriesListClient";
import { confirmAdmin } from "@/lib/auth-utils";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import {
    fetchInquiriesAdminPage,
    getInquiryStatusCounts,
} from "@/lib/admin-inquiries-list";

export default async function AdminInquiriesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const locale = await getLocale();
    const admin = await confirmAdmin();
    if (!admin) redirect({ href: "/admin", locale });

    const { page: pageParam } = await searchParams;
    const page = Math.max(1, parseInt(String(pageParam || "1"), 10) || 1);

    const [statusCounts, pageData] = await Promise.all([
        getInquiryStatusCounts(),
        fetchInquiriesAdminPage(page),
    ]);

    const serializedInquiries = pageData.inquiries.map((inq) => ({
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

    return (
        <div className="max-w-6xl mx-auto space-y-6 font-sans">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">お問い合わせ管理</h1>
                    <p className="text-gray-500 mt-1 text-xs md:text-sm">
                        コンタクトフォームからのお問い合わせを一覧で確認できます
                    </p>
                </div>
            </div>
            <InquiriesListClient
                initialData={{
                    inquiries: serializedInquiries,
                    total: pageData.total,
                    totalPages: pageData.totalPages,
                    page: pageData.page,
                    statusCounts,
                }}
            />
        </div>
    );
}
