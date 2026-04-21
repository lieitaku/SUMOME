import React from "react";
import AdminRouteLoadingShell from "@/components/admin/AdminRouteLoadingShell";

/**
 * 普及・広報活动管理页的 loading 骨架，与真实布局一致
 */
export default function AdminActivitiesLoading() {
  return (
    <AdminRouteLoadingShell>
    <div className="max-w-6xl mx-auto space-y-6 font-sans animate-pulse">
      {/* 标题 + 描述 + 新規登録按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-56 bg-gray-200 rounded" />
          <div className="h-4 max-w-sm mt-2 bg-gray-100 rounded" />
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg shrink-0" />
      </div>

      {/* 筛选卡片：搜索 + 分类 + 地域 */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2 grow max-w-md">
            <div className="flex-1 h-10 bg-gray-100 rounded-lg" />
            <div className="h-10 w-20 bg-gray-200 rounded-lg shrink-0" />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-7 w-14 bg-gray-200 rounded-md" />
            ))}
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="h-3 w-16 bg-gray-100 rounded" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-7 w-12 bg-gray-100 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* 列表：桌面为表格，与 ActivitiesListClient 一致 */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-12 bg-gray-50 border-b border-gray-200 flex gap-4 px-6 items-center">
          <div className="h-4 flex-1 max-w-xs bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-12 bg-gray-200 rounded ml-auto" />
        </div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-14 border-b border-gray-100 flex gap-4 px-6 items-center"
          >
            <div className="flex-1 space-y-1">
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-100 rounded" />
            </div>
            <div className="w-24 space-y-1">
              <div className="h-4 bg-gray-100 rounded" />
              <div className="h-3 w-16 bg-gray-100 rounded" />
            </div>
            <div className="w-16">
              <div className="h-5 w-14 bg-gray-100 rounded" />
            </div>
            <div className="w-12 ml-auto">
              <div className="h-8 w-8 bg-gray-100 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* 移动端：卡片列表 */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="h-5 w-14 bg-gray-200 rounded" />
              <div className="h-5 w-16 bg-gray-100 rounded" />
            </div>
            <div className="h-5 w-full bg-gray-200 rounded" />
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="h-4 w-2/3 bg-gray-100 rounded" />
              <div className="h-4 w-1/2 bg-gray-100 rounded" />
            </div>
            <div className="h-10 bg-gray-100 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
    </AdminRouteLoadingShell>
  );
}
