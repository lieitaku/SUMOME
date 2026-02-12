import { getBannerDisplaySettings } from "@/lib/actions/banners";
import { Plus } from "lucide-react";
import Link from "next/link";
import BannerDisplaySettingsCard from "@/components/admin/banners/BannerDisplaySettingsCard";
import BannersListClient from "@/components/admin/banners/BannersListClient";

interface PageProps {
    searchParams: Promise<{ category?: string }>;
}

export default async function AdminBannersPage({ searchParams }: PageProps) {
    const { category } = await searchParams;
    const displaySettings = await getBannerDisplaySettings();

    return (
        <div className="max-w-6xl mx-auto space-y-6 font-sans">
            <BannerDisplaySettingsCard initialSettings={displaySettings} />

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

            <BannersListClient initialCategory={category} />
        </div>
    );
}
