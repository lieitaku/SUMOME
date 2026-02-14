import React from "react";

/**
 * 注目の相撲クラブ编辑页的 loading 骨架，与真实布局一致
 */
export default function PickupClubsLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans animate-pulse">
      {/* 标题 + 描述（无右侧按钮） */}
      <div>
        <div className="h-8 w-56 bg-gray-200 rounded" />
        <div className="h-4 max-w-xl mt-2 bg-gray-100 rounded" />
      </div>

      {/* 一张卡片：头部 + 3 个槽位 + 保存按钮 */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gray-200" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-48 bg-gray-200 rounded" />
              <div className="h-3 max-w-md bg-gray-100 rounded" />
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 bg-gray-100 rounded" />
              <div className="h-12 w-full bg-gray-100 rounded-xl" />
              <div className="flex items-center gap-3 mt-2 p-3 rounded-xl border border-gray-100 bg-gray-50/50 min-h-[72px]">
                <div className="w-14 h-14 shrink-0 rounded-lg bg-gray-200" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
            </div>
          ))}

          <div className="pt-2">
            <div className="h-10 w-40 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
