import React from "react";
import { prisma } from "@/lib/db";
import { getBannerDisplaySettings } from "@/lib/actions/banners";
import { getPickupClubsForHome } from "@/lib/actions/pickup-clubs";
import { getPreviewPayload } from "@/lib/preview";

// 引入组件
import Hero from "@/components/home/Hero";
import AboutService from "@/components/home/AboutService";
import PickupClubs from "@/components/home/PickupClubs";
import ManagerInfo from "@/components/home/ManagerInfo";
import ActivityReport from "@/components/home/ActivityReport"; // 待会儿给它传 props
import CTA from "@/components/home/CTA";
import ScrollInitializer from "@/components/utils/ScrollInitializer";

export default async function Home() {
  const preview = await getPreviewPayload();
  const isPreview =
    !!preview &&
    (preview.redirectPath === "/" || preview.redirectPath === "" || preview.type === "banner_single");

  let displaySettings = await getBannerDisplaySettings();
  let pickupClubs = await getPickupClubsForHome();

  if (preview?.type === "banner_display" && preview.payload && typeof preview.payload === "object") {
    const p = preview.payload as Record<string, string>;
    displaySettings = {
      ...displaySettings,
      homeDisplayMode: (p.homeDisplayMode as typeof displaySettings.homeDisplayMode) ?? displaySettings.homeDisplayMode,
      homeSponsorTierFilter: (p.homeSponsorTierFilter as typeof displaySettings.homeSponsorTierFilter) ?? displaySettings.homeSponsorTierFilter,
      prefTopDisplayMode: (p.prefTopDisplayMode as typeof displaySettings.prefTopDisplayMode) ?? displaySettings.prefTopDisplayMode,
      prefTopSponsorTierFilter: (p.prefTopSponsorTierFilter as typeof displaySettings.prefTopSponsorTierFilter) ?? displaySettings.prefTopSponsorTierFilter,
      prefSidebarDisplayMode: (p.prefSidebarDisplayMode as typeof displaySettings.prefSidebarDisplayMode) ?? displaySettings.prefSidebarDisplayMode,
      prefSidebarSponsorTierFilter: (p.prefSidebarSponsorTierFilter as typeof displaySettings.prefSidebarSponsorTierFilter) ?? displaySettings.prefSidebarSponsorTierFilter,
    };
  }
  if (preview?.type === "home_pickup" && preview.payload && typeof preview.payload === "object") {
    const p = preview.payload as { clubIds?: (string | null)[] };
    const ids = (p.clubIds ?? []).filter((id): id is string => !!id);
    if (ids.length > 0) {
      const found = await prisma.club.findMany({ where: { id: { in: ids } } });
      const order = (p.clubIds ?? []).slice(0, 3);
      pickupClubs = order.map((id) => (id ? found.find((c) => c.id === id) : null)).filter(Boolean) as typeof pickupClubs;
    }
  }

  const [activities, bannersFromDb] = await Promise.all([
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
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    }),
  ]);

  let banners = bannersFromDb;
  if (preview?.type === "banner_single" && preview.payload && typeof preview.payload === "object") {
    const p = preview.payload as { banner?: { id?: string; name?: string; image?: string; alt?: string; link?: string; category?: string; sponsorTier?: string | null } };
    const single = p.banner;
    if (single?.image) {
      const previewBanner = {
        id: single.id ?? "preview-banner",
        name: single.name ?? "プレビュー",
        image: single.image,
        alt: single.alt ?? single.name ?? "",
        link: single.link ?? "",
        category: (single.category === "sponsor" ? "sponsor" : "club") as "club" | "sponsor",
        sponsorTier: single.sponsorTier ?? null,
        sortOrder: 0,
        isActive: true,
      };
      const rest = bannersFromDb.filter((b) => b.id !== previewBanner.id);
      banners = [previewBanner, ...rest].sort((a, b) => a.sortOrder - b.sortOrder);
    }
  }

  const homeFilter = displaySettings.homeSponsorTierFilter;
  const filteredBanners = banners.filter((b) => {
    if (b.category === "club") return true;
    if (b.category !== "sponsor") return false;
    if (homeFilter === "official_only") return b.sponsorTier === "OFFICIAL";
    if (homeFilter === "local_only") return b.sponsorTier === "LOCAL" || b.sponsorTier == null;
    return true; // all
  });

  const sponsors = filteredBanners.map((b) => ({
    id: b.id,
    image: b.image,
    alt: b.alt || b.name,
    link: b.link,
    category: b.category,
  }));

  return (
    <div className="w-full flex flex-col min-h-screen">
      {isPreview && (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-bold">
          プレビュー — 未保存の内容を表示しています。
        </div>
      )}
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