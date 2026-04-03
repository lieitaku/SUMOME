import React from "react";

export default function ClubsLoading() {
  return (
    <div className="min-h-screen bg-[#F4F5F7] animate-pulse">
      {/* Hero/标题区骨架 */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-10 w-48 bg-gray-200 rounded mb-4" />
          <div className="h-5 w-96 max-w-md bg-gray-100 rounded" />
        </div>
      </section>

      {/* 搜索 & 筛选骨架 */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="h-10 max-w-md bg-gray-100 rounded-lg" />
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-9 w-24 bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 俱乐部卡片网格骨架 */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="aspect-video bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-2/3 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-100 rounded" />
                  <div className="h-4 w-1/2 bg-gray-100 rounded" />
                  <div className="pt-4 flex gap-2">
                    <div className="h-8 w-20 bg-gray-100 rounded-lg" />
                    <div className="h-8 w-8 bg-gray-100 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
