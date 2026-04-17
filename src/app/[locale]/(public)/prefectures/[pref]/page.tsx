import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "@/components/ui/TransitionLink";
import {
  ChevronLeft,
  ArrowRight,
  Info,
  MapPin,
} from "lucide-react";

import { getBannerDisplaySettings } from "@/lib/actions/banners";
import {
  getCachedActiveBanners,
  getCachedClubsByArea,
  getCachedPrefectureBanner,
} from "@/lib/cached-queries";

import RabbitWalkingBanner from "@/components/home/RabbitBanner/RabbitBannerDynamic";
import RikishiTable from "@/components/clubs/RikishiTable";
import ClubCard from "@/components/clubs/ClubCard";
import Ceramic from "@/components/ui/Ceramic";
import ScrollToTop from "@/components/common/ScrollToTop";
import PrefectureFeatureBanner from "@/components/prefecture/PrefectureFeatureBanner";
import type { FeaturedClubInfo } from "@/components/prefecture/PrefectureFeatureBanner";
import PrefectureCharacter from "@/components/prefecture/PrefectureCharacter";
import { heroCharacterColumnWidth } from "@/components/prefecture/prefectureCharacterTuning";

import { PREFECTURE_DATABASE } from "@/data/prefectures";
import { PREFECTURE_CHARACTERS } from "@/data/characters";
import type { PrefectureInfo } from "@/data/types";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import { getPrefectureTheme } from "@/lib/prefectureThemes";
import { hasRealClubMainImage } from "@/lib/club-images";
import { getTranslations } from "next-intl/server";
import { regionDisplayForLocale } from "@/lib/prefecture-en";
import { prefectureIntroForLocale } from "@/lib/prefecture-intro";

/** Full club row shape from the shared Prisma client (no `Club` import from `@prisma/client`). */
type Club = Awaited<ReturnType<typeof prisma.club.findMany>>[number];

// ISR: re-render at most once per 60 s, matching the unstable_cache TTL on each data query
export const revalidate = 60;

// Pre-build every prefecture at deploy time for both locales
export function generateStaticParams() {
  return Object.keys(PREFECTURE_DATABASE).map((pref) => ({ pref }));
}

function siteBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.memory-sumo.com").replace(
    /\/+$/,
    "",
  );
}

interface PageProps {
  params: Promise<{ locale: string; pref: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pref: string }>;
}): Promise<Metadata> {
  const { locale, pref } = await params;
  const prefSlug = pref;
  const prefData = PREFECTURE_DATABASE[prefSlug];
  const jaName = prefData?.name ?? prefSlug.toUpperCase();
  const displayName = regionDisplayForLocale(jaName, locale);
  const t = await getTranslations({ locale, namespace: "PrefecturePage" });
  const base = siteBase();
  const jaUrl = `${base}/prefectures/${prefSlug}`;
  const enUrl = `${base}/en/prefectures/${prefSlug}`;
  return {
    title: t("metaTitle", { prefName: displayName }),
    description: prefData
      ? t("metaDescription", { prefName: displayName })
      : t("metaDescriptionFallback"),
    alternates: {
      canonical: locale === "en" ? enUrl : jaUrl,
      languages: {
        ja: jaUrl,
        en: enUrl,
      },
    },
  };
}

