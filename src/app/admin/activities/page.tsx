import React from "react";
import { Plus, Search } from "lucide-react";
import Link from "@/components/ui/TransitionLink";
import { cn } from "@/lib/utils";
import RegionFilter from "@/components/admin/ui/RegionFilter";
import ActivitiesListClient from "@/components/admin/activities/ActivitiesListClient";

export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string; region?: string; pref?: string }>;
}) {
    const { q, category, region, pref } = await searchParams;

    return (
        <div className="max-w-6xl mx-auto space-y-6 font-sans">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">普及・広報活動管理</h1>
                    <p className="text-gray-500 mt-1 text-xs md:text-sm">
                        全クラブの活動レポート、ニュースの投稿・編集
                    </p>
                </div>
                <Link
                    href="/admin/activities/new"
                    className="flex items-center gap-2 bg-sumo-brand text-white px-4 py-2 rounded-lg font-bold hover:bg-sumo-dark transition-all shadow-md text-sm"
                >
                    <Plus size={18} />
                    <span>新規登録</span>
                </Link>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-wrap gap-4">
                    <form className="relative grow max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="タイトルで検索..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sumo-brand outline-none transition-all"
                        />
                    </form>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {["all", "Report", "Event", "News"].map((cat) => (
                            <Link
                                key={cat}
                                href={`/admin/activities?category=${cat}${q ? `&q=${q}` : ""}`}
                                className={cn(
                                    "px-3 py-1 rounded-md text-xs font-bold transition-all",
                                    (category || "all") === cat
                                        ? "bg-white text-sumo-brand shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {cat === "all" ? "全て" : cat}
                            </Link>
                        ))}
                    </div>
                </div>
                <RegionFilter
                    basePath="/admin/activities"
                    currentRegion={region}
                    currentPref={pref}
                    currentQuery={q}
                    extraParams={{ category }}
                />
            </div>

            <ActivitiesListClient
                initialQ={q}
                initialCategory={category}
                initialRegion={region}
                initialPref={pref}
            />
        </div>
    );
}
