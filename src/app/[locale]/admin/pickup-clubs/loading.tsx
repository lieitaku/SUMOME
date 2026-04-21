import React from "react";
import AdminRouteLoadingShell from "@/components/admin/AdminRouteLoadingShell";

/**
 * 注目の相撲クラブ編集页的 loading 骨架，与真实布局一致
 */
export default function PickupClubsLoading() {
  return (
    <AdminRouteLoadingShell>
    <div className="max-w-6xl mx-auto space-y-6 font-sans animate-pulse">
      {/* 标题 + 描述 */}
      <div>
        <div className="h-8 w-56 bg-gray-200 rounded" />
        <div className="h-4 max-w-xl mt-2 bg-gray-100 rounded" />
      </div>

      {/* 一张卡片：头部 + 3 列槽位 */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header：左侧图标+文案，右侧两个按钮 */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-44 bg-gray-200 rounded" />
              <div className="h-3 max-w-xs bg-gray-100 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-24 bg-gray-200 rounded-lg" />
            <div className="h-9 w-28 bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* 3 列网格，每列：标签 + aspect-[4/3] 卡片 */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="h-3 w-28 bg-gray-100 rounded px-1" />
                <div className="aspect-4/3 rounded-2xl bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </AdminRouteLoadingShell>
  );
}
