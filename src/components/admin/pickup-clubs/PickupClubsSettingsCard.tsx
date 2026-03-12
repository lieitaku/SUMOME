"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Save, Loader2, Star, Eye, Plus, Trash2, ArrowRightLeft } from "lucide-react";
import PreviewModal from "@/components/admin/ui/PreviewModal";
import { updateHomePickupClubs } from "@/lib/actions/pickup-clubs";
import ClubSelectorModal from "./ClubSelectorModal";
import { cn } from "@/lib/utils";

export type SlotItem = {
  sortOrder: number;
  clubId: string | null;
  club: { id: string; name: string; slug: string; logo: string | null } | null;
};

type ClubOption = { id: string; name: string; mainImage: string | null };

const PLACEHOLDER_IMAGE = "/images/placeholder.webp";

const SLOT_LABELS = ["Left (1番目)", "Center (2番目)", "Right (3番目)"];

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
  
  // State for slots (array of club IDs)
  const [slots, setSlots] = useState<string[]>(() =>
    initialSlots.map((s) => s.clubId ?? "")
  );

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

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

  const handleOpenModal = (index: number) => {
    setActiveSlotIndex(index);
    setIsModalOpen(true);
  };

  const handleSelectClub = (clubId: string) => {
    if (activeSlotIndex === null) return;
    
    // Check if club is already selected in another slot
    const existingIndex = slots.indexOf(clubId);
    if (existingIndex !== -1 && existingIndex !== activeSlotIndex) {
      if (!confirm("このクラブは既に他の枠で選択されています。移動しますか？")) {
        return;
      }
      // Swap or Move logic: Here we just clear the old one and set the new one
      const newSlots = [...slots];
      newSlots[existingIndex] = ""; // Clear old position
      newSlots[activeSlotIndex] = clubId; // Set new position
      setSlots(newSlots);
    } else {
      const newSlots = [...slots];
      newSlots[activeSlotIndex] = clubId;
      setSlots(newSlots);
    }
  };

  const handleRemoveClub = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const newSlots = [...slots];
    newSlots[index] = "";
    setSlots(newSlots);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sumo-brand/10 flex items-center justify-center text-sumo-brand">
            <Star size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">注目の相撲クラブ設定</h2>
            <p className="text-xs text-gray-500">トップページに表示する3つのクラブを選択してください</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
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
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            {isPreviewing ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
            プレビュー
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2 bg-sumo-brand text-white text-xs font-bold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 shadow-md shadow-sumo-brand/20"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            変更を保存
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-2">
            保存しました。トップページの表示はすぐに反映されます。
          </div>
        )}

        {/* Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SLOT_LABELS.map((label, i) => {
            const selectedId = slots[i] ?? "";
            const selectedClub = selectedId
              ? clubOptions.find((c) => c.id === selectedId)
              : null;

            return (
              <div key={i} className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
                  {selectedClub && (
                    <button 
                      onClick={(e) => handleRemoveClub(e, i)}
                      className="text-[10px] font-bold text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={10} /> 解除
                    </button>
                  )}
                </div>

                <div 
                  onClick={() => handleOpenModal(i)}
                  className={cn(
                    "relative aspect-[4/3] rounded-2xl border-2 transition-all cursor-pointer group overflow-hidden bg-gray-50 flex flex-col items-center justify-center text-center p-4",
                    selectedClub 
                      ? "border-transparent shadow-md hover:shadow-lg hover:scale-[1.02]" 
                      : "border-dashed border-gray-200 hover:border-sumo-brand hover:bg-sumo-brand/5"
                  )}
                >
                  {selectedClub ? (
                    <>
                      <Image
                        src={selectedClub.mainImage || PLACEHOLDER_IMAGE}
                        alt={selectedClub.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="text-sm font-bold line-clamp-2 leading-tight">{selectedClub.name}</p>
                        <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10 group-hover:bg-sumo-brand group-hover:border-sumo-brand transition-colors">
                          <ArrowRightLeft size={10} /> 変更する
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-sumo-brand transition-colors">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus size={24} />
                      </div>
                      <span className="text-xs font-bold">クラブを選択</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ClubSelectorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectClub}
        clubs={clubOptions}
        currentSelectedId={activeSlotIndex !== null ? slots[activeSlotIndex] : null}
      />

      <PreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} title="注目クラブ プレビュー" />
    </div>
  );
}
