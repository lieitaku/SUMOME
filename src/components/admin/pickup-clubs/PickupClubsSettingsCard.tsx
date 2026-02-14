"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Save, Loader2, Star, LayoutGrid, Eye } from "lucide-react";
import PreviewModal from "@/components/admin/ui/PreviewModal";
import { updateHomePickupClubs } from "@/lib/actions/pickup-clubs";

export type SlotItem = {
  sortOrder: number;
  clubId: string | null;
  club: { id: string; name: string; slug: string; logo: string | null } | null;
};

type ClubOption = { id: string; name: string; mainImage: string | null };

const PLACEHOLDER_IMAGE = "/images/placeholder.jpg";

const SLOT_LABELS = ["1番（左）", "2番（中央）", "3番（右）"];

interface Props {
  initialSlots: SlotItem[];
  clubOptions: ClubOption[];
}

export default function PickupClubsSettingsCard({ initialSlots, clubOptions }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>(() =>
    initialSlots.map((s) => s.clubId ?? "")
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const fd = new FormData();
      slots.forEach((id, i) => fd.append(`slot${i}`, id));
      const result = await updateHomePickupClubs(fd);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error ?? "保存に失敗しました");
      }
    });
  };

  const labelClass =
    "block text-xs font-bold mb-2 uppercase tracking-wide text-gray-400";
  const selectClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all text-sm focus:ring-2 focus:ring-sumo-brand focus:border-transparent bg-white";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-4 md:px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-sumo-brand/10 flex items-center justify-center">
            <Star className="w-5 h-5 text-sumo-brand" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              注目の相撲クラブ（3件）
            </h2>
            <p className="text-xs text-gray-500">
              トップページの「Pick Up Clubs」に表示するクラブを、左から順に選んでください。未設定の場合は「新着3件」が表示されます。
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
            保存しました。トップページの表示はすぐに反映されます。
          </div>
        )}

        <div className="space-y-4">
          {SLOT_LABELS.map((label, i) => {
            const selectedId = slots[i] ?? "";
            const selectedClub = selectedId
              ? clubOptions.find((c) => c.id === selectedId)
              : null;
            return (
              <div key={i} className="space-y-2">
                <label className={labelClass}>
                  <LayoutGrid size={12} className="inline mr-1" />
                  {label}
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => {
                    const next = [...slots];
                    next[i] = e.target.value;
                    setSlots(next);
                  }}
                  className={selectClass}
                >
                  <option value="">— 未選択（新着で表示）—</option>
                  {clubOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-3 mt-2 p-3 rounded-xl border border-gray-100 bg-gray-50/50 min-h-[72px]">
                  {selectedClub ? (
                    <>
                      <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                        <Image
                          src={selectedClub.mainImage || PLACEHOLDER_IMAGE}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedClub.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">
                      — 未選択（新着で表示）—
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
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
            表示クラブを保存
          </button>
          <button
            type="button"
            disabled={isPreviewing}
onClick={async () => {
                setIsPreviewing(true);
                try {
                  const res = await fetch("/admin/api/preview", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      type: "home_pickup",
                      redirectPath: "/",
                      payload: { clubIds: slots.slice(0, 3) },
                    }),
                  });
                  const data = await res.json();
if (data.redirectUrl) {
                    setPreviewUrl(data.bridgeUrl ?? data.redirectUrl);
                    return;
                  }
                  if (data.error) alert(data.error);
                } finally {
                  setIsPreviewing(false);
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 bg-white text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 disabled:opacity-50"
            >
              {isPreviewing ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
              プレビュー
            </button>
        </div>
      </form>
      <PreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} title="注目クラブ プレビュー" />
    </div>
  );
}
