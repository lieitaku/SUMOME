"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, X, Trash2 } from "lucide-react";

interface AdminFormLayoutProps {
    title: string;
    subTitle?: string;
    backLink: string;
    isSubmitting: boolean;
    onDelete?: () => Promise<void> | void;
    isDeleting?: boolean;
    children: ReactNode;
    headerActions?: ReactNode;
}

export default function AdminFormLayout({
    title,
    subTitle,
    backLink,
    isSubmitting,
    onDelete,
    isDeleting = false,
    children,
    headerActions
}: AdminFormLayoutProps) {
    const router = useRouter();

    const handleCancel = () => {
        if (confirm("未保存の変更は失われます。戻ってもよろしいですか？")) {
            router.push(backLink);
        }
    };

    return (
        // ✨ 优化 1: 将 pb-32 缩减为 pb-10，消除底部巨大的空白
        <div className="min-h-screen bg-gray-50/30 flex flex-col pb-10">

            {/* === 1. Header (去掉背景、边框和阴影，仅保留文字) === */}
            {/* 去掉了 bg-white, border-b, shadow-sm, bg-white/90 */}
            <div className="px-6 py-8 sticky top-0 z-30 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="p-2 rounded-lg hover:bg-gray-200/50 text-gray-500 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">
                                {subTitle || "Editor"}
                            </div>
                            <h1 className="text-xl font-black text-gray-900 leading-none">
                                {title}
                            </h1>
                        </div>
                    </div>
                    {headerActions && <div className="animate-in fade-in zoom-in-95">{headerActions}</div>}
                </div>
            </div>

            {/* === 2. Main Content === */}
            <div className="flex-1 max-w-5xl mx-auto w-full px-6 space-y-8">
                {children}
            </div>

            {/* === 3. Footer (同样去掉白色背景色块，仅保留按钮行) === */}
            {/* 去掉了 bg-white, border-t, shadow-lg */}
            <div className="sticky bottom-0 z-40 px-6 py-6 mt-10 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto flex items-center justify-between">

                    <div className="flex items-center gap-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-all flex items-center gap-2"
                        >
                            <X size={16} /> キャンセル
                        </button>

                        {onDelete && (
                            <button
                                type="button"
                                onClick={onDelete}
                                disabled={isDeleting || isSubmitting}
                                className="flex items-center gap-2 text-xs font-bold text-red-300 hover:text-red-500 transition-all disabled:opacity-30"
                            >
                                {isDeleting ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                                削除
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || isDeleting}
                        className="bg-sumo-brand text-white px-10 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-xl shadow-sumo-brand/20 hover:bg-sumo-dark hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        保存して公開
                    </button>
                </div>
            </div>
        </div>
    );
}