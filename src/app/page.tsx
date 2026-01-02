"use client";

import React from "react";
import Hero from "@/components/home/HeroDemoB";
import AboutService from "@/components/home/AboutService";
import PickupClubs from "@/components/home/PickupClubs";
import ManagerInfo from "@/components/home/ManagerInfo";
import ActivityReport from "@/components/home/ActivityReport";
import CTA from "@/components/home/CTA";
import HeroDemoA from "@/components/home/HeroDemoA";
import HeroDemoB from "@/components/home/HeroDemoB";

// 引入封装好的 Hook
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Home() {
  // 一行代码调用动画逻辑
  useScrollReveal();
  // false = 显示 A版
  // true  = 显示 B版
  const useAlternativeLayout = false;

  return (
    // 这里的 selection 样式也可以移到 globals.css (之前已经教过)，让这里更干净
    <div className="antialiased min-h-screen w-full flex flex-col bg-sumo-bg text-sumo-dark font-serif relative">
      {/* 全局纹理 (如果每个页面都要，建议放到 layout.tsx；如果只有首页要，留在这里) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 z-[1] mix-blend-multiply"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/washi.png")`,
        }}
      ></div>

      <main className="flex-grow relative z-10 w-full">
        {/* 2. 条件渲染区域 */}
        {useAlternativeLayout ? (
          // === [ Plan B: 实验版本 ] ===
          <HeroDemoB />
        ) : (
          // === [ Plan A: 基准版本 ] ===
          <HeroDemoA />
        )}
        <AboutService />
        <PickupClubs />
        <ManagerInfo />
        <ActivityReport />
        <CTA />
      </main>
    </div>
  );
}
