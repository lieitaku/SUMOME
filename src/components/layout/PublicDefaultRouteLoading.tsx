import React from "react";
import PublicRouteLoadingShell from "@/components/layout/PublicRouteLoadingShell";

/**
 * 公开站默认路由 loading：与 `(public)/loading` 一致。
 * 供 about、contact、partners 等各段 `loading.tsx` 复用，避免只依赖父级时的歧义。
 */
export default function PublicDefaultRouteLoading() {
  return (
    <PublicRouteLoadingShell>
      <section className="shrink-0 pt-28 pb-10 px-4 md:pt-32 md:pb-16 md:px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="h-10 w-56 max-w-[80%] bg-gray-200 rounded-lg" />
          <div className="h-5 w-full max-w-md bg-gray-100 rounded" />
        </div>
      </section>

      <section className="shrink-0 px-4 pb-8 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-4 shadow-sm">
            <div className="h-4 w-3/4 max-w-sm bg-gray-100 rounded" />
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-5/6 bg-gray-100 rounded" />
            <div className="h-32 w-full bg-gray-100 rounded-xl mt-4" />
          </div>
        </div>
      </section>

      <section className="shrink-0 px-4 pb-24 md:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
            >
              <div className="h-40 bg-gray-200" />
              <div className="p-6 space-y-3">
                <div className="h-5 w-2/3 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-1/2 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </PublicRouteLoadingShell>
  );
}
