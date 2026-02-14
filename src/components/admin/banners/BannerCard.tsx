"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit2, Trash2, ExternalLink, GripVertical } from "lucide-react";
import { toggleBannerActive, deleteBanner } from "@/lib/actions/banners";
import { Banner } from "@prisma/client";

/** カード表示用：API からの JSON では sponsorTier が欠ける場合があるため optional */
type BannerForCard = Omit<Banner, "sponsorTier"> & { sponsorTier?: "OFFICIAL" | "LOCAL" | null };

export type DragHandleProps = {
    listeners: Record<string, unknown>;
    attributes: Record<string, unknown>;
};

interface Props {
    banner: BannerForCard;
    index: number;
    /** 拖拽排序时传入，序号徽章作为 handle */
    dragHandleProps?: DragHandleProps;
}

export default function BannerCard({ banner, index, dragHandleProps }: Props) {
    const [isPending, startTransition] = useTransition();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleToggle = () => {
        startTransition(async () => {
            await toggleBannerActive(banner.id);
        });
    };

    const handleDelete = () => {
        startTransition(async () => {
            await deleteBanner(banner.id);
        });
    };

    return (
        <div className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${banner.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
            {/* 画像プレビュー */}
            <div className="relative aspect-[4/3] bg-gray-100">
                <Image
                    src={banner.image}
                    alt={banner.alt || banner.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* 順番バッジ（支持拖拽 handle） */}
                <div
                    className={`absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 ${dragHandleProps ? "cursor-grab active:cursor-grabbing touch-none" : ""}`}
                    title={dragHandleProps ? "ドラッグで順序を変更" : undefined}
                    {...(dragHandleProps?.attributes ?? {})}
                    {...(dragHandleProps?.listeners ?? {})}
                >
                    <GripVertical size={10} />
                    {index + 1}
                </div>
                {/* ステータスバッジ */}
                <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded ${banner.isActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                    {banner.isActive ? '有効' : '無効'}
                </div>
            </div>

            {/* 情報 */}
            <div className="p-3 md:p-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-sm text-gray-900 truncate">{banner.name}</h3>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${banner.category === "club"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-amber-100 text-amber-600"
                        }`}>
                        {banner.category === "club" ? "クラブ" : "スポンサー"}
                    </span>
                    {banner.category === "sponsor" && banner.sponsorTier && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${banner.sponsorTier === "OFFICIAL"
                            ? "bg-amber-200 text-amber-800"
                            : "bg-gray-100 text-gray-600"
                            }`}>
                            {banner.sponsorTier === "OFFICIAL" ? "OFFICIAL" : "LOCAL"}
                        </span>
                    )}
                </div>
                {banner.link && (
                    <a
                        href={banner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-sumo-brand flex items-center gap-1 truncate hover:underline"
                    >
                        <ExternalLink size={10} />
                        <span className="truncate">{banner.link}</span>
                    </a>
                )}
                {!banner.link && (
                    <p className="text-[10px] text-gray-400">リンクなし</p>
                )}

                {/* アクションボタン */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    {/* 有効/無効トグル */}
                    <button
                        onClick={handleToggle}
                        disabled={isPending}
                        className={`flex-1 text-[10px] font-bold py-2 rounded-lg transition-all ${banner.isActive
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                            } disabled:opacity-50`}
                    >
                        {banner.isActive ? '無効にする' : '有効にする'}
                    </button>

                    {/* 編集 */}
                    <Link
                        href={`/admin/banners/${banner.id}`}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-sumo-brand hover:text-white transition-all"
                    >
                        <Edit2 size={14} />
                    </Link>

                    {/* 削除 */}
                    {showDeleteConfirm ? (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="px-2 py-2 bg-red-500 text-white text-[10px] font-bold rounded-lg hover:bg-red-600 disabled:opacity-50"
                            >
                                削除
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-2 py-2 bg-gray-200 text-gray-600 text-[10px] font-bold rounded-lg"
                            >
                                戻る
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
