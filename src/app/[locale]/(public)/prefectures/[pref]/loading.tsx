import React from "react";

export default function PrefectureLoading() {
  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col animate-pulse">
      <main className="grow">
        {/* Header 骨架 */}
        <section className="relative pt-40 pb-32 overflow-hidden bg-gray-800">
          <div className="container mx-auto px-6 relative z-10">
            <div className="mb-8">
              <div className="h-6 w-24 bg-gray-600 rounded" />
            </div>
            <div className="h-4 w-32 bg-gray-600/80 rounded mb-4" />
            <div className="h-14 w-64 bg-gray-600 rounded mb-6" />
            <div className="h-5 w-96 max-w-xl bg-gray-600/70 rounded" />
          </div>
        </section>

        {/* Ceramic 区域骨架 */}
        <section className="relative px-6 z-20">
          <div className="container mx-auto max-w-6xl relative -mt-20">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div className="h-6 w-40 bg-gray-100 rounded mx-auto mb-6" />
              <div className="h-[270px] bg-gray-100 rounded" />
            </div>
          </div>
        </section>

        {/* 主内容网格骨架 */}
        <section className="relative pb-24 px-6 pt-20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-8 h-48" />
                <div className="bg-white rounded-2xl border border-gray-200 p-0 overflow-hidden h-80" />
              </div>
              <div className="lg:col-span-8 space-y-8">
                <div className="aspect-[21/9] bg-gray-200 rounded-2xl" />
                <div>
                  <div className="flex justify-between mb-6">
                    <div className="h-8 w-32 bg-gray-200 rounded" />
                    <div className="h-8 w-12 bg-gray-200 rounded" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="aspect-video bg-gray-100" />
                        <div className="p-6 space-y-2">
                          <div className="h-5 w-3/4 bg-gray-200 rounded" />
                          <div className="h-4 w-full bg-gray-100 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
