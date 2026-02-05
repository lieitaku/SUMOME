import React from "react";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { Plus, BookOpen, Calendar, Pencil, ExternalLink, Search, MapPin } from "lucide-react";
import Link from "@/components/ui/TransitionLink";
import Image from "next/image";
import { REGIONS } from "@/lib/constants";
import RegionFilter from "@/components/admin/ui/RegionFilter";

export const dynamic = "force-dynamic";

export default async function MagazineListPage({
    searchParams,
}: {
    searchParams: { q?: string; region?: string; pref?: string };
}) {
    const { q, region, pref } = await searchParams;

    // 构建查询条件
    const where: Prisma.MagazineWhereInput = {};

    // 关键词搜索（标题）
    if (q) {
        where.title = { contains: q, mode: "insensitive" };
    }

    // 地区筛选（与俱乐部页面一致的分级逻辑）
    if (pref) {
        // 选择了具体的县
        where.region = { equals: pref };
    } else if (region && region in REGIONS) {
        // 选择了大区域，匹配该区域下的所有县
        where.region = { in: REGIONS[region as keyof typeof REGIONS] };
    }

    const magazines = await prisma.magazine.findMany({
        where,
        orderBy: { issueDate: "desc" },
    });

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* 头部标题 - 与 /admin/clubs 保持一致 */}
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

            {/* 搜索 & 筛选区域 */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                {/* 关键词搜索 */}
                <form className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        name="q"
                        defaultValue={q}
                        placeholder="タイトルで検索..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sumo-brand outline-none transition-all"
                    />
                </form>

                {/* 地区筛选 */}
                <RegionFilter
                    basePath="/admin/magazines"
                    currentRegion={region}
                    currentPref={pref}
                    currentQuery={q}
                />
            </div>

            {/* 列表区域 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {magazines.map((mag) => (
                    <div key={mag.id} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                        {/* 封面预览 */}
                        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
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
                            {/* 状态角标 */}
                            <div className="absolute top-4 right-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${mag.published ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"
                                    }`}>
                                    {mag.published ? "Public" : "Draft"}
                                </span>
                            </div>
                        </div>

                        {/* 内容 */}
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center gap-1.5 text-sumo-brand">
                                    <Calendar size={14} />
                                    <span className="text-xs font-bold font-mono">
                                        {mag.issueDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
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
        </div>
    );
}