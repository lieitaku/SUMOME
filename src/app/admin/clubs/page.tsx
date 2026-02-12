import React, { Suspense } from "react";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { Search, Plus, MapPin, Pencil } from "lucide-react";
import Link from "@/components/ui/TransitionLink";
import { REGIONS } from "@/lib/constants";
import RegionFilter from "@/components/admin/ui/RegionFilter";

export const dynamic = "force-dynamic";

const LIST_SELECT = {
    id: true,
    name: true,
    slug: true,
    area: true,
    city: true,
    updatedAt: true,
} as const;

async function ClubsList({
    q,
    region,
    pref,
}: {
    q?: string;
    region?: string;
    pref?: string;
}) {
    const where: Prisma.ClubWhereInput = { id: { not: "official-hq" } };
    if (q) where.name = { contains: q, mode: "insensitive" };
    if (pref) where.area = { equals: pref };
    else if (region && region in REGIONS) where.area = { in: REGIONS[region as keyof typeof REGIONS] };

    const clubs = await prisma.club.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        select: LIST_SELECT,
    });

    return (
        <>
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
                                    {new Date(club.updatedAt).toLocaleDateString('ja-JP')}
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

            <Suspense fallback={<ClubsListFallback />}>
                <ClubsList q={q} region={region} pref={pref} />
            </Suspense>
        </div>
    );
}
