import React from "react";

/**
 * Admin 根 loading：点击侧边栏或筛选后立即显示，避免长时间白屏
 * 正式环境服务端 RTT + DB 较慢时，用户可先看到骨架再等数据
 */
export default function AdminLoading() {
    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-7 w-48 bg-gray-200 rounded" />
                    <div className="h-4 w-64 bg-gray-100 rounded" />
                </div>
                <div className="h-10 w-28 bg-gray-200 rounded-lg" />
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="h-10 max-w-md bg-gray-100 rounded-lg" />
                <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-8 w-20 bg-gray-100 rounded-lg" />
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="aspect-video bg-gray-200" />
                        <div className="p-4 space-y-2">
                            <div className="h-4 w-3/4 bg-gray-200 rounded" />
                            <div className="h-3 w-1/2 bg-gray-100 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
