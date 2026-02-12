"use client";

import React, { useEffect, useState } from "react";
import { BookOpen, Calendar, Pencil, ExternalLink, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "@/components/ui/TransitionLink";
import Image from "next/image";

const PAGE_SIZE = 12;

export type MagazineListItem = {
    id: string;
    title: string;
    slug: string;
    region: string;
    coverImage: string | null;
    pdfUrl: string | null;
    issueDate: string;
    published: boolean;
};

function buildSearchParams(params: { q?: string; region?: string; pref?: string; page?: number }) {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (params.region) sp.set("region", params.region);
    if (params.pref) sp.set("pref", params.pref);
    if (params.page && params.page > 1) sp.set("page", String(params.page));
    return sp.toString();
}

function Fallback() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm animate-pulse">
                    <div className="aspect-3/4 bg-gray-200" />
                    <div className="p-6 space-y-3">
                        <div className="flex gap-2">
                            <div className="h-4 w-24 bg-gray-100 rounded" />
                            <div className="h-4 w-12 bg-gray-100 rounded" />
                        </div>
                        <div className="h-5 w-full bg-gray-200 rounded" />
                        <div className="h-5 w-3/4 bg-gray-100 rounded" />
                        <div className="pt-4 border-t border-gray-50 flex justify-between">
                            <div className="h-4 w-12 bg-gray-100 rounded" />
                            <div className="h-8 w-8 bg-gray-100 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function Content({
    magazines,
    total,
    totalPages,
    page,
    q,
    region,
    pref,
}: {
    magazines: MagazineListItem[];
    total: number;
    totalPages: number;
    page: number;
    q?: string;
    region?: string;
    pref?: string;
}) {
    const query = { q, region, pref };
    const hasPrev = page > 1;
    const hasNext = page < totalPages;

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {magazines.map((mag) => (
                    <div key={mag.id} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                        <div className="relative aspect-3/4 bg-gray-100 overflow-hidden">
                            {mag.coverImage ? (
                                <Image
                                    src={mag.coverImage}
                                    alt={mag.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                                    <BookOpen size={48} strokeWidth={1} />
                                    <span className="text-[10px] mt-2 font-bold uppercase tracking-widest">No Cover</span>
                                </div>
                            )}
                            <div className="absolute top-4 right-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${mag.published ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"}`}>
                                    {mag.published ? "Public" : "Draft"}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center gap-1.5 text-sumo-brand">
                                    <Calendar size={14} />
                                    <span className="text-xs font-bold font-mono">
                                        {new Date(mag.issueDate).toLocaleDateString("ja-JP", { year: "numeric", month: "long" })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-400">
                                    <MapPin size={12} />
                                    <span className="text-[10px] font-bold">{mag.region === "All" ? "全国" : mag.region}</span>
                                </div>
                            </div>
                            <h3 className="text-lg font-black text-gray-900 line-clamp-1 mb-4">{mag.title}</h3>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <Link
                                    href={`/admin/magazines/${mag.id}`}
                                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-sumo-brand transition-colors"
                                >
                                    <Pencil size={16} /> 編集
                                </Link>
                                {mag.pdfUrl && (
                                    <a
                                        href={mag.pdfUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-blue-50 hover:text-sumo-brand transition-all"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {magazines.length === 0 && (
                    <div className="col-span-full py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                        <BookOpen size={40} strokeWidth={1} className="mb-4" />
                        <p className="text-sm font-bold">登録された広報誌はありません</p>
                        <Link href="/admin/magazines/new" className="text-sumo-brand text-xs font-bold underline mt-2">
                            最初のデータを登録する
                        </Link>
                    </div>
                )}
            </div>
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <p className="text-sm text-gray-500">
                        {total} 件中 {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} 件目
                    </p>
                    <div className="flex items-center gap-2">
                        {hasPrev ? (
                            <Link
                                href={`/admin/magazines?${buildSearchParams({ ...query, page: page - 1 })}`}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronLeft size={18} /> 前へ
                            </Link>
                        ) : (
                            <span className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-100 text-sm text-gray-300 cursor-not-allowed">
                                <ChevronLeft size={18} /> 前へ
                            </span>
                        )}
                        <span className="px-3 py-2 text-sm text-gray-500 font-medium">
                            {page} / {totalPages}
                        </span>
                        {hasNext ? (
                            <Link
                                href={`/admin/magazines?${buildSearchParams({ ...query, page: page + 1 })}`}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                次へ <ChevronRight size={18} />
                            </Link>
                        ) : (
                            <span className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-100 text-sm text-gray-300 cursor-not-allowed">
                                次へ <ChevronRight size={18} />
                            </span>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

interface Props {
    initialQ?: string;
    initialRegion?: string;
    initialPref?: string;
    initialPage: number;
}

export default function MagazinesListClient({ initialQ, initialRegion, initialPref, initialPage }: Props) {
    const [data, setData] = useState<{ magazines: MagazineListItem[]; total: number; totalPages: number; page: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams();
        if (initialQ) params.set("q", initialQ);
        if (initialRegion) params.set("region", initialRegion);
        if (initialPref) params.set("pref", initialPref);
        if (initialPage > 1) params.set("page", String(initialPage));
        const query = params.toString();
        const url = query ? `/admin/api/magazines?${query}` : "/admin/api/magazines";

        setLoading(true);
        setError(null);
        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(res.status === 401 ? "Unauthorized" : "Failed to load");
                return res.json();
            })
            .then(setData)
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Failed to load");
                setData(null);
            })
            .finally(() => setLoading(false));
    }, [initialQ, initialRegion, initialPref, initialPage]);

    if (error) {
        return (
            <div className="py-12 text-center text-red-500 text-sm">
                {error === "Unauthorized" ? "ログインしてください。" : "読み込みに失敗しました。"}
            </div>
        );
    }
    if (loading || !data) return <Fallback />;
    return (
        <Content
            magazines={data.magazines}
            total={data.total}
            totalPages={data.totalPages}
            page={data.page}
            q={initialQ}
            region={initialRegion}
            pref={initialPref}
        />
    );
}
