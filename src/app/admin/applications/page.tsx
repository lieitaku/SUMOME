import React from "react";
import ApplicationsListClient from "@/components/admin/applications/ApplicationsListClient";

export default function AdminApplicationsPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-6 font-sans">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">入会申請管理</h1>
                    <p className="text-gray-500 mt-1 text-xs md:text-sm">
                        各道場への入会・体験希望者からのメッセージを一覧で確認できます
                    </p>
                </div>
            </div>
            <ApplicationsListClient />
        </div>
    );
}
