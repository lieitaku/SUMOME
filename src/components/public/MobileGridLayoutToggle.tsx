"use client";

import React from "react";
import { LayoutGrid, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";

export type MobileGridLayout = "single" | "double";

type MobileGridLayoutToggleProps = {
  layout: MobileGridLayout;
  onLayoutChange: (layout: MobileGridLayout) => void;
  labelDisplay: string;
  ariaDouble: string;
  ariaSingle: string;
  className?: string;
};

/**
 * 杂志 / 俱乐部等列表页：手机端「表示」切换（双列 / 单列），与 MagazinesClient 行为一致。
 */
export default function MobileGridLayoutToggle({
  layout,
  onLayoutChange,
  labelDisplay,
  ariaDouble,
  ariaSingle,
  className,
}: MobileGridLayoutToggleProps) {
  return (
    <div className={cn("md:hidden inline-flex items-center gap-2", className)}>
      <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
        {labelDisplay}
      </span>
      <div className="inline-flex items-center rounded-full bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => onLayoutChange("double")}
          className={cn(
            "p-2 rounded-full transition-colors",
            layout === "double" ? "bg-sumo-brand text-white" : "text-gray-500"
          )}
          aria-label={ariaDouble}
        >
          <LayoutGrid size={18} />
        </button>
        <button
          type="button"
          onClick={() => onLayoutChange("single")}
          className={cn(
            "p-2 rounded-full transition-colors",
            layout === "single" ? "bg-sumo-brand text-white" : "text-gray-500"
          )}
          aria-label={ariaSingle}
        >
          <LayoutList size={18} />
        </button>
      </div>
    </div>
  );
}
