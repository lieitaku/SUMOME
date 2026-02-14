"use client";

import { useState, useTransition } from "react";
import { Save, Loader2, LayoutDashboard, Home, MapPin, PanelRight } from "lucide-react";
import { updateBannerDisplaySettings, type SponsorTierFilter } from "@/lib/actions/banners";
import type { BannerDisplayMode } from "@prisma/client";

const DISPLAY_MODE_OPTIONS: { value: BannerDisplayMode; label: string }[] = [
  { value: "all", label: "すべて表示" },
  { value: "club", label: "クラブのみ" },
  { value: "sponsor", label: "スポンサーのみ" },
  { value: "mixed", label: "混合（クラブ→スポンサー）" },
];

const SPONSOR_TIER_OPTIONS: { value: SponsorTierFilter; label: string }[] = [
  { value: "all", label: "すべてのスポンサー" },
  { value: "official_only", label: "高级スポンサーのみ" },
  { value: "local_only", label: "低级スポンサーのみ" },
];

type Settings = {
  homeDisplayMode: BannerDisplayMode;
  homeSponsorTierFilter: SponsorTierFilter;
  prefTopDisplayMode: BannerDisplayMode;
  prefTopSponsorTierFilter: SponsorTierFilter;
  prefSidebarDisplayMode: BannerDisplayMode;
  prefSidebarSponsorTierFilter: SponsorTierFilter;
};

interface Props {
  initialSettings: Settings;
}

export default function BannerDisplaySettingsCard({ initialSettings }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Settings>(initialSettings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("homeDisplayMode", formData.homeDisplayMode);
      fd.append("homeSponsorTierFilter", formData.homeSponsorTierFilter);
      fd.append("prefTopDisplayMode", formData.prefTopDisplayMode);
      fd.append("prefTopSponsorTierFilter", formData.prefTopSponsorTierFilter);
      fd.append("prefSidebarDisplayMode", formData.prefSidebarDisplayMode);
      fd.append("prefSidebarSponsorTierFilter", formData.prefSidebarSponsorTierFilter);
      const result = await updateBannerDisplaySettings(fd);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || "更新に失敗しました");
      }
    });
  };

  const labelClass = "block text-xs font-bold mb-2 uppercase tracking-wide text-gray-400";
  const selectClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all text-sm focus:ring-2 focus:ring-sumo-brand focus:border-transparent bg-white";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* 标题 */}
      <div className="px-4 md:px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-sumo-brand/10 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-sumo-brand" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">旗の表示設定</h2>
            <p className="text-xs text-gray-500">
              各ページで「クラブ」「スポンサー」の旗をどう表示するか選べます（コード不要）
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-xl">
            保存しました。フロントの表示はすぐに反映されます。
          </div>
        )}

        {/* トップページ（HOME）の旗 */}
        <div className="space-y-3">
          <div>
            <label className={labelClass}>
              <Home size={12} className="inline mr-1" />
              トップページ（HOME）の旗
            </label>
            <select
              value={formData.homeDisplayMode}
              onChange={(e) =>
                setFormData({ ...formData, homeDisplayMode: e.target.value as BannerDisplayMode })
              }
              className={selectClass}
            >
              {DISPLAY_MODE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="pl-4 border-l-2 border-gray-200 space-y-2">
            <label className={labelClass}>スポンサー表示</label>
            <select
              value={formData.homeSponsorTierFilter}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  homeSponsorTierFilter: e.target.value as SponsorTierFilter,
                })
              }
              className={selectClass}
            >
              {SPONSOR_TIER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 都道府県ページ「Official Top Partners」の旗 */}
        <div className="space-y-3">
          <div>
            <label className={labelClass}>
              <MapPin size={12} className="inline mr-1" />
              都道府県ページ「Official Top Partners」の旗
            </label>
            <select
              value={formData.prefTopDisplayMode}
              onChange={(e) =>
                setFormData({ ...formData, prefTopDisplayMode: e.target.value as BannerDisplayMode })
              }
              className={selectClass}
            >
              {DISPLAY_MODE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="pl-4 border-l-2 border-gray-200 space-y-2">
            <label className={labelClass}>スポンサー表示</label>
            <select
              value={formData.prefTopSponsorTierFilter}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  prefTopSponsorTierFilter: e.target.value as SponsorTierFilter,
                })
              }
              className={selectClass}
            >
              {SPONSOR_TIER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 都道府県ページ「Local Supporters」の旗 */}
        <div className="space-y-3">
          <div>
            <label className={labelClass}>
              <PanelRight size={12} className="inline mr-1" />
              都道府県ページ「Local Supporters」の旗
            </label>
            <select
              value={formData.prefSidebarDisplayMode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  prefSidebarDisplayMode: e.target.value as BannerDisplayMode,
                })
              }
              className={selectClass}
            >
              {DISPLAY_MODE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="pl-4 border-l-2 border-gray-200 space-y-2">
            <label className={labelClass}>スポンサー表示</label>
            <select
              value={formData.prefSidebarSponsorTierFilter}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  prefSidebarSponsorTierFilter: e.target.value as SponsorTierFilter,
                })
              }
              className={selectClass}
            >
              {SPONSOR_TIER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sumo-brand text-white text-sm font-bold rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            表示設定を保存
          </button>
        </div>
      </form>
    </div>
  );
}
