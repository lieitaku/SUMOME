import React from "react";
import MagazineListLoadingSkeleton from "@/components/admin/magazines/MagazineListLoadingSkeleton";

/**
 * 与 admin/magazines/loading 一致：标题区 + 筛选 + 列表表格骨架。
 * 用作后台缺省 loading（无独立骨架的页面）。
 */
export default function AdminMagazineStyleLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 px-0">
      {/* 头部骨架 */}
      <div className="flex items-center justify-between animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded-lg" />
          <div className="h-4 w-64 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg" />
      </div>

      {/* 搜索 & 筛选区域骨架 */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 animate-pulse">
        <div className="h-10 max-w-md bg-gray-100 rounded-lg" />
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>

      <MagazineListLoadingSkeleton variant="list" />
    </div>
  );
}
