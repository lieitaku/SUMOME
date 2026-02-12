"use client";

import React, { useEffect, useState } from "react";
import { CalendarDays, User, Mail, MessageSquare, Phone } from "lucide-react";
import StatusSelect from "@/components/admin/applications/StatusSelect";
import DeleteApplicationButton from "@/components/admin/applications/DeleteApplicationButton";

export type ApplicationListItem = {
    id: string;
    clubName: string;
    name: string;
    email: string;
    phone: string | null;
    experience: string;
    message: string | null;
    status: string;
    createdAt: string;
};

function Fallback() {
    return (
        <>
            <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 text-center animate-pulse">
                        <div className="h-8 w-12 bg-gray-200 rounded mx-auto mb-2" />
                        <div className="h-4 w-16 bg-gray-100 rounded mx-auto" />
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-32 border-b border-gray-100" />
                <div className="h-32 border-b border-gray-100" />
                <div className="h-32" />
            </div>
        </>
    );
}

function Content({ apps }: { apps: ApplicationListItem[] }) {
    const statusCounts = {
        pending: apps.filter(a => a.status === "pending").length,
        contacted: apps.filter(a => a.status === "contacted").length,
        completed: apps.filter(a => a.status === "completed").length,
    };

    return (
        <>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-yellow-500">{statusCounts.pending}</div>
                    <div className="text-xs text-gray-400 font-bold">未対応</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-blue-500">{statusCounts.contacted}</div>
                    <div className="text-xs text-gray-400 font-bold">連絡済み</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-green-500">{statusCounts.completed}</div>
                    <div className="text-xs text-gray-400 font-bold">対応完了</div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {apps.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        現在、新しい申請はありません。
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {apps.map((app) => (
                            <div key={app.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="bg-sumo-brand text-white text-[10px] font-black px-2 py-1 rounded tracking-widest uppercase">
                                                {app.clubName}
                                            </span>
                                            <span className="text-[10px] font-normal text-gray-400 px-1.5 py-0.5 border rounded">
                                                {app.experience === "beginner" ? "未経験者" : "経験者"}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                                <CalendarDays size={14} />
                                                {new Date(app.createdAt).toLocaleString("ja-JP")}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div className="flex items-center gap-2 font-bold text-gray-900">
                                                <User size={16} className="text-gray-400" />
                                                {app.name}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail size={16} className="text-gray-400" />
                                                {app.email}
                                            </div>
                                            {app.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone size={16} className="text-gray-400" />
                                                    {app.phone}
                                                </div>
                                            )}
                                        </div>
                                        {app.message && (
                                            <div className="flex gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-500">
                                                <MessageSquare size={16} className="shrink-0 mt-1 text-gray-400" />
                                                <p>{app.message}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="lg:w-48 flex flex-col justify-between items-end gap-4 lg:border-l lg:border-gray-100 lg:pl-6">
                                        <div className="text-right w-full">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                                                Status
                                            </label>
                                            <StatusSelect id={app.id} initialStatus={app.status} />
                                        </div>
                                        <DeleteApplicationButton id={app.id} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default function ApplicationsListClient() {
    const [list, setList] = useState<ApplicationListItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/admin/api/applications")
            .then((res) => {
                if (!res.ok) throw new Error(res.status === 401 ? "Unauthorized" : "Failed to load");
                return res.json();
            })
            .then((data: ApplicationListItem[]) => setList(data))
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Failed to load");
                setList([]);
            })
            .finally(() => setLoading(false));
    }, []);

    if (error) {
        return (
            <div className="py-12 text-center text-red-500 text-sm">
                {error === "Unauthorized" ? "ログインしてください。" : "読み込みに失敗しました。"}
            </div>
        );
    }
    if (loading || list === null) return <Fallback />;
    return <Content apps={list} />;
}
