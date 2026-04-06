import React from "react";
import InquiriesListClient from "@/components/admin/inquiries/InquiriesListClient";
import { prisma } from "@/lib/db";
import { confirmAdmin } from "@/lib/auth-utils";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function AdminInquiriesPage() {
    const locale = await getLocale();
    const admin = await confirmAdmin();
    if (!admin) redirect({ href: "/admin", locale });

    const inquiries = await prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            inquiryType: true,
            name: true,
            furigana: true,
            email: true,
            phone: true,
            message: true,
            status: true,
            createdAt: true,
        },
    });

    const serializedInquiries = inquiries.map(inq => ({
        ...inq,
        createdAt: inq.createdAt.toISOString(),
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
            <InquiriesListClient initialData={serializedInquiries} />
        </div>
    );
}
