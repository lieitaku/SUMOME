"use client";

import React, { useTransition, useOptimistic } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { REGIONS } from "@/lib/constants";

interface RegionFilterProps {
    /** 基础路径，如 "/admin/clubs" */
    basePath: string;
    /** 当前选中的 region */
    currentRegion?: string;
    /** 当前选中的 pref */
    currentPref?: string;
    /** 当前搜索关键词 */
    currentQuery?: string;
    /** 额外的查询参数（如 category） */
    extraParams?: Record<string, string | undefined>;
}

export default function RegionFilter({
    basePath,
    currentRegion,
    currentPref,
    currentQuery,
    extraParams = {},
}: RegionFilterProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // 乐观更新：立即显示选中状态
    const [optimisticState, setOptimisticState] = useOptimistic(
        { region: currentRegion, pref: currentPref },
        (_, newState: { region?: string; pref?: string }) => newState
    );

    // 构建 URL 并导航
    const navigate = (region?: string, pref?: string) => {
        // 构建查询参数
        const params = new URLSearchParams();
        if (region) params.set("region", region);
        if (pref) params.set("pref", pref);
        if (currentQuery) params.set("q", currentQuery);

        // 添加额外参数
        Object.entries(extraParams).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });

        const queryString = params.toString();
        const url = queryString ? `${basePath}?${queryString}` : basePath;

        // 使用 transition 进行导航和乐观更新
        startTransition(() => {
            // 乐观更新必须在 startTransition 内部
            setOptimisticState({ region, pref });
            router.push(url);
        });
    };

    // 选择区域
    const selectRegion = (region: string) => {
        if (region === optimisticState.region && !optimisticState.pref) return;
        navigate(region, undefined);
    };

    // 选择县
    const selectPref = (pref: string) => {
        if (pref === optimisticState.pref) return;
        navigate(optimisticState.region, pref);
    };

    // 清除筛选
    const clearFilter = () => {
        if (!optimisticState.region && !optimisticState.pref) return;
        navigate(undefined, undefined);
    };

    return (
        <div className="pt-4 border-t border-gray-100 space-y-4 relative">
            {/* Loading 指示器 */}
            {isPending && (
                <div className="absolute top-2 right-0 flex items-center gap-1.5 text-sumo-brand">
                    <Loader2 size={12} className="animate-spin" />
                    <span className="text-[10px] font-bold">読込中...</span>
                </div>
            )}

            {/* 区域筛选 */}
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2 flex items-center gap-1">
                    <Filter size={12} /> Region
                </span>

                {/* 全部按钮 */}
                <button
                    type="button"
                    onClick={clearFilter}
                    disabled={isPending}
                    className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold border transition-all",
                        !optimisticState.region
                            ? "bg-sumo-dark text-white border-sumo-dark"
                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-400",
                        isPending && "opacity-70"
                    )}
                >
                    全て
                </button>

                {/* 区域按钮 */}
                {Object.keys(REGIONS).map((r) => (
                    <button
                        key={r}
                        type="button"
                        onClick={() => selectRegion(r)}
                        disabled={isPending}
                        className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold border transition-all",
                            optimisticState.region === r
                                ? "bg-sumo-brand text-white border-sumo-brand"
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-400",
                            isPending && "opacity-70"
                        )}
                    >
                        {r}
                    </button>
                ))}
            </div>

            {/* 县筛选（展开） */}
            {optimisticState.region && optimisticState.region in REGIONS && (
                <div className="flex flex-wrap gap-2 items-center md:pl-10 animate-in fade-in slide-in-from-left-2 duration-200">
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mr-2">
                        ┗ Pref
                    </span>
                    {REGIONS[optimisticState.region as keyof typeof REGIONS].map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => selectPref(p)}
                            disabled={isPending}
                            className={cn(
                                "px-3 py-1 rounded-full text-[11px] font-bold border transition-all",
                                optimisticState.pref === p
                                    ? "bg-blue-50 text-sumo-brand border-sumo-brand"
                                    : "bg-white text-gray-400 border-gray-100 hover:border-gray-300",
                                isPending && "opacity-70"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
