import React from "react";

export default function AdminDashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto font-sans animate-pulse">
      {/* 标题区域骨架 */}
      <div className="mb-8">
        <div className="h-8 w-40 bg-gray-200 rounded-md mb-3" />
        <div className="h-4 w-72 bg-gray-200 rounded-md" />
      </div>

      {/* 待处理提醒横幅骨架 */}
      <div className="mb-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-lg" />
            <div>
              <div className="h-4 w-44 bg-amber-100 rounded-md mb-2" />
              <div className="h-3 w-56 bg-amber-100 rounded-md" />
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="h-9 w-32 bg-amber-100 rounded-lg" />
            <div className="hidden sm:block h-9 w-32 bg-amber-100 rounded-lg" />
          </div>
        </div>
      </div>

      {/* 核心指标卡片骨架：与实际布局一致的 6 列响应式网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-12">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="relative block p-5 bg-white rounded-xl border border-gray-200 shadow-sm"
          >
            {/* 右上角小标签占位 */}
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg" />
              <div className="h-3 w-10 bg-gray-100 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-100 rounded-md" />
              <div className="flex items-baseline gap-2">
                <div className="h-7 w-10 bg-gray-100 rounded-md" />
                <div className="h-3 w-6 bg-gray-100 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 快速操作指引骨架：保持与实际 CTA 容器相同结构 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6" />
        <div className="h-5 w-56 bg-gray-200 rounded-md mx-auto mb-3" />
        <div className="h-4 w-80 bg-gray-200 rounded-md mx-auto mb-2" />
        <div className="h-4 w-64 bg-gray-200 rounded-md mx-auto mb-6" />
        <div className="flex flex-wrap justify-center gap-4">
          <div className="h-11 w-40 bg-sumo-brand/10 rounded-xl" />
          <div className="h-11 w-44 bg-blue-50 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

