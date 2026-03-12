import React, { Suspense } from "react";
import Link from "@/components/ui/TransitionLink";
import Image from "next/image";
import {
  ChevronLeft,
  Camera,
  ArrowRight,
  UserPlus,
  Info,
  MapPin,
  ExternalLink,
} from "lucide-react";

import { getBannerDisplaySettings } from "@/lib/actions/banners";
import { getPreviewPayload } from "@/lib/preview";
import {
  getCachedActiveBanners,
  getCachedClubsByArea,
  getCachedPrefectureBanner,
} from "@/lib/cached-queries";

// Client component wrapper: dynamic import with ssr: false (must live in a Client Component in Next.js 16)
import RabbitWalkingBanner from "@/components/home/RabbitBanner/RabbitBannerDynamic";

// Components
import RikishiTable from "@/components/clubs/RikishiTable";
import ClubCard from "@/components/clubs/ClubCard";
import Ceramic from "@/components/ui/Ceramic";
import ScrollToTop from "@/components/common/ScrollToTop";

// Data & Utils
import { PREFECTURE_DATABASE } from "@/data/prefectures";
import { cn } from "@/lib/utils";
import { getPrefectureTheme } from "@/lib/prefectureThemes";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ pref: string }>;
  searchParams?: Promise<{ embedded?: string }>;
}

