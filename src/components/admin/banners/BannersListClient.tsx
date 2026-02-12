"use client";

import React, { useEffect, useState } from "react";
import { Image as ImageIcon, Plus, Flag, Building2, Megaphone } from "lucide-react";
import Link from "next/link";
import BannerCard from "@/components/admin/banners/BannerCard";
import { Banner } from "@prisma/client";

type Stats = { total: number; club: number; sponsor: number; active: number };

function Fallback() {
    return (
        <>
            <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse" />
                ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 text-center animate-pulse">
                        <div className="h-8 w-12 bg-gray-200 rounded mx-auto mb-2" />
                        <div className="h-4 w-16 bg-gray-100 rounded mx-auto" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
                ))}
            </div>
        </>
    );
}

function Content({
    banners,
    stats,
    category,
}: {
    banners: Banner[];
    stats: Stats;
    category?: string;
}) {
    const tabs = [
        { key: "", label: "すべて", count: stats.total, icon: Flag },
        { key: "club", label: "クラブ", count: stats.club, icon: Building2 },
        { key: "sponsor", label: "スポンサー", count: stats.sponsor, icon: Megaphone },
    ];
    const currentTab = category || "";

    return (
        <>
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentTab === tab.key;
                    return (
                        <Link
                            key={tab.key}
                            href={tab.key ? `/admin/banners?category=${tab.key}` : "/admin/banners"}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${isActive
                                ? "bg-sumo-brand text-white shadow-md"
                                : "bg-white text-gray-600 border border-gray-200 hover:border-sumo-brand hover:text-sumo-brand"
                                }`}
                        >
                            <Icon size={14} />
                            <span>{tab.label}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-gray-100"}`}>
                                {tab.count}
                            </span>
                        </Link>
                    );
                })}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-sumo-brand">{stats.total}</div>
                    <div className="text-xs text-gray-400 font-bold">総数</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-blue-500">{stats.club}</div>
                    <div className="text-xs text-gray-400 font-bold">クラブ</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-amber-500">{stats.sponsor}</div>
                    <div className="text-xs text-gray-400 font-bold">スポンサー</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-green-500">{stats.active}</div>
                    <div className="text-xs text-gray-400 font-bold">有効</div>
                </div>
            </div>
            {banners.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium mb-4">
                        {category ? `${category === "club" ? "クラブ" : "スポンサー"}バナーがまだ登録されていません` : "バナーがまだ登録されていません"}
                    </p>
                    <Link
                        href="/admin/banners/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-sumo-brand text-white text-sm font-bold rounded-lg hover:brightness-110 transition-all"
                    >
                        <Plus size={14} />
                        最初のバナーを追加
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {banners.map((banner, index) => (
                        <BannerCard key={banner.id} banner={banner} index={index} />
                    ))}
                </div>
            )}
        </>
    );
}

interface Props {
    initialCategory?: string;
}

export default function BannersListClient({ initialCategory }: Props) {
    const [data, setData] = useState<{ banners: Banner[]; stats: Stats } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const url = initialCategory
            ? `/admin/api/banners?category=${encodeURIComponent(initialCategory)}`
            : "/admin/api/banners";
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
    }, [initialCategory]);

    if (error) {
        return (
            <div className="py-12 text-center text-red-500 text-sm">
                {error === "Unauthorized" ? "ログインしてください。" : "読み込みに失敗しました。"}
            </div>
        );
    }
    if (loading || !data) return <Fallback />;
    return <Content banners={data.banners} stats={data.stats} category={initialCategory} />;
}
