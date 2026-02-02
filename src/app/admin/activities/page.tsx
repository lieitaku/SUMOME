import React from "react";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { confirmAdmin } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import {
    Plus, Search, Pencil, Filter,
    Calendar, Tag, MapPin
} from "lucide-react";
import Link from "@/components/ui/TransitionLink";
import { cn } from "@/lib/utils";
import { REGIONS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage({
    searchParams,
}: {
    searchParams: { q?: string; category?: string; region?: string; pref?: string };
}) {
    // 1. 権限チェック
    const admin = await confirmAdmin();
    if (!admin) redirect("/manager/login");

    // Next.js 15/16 非同期 searchParams 対応
    const { q, category, region, pref } = await searchParams;

    // 2. 厳密な型定義でクエリを構築
    const where: Prisma.ActivityWhereInput = {};

    // キーワード検索 (タイトル)
    if (q) {
        where.title = { contains: q, mode: "insensitive" };
    }

    // カテゴリフィルタ
    if (category && category !== "all") {
        where.category = { equals: category };
    }

    // 地域・都道府県フィルタ (関連するクラブの所在地で検索)
    if (pref) {
        where.club = { area: { equals: pref } };
    } else if (region && region in REGIONS) {
        where.club = { area: { in: REGIONS[region as keyof typeof REGIONS] } };
    }

    // 3. データ取得
    const activities = await prisma.activity.findMany({
        where,
        include: {
            club: { select: { name: true, area: true } }
        },
        orderBy: { date: "desc" },
    });

    return (
        <div className="max-w-6xl mx-auto space-y-6 font-sans">
            {/* --- ヘッダー (Header) --- */}
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
                    <span>新規作成</span>
                </Link>
            </div>

            {/* --- 検索 & フィルタ (Search & Filter) --- */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-wrap gap-4">
                    {/* キーワード検索 */}
                    <form className="relative flex-grow max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="タイトルで検索..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sumo-brand outline-none transition-all"
                        />
                    </form>

                    {/* カテゴリクイックフィルタ */}
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

                {/* 地方・都道府県フィルタ (分級検索) */}
                <div className="pt-4 border-t border-gray-100 space-y-4">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2 flex items-center gap-1">
                            <Filter size={12} /> Region
                        </span>
                        <Link
                            href="/admin/activities"
                            className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold border",
                                !region ? "bg-sumo-dark text-white border-sumo-dark" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                            )}
                        >
                            全て
                        </Link>
                        {Object.keys(REGIONS).map((r) => (
                            <Link
                                key={r}
                                href={`/admin/activities?region=${r}${q ? `&q=${q}` : ""}${category ? `&category=${category}` : ""}`}
                                className={cn(
                                    "px-3 py-1 rounded-full text-xs font-bold border transition-all",
                                    region === r ? "bg-sumo-brand text-white border-sumo-brand" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                                )}
                            >
                                {r}
                            </Link>
                        ))}
                    </div>

                    {region && region in REGIONS && (
                        <div className="flex flex-wrap gap-2 items-center md:pl-10 animate-in fade-in slide-in-from-left-2 duration-300">
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mr-2">┗ Pref</span>
                            {REGIONS[region as keyof typeof REGIONS].map((p) => (
                                <Link
                                    key={p}
                                    href={`/admin/activities?region=${region}&pref=${p}${q ? `&q=${q}` : ""}${category ? `&category=${category}` : ""}`}
                                    className={cn(
                                        "px-3 py-1 rounded-full text-[11px] font-bold border transition-all",
                                        pref === p ? "bg-blue-50 text-sumo-brand border-sumo-brand" : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
                                    )}
                                >
                                    {p}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- 1. モバイル表示 (Mobile Cards) --- */}
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
                                <span className="text-xs font-mono">{new Date(act.date).toLocaleDateString('ja-JP')}</span>
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

            {/* --- 2. PC表示 (Desktop Table) --- */}
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
                                            {new Date(act.date).toLocaleDateString('ja-JP')}
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
        </div>
    );
}