export default async function PrefecturePage({ params }: PageProps) {
  const { locale, pref } = await params;
  const t = await getTranslations({ locale, namespace: "PrefecturePage" });
  const prefSlug = pref;
  const prefData = PREFECTURE_DATABASE[prefSlug];
  const staticDisplay: PrefectureInfo = prefData ?? {
    id: prefSlug,
    name: prefSlug.toUpperCase(),
    introTitle: `${prefSlug}の相撲事情`,
    introText: "現在、この地域の詳細情報は準備中です。",
    bannerImg: "",
    rikishiList: [],
  };

  const displayName = regionDisplayForLocale(staticDisplay.name, locale);
  const { title: introTitle, text: introText } = prefectureIntroForLocale(staticDisplay, locale);

  // All four queries are independent — fire them in parallel with caching
  const [customBanner, filteredClubs, banners, displaySettings] = await Promise.all([
    getCachedPrefectureBanner(prefSlug),
    getCachedClubsByArea(staticDisplay.name),
    getCachedActiveBanners(),
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
    return b.sponsorTier === "LOCAL" || b.sponsorTier == null;
  };

  const sponsorsTop = banners
    .filter((b: BannerWithTier) => matchSponsorTier(b, displaySettings.prefTopSponsorTierFilter))
    .map(toSponsorItem);
  const sponsorsSidebar = banners
    .filter((b: BannerWithTier) => matchSponsorTier(b, displaySettings.prefSidebarSponsorTierFilter))
    .map(toSponsorItem);

  const theme = getPrefectureTheme(prefSlug);
  const prefAreaName = staticDisplay.name;
  const character = PREFECTURE_CHARACTERS[prefSlug] ?? null;

  // Resolve featured club from DB data only (preview is handled client-side)
  const resolveFeaturedClub = () => {
    const tryById = (id: string | null | undefined) => {
      if (!id) return null;
      const c = filteredClubs.find((x: Club) => x.id === id);
      if (!c || c.area !== prefAreaName) return null;
      if (!hasRealClubMainImage(c.mainImage)) return null;
      return c;
    };
    const manual = tryById(customBanner?.featuredClubId);
    if (manual) return manual;
    return filteredClubs.find((c: Club) => hasRealClubMainImage(c.mainImage)) ?? null;
  };

  const featuredClub = resolveFeaturedClub();

  const bannerTitle = featuredClub
    ? t("bannerTitleWithClub", { clubName: featuredClub.name, prefName: displayName })
    : t("bannerTitlePrefOnly", { prefName: displayName });

  // DB-derived banner display properties (preview overrides happen client-side)
  type BannerWithPosition = { imagePosition?: string | null; imageScale?: number | null; imageRotation?: number | null };
  const bannerRecord = customBanner as (BannerWithPosition & typeof customBanner) | null;
  const bannerPositionRaw = bannerRecord?.imagePosition ?? "50,50";
  const bannerPosition = String(bannerPositionRaw ?? "50,50").trim();
  const [dbPosX, dbPosY] = bannerPosition.split(",").map((s: string) => {
    const n = Number(s.trim());
    return Number.isNaN(n) ? 50 : Math.min(100, Math.max(0, n));
  });
  const dbBannerScale = bannerRecord?.imageScale != null ? Number(bannerRecord.imageScale) : 1;
  const dbBannerRotation =
    bannerRecord?.imageRotation != null && [0, 90, 180, 270].includes(bannerRecord.imageRotation)
      ? bannerRecord.imageRotation
      : 0;
  const dbBannerImg = customBanner?.image ?? staticDisplay.bannerImg ?? "";
  const dbBannerAlt = customBanner?.alt ?? bannerTitle;

  const dbFeaturedClub: FeaturedClubInfo | null = featuredClub
    ? {
        id: featuredClub.id,
        name: featuredClub.name,
        slug: featuredClub.slug,
        area: featuredClub.area ?? null,
        city: featuredClub.city ?? null,
        address: featuredClub.address ?? null,
        mainImage: featuredClub.mainImage ?? null,
      }
    : null;

  const ceramicStyle = {
    borderBottomColor: theme.color,
    boxShadow: `0 4px 10px -2px ${theme.shadow}, 0 2px 4px -2px ${theme.shadow}`,
  };

  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
      <main className="grow">
        {/* ==================== SECTION 1: Header ==================== */}
        {/* 桌面：z 高于白卡，标题与吉祥物在叠层上。移动端：整段 hero 低于白卡，白卡盖住底部背景与角色形成视差 */}
        <section className="relative z-10 md:z-25 pt-32 md:pt-40 pb-48 md:pb-32 text-white bg-gray-900 transition-colors duration-500">
          {/* overflow-x-clip 会产生新层叠上下文，导致内部 z-index 无法与外部比较；
              装饰层已有独立 overflow-hidden，section 本身不需要 overflow 限制 */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-b opacity-100",
                theme.gradient
              )}
            />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 text-[18vw] font-black text-white opacity-[0.04] select-none leading-none mix-blend-overlay uppercase tracking-tighter font-sans">
              {prefSlug}
            </div>
          </div>

          <div className="container mx-auto px-6">
            <div className="mb-8">
              <Link
                href="/clubs/map"
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 md:bg-white/10 backdrop-blur-md rounded-full border border-white/30 md:border-white/20 hover:bg-white/30 md:hover:bg-white/20 transition-all text-white group"
              >
                <ChevronLeft className="w-4 h-4 md:w-3 md:h-3 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-xs md:text-[10px] font-bold tracking-[0.2em] uppercase">{t("backToMap")}</span>
              </Link>
            </div>

            {/* 两列：左=都道府県情報+县名+headerLead（自动换行）；右=人物气泡+立绘。min-w-0 保证左列可收缩换行 */}
            <div className="flex min-w-0 flex-row items-start justify-between gap-4 overflow-visible sm:gap-6 lg:gap-10">
              <div className="relative z-10 min-w-0 flex-1 pr-1">
                <div className="flex flex-col items-start mb-4 opacity-80">
                  <span className="text-xs font-bold tracking-[0.3em] uppercase text-left text-white whitespace-nowrap">
                    {t("headerKicker")}
                  </span>
                </div>
                <h1 className="text-4xl md:text-7xl font-serif font-black tracking-tight mb-4 md:mb-6 text-white drop-shadow-md text-left leading-[1.1] max-lg:whitespace-normal lg:whitespace-nowrap">
                  {displayName}
                </h1>
                <p className="text-white/90 font-medium tracking-wide leading-relaxed text-left text-sm md:text-base wrap-anywhere">
                  {t("headerLead", { prefName: displayName })}
                </p>
              </div>
              {character && (
                <div
                  className="shrink-0 self-start"
                  style={{ width: heroCharacterColumnWidth() }}
                >
                  <PrefectureCharacter
                    prefSlug={prefSlug}
                    character={character}
                    locale={locale}
                    themeColor={theme.color}
                    variant="hero"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ==================== SECTION 2: Top Sponsors Banner ==================== */}
        <section className="relative z-30 px-6 md:z-20">
          {/* 移动端：z 高于 hero，负 margin 加大使白卡叠在背景与角色之上；md+ 恢复原先 z 与上移量 */}
          <div className="container mx-auto max-w-6xl relative -mt-16 md:-mt-14 lg:-mt-20">
            <Ceramic
              interactive={false}
              className="border border-gray-100 border-b-[6px] shadow-xl"
              style={{
                ...ceramicStyle,
                marginTop: "-10px",
              }}
            >
              <div className="px-2 md:px-4 pt-8 md:pt-12 pb-0 text-center">
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
            {/* 外层 flex：避免「12 列 + 嵌套 12 列」导致的 grid 自动排版/收缩异常 */}
            <div className="flex flex-col gap-4 lg:gap-10 w-full min-w-0">
              {/* 与改版前相同：左侧 4 列 + 右侧 8 列；角色仅在页头展示 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10 items-start w-full min-w-0">
              {/* --- 左侧边栏（sticky）：都道府県情報 + 赞助商 --- */}
              <div className="lg:col-span-4 w-full min-w-0 lg:sticky lg:top-24 lg:self-start flex flex-col gap-4 lg:gap-6">
                <Ceramic
                  interactive={false}
                  className="p-6 md:p-10 border border-gray-100 border-b-[6px] text-left w-full min-w-0"
                  style={ceramicStyle}
                >
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-start gap-3 text-left">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0"
                      style={{ backgroundColor: theme.color, color: "white" }}
                    >
                      <Info size={20} />
                    </div>
                    <span className="tracking-tight min-w-0 flex-1">{introTitle}</span>
                  </h3>
                  <p
                    className={cn(
                      "text-sm md:text-base text-gray-700 leading-loose font-medium",
                      locale === "en" ? "text-left" : "text-justify",
                    )}
                  >
                    {introText}
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
                      {t("sponsorCta")}
                      <ArrowRight
                        size={10}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </Link>
                </Ceramic>
              </div>

              {/* --- Right Main Content --- */}
              <div className="lg:col-span-8 flex flex-col gap-4 md:gap-12">

                {/* Feature Banner — preview handled client-side */}
                <PrefectureFeatureBanner
                  prefSlug={prefSlug}
                  displayName={displayName}
                  themeColor={theme.color}
                  themeShadow={theme.shadow}
                  dbBannerImg={dbBannerImg}
                  dbBannerAlt={dbBannerAlt}
                  dbPosX={dbPosX}
                  dbPosY={dbPosY}
                  dbBannerScale={dbBannerScale}
                  dbBannerRotation={dbBannerRotation}
                  dbFeaturedClub={dbFeaturedClub}
                />

                {/* Club List */}
                <div>
                  <div className="flex items-end justify-between mb-6 md:mb-8 pb-4 border-b border-gray-200/60">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-serif font-black flex items-center gap-3" style={{ color: theme.color }}>
                        {t("clubListTitle")}
                      </h2>
                      <p className="text-[10px] md:text-xs text-gray-400 font-bold tracking-widest mt-1 md:mt-2 uppercase">
                        {t("clubListSubtitle")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl md:text-4xl font-serif font-black" style={{ color: theme.color }}>
                        {filteredClubs.length}
                      </span>
                      <span className="text-[10px] md:text-xs text-gray-400 font-bold ml-1">{t("countSuffix")}</span>
                    </div>
                  </div>

                  {filteredClubs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      {filteredClubs.map((club: Club) => (
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
                      <p className="text-sm md:text-base text-gray-400 font-medium">{t("emptyClubs")}</p>
                    </Ceramic>
                  )}
                </div>

                {/* Rikishi Table */}
                <div>
                  <Suspense
                    fallback={
                      <div className="h-[400px] w-full bg-white rounded-md border border-gray-100 animate-pulse flex items-center justify-center text-gray-400">
                        {t("rikishiLoading")}
                      </div>
                    }
                  >
                    <Ceramic interactive={false} className="p-0 border border-gray-100 border-b-[6px] overflow-hidden" style={ceramicStyle}>
                      <RikishiTable
                        rikishiList={staticDisplay.rikishiList}
                        prefectureName={displayName}
                        accentColor={theme.color}
                      />
                    </Ceramic>
                  </Suspense>
                </div>
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
