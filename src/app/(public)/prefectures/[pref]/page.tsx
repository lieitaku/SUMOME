import React from "react";
import Link from "@/components/ui/TransitionLink";
import {
  ChevronLeft,
  Camera,
  ArrowRight,
  UserPlus,
  Info,
  MapPin,
  ExternalLink,
} from "lucide-react";

import { prisma } from "@/lib/db";
import { getBannerDisplaySettings } from "@/lib/actions/banners";
import { getPreviewPayload } from "@/lib/preview";

// Components
import RabbitWalkingBanner from "@/components/home/RabbitBanner";
import RikishiTable from "@/components/clubs/RikishiTable";
import ClubCard from "@/components/clubs/ClubCard";
import Ceramic from "@/components/ui/Ceramic";
import ScrollToTop from "@/components/common/ScrollToTop";

// Data & Utils
import { PREFECTURE_DATABASE } from "@/data/prefectures";
import { cn } from "@/lib/utils";
import { getPrefectureTheme } from "@/lib/prefectureThemes";

interface PageProps {
  params: Promise<{
    pref: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function PrefecturePage({ params }: PageProps) {
  const { pref } = await params;
  const prefSlug = pref;
  const prefData = PREFECTURE_DATABASE[prefSlug];
  const staticDisplay = prefData || {
    name: prefSlug.toUpperCase(),
    introTitle: `${prefSlug}の相撲事情`,
    introText: "現在、この地域の詳細情報は準備中です。",
    bannerImg: "",
    rikishiList: [],
  };

  // 后台设置的都道府県 Banner 优先于静态默认（必须先拿到才能拼 displayData）
  const preview = await getPreviewPayload();
  const prefBannerPreview =
    preview?.type === "prefecture_banner" &&
    preview.payload &&
    typeof preview.payload === "object" &&
    (preview.payload as { pref?: string }).pref === prefSlug
      ? (preview.payload as { pref: string; image?: string; alt?: string; imagePosition?: string; imageScale?: string | number })
      : null;

  const customBanner = await prisma.prefectureBanner.findUnique({
    where: { pref: prefSlug },
  });
  const displayData = {
    ...staticDisplay,
    bannerImg: prefBannerPreview?.image ?? customBanner?.image ?? staticDisplay.bannerImg,
  };

  // 以下三路互不依赖，并行请求以减少总等待时间
  const [filteredClubs, banners, displaySettings] = await Promise.all([
    prisma.club.findMany({
      where: {
        area: {
          contains: displayData.name,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    }),
    getBannerDisplaySettings(),
  ]);

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

  type BannerWithPosition = { imagePosition?: string | null; imageScale?: number | null };
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
  const bannerBgPosition = `${posX}% ${posY}%`;
  const bannerBgSize = `${100 * bannerScale}%`;

  const ceramicStyle = {
    borderBottomColor: theme.color,
    boxShadow: `0 4px 10px -2px ${theme.shadow}, 0 2px 4px -2px ${theme.shadow}`,
  };

  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
      {prefBannerPreview && (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-bold flex flex-wrap items-center justify-center gap-2">
          <span>プレビュー — 未保存の内容を表示しています。</span>
          <a href="javascript:history.back()" className="underline font-bold hover:no-underline">
            編集に戻る
          </a>
        </div>
      )}
      <main className="grow">
        {/* ==================== SECTION 1: Header ==================== */}
        <section className="relative pt-40 pb-32 overflow-hidden text-white shadow-xl bg-gray-900 transition-colors duration-500">
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
            {/* 首屏头部不做 reveal-up，始终可见，避免依赖 JS 未触发时整块不显示 */}
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
                Back to Map
              </Link>
            </div>

            <div>
              <div className="flex flex-col items-start mb-4 opacity-80">
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-left text-white">
                  Prefecture Info
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight mb-6 text-white drop-shadow-md text-left">
                {displayData.name}
              </h1>
              <p className="text-white/80 font-medium tracking-wide max-w-xl leading-relaxed text-left">
                {displayData.name}の相撲クラブ・道場情報、
                <br className="hidden md:inline" />
                および出身力士のデータベース。
              </p>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 2: Top Sponsors Banner ==================== */}
        <section className="relative px-6 z-20">
          <div className="container mx-auto max-w-6xl relative -mt-20">
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
                    Official Top Partners
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
        <section className="relative pb-24 px-6 pt-20">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

              {/* --- ✨ 左侧边栏 (Left Sidebar) --- */}
              {/* 1. lg:sticky lg:top-24: 保持吸顶
                  2. 移除了 max-h-... 和 overflow-y-auto: 这样就不会出现滚动条了
                  3. flex flex-col gap-6: 保持间距
              */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start flex flex-col gap-6">

                {/* Intro Card */}
                <Ceramic
                  interactive={false}
                  className="p-8 md:p-10 border border-gray-100 border-b-[6px]"
                  style={ceramicStyle}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: theme.color, color: "white" }}
                    >
                      <Info size={20} />
                    </div>
                    <span className="tracking-tight">{displayData.introTitle}</span>
                  </h3>
                  <p className="text-base text-gray-700 leading-loose text-justify font-medium">
                    {displayData.introText}
                  </p>
                </Ceramic>

                {/* ✨ Local Supporters Card (纯兔子版) */}
                <Ceramic
                  interactive={false}
                  className="p-0 border border-gray-100 border-b-[6px] overflow-hidden"
                  style={ceramicStyle}
                >
                  {/* Header */}
                  <div className="bg-gray-50/50 px-6 py-3 border-b border-gray-100 flex justify-between items-center relative z-10">
                    <p className="text-[10px] text-gray-400 tracking-widest font-bold uppercase">
                      Local Supporters
                    </p>
                    <span
                      className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono font-bold shadow-sm"
                      style={{ color: theme.color }}
                    >
                      {sponsorsSidebar.length}
                    </span>
                  </div>

                  {/* 兔子容器 */}
                  <div
                    className="relative w-full h-[240px] bg-white overflow-hidden"
                    style={{
                      maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                      WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
                    }}
                  >
                    {/* 兔子本体 */}
                    <div className="absolute inset-0 w-[200%] -left-[50%] origin-center scale-[0.75] flex items-center justify-center pt-8">
                      <RabbitWalkingBanner
                        scale={1}
                        containerHeight="300px"
                        sponsors={sponsorsSidebar}
                        displayMode={displaySettings.prefSidebarDisplayMode}
                      />
                    </div>
                  </div>

                  {/* Footer Link */}
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
              <div className="lg:col-span-8 flex flex-col gap-12">
                {/* Feature Banner */}
                {displayData.bannerImg && (
                  <div
                    className="group relative aspect-[21/9] rounded-2xl overflow-hidden shadow-lg block ceramic-3d-hover ring-1 ring-black/5"
                    style={{ "--hover-shadow": theme.shadow } as React.CSSProperties}
                  >
                    <div
                      className="absolute inset-0 bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${displayData.bannerImg})`,
                        backgroundPosition: bannerBgPosition,
                        backgroundSize: bannerBgSize,
                      }}
                      role="img"
                      aria-label={bannerAlt}
                    />
                    <Link
                      href={clubDetailLink}
                      className="absolute inset-0 z-0"
                      aria-label="View Club"
                    >
                      <span className="sr-only">View Club</span>
                    </Link>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 min-[400px]:p-8 pointer-events-none">
                      <div className="text-white w-full flex flex-col gap-3 md:flex-row md:gap-0 md:justify-between md:items-end">
                        <div className="pointer-events-auto min-w-0">
                          <p className="font-bold tracking-widest mb-2 flex items-center gap-2 opacity-80 border-b border-white/30 pb-2 text-[clamp(0.5rem,1.8vw,0.625rem)]">
                            <Camera className="w-3 h-3 min-[400px]:w-[12px] min-[400px]:h-[12px] shrink-0" /> LOCAL FEATURE
                          </p>
                          <p className="font-serif font-bold tracking-wide flex items-center gap-2 transition-colors text-[clamp(1rem,4vw,1.5rem)]">
                            {bannerTitle}
                            <ArrowRight className="w-4 h-4 min-[400px]:w-5 min-[400px]:h-5 shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                          </p>
                          {/* 俱乐部具体地址 */}
                          {clubAddress && (
                            <p className="text-white/60 mt-2 flex items-center gap-1.5 text-[clamp(0.625rem,1.5vw,0.6875rem)]">
                              <MapPin className="w-2.5 h-2.5 min-[400px]:w-[10px] min-[400px]:h-[10px] shrink-0" />
                              {clubAddress}
                            </p>
                          )}
                        </div>
                        <div className="pointer-events-auto relative z-10 shrink-0">
                          <Link
                            href={recruitLink}
                            className="inline-flex items-center gap-2 text-white px-4 py-2 min-[400px]:px-5 min-[400px]:py-2.5 rounded-full font-bold tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:brightness-110 text-[clamp(0.625rem,1.5vw,0.75rem)] whitespace-nowrap"
                            style={{ backgroundColor: theme.color }}
                          >
                            <UserPlus className="w-3 h-3 min-[400px]:w-3.5 min-[400px]:h-3.5 shrink-0" />
                            募集中
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Club List */}
                <div>
                  <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-200/60">
                    <div>
                      <h2 className="text-3xl font-serif font-black flex items-center gap-3" style={{ color: theme.color }}>
                        クラブ一覧
                      </h2>
                      <p className="text-xs text-gray-400 font-bold tracking-widest mt-2 uppercase">
                        Registered Sumo Clubs
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-serif font-black" style={{ color: theme.color }}>
                        {filteredClubs.length}
                      </span>
                      <span className="text-xs text-gray-400 font-bold ml-1">件</span>
                    </div>
                  </div>

                  {filteredClubs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {filteredClubs.map((club) => (
                        <div key={club.id}>
                          <ClubCard club={club} accentColor={theme.color} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Ceramic interactive={false} className="p-16 text-center border border-gray-100 border-b-[6px]" style={{ borderBottomColor: theme.color }}>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${theme.color}1A`, color: theme.color }}>
                        <MapPin size={24} />
                      </div>
                      <p className="text-gray-400 font-medium">現在、この地域の掲載クラブはありません。</p>
                    </Ceramic>
                  )}
                </div>

                {/* Rikishi Table */}
                <div>
                  <Ceramic interactive={false} className="p-0 border border-gray-100 border-b-[6px] overflow-hidden" style={ceramicStyle}>
                    <RikishiTable rikishiList={displayData.rikishiList} prefectureName={displayData.name} accentColor={theme.color} />
                  </Ceramic>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SECTION 4: Bottom CTA ==================== */}
        <section className="relative py-12 overflow-hidden">
          <div className={cn("absolute inset-0 bg-gradient-to-b", theme.gradient)}></div>
          <div className="container mx-auto px-6 relative z-10 text-center text-white">
            <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <MapPin size={24} />
            </div>
            <h3 className="text-2xl md:text-3xl font-serif font-black mb-4 drop-shadow-md">
              {displayData.name}の相撲文化を深堀り
            </h3>
            <p className="text-white/80 max-w-lg mx-auto mb-8 text-sm font-medium">
              {displayData.name}の相撲文化をさらに深く知るための情報を提供しています。
            </p>
            <Link
              href="/contact"
              className={cn(
                "group inline-flex items-center gap-2 bg-white px-8 py-3 rounded-full font-bold text-sm tracking-wider shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]",
              )}
              style={{ color: theme.color }}
            >
              地域に関するお問い合わせ
              <ExternalLink size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </main>
      <ScrollToTop />
    </div>
  );
}