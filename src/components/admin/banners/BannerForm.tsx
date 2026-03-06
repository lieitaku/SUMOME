"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Link as LinkIcon, Hash, Type, Building2, Megaphone, Eye } from "lucide-react";
import { createBanner, updateBanner, deleteBanner } from "@/lib/actions/banners";
import { Banner, BannerCategory, BannerSponsorTier } from "@prisma/client";
import ImageUploader from "@/components/admin/ui/ImageUploader";
import PreviewModal from "@/components/admin/ui/PreviewModal";

interface Props {
    initialData?: Banner;
}

export default function BannerForm({ initialData }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        image: initialData?.image || "",
        alt: initialData?.alt || "",
        link: initialData?.link || "",
        category: initialData?.category || "club" as BannerCategory,
        sponsorTier: (initialData?.category === "sponsor" ? (initialData?.sponsorTier ?? "LOCAL") : "LOCAL") as BannerSponsorTier,
        sortOrder: initialData?.sortOrder ?? 0,
        isActive: initialData?.isActive ?? true,
    });

    const isEdit = !!initialData;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.name.trim()) {
            setError("名前は必須です");
            return;
        }
        if (!formData.image) {
            setError("画像は必須です");
            return;
        }

        startTransition(async () => {
            const fd = new FormData();
            if (initialData) {
                fd.append("id", initialData.id);
            }
            fd.append("name", formData.name);
            fd.append("image", formData.image);
            fd.append("alt", formData.alt || formData.name);
            fd.append("link", formData.link);
            fd.append("category", formData.category);
            if (formData.category === "sponsor") {
                fd.append("sponsorTier", formData.sponsorTier);
            }
            fd.append("sortOrder", formData.sortOrder.toString());
            fd.append("isActive", formData.isActive.toString());

            const result = isEdit ? await updateBanner(fd) : await createBanner(fd);

            if (result.success) {
                router.push("/admin/banners");
            } else {
                setError(result.error || "エラーが発生しました");
            }
        });
    };

    const handleDelete = () => {
        if (!initialData) return;
        if (!confirm("このバナーを削除しますか？")) return;

        startTransition(async () => {
            const result = await deleteBanner(initialData.id);
            if (result.success) {
                router.push("/admin/banners");
            } else {
                setError(result.error || "削除に失敗しました");
            }
        });
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition-all text-sm focus:ring-2 focus:ring-sumo-brand focus:border-transparent";
    const labelClass = "block text-xs font-bold mb-2 uppercase tracking-wide text-gray-400";

    return (
        <div className="p-4 md:p-6 lg:p-10 max-w-3xl mx-auto bg-[#F9FAFB] min-h-screen">
            <PreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} title="バナー プレビュー" />
            {/* Header */}
            <header className="mb-6 md:mb-8">
                <Link
                    href="/admin/banners"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-sumo-brand text-sm font-bold mb-4 transition-colors"
                >
                    <ArrowLeft size={16} />
                    一覧に戻る
                </Link>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    {isEdit ? "バナー編集" : "新規バナー追加"}
                </h1>
            </header>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 space-y-6">
                    {/* 画像アップロード */}
                    <div>
                        <label className={labelClass}>
                            <ImageIcon size={12} className="inline mr-1" />
                            スポンサー画像 <span className="text-red-500">*</span>
                        </label>

                        {/* 尺寸指南 */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
                            <p className="text-xs font-bold text-blue-700 mb-1">📐 推奨サイズ・形式</p>
                            <ul className="text-[11px] text-blue-600 space-y-0.5">
                                <li>• サイズ: <span className="font-bold">160×290 px</span>（縦長）</li>
                                <li>• 比率: 約 <span className="font-bold">1:1.8</span>（縦向き）</li>
                                <li>• 形式: <span className="font-bold text-green-600">WebP 推奨</span></li>
                                <li>• ファイルサイズ: <span className="font-bold">300KB 以下</span>推奨</li>
                            </ul>
                            <p className="text-[10px] text-amber-600 mt-2 flex items-start gap-1">
                                <span>⚠️</span>
                                <span>PNG は容量が大きくなりがちです。可能であれば “WebP” に変換してからアップロードしてください。</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ImageUploader
                                label=""
                                value={formData.image}
                                onChange={(url) => setFormData({ ...formData, image: url })}
                                bucket="images"
                            />
                            {formData.image && (
                                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-400 mb-2">プレビュー</p>
                                        <div className="relative w-24 h-24 mx-auto">
                                            <Image
                                                src={formData.image}
                                                alt="Preview"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* カテゴリ選択 */}
                    <div>
                        <label className={labelClass}>
                            種別 <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, category: "club" })}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${formData.category === "club"
                                    ? "border-blue-500 bg-blue-50 text-blue-600"
                                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                                    }`}
                            >
                                <Building2 size={16} />
                                クラブ
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, category: "sponsor" })}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${formData.category === "sponsor"
                                    ? "border-amber-500 bg-amber-50 text-amber-600"
                                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                                    }`}
                            >
                                <Megaphone size={16} />
                                スポンサー
                            </button>
                        </div>
                    </div>

                    {/* スポンサーランク（スポンサーのみ） */}
                    {formData.category === "sponsor" && (
                        <div>
                            <label className={labelClass}>スポンサーランク</label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, sponsorTier: "OFFICIAL" })}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${formData.sponsorTier === "OFFICIAL"
                                        ? "border-amber-600 bg-amber-50 text-amber-700"
                                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                                        }`}
                                >
                                    高級（OFFICIAL TOP PARTNER）
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, sponsorTier: "LOCAL" })}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${formData.sponsorTier === "LOCAL"
                                        ? "border-sumo-brand bg-sumo-brand/10 text-sumo-brand"
                                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                                        }`}
                                >
                                    低级（LOCAL SUPPORTER）
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 名前 */}
                    <div>
                        <label className={labelClass}>
                            <Type size={12} className="inline mr-1" />
                            名前 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={formData.category === "club" ? "例: 東京相撲クラブ" : "例: 株式会社サンプル"}
                            className={inputClass}
                        />
                    </div>

                    {/* Alt テキスト */}
                    <div>
                        <label className={labelClass}>
                            Alt テキスト（画像の説明）
                        </label>
                        <input
                            type="text"
                            value={formData.alt}
                            onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                            placeholder="空欄の場合、スポンサー名が使用されます"
                            className={inputClass}
                        />
                    </div>

                    {/* リンク */}
                    <div>
                        <label className={labelClass}>
                            <LinkIcon size={12} className="inline mr-1" />
                            リンクURL（任意）
                        </label>
                        <input
                            type="url"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            placeholder="https://example.com"
                            className={inputClass}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                            ※ 現在、旗をクリックしてもリンクには遷移しません（将来対応予定）
                        </p>
                    </div>

                    {/* 並び順（新規は自動で最後、編集時は同種別内で変更可） */}
                    <div>
                        <label className={labelClass}>
                            <Hash size={12} className="inline mr-1" />
                            並び順
                        </label>
                        {isEdit ? (
                            <>
                                <input
                                    type="number"
                                    value={formData.sortOrder}
                                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                                    min={0}
                                    className={`${inputClass} w-32`}
                                />
                                <p className="text-[10px] text-gray-400 mt-1">
                                    同種別（クラブ or スポンサー）内での順位。小さいほど先に表示されます。変更すると他が自動でずれます。
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500 py-2">
                                自動（最後に追加）— 同種別内で末尾に並びます
                            </p>
                        )}
                    </div>

                    {/* 有効/無効（編集時のみ） */}
                    {isEdit && (
                        <div>
                            <label className={labelClass}>ステータス</label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 accent-sumo-brand rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    有効（表示する）
                                </span>
                            </label>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                    {isEdit && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isPending}
                            className="w-full sm:w-auto px-4 py-3 text-red-500 text-sm font-bold hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                        >
                            削除する
                        </button>
                    )}
                    <div className="flex items-center gap-3 w-full sm:w-auto sm:ml-auto flex-wrap">
                        <Link
                            href="/admin/banners"
                            className="flex-1 sm:flex-initial px-6 py-3 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all text-center"
                        >
                            キャンセル
                        </Link>
                        <button
                            type="button"
                            disabled={isPreviewing || !formData.image}
                            onClick={async () => {
                                setIsPreviewing(true);
                                try {
                                    const res = await fetch("/admin/api/preview", {
                                        method: "POST",
                                        credentials: "include",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            type: "banner_single",
                                            redirectPath: "/",
                                            payload: {
                                                banner: {
                                                    id: initialData?.id,
                                                    name: formData.name,
                                                    image: formData.image,
                                                    alt: formData.alt || formData.name,
                                                    link: formData.link,
                                                    category: formData.category,
                                                    sponsorTier: formData.category === "sponsor" ? formData.sponsorTier : null,
                                                },
                                            },
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
                            className="inline-flex items-center gap-2 px-5 py-3 border border-gray-200 bg-white text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 disabled:opacity-50"
                        >
                            {isPreviewing ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
                            プレビュー
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 sm:flex-initial px-6 py-3 bg-sumo-brand text-white text-sm font-bold rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isPending ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            {isEdit ? "更新" : "作成"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
