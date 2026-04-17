import React from "react";

/** 与 Hero 首屏高度大致对齐的占位，便于 Suspense 流式首绘 */
export default function HomeSkeleton() {
    return (
        <div className="w-full flex flex-col min-h-screen">
            <div className="grow w-full">
                <div
                    className="w-full rounded-2xl bg-sumo-bg/80 animate-pulse"
                    style={{ minHeight: "min(70vh, 560px)" }}
                />
                <div className="max-w-[1280px] mx-auto px-4 pt-12 pb-8 flex flex-col gap-8">
                    <div className="h-40 rounded-xl bg-gray-100/80 animate-pulse" />
                    <div className="h-48 rounded-xl bg-gray-100/80 animate-pulse" />
                    <div className="h-64 rounded-xl bg-gray-100/80 animate-pulse" />
                </div>
            </div>
        </div>
    );
}
