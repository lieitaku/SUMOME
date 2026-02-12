import React from "react";
import { Plus, Search } from "lucide-react";
import Link from "@/components/ui/TransitionLink";
import RegionFilter from "@/components/admin/ui/RegionFilter";
import ClubsListClient from "@/components/admin/clubs/ClubsListClient";

export const dynamic = "force-dynamic";

export default async function AdminClubsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; region?: string; pref?: string }>;
}) {
    const { q, region, pref } = await searchParams;

    return (
        <div className="max-w-6xl mx-auto space-y-6 font-sans">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">クラブ管理</h1>
                    <p className="text-gray-500 mt-1 text-xs md:text-sm">登録済み相撲クラブの一覧・編集</p>
                </div>
                <Link
                    href="/admin/clubs/new"
                    className="flex items-center gap-2 bg-sumo-brand text-white px-4 py-2 rounded-lg font-bold hover:bg-sumo-dark transition-all shadow-md text-sm"
                >
                    <Plus size={18} />
                    <span>新規登録</span>
                </Link>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <form className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        name="q"
                        defaultValue={q}
                        placeholder="クラブ名で検索..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sumo-brand outline-none transition-all"
                    />
                </form>
                <RegionFilter basePath="/admin/clubs" currentRegion={region} currentPref={pref} currentQuery={q} />
            </div>

            <ClubsListClient initialQ={q} initialRegion={region} initialPref={pref} />
        </div>
    );
}
