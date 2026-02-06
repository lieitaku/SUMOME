import React from "react";
import { prisma } from "@/lib/db";
import { PREFECTURE_DATABASE } from "@/data/prefectures";
import { ImageIcon, Pencil, MapPin } from "lucide-react";
import Link from "@/components/ui/TransitionLink";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPrefectureBannersPage() {
  const [dbBanners, clubCounts] = await Promise.all([
    prisma.prefectureBanner.findMany({ orderBy: { pref: "asc" } }),
    prisma.club.groupBy({
      by: ["area"],
      _count: { area: true },
    }),
  ]);

  const countByArea = Object.fromEntries(
    clubCounts.map((c) => [c.area, c._count.area])
  );

  const prefs = Object.keys(PREFECTURE_DATABASE).sort();
  const bannerByPref = new Map(dbBanners.map((b) => [b.pref, b]));

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">都道府県バナー管理</h1>
        <p className="text-gray-500 mt-1 text-xs md:text-sm">
          各都道府県ページの「Feature Banner」画像を管理。該当県にクラブがなくてもプレースホルダーとして画像を設定できます。
        </p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-xs text-gray-500 mb-4">
          一覧は都道府県コード順。バナーを設定すると、該当県ページで静的デフォルト（
          <code className="bg-gray-100 px-1 rounded">/images/banner/banner-xxx.jpg</code>
          ）の代わりに表示されます。
        </p>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {prefs.map((pref) => {
          const info = PREFECTURE_DATABASE[pref];
          const custom = bannerByPref.get(pref);
          const name = info?.name ?? pref;
          const clubCount = countByArea[name] ?? 0;
          return (
            <div
              key={pref}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                {custom?.image ? (
                  <div className="w-16 h-10 rounded overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={custom.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-10 rounded bg-gray-100 flex items-center justify-center shrink-0">
                    <ImageIcon size={18} className="text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900">{name}</h3>
                  <span className="text-xs text-gray-400 font-mono">#{pref}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} className="text-sumo-brand" />
                <span>クラブ {clubCount} 件</span>
                {custom ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                    カスタム
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400">デフォルト</span>
                )}
              </div>
              <Link
                href={`/admin/prefecture-banners/${pref}`}
                className="flex items-center justify-center gap-2 w-full bg-gray-50 text-sumo-brand font-bold py-2.5 rounded-lg border border-gray-200 hover:bg-sumo-brand hover:text-white transition-all"
              >
                <Pencil size={16} />
                編集
              </Link>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                都道府県 / 画像
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                バナー
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                クラブ数
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                編集
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {prefs.map((pref) => {
              const info = PREFECTURE_DATABASE[pref];
              const custom = bannerByPref.get(pref);
              const name = info?.name ?? pref;
              const clubCount = countByArea[name] ?? 0;
              return (
                <tr
                  key={pref}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{name}</div>
                    <div className="text-xs text-gray-400 font-mono">#{pref}</div>
                  </td>
                  <td className="px-6 py-4">
                    {custom?.image ? (
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-11 rounded overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={custom.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                          カスタム
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 flex items-center gap-1.5">
                        <ImageIcon size={14} />
                        デフォルト
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-400" />
                      {clubCount} 件
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/prefecture-banners/${pref}`}
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-2 text-sumo-brand hover:bg-blue-50 rounded-lg transition-colors text-sm font-bold"
                      )}
                    >
                      <Pencil size={16} />
                      編集
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
