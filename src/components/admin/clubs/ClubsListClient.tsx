"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MapPin, Pencil } from "lucide-react";
import Link from "@/components/ui/TransitionLink";
import SortOrderBar, { type SortMode } from "@/components/admin/ui/SortOrderBar";
import { getPrefectureIndex } from "@/lib/prefecture-order";

export type ClubListItem = {
    id: string;
    name: string;
    slug: string;
    area: string;
    city: string | null;
    updatedAt: string;
};

function ClubsListFallback() {
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
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                        <div className="h-4 w-24 bg-gray-100 rounded" />
                        <div className="h-4 w-20 bg-gray-100 rounded" />
                    </div>
                ))}
            </div>
        </>
    );
}

function ClubsListContent({
    clubs,
    sortBy,
    onSortChange,
}: {
    clubs: ClubListItem[];
    sortBy: SortMode;
    onSortChange: (v: SortMode) => void;
}) {
    return (
        <>
            <div className="flex flex-wrap items-center justify-end gap-4 mb-4">
                <SortOrderBar value={sortBy} onChange={onSortChange} />
            </div>
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {clubs.map((club) => (
                    <div key={club.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{club.name}</h3>
                            <span className="text-xs text-gray-400 font-mono">#{club.slug}</span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-3">
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-sumo-brand" />
                                <span>{club.area} {club.city}</span>
                            </div>
                        </div>
                        <Link
                            href={`/admin/clubs/${club.id}`}
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
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">クラブ名 / ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">所在地</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">更新日</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">編集</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {clubs.map((club) => (
                            <tr key={club.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{club.name}</div>
                                    <div className="text-xs text-gray-400 font-mono">#{club.slug}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                        <MapPin size={14} className="text-gray-400" />
                                        <span>{club.area} {club.city}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                    {new Date(club.updatedAt).toLocaleDateString("ja-JP")}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/admin/clubs/${club.id}`}
                                        className="inline-block p-2 text-sumo-brand hover:bg-blue-50 rounded-md transition-colors"
                                    >
                                        <Pencil size={18} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {clubs.length === 0 && (
                    <div className="px-6 py-12 text-center text-gray-400 text-sm">データが見つかりませんでした。</div>
                )}
            </div>
        </>
    );
}

interface ClubsListClientProps {
    initialQ?: string;
    initialRegion?: string;
    initialPref?: string;
}

export default function ClubsListClient({
    initialQ,
    initialRegion,
    initialPref,
}: ClubsListClientProps) {
    const [clubs, setClubs] = useState<ClubListItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sortBy, setSortBy] = useState<SortMode>("area");

    useEffect(() => {
        const params = new URLSearchParams();
        if (initialQ) params.set("q", initialQ);
        if (initialRegion) params.set("region", initialRegion);
        if (initialPref) params.set("pref", initialPref);
        const query = params.toString();
        const url = query ? `/admin/api/clubs?${query}` : "/admin/api/clubs";

        setLoading(true);
        setError(null);
        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(res.status === 401 ? "Unauthorized" : "Failed to load");
                return res.json();
            })
            .then((data: ClubListItem[]) => {
                setClubs(data);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Failed to load");
                setClubs([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [initialQ, initialRegion, initialPref]);

    const sortedClubs = useMemo(() => {
        if (!clubs) return [];
        const list = [...clubs];
        if (sortBy === "time") {
            const toTime = (d: string | null | undefined) => (d ? new Date(d).getTime() : 0);
            list.sort((a, b) => toTime(b.updatedAt) - toTime(a.updatedAt));
            return list;
        }
        list.sort((a, b) => getPrefectureIndex(a.area) - getPrefectureIndex(b.area));
        return list;
    }, [clubs, sortBy]);

    if (error) {
        return (
            <div className="py-12 text-center text-red-500 text-sm">
                {error === "Unauthorized" ? "ログインしてください。" : "読み込みに失敗しました。"}
            </div>
        );
    }

    if (loading || clubs === null) {
        return <ClubsListFallback />;
    }

    return (
        <ClubsListContent
            clubs={sortedClubs}
            sortBy={sortBy}
            onSortChange={setSortBy}
        />
    );
}
