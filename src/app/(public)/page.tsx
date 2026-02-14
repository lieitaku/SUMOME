import React from "react";
import { prisma } from "@/lib/db";
import { getBannerDisplaySettings } from "@/lib/actions/banners";
import { getPickupClubsForHome } from "@/lib/actions/pickup-clubs";

// 引入组件
import Hero from "@/components/home/Hero";
import AboutService from "@/components/home/AboutService";
import PickupClubs from "@/components/home/PickupClubs";
import ManagerInfo from "@/components/home/ManagerInfo";
import ActivityReport from "@/components/home/ActivityReport"; // 待会儿给它传 props
import CTA from "@/components/home/CTA";
import ScrollInitializer from "@/components/utils/ScrollInitializer";

export default async function Home() {
  // 四路请求互不依赖，并行以缩短首屏时间
  const [pickupClubs, activities, banners, displaySettings] = await Promise.all([
    getPickupClubsForHome(),
    prisma.activity.findMany({
      where: { published: true },
      include: {
        club: { select: { name: true } },
      },
      orderBy: { date: "desc" },
      take: 6,
    }),
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    getBannerDisplaySettings(),
  ]);

  const filteredBanners =
    displaySettings.homeSponsorTierFilter === "official_only"
      ? banners.filter(
          (b) =>
            b.category === "club" ||
            (b.category === "sponsor" && b.sponsorTier === "OFFICIAL")
        )
      : banners;

  const sponsors = filteredBanners.map((b) => ({
    id: b.id,
    image: b.image,
    alt: b.alt || b.name,
    link: b.link,
    category: b.category,
  }));

  return (
    <div className="w-full flex flex-col min-h-screen">
      <ScrollInitializer />

      <main className="flex-grow w-full">
        {/* 使用视频背景时传 videoSrc + posterSrc（可选 videoWebmSrc），见 docs/hero-video.md */}
        <Hero
          sponsors={sponsors}
          displayMode={displaySettings.homeDisplayMode}
          videoSrc="/videos/hero-bg.mp4"
          posterSrc="/images/hero/hero-poster.jpg"
        />
        <AboutService />

        <PickupClubs clubs={pickupClubs} />

        <ManagerInfo />

        <ActivityReport activities={activities} />

        <CTA />
      </main>
    </div>
  );
}