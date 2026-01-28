import React from "react";
import { prisma } from "@/lib/db";

// 引入组件
import Hero from "@/components/home/Hero";
import AboutService from "@/components/home/AboutService";
import PickupClubs from "@/components/home/PickupClubs";
import ManagerInfo from "@/components/home/ManagerInfo";
import ActivityReport from "@/components/home/ActivityReport"; // 待会儿给它传 props
import CTA from "@/components/home/CTA";
import ScrollInitializer from "@/components/utils/ScrollInitializer";

export default async function Home() {
  // 1. 获取俱乐部数据（你已经写好的）
  const pickupClubs = await prisma.club.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  // ✨ 2. 新增：获取活动数据
  const activities = await prisma.activity.findMany({
    where: { published: true },
    include: {
      club: {
        select: { name: true } // 只需要名字，节省性能，符合 Smart Money 观
      }
    },
    orderBy: { date: 'desc' },
    take: 6, // 拿 6 条，方便你的 Swiper 循环展示
  });

  return (
    <div className="w-full flex flex-col min-h-screen">
      <ScrollInitializer />

      <main className="flex-grow w-full">
        <Hero />
        <AboutService />

        <PickupClubs clubs={pickupClubs} />

        <ManagerInfo />

        <ActivityReport activities={activities} />

        <CTA />
      </main>
    </div>
  );
}