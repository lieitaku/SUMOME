"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Pencil, Calendar } from "lucide-react";
import Link from "@/components/ui/TransitionLink";
import { cn } from "@/lib/utils";

export type ActivityListItem = {
    id: string;
    title: string;
    category: string;
    date: string;
    published: boolean;
    club: { name: string; area: string } | null;
};

function Fallback() {
    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm animate-pulse">
                        <div className="h-5 w-2/3 bg-gray-200 rounded mb-2" />
                        <div className="h-4 w-1/2 bg-gray-100 rounded mb-3" />
                        <div className="h-10 bg-gray-100 rounded" />
                    </div>
                ))}
            </div>
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-12 bg-gray-50 border-b border-gray-200" />
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-14 border-b border-gray-100 flex gap-4 px-6 items-center">
                        <div className="h-4 flex-1 bg-gray-200 rounded" />
                        <div className="h-4 w-24 bg-gray-100 rounded" />
                        <div className="h-4 w-16 bg-gray-100 rounded" />
                    </div>
                ))}
            </div>
        </>
    );
}

function Content({ activities }: { activities: ActivityListItem[] }) {
    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {activities.map((act) => (
                    <div key={act.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-[9px] font-black uppercase",
                                        act.published ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                                    )}>
                                        {act.published ? "公開中" : "下書き"}
                                    </span>
                                    <span className="text-[10px] font-bold text-sumo-brand uppercase tracking-wider">{act.category}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 leading-tight">{act.title}</h3>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-3">
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-gray-400" />
                                <span className="text-xs">{act.club?.name} ({act.club?.area})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-gray-400" />
                                <span className="text-xs font-mono">{new Date(act.date).toLocaleDateString("ja-JP")}</span>
                            </div>
                        </div>
                        <Link
                            href={`/admin/activities/${act.id}`}
                            className="flex items-center justify-center gap-2 w-full bg-gray-50 text-sumo-brand font-bold py-2.5 rounded-lg border border-gray-200 hover:bg-sumo-brand hover:text-white transition-all"
                        >
                            <Pencil size={16} />
                            詳細・編集
                        </Link>
                    </div>
                ))}
            </div>
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">活動タイトル / カテゴリ</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">所属クラブ</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ステータス</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">編集</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {activities.map((act) => (
                            <tr key={act.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900 line-clamp-1">{act.title}</div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] font-bold text-sumo-brand uppercase">{act.category}</span>
                                        <span className="text-[10px] text-gray-400 font-mono">
                                            {new Date(act.date).toLocaleDateString("ja-JP")}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-600">{act.club?.name}</div>
                                    <div className="text-[10px] text-gray-400">{act.club?.area}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                        act.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                    )}>
                                        {act.published ? "公開中" : "下書き"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/admin/activities/${act.id}`}
                                        className="inline-block p-2 text-sumo-brand hover:bg-blue-50 rounded-md transition-colors"
                                    >
                                        <Pencil size={18} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {activities.length === 0 && (
                    <div className="px-6 py-12 text-center text-gray-400 text-sm">データが見つかりませんでした。</div>
                )}
            </div>
        </>
    );
}

interface Props {
    initialQ?: string;
    initialCategory?: string;
    initialRegion?: string;
    initialPref?: string;
}

export default function ActivitiesListClient({ initialQ, initialCategory, initialRegion, initialPref }: Props) {
    const [list, setList] = useState<ActivityListItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams();
        if (initialQ) params.set("q", initialQ);
        if (initialCategory) params.set("category", initialCategory);
        if (initialRegion) params.set("region", initialRegion);
        if (initialPref) params.set("pref", initialPref);
        const query = params.toString();
        const url = query ? `/admin/api/activities?${query}` : "/admin/api/activities";

        setLoading(true);
        setError(null);
        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(res.status === 401 ? "Unauthorized" : "Failed to load");
                return res.json();
            })
            .then((data: ActivityListItem[]) => setList(data))
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Failed to load");
                setList([]);
            })
            .finally(() => setLoading(false));
    }, [initialQ, initialCategory, initialRegion, initialPref]);

    if (error) {
        return (
            <div className="py-12 text-center text-red-500 text-sm">
                {error === "Unauthorized" ? "ログインしてください。" : "読み込みに失敗しました。"}
            </div>
        );
    }
    if (loading || list === null) return <Fallback />;
    return <Content activities={list} />;
}
