import { prisma } from "@/lib/db";
import { getBannerDisplaySettings } from "@/lib/actions/banners";
import { Image as ImageIcon, Plus, Flag, Building2, Megaphone } from "lucide-react";
import Link from "next/link";
import BannerCard from "@/components/admin/banners/BannerCard";
import BannerDisplaySettingsCard from "@/components/admin/banners/BannerDisplaySettingsCard";
import { BannerCategory } from "@prisma/client";

interface PageProps {
    searchParams: Promise<{ category?: string }>;
}

export default async function AdminBannersPage({ searchParams }: PageProps) {
    const { category } = await searchParams;

    const whereClause = category && (category === "club" || category === "sponsor")
        ? { category: category as BannerCategory }
        : {};

    const [banners, allBanners, displaySettings] = await Promise.all([
        prisma.banner.findMany({
            where: whereClause,
            orderBy: { sortOrder: "asc" },
        }),
        prisma.banner.findMany(),
        getBannerDisplaySettings(),
    ]);

    const clubBanners = allBanners.filter(b => b.category === "club");
    const sponsorBanners = allBanners.filter(b => b.category === "sponsor");
    const tabs = [
        { key: "", label: "すべて", count: allBanners.length, icon: Flag },
        { key: "club", label: "クラブ", count: clubBanners.length, icon: Building2 },
        { key: "sponsor", label: "スポンサー", count: sponsorBanners.length, icon: Megaphone },
    ];
    const currentTab = category || "";

    return (
        <div className="max-w-6xl mx-auto space-y-6 font-sans">
            {/* --- 旗子显示设置（各页面显示什么） --- */}
            <BannerDisplaySettingsCard initialSettings={displaySettings} />

            {/* --- ヘッダー --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">バナー広告管理</h1>
                    <p className="text-gray-500 mt-1 text-xs md:text-sm">
                        ウサギが持つ旗の画像を管理します
                    </p>
                </div>
                <Link
                    href="/admin/banners/new"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sumo-brand text-white text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-sm w-full sm:w-auto"
                >
                    <Plus size={16} />
                    <span>新規登録</span>
                </Link>
            </div>

            {/* Tab 筛选 */}
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

            {/* 統計カード */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-sumo-brand">{allBanners.length}</div>
                    <div className="text-xs text-gray-400 font-bold">総数</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-blue-500">{clubBanners.length}</div>
                    <div className="text-xs text-gray-400 font-bold">クラブ</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-amber-500">{sponsorBanners.length}</div>
                    <div className="text-xs text-gray-400 font-bold">スポンサー</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-green-500">{allBanners.filter(b => b.isActive).length}</div>
                    <div className="text-xs text-gray-400 font-bold">有効</div>
                </div>
            </div>

            {/* バナーリスト */}
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
        </div>
    );
}
