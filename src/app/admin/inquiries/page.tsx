import React from "react";
import InquiriesListClient from "@/components/admin/inquiries/InquiriesListClient";

export default function AdminInquiriesPage() {
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
            <InquiriesListClient />
        </div>
    );
}
