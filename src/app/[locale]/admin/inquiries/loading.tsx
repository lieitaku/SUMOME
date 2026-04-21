import React from "react";
import AdminRouteLoadingShell from "@/components/admin/AdminRouteLoadingShell";

/**
 * お問い合わせ管理页的 loading 骨架，与真实布局一致
 */
export default function InquiriesLoading() {
  return (
    <AdminRouteLoadingShell>
    <div className="max-w-6xl mx-auto space-y-6 font-sans animate-pulse">
      {/* 标题 + 描述（无右侧按钮） */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-4 max-w-md mt-2 bg-gray-100 rounded" />
        </div>
      </div>

      {/* 4 个状态统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-4 text-center"
          >
            <div className="h-8 w-12 bg-gray-200 rounded mx-auto mb-2" />
            <div className="h-4 w-16 bg-gray-100 rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* 列表卡片 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="h-6 w-20 bg-gray-200 rounded" />
                <div className="h-5 w-12 bg-gray-100 rounded" />
                <div className="h-4 w-32 bg-gray-100 rounded" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="h-5 w-28 bg-gray-200 rounded" />
                <div className="h-4 w-40 bg-gray-100 rounded" />
                <div className="h-4 w-24 bg-gray-100 rounded" />
              </div>
              <div className="h-16 bg-gray-50 rounded-lg border border-gray-100" />
            </div>
            <div className="lg:w-48 flex flex-col justify-between items-end gap-4 lg:border-l lg:border-gray-100 lg:pl-6">
              <div className="h-9 w-full bg-gray-100 rounded-lg" />
              <div className="h-5 w-12 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="h-6 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-28 bg-gray-100 rounded" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="h-5 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-36 bg-gray-100 rounded" />
                <div className="h-4 w-20 bg-gray-100 rounded" />
              </div>
              <div className="h-12 bg-gray-50 rounded-lg border border-gray-100" />
            </div>
            <div className="lg:w-48 flex flex-col justify-between items-end gap-4 lg:border-l lg:border-gray-100 lg:pl-6">
              <div className="h-9 w-full bg-gray-100 rounded-lg" />
              <div className="h-5 w-12 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="h-6 w-20 bg-gray-200 rounded" />
                <div className="h-5 w-14 bg-gray-100 rounded" />
                <div className="h-4 w-36 bg-gray-100 rounded" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="h-5 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-44 bg-gray-100 rounded" />
                <div className="h-4 w-20 bg-gray-100 rounded" />
              </div>
              <div className="h-20 bg-gray-50 rounded-lg border border-gray-100" />
            </div>
            <div className="lg:w-48 flex flex-col justify-between items-end gap-4 lg:border-l lg:border-gray-100 lg:pl-6">
              <div className="h-9 w-full bg-gray-100 rounded-lg" />
              <div className="h-5 w-12 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminRouteLoadingShell>
  );
}
