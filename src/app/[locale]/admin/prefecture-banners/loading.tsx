import React from "react";
import AdminRouteLoadingShell from "@/components/admin/AdminRouteLoadingShell";

/**
 * 都道府県バナー管理页的 loading 骨架，与真实布局一致
 */
export default function PrefectureBannersLoading() {
  return (
    <AdminRouteLoadingShell>
    <div className="max-w-6xl mx-auto space-y-6 font-sans animate-pulse">
      {/* 标题 + 描述（无右侧按钮） */}
      <div>
        <div className="h-8 w-52 bg-gray-200 rounded" />
        <div className="h-4 max-w-xl mt-2 bg-gray-100 rounded" />
      </div>

      {/* 蓝色说明框 */}
      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-blue-200 shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-32 bg-blue-200 rounded" />
          <div className="h-3 w-full max-w-2xl bg-blue-100 rounded" />
        </div>
      </div>

      {/* 排序栏 */}
      <div className="flex flex-wrap items-center justify-end gap-4 mb-4">
        <div className="h-9 w-48 bg-gray-100 rounded-lg" />
      </div>

      {/* 移动端：卡片列表 */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-16 h-10 rounded bg-gray-200 shrink-0" />
              <div className="space-y-1">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="h-4 w-20 bg-gray-100 rounded" />
            <div className="h-10 bg-gray-100 rounded-lg" />
          </div>
        ))}
      </div>

      {/* 桌面：表格 */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">
                <div className="h-4 w-28 bg-gray-200 rounded" />
              </th>
              <th className="px-6 py-4">
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </th>
              <th className="px-6 py-4">
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </th>
              <th className="px-6 py-4 text-right">
                <div className="h-4 w-12 bg-gray-200 rounded ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <tr key={i} className="h-16">
                <td className="px-6 py-4 space-y-1">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-3 w-14 bg-gray-100 rounded" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-11 rounded bg-gray-100" />
                    <div className="h-5 w-14 bg-gray-100 rounded" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-12 bg-gray-100 rounded" />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="h-9 w-16 bg-gray-100 rounded-lg ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </AdminRouteLoadingShell>
  );
}
