import React from "react";

export default function MagazineListLoading() {
    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
            {/* 头部骨架 */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-7 w-48 bg-gray-200 rounded" />
                    <div className="h-4 w-64 bg-gray-100 rounded" />
                </div>
                <div className="h-10 w-28 bg-gray-200 rounded-lg" />
            </div>

            {/* 搜索 & 筛选区域骨架 */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="h-10 max-w-md bg-gray-100 rounded-lg" />
                <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 w-20 bg-gray-100 rounded-lg" />
                    ))}
                </div>
            </div>

            {/* 卡片网格骨架 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="aspect-3/4 bg-gray-200" />
                        <div className="p-6 space-y-3">
                            <div className="flex gap-2">
                                <div className="h-4 w-24 bg-gray-100 rounded" />
                                <div className="h-4 w-12 bg-gray-100 rounded" />
                            </div>
                            <div className="h-5 w-full bg-gray-200 rounded" />
                            <div className="h-5 w-3/4 bg-gray-100 rounded" />
                            <div className="pt-4 border-t border-gray-50 flex justify-between">
                                <div className="h-4 w-12 bg-gray-100 rounded" />
                                <div className="h-8 w-8 bg-gray-100 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
