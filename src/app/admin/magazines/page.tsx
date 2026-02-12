import React from "react";
import { Plus, Search } from "lucide-react";
import Link from "@/components/ui/TransitionLink";
import RegionFilter from "@/components/admin/ui/RegionFilter";
import MagazinesListClient from "@/components/admin/magazines/MagazinesListClient";

export const dynamic = "force-dynamic";

export default async function MagazineListPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; region?: string; pref?: string; page?: string }>;
}) {
    const { q, region, pref, page: pageParam } = await searchParams;
    const page = Math.max(1, parseInt(String(pageParam || "1"), 10) || 1);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">広報誌データ管理</h1>
                    <p className="text-gray-500 mt-1 text-xs md:text-sm">定期刊行誌の表紙とPDFデータの登録・編集</p>
                </div>
                <Link
                    href="/admin/magazines/new"
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
                        placeholder="タイトルで検索..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sumo-brand outline-none transition-all"
                    />
                </form>
                <RegionFilter basePath="/admin/magazines" currentRegion={region} currentPref={pref} currentQuery={q} />
            </div>

            <MagazinesListClient
                initialQ={q}
                initialRegion={region}
                initialPref={pref}
                initialPage={page}
            />
        </div>
    );
}
