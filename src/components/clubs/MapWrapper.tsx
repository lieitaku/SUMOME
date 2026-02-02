"use client"; // 👈 必须是客户端组件才能使用 ssr: false

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// 在这里定义动态导入，并关闭 SSR
const JapanMap = dynamic(
    () => import("@/components/clubs/JapanMap"),
    {
        ssr: false, // ✅ 这里允许使用 ssr: false
        loading: () => (
            <div className="w-full h-[600px] flex flex-col items-center justify-center text-gray-400 gap-3 bg-white/50 rounded-xl">
                <Loader2 className="animate-spin w-8 h-8 text-sumo-brand" />
                <span className="text-sm font-bold tracking-widest text-gray-500">MAP LOADING...</span>
            </div>
        ),
    }
);

export default function MapWrapper() {
    return <JapanMap />;
}