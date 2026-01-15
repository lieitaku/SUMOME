import React from "react";
// 引入你的组件
import RabbitWalkingBanner from "@/components/home/RabbitBanner";

export default function BannerTestPage() {
  return (
    // 1. 设置全屏高度和灰色背景，模拟网页环境
    <div className="min-h-screen w-full bg-[#f0f2f5] flex flex-col items-center justify-center">
      {/* 测试标题 */}
      <h1 className="text-3xl font-bold text-gray-700 mb-10">
        🐇 Rabbit Banner Component Test
      </h1>

      {/* 2. Banner 容器 */}
      {/* Banner 默认是 w-full，所以给父容器设定宽度来测试响应式表现 */}
      <div className="w-full border-y border-gray-300 bg-white/50">
        <RabbitWalkingBanner />
      </div>

      {/* 提示信息 */}
      <p className="mt-8 text-gray-500 font-mono text-sm">
        Current Settings: Speed 50px/s | Gap 0 | Loop Mode
      </p>
    </div>
  );
}