export default async function PrefecturePage({ params, searchParams }: PageProps) {
  const { pref } = await params;
  const sp = searchParams ? await searchParams : {};
  const isEmbedded = sp?.embedded === "1";
  const prefSlug = pref;
  const prefData = PREFECTURE_DATABASE[prefSlug];
  const staticDisplay = prefData || {
    name: prefSlug.toUpperCase(),
    introTitle: `${prefSlug}の相撲事情`,
    introText: "現在、この地域の詳細情報は準備中です。",
    bannerImg: "",
    rikishiList: [],
  };

  const preview = await getPreviewPayload();
  const prefBannerPreview =
    preview?.type === "prefecture_banner" &&
    preview.payload &&
    typeof preview.payload === "object" &&
    (preview.payload as { pref?: string }).pref === prefSlug
      ? (preview.payload as { pref: string; image?: string; alt?: string; imagePosition?: string; imageScale?: string | number; imageRotation?: string | number })
      : null;

  // All four queries are independent — fire them in parallel with caching
  const [customBanner, filteredClubs, banners, displaySettings] = await Promise.all([
    getCachedPrefectureBanner(prefSlug),
    getCachedClubsByArea(staticDisplay.name),
    getCachedActiveBanners(),
    getBannerDisplaySettings(),
  ]);

  const displayData = {
    ...staticDisplay,
    bannerImg: prefBannerPreview?.image ?? customBanner?.image ?? staticDisplay.bannerImg,
  };

  const toSponsorItem = (b: (typeof banners)[0]) => ({
    id: b.id,
    image: b.image,
    alt: b.alt || b.name,
    link: b.link,
    category: b.category,
  });

  type BannerWithTier = (typeof banners)[0] & { sponsorTier?: string | null };
  const matchSponsorTier = (b: BannerWithTier, filter: "all" | "official_only" | "local_only") => {
    if (b.category === "club") return true;
    if (b.category !== "sponsor") return false;
    if (filter === "all") return true;
    if (filter === "official_only") return b.sponsorTier === "OFFICIAL";
    return b.sponsorTier === "LOCAL" || b.sponsorTier == null; // local_only
  };

  const sponsorsTop = banners
    .filter((b) => matchSponsorTier(b, displaySettings.prefTopSponsorTierFilter))
    .map(toSponsorItem);
  const sponsorsSidebar = banners
    .filter((b) => matchSponsorTier(b, displaySettings.prefSidebarSponsorTierFilter))
    .map(toSponsorItem);

  const theme = getPrefectureTheme(prefSlug);
  const featuredClub = filteredClubs.length > 0 ? filteredClubs[0] : null;
  const bannerTitle = featuredClub
    ? `${featuredClub.name}の相撲風景`
    : `${displayData.name}の相撲風景`;
  const bannerAlt = prefBannerPreview?.alt ?? customBanner?.alt ?? bannerTitle;
  const clubDetailLink = featuredClub ? `/clubs/${featuredClub.slug}` : "#";
  const recruitLink = featuredClub ? `/clubs/${featuredClub.slug}/recruit` : "#";
  
  // 构建俱乐部完整地址
  const clubAddress = featuredClub
    ? [featuredClub.area, featuredClub.city, featuredClub.address].filter(Boolean).join(" ")
    : "";

  type BannerWithPosition = { imagePosition?: string | null; imageScale?: number | null; imageRotation?: number | null };
  const bannerRecord = customBanner as (BannerWithPosition & typeof customBanner) | null;
  const bannerPosition = prefBannerPreview?.imagePosition ?? bannerRecord?.imagePosition ?? "50,50";
  const [posX, posY] = bannerPosition.split(",").map((s: string) => {
    const n = Number(s.trim());
    return Number.isNaN(n) ? 50 : Math.min(100, Math.max(0, n));
  });
  const bannerScale =
    prefBannerPreview?.imageScale != null
      ? Number(prefBannerPreview.imageScale)
      : bannerRecord?.imageScale != null
        ? Number(bannerRecord.imageScale)
        : 1;
  const bannerRotation =
    prefBannerPreview?.imageRotation != null
      ? (() => {
          const n = Number(prefBannerPreview.imageRotation);
          return [0, 90, 180, 270].includes(n) ? n : 0;
        })()
      : bannerRecord?.imageRotation != null && [0, 90, 180, 270].includes(bannerRecord.imageRotation)
        ? bannerRecord.imageRotation
        : 0;
  const bannerBgPosition = `${posX}% ${posY}%`;

  const ceramicStyle = {
    borderBottomColor: theme.color,
    boxShadow: `0 4px 10px -2px ${theme.shadow}, 0 2px 4px -2px ${theme.shadow}`,
  };

  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
      {prefBannerPreview && !isEmbedded && (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-bold flex flex-wrap items-center justify-center gap-2">
          <span>プレビュー — 未保存の内容を表示しています。</span>
          {/* eslint-disable-next-line no-script-url */}
          <a href="javascript:history.back()" className="underline font-bold hover:no-underline">
            編集に戻る
          </a>
        </div>
      )}
      <main className="grow">
        {/* ==================== SECTION 1: Header ==================== */}
        <section className="relative pt-32 md:pt-40 pb-24 md:pb-32 overflow-hidden text-white shadow-xl bg-gray-900 transition-colors duration-500">
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-b opacity-100",
              theme.gradient
            )}
          ></div>
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 text-[18vw] font-black text-white opacity-[0.04] select-none pointer-events-none leading-none z-0 mix-blend-overlay uppercase tracking-tighter font-sans">
            {prefSlug}
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="mb-8">
              <Link
                href="/clubs/map"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase group"
              >
                <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white transition-all duration-300">
                  <ChevronLeft
                    size={14}
                    className="text-current group-hover:text-gray-900 transition-colors"
                  />
                </div>
                地図に戻る
              </Link>
            </div>

            <div>
              <div className="flex flex-col items-start mb-4 opacity-80">
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-left text-white">
                  Prefecture Info
                </span>
              </div>
              {/* 优化点 1：移动端字体从 text-5xl 降级为 text-4xl，防止超长打乱布局 */}
              <h1 className="text-4xl md:text-7xl font-serif font-black tracking-tight mb-4 md:mb-6 text-white drop-shadow-md text-left">
                {displayData.name}
              </h1>
              <p className="text-white/80 font-medium tracking-wide max-w-xl leading-relaxed text-left text-sm md:text-base">
                {displayData.name}の相撲クラブ・道場情報、
                <br className="hidden md:inline" />
                および出身力士のデータベース。
              </p>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 2: Top Sponsors Banner ==================== */}
        <section className="relative px-6 z-20">
          <div className="container mx-auto max-w-6xl relative -mt-16 md:-mt-20">
            <Ceramic
              interactive={false}
              className="border border-gray-100 border-b-[6px]"
              style={{
                ...ceramicStyle,
                marginTop: "-10px",
              }}
            >
              <div className="px-2 md:px-4 pt-8 md:pt-12 pb-0 text-center">
                <div className="mb-8 flex justify-center">
                  <span
                    className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border"
                    style={{
                      backgroundColor: `${theme.color}0D`,
                      color: theme.color,
                      borderColor: `${theme.color}33`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: theme.color }}
                    ></span>
                    トップスポンサー
                  </span>
                </div>
                <div
                  className="w-full relative overflow-visible"
                  style={{
                    height: "270px",
                    paddingBottom: "40px",
                    maskImage:
                      "linear-gradient(to right, transparent, black 10%, black 97%, transparent)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent, black 10%, black 97%, transparent)",
                  }}
                >
                  <div
                    className="absolute overflow-visible"
                    style={{
                      top: "-200px",
                      bottom: "-40px",
                      left: "0",
                      right: "0",
                      zIndex: 30,
                    }}
                  >
                    <RabbitWalkingBanner
                      scale={1}
                      containerHeight="500px"
                      sponsors={sponsorsTop}
                      displayMode={displaySettings.prefTopDisplayMode}
                    />
                  </div>
                </div>
              </div>
            </Ceramic>
          </div>
        </section>

        {/* ==================== SECTION 3: Main Content Grid ==================== */}
        <section className="relative pb-12 md:pb-24 px-6 pt-12 md:pt-20">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10 items-start">

              {/* --- 左侧边栏 (Left Sidebar) --- */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start flex flex-col gap-4 lg:gap-6">
                {/* Intro Card */}
                <Ceramic
                  interactive={false}
                  className="p-6 md:p-10 border border-gray-100 border-b-[6px]"
                  style={ceramicStyle}
                >
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0"
                      style={{ backgroundColor: theme.color, color: "white" }}
                    >
                      <Info size={20} />
                    </div>
                    <span className="tracking-tight">{displayData.introTitle}</span>
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 leading-loose text-justify font-medium">
                    {displayData.introText}
                  </p>
                </Ceramic>

                {/* Local Supporters Card */}
                <Ceramic
                  interactive={false}
                  className="p-0 border border-gray-100 border-b-[6px] overflow-hidden"
                  style={ceramicStyle}
                >

                  <div
                    className="relative w-full h-[240px] bg-white overflow-hidden"
                    style={{
                      maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                      WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
                    }}
                  >
                    <div className="absolute inset-0 w-[200%] -left-[50%] origin-center scale-[0.75] flex items-center justify-center pt-8">
                      <RabbitWalkingBanner
                        scale={1}
                        containerHeight="300px"
                        sponsors={sponsorsSidebar}
                        displayMode={displaySettings.prefSidebarDisplayMode}
                      />
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="block py-3 bg-gray-50 text-center border-t border-gray-100 transition-colors group hover:bg-white"
                  >
                    <span className="text-[10px] font-bold tracking-wider flex items-center justify-center gap-2 text-gray-400 group-hover:text-gray-900 transition-colors">
                      スポンサー募集
                      <ArrowRight
                        size={10}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </Link>
                </Ceramic>
              </div>

              {/* --- Right Main Content --- */}
              {/* 移动端缩小卡片间距 */}
              <div className="lg:col-span-8 flex flex-col gap-4 md:gap-12">
                
                {/* Feature Banner */}
                {displayData.bannerImg && (
                  <div
                    className="group relative rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-100 border-b-[6px] ceramic-3d-hover transition-all duration-500"
                    style={{ 
                      "--hover-shadow": theme.shadow,
                      borderBottomColor: theme.color 
                    } as React.CSSProperties}
                  >
                    {/* 上半部分：图片区域 */}
                    <div className="relative aspect-[21/9] overflow-hidden">
                      {bannerScale > 1 ? (
                        <div
                          className="absolute inset-0 bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                          style={{
                            backgroundImage: `url(${displayData.bannerImg})`,
                            backgroundSize: `${100 * bannerScale}%`,
                            backgroundPosition: bannerBgPosition,
                            transform: `rotate(${bannerRotation}deg)`,
                          }}
                          aria-hidden
                        />
                      ) : (
                        <Image
                          src={displayData.bannerImg}
                          alt={bannerAlt}
                          fill
                          priority
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          style={{
                            objectPosition: bannerBgPosition,
                            transform: `rotate(${bannerRotation}deg)`,
                          }}
                        />
                      )}
                      <Link
                        href={clubDetailLink}
                        className="absolute inset-0 z-0"
                        aria-label="View Club"
                      >
                        <span className="sr-only">View Club</span>
                      </Link>
                      {/* 图片上的轻微渐变，仅为了让左上角的标签更清晰 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>

                    {/* 下半部分：文字信息区域（类似移动端的卡片式布局） */}
                    <div className="p-6 md:p-8 bg-white relative">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                        <div className="min-w-0 flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <span 
                              className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase"
                              style={{ backgroundColor: `${theme.color}15`, color: theme.color }}
                            >
                              LOCAL FEATURE
                            </span>
                            <div className="h-px grow bg-gray-100" />
                          </div>
                          
                          <Link href={clubDetailLink} className="group/title">
                            <h3 className="font-serif font-bold tracking-wide text-xl md:text-2xl text-gray-900 group-hover/title:text-gray-600 transition-colors flex items-center gap-2">
                              {bannerTitle}
                              <ArrowRight className="w-5 h-5 shrink-0 text-gray-400 group-hover/title:translate-x-1 transition-transform" />
                            </h3>
                          </Link>

                          {clubAddress && (
                            <p className="text-gray-500 flex items-start gap-2 text-sm md:text-base">
                              <MapPin className="w-4 h-4 shrink-0 mt-1 text-gray-400" />
                              <span>{clubAddress}</span>
                            </p>
                          )}
                        </div>

                        <div className="shrink-0">
                          <Link
                            href={recruitLink}
                            className="inline-flex items-center justify-center gap-2 text-white px-8 py-3.5 rounded-xl font-bold tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 text-sm w-full md:w-auto"
                            style={{ backgroundColor: theme.color }}
                          >
                            <UserPlus className="w-4 h-4 shrink-0" />
                            メンバー募集中
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Club List */}
                <div>
                  <div className="flex items-end justify-between mb-6 md:mb-8 pb-4 border-b border-gray-200/60">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-serif font-black flex items-center gap-3" style={{ color: theme.color }}>
                        クラブ一覧
                      </h2>
                      <p className="text-[10px] md:text-xs text-gray-400 font-bold tracking-widest mt-1 md:mt-2 uppercase">
                        Registered Sumo Clubs
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl md:text-4xl font-serif font-black" style={{ color: theme.color }}>
                        {filteredClubs.length}
                      </span>
                      <span className="text-[10px] md:text-xs text-gray-400 font-bold ml-1">件</span>
                    </div>
                  </div>

                  {filteredClubs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      {filteredClubs.map((club) => (
                        <div key={club.id}>
                          <ClubCard club={club} accentColor={theme.color} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Ceramic interactive={false} className="p-10 md:p-16 text-center border border-gray-100 border-b-[6px]" style={{ borderBottomColor: theme.color }}>
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${theme.color}1A`, color: theme.color }}>
                        <MapPin className="w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <p className="text-sm md:text-base text-gray-400 font-medium">現在、この地域の掲載クラブはありません。</p>
                    </Ceramic>
                  )}
                </div>

                {/* Rikishi Table（出身力士一覧） */}
                <div>
                  <Suspense fallback={
                    <div className="h-[400px] w-full bg-white rounded-2xl border border-gray-100 animate-pulse flex items-center justify-center text-gray-400">
                      Loading Rikishi Data...
                    </div>
                  }>
                    <Ceramic interactive={false} className="p-0 border border-gray-100 border-b-[6px] overflow-hidden" style={ceramicStyle}>
                      <RikishiTable rikishiList={displayData.rikishiList} prefectureName={displayData.name} accentColor={theme.color} />
                    </Ceramic>
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ScrollToTop />
    </div>
  );
}