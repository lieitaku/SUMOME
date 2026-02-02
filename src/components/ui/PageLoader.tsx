"use client";

import { useTransition } from "@/context/TransitionContext";
import { Loader2 } from "lucide-react";

export default function PageLoader() {
    const { isLoading } = useTransition();

    if (!isLoading) return null;

    return (
        // 1. 全屏遮罩：白色半透明 + 轻微毛玻璃 -> 营造“迷雾”感
        // z-[9999] 确保盖住所有内容
        <div className="fixed inset-0 z-[9999] bg-white/60 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in duration-200 cursor-wait">

            {/* 2. 中心加载标识：可以是你的 Sumo Logo，或者极简的 Loading 文字 */}
            <div className="flex flex-col items-center gap-3">
                {/* 这里换成你的 Logo 图片最好，现在用图标代替 */}
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-sumo-brand/50"></div>
                    <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-t-sumo-brand animate-spin"></div>
                </div>

                <span className="text-[10px] font-bold tracking-[0.3em] text-sumo-text uppercase animate-pulse">
                    SUMOME
                </span>
            </div>
        </div>
    );
}