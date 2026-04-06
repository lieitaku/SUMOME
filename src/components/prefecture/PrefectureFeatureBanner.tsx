"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/TransitionLink";
import { ArrowRight, UserPlus, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

const PREVIEW_COOKIE_NAME = "preview_id";

function hasPreviewCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith(`${PREVIEW_COOKIE_NAME}=`));
}

function parsePosition(raw: string): [number, number] {
  return raw.split(",").map((s) => {
    const n = Number(s.trim());
    return Number.isNaN(n) ? 50 : Math.min(100, Math.max(0, n));
  }) as [number, number];
}

export interface FeaturedClubInfo {
  id: string;
  name: string;
  slug: string;
  area: string | null;
  city: string | null;
  address: string | null;
  mainImage: string | null;
}

interface BannerState {
  bannerImg: string;
  bannerAlt: string;
  posX: number;
  posY: number;
  bannerScale: number;
  bannerRotation: number;
  featuredClub: FeaturedClubInfo | null;
  isPreview: boolean;
}

interface Props {
  prefSlug: string;
  displayName: string;
  themeColor: string;
  themeShadow: string;
  dbBannerImg: string;
  dbBannerAlt: string;
  dbPosX: number;
  dbPosY: number;
  dbBannerScale: number;
  dbBannerRotation: number;
  dbFeaturedClub: FeaturedClubInfo | null;
}

export default function PrefectureFeatureBanner({
  prefSlug,
  displayName,
  themeColor,
  themeShadow,
  dbBannerImg,
  dbBannerAlt,
  dbPosX,
  dbPosY,
  dbBannerScale,
  dbBannerRotation,
  dbFeaturedClub,
}: Props) {
  const t = useTranslations("PrefecturePage");

  const [state, setState] = useState<BannerState>({
    bannerImg: dbBannerImg,
    bannerAlt: dbBannerAlt,
    posX: dbPosX,
    posY: dbPosY,
    bannerScale: dbBannerScale,
    bannerRotation: dbBannerRotation,
    featuredClub: dbFeaturedClub,
    isPreview: false,
  });

  useEffect(() => {
    if (!hasPreviewCookie()) return;

    fetch(`/api/preview/check?pref=${encodeURIComponent(prefSlug)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.isPreview) return;
        const [px, py] = parsePosition(data.imagePosition ?? "50,50");
        setState({
          bannerImg: data.bannerImg ?? dbBannerImg,
          bannerAlt: data.bannerAlt ?? dbBannerAlt,
          posX: px,
          posY: py,
          bannerScale: data.imageScale ?? dbBannerScale,
          bannerRotation: data.imageRotation ?? dbBannerRotation,
          featuredClub: data.featuredClub ?? dbFeaturedClub,
          isPreview: true,
        });
      })
      .catch(() => {
        /* ignore */
      });
  }, [prefSlug, dbBannerImg, dbBannerAlt, dbPosX, dbPosY, dbBannerScale, dbBannerRotation, dbFeaturedClub]);

  const { bannerImg, bannerAlt, posX, posY, bannerScale, bannerRotation, featuredClub, isPreview } = state;
  const bannerBgPosition = `${posX}% ${posY}%`;
  const clubDetailLink = featuredClub ? `/clubs/${featuredClub.slug}` : "#";
  const recruitLink = featuredClub ? `/clubs/${featuredClub.slug}/recruit` : "#";
  const clubAddress = featuredClub
    ? [featuredClub.area, featuredClub.city, featuredClub.address].filter(Boolean).join(" ")
    : "";
  const bannerTitle = featuredClub
    ? t("bannerTitleWithClub", { clubName: featuredClub.name, prefName: displayName })
    : t("bannerTitlePrefOnly", { prefName: displayName });

  // Nothing to show (no banner in DB and no preview override)
  if (!bannerImg) return null;

  return (
    <>
      {/* Preview mode indicator — fixed at top so it's always visible to admins */}
      {isPreview && (
        <div
          className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-white text-center py-2 px-4 text-sm font-bold flex flex-wrap items-center justify-center gap-2"
          style={{ transition: "opacity 200ms ease-in-out" }}
        >
          <span>{t("previewBanner")}</span>
          {/* eslint-disable-next-line no-script-url */}
          <a href="javascript:history.back()" className="underline font-bold hover:no-underline">
            {t("previewBack")}
          </a>
        </div>
      )}

      {/* Feature Banner Card */}
      <div
        className="group relative rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-100 border-b-[6px] ceramic-3d-hover transition-all duration-500"
        style={{
          "--hover-shadow": themeShadow,
          borderBottomColor: themeColor,
        } as React.CSSProperties}
      >
        {/* Image area */}
        <div className="relative aspect-[21/9] overflow-hidden">
          {bannerScale > 1 ? (
            <div
              className="absolute inset-0 bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url(${bannerImg})`,
                backgroundSize: `${100 * bannerScale}%`,
                backgroundPosition: bannerBgPosition,
                transform: `rotate(${bannerRotation}deg)`,
              }}
              aria-hidden
            />
          ) : (
            <Image
              src={bannerImg}
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
            aria-label={t("featureViewAria")}
          >
            <span className="sr-only">{t("featureViewAria")}</span>
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Text info area */}
        <div className="p-6 md:p-8 bg-white relative">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <div className="min-w-0 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-widest uppercase"
                  style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                >
                  {t("featureBadge")}
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
                style={{ backgroundColor: themeColor }}
              >
                <UserPlus className="w-4 h-4 shrink-0" />
                {t("recruitCta")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
