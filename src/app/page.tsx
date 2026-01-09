"use client";

import React from "react";
import Hero from "@/components/home/Hero";
import AboutService from "@/components/home/AboutService";
import PickupClubs from "@/components/home/PickupClubs";
import ManagerInfo from "@/components/home/ManagerInfo";
import ActivityReport from "@/components/home/ActivityReport";
import CTA from "@/components/home/CTA";

// 引入封装好的 Hook
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Home() {
  // 一行代码调用动画逻辑
  useScrollReveal();

  const useAlternativeLayout = false;

  return (
    <div className="w-full flex flex-col min-h-screen">
      <main className="flex-grow w-full">
        {/* 注意：以下组件内部可能还写死了 'bg-sumo-dark'。
           下一步我们会进入这些组件，使用新的 <Section> 组件来包裹它们。
        */}
        <Hero />
        <AboutService />
        <PickupClubs />
        <ManagerInfo />
        <ActivityReport />
        <CTA />
      </main>
    </div>
  );
}
