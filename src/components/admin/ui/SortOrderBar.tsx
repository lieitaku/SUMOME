"use client";

import React from "react";
import { Map, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortMode = "area" | "time";

interface SortOrderBarProps {
    value: SortMode;
    onChange: (value: SortMode) => void;
    className?: string;
}

/** 並び順：地域順 / 新着順 — 与前端 clubs 页一致，后台复用 */
export default function SortOrderBar({ value, onChange, className }: SortOrderBarProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">
                並び順
            </span>
            <button
                type="button"
                onClick={() => onChange("area")}
                className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-colors",
                    value === "area"
                        ? "bg-sumo-brand text-white border-sumo-brand shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                )}
            >
                <Map size={14} />
                地域順
            </button>
            <button
                type="button"
                onClick={() => onChange("time")}
                className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-colors",
                    value === "time"
                        ? "bg-sumo-brand text-white border-sumo-brand shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                )}
            >
                <Clock size={14} />
                新着順
            </button>
        </div>
    );
}
