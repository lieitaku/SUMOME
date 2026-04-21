"use client";

import React, { useMemo } from "react";
import Link from "@/components/ui/TransitionLink";
import Image from "next/image";
import { MapPin, Instagram, Twitter, ArrowUpRight, Users, Phone, Mail, Globe, Facebook } from "lucide-react";
import { cn, getMainImageObjectPosition, getMainImageScale, getMainImageRotation } from "@/lib/utils";
import { hasRealClubMainImage, DEFAULT_CLUB_MAIN_IMAGE } from "@/lib/club-images";
import Ceramic from "@/components/ui/Ceramic";
import { type Club } from "@prisma/client";
import { useLocale, useTranslations } from "next-intl";
import {
  clubDisplayAddress,
  clubDisplayArea,
  clubDisplayCity,
  clubDisplayDescription,
  clubDisplayName,
  clubDisplayTarget,
} from "@/lib/i18n-db";
import {
  clubWebsiteHref,
  clubInstagramHref,
  clubTwitterHref,
  clubFacebookHref,
} from "@/lib/club-contact-urls";
import ClubExternalAnchor from "@/components/clubs/ClubExternalAnchor";

type ExtendedClub = Club & {
  phoneVisibleOnPublicSite?: boolean;
};

type ClubCardProps = {
  club: ExtendedClub;
  className?: string;
  accentColor?: string;
  /** 手机端双列列表时的紧凑排版（平板以上不受影响） */
  compact?: boolean;
};

const DEFAULT_COLOR = "#2454a4";

const ClubCard = ({ club, className, accentColor, compact }: ClubCardProps) => {
  const locale = useLocale();
  const t = useTranslations("ClubDetail");
  const displayName = clubDisplayName(club, locale);
  const displayArea = clubDisplayArea(club, locale);
  const displayCity = clubDisplayCity(club, locale);
  const displayAddress = clubDisplayAddress(club, locale);
  // --- 1. Hooks ---
  const summaryText = useMemo(() => {
    const desc = clubDisplayDescription(club, locale);
    if (desc) {
      return desc.length > 60 ? desc.substring(0, 60) + "..." : desc;
    }
    return t("introFallback");
  }, [club, locale, t]);

  const dynamicTags = useMemo(() => {
    const raw = clubDisplayTarget(club, locale);
    if (!raw) return [];
    return raw
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 4);
  }, [club, locale]);

  // --- 2. Early Return ---
  if (club.slug === "official-hq") return null;

  const websiteHref = clubWebsiteHref(club.website);
  const instagramHref = clubInstagramHref(club.instagram);
  const twitterHref = clubTwitterHref(club.twitter);
  const facebookHref = clubFacebookHref(club.facebook);

  const themeColor = accentColor || DEFAULT_COLOR;
  const detailLink = `/clubs/${club.slug}`;
  const displayImage = hasRealClubMainImage(club.mainImage)
    ? (club.mainImage as string)
    : DEFAULT_CLUB_MAIN_IMAGE;
  const mainImagePosition = getMainImageObjectPosition(club.mainImagePosition);
  const mainImageScale = getMainImageScale(club.mainImageScale);
  const mainImageRotation = getMainImageRotation(club.mainImageRotation);
  const useBackgroundCover = mainImageScale > 1;
  const showPhonePublic = Boolean(club.phone && club.phoneVisibleOnPublicSite);
  /** 与俱乐部详情页「公式链接」区一致的圆钮：白底 + 描边 + 阴影（移动端略大便于点击） */
  const contactIconWrap =
    "inline-flex aspect-square w-11 h-11 md:w-7 md:h-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1 active:scale-[0.98]";

  return (
    <Ceramic
      style={
        {
          "--theme-color": themeColor,
          "--theme-shadow": `0 15px 30px color-mix(in srgb, ${themeColor}, transparent 85%)`,
        } as React.CSSProperties
      }
      className={cn(
        "flex flex-col h-full overflow-hidden isolate group cursor-pointer transform-gpu",
        "hover:border-b-[var(--theme-color)]",
        "hover:shadow-[var(--theme-shadow)]",
        className,
      )}
    >
      <div className="flex flex-col h-full min-h-0">
        <Link href={detailLink} className="relative z-0 flex min-h-0 flex-1 flex-col outline-none">
          {/* Visual Area */}
          <div
            className="relative aspect-[16/10] block overflow-hidden z-0 bg-gray-100 rounded-t-[inherit]"
            style={{
              WebkitMaskImage: "-webkit-radial-gradient(white, black)",
            }}
          >
            {useBackgroundCover ? (
              <div
                className="absolute inset-0 bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${displayImage})`,
                  backgroundSize: `${100 * mainImageScale}%`,
                  backgroundPosition: mainImagePosition,
                  transform: `rotate(${mainImageRotation}deg)`,
                }}
                aria-hidden
              />
            ) : (
              <Image
                src={displayImage}
                alt={displayName}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: mainImagePosition, transform: `rotate(${mainImageRotation}deg)` }}
                sizes={
                  compact
                    ? "(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
                    : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                }
              />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

            <div
              className={cn(
                "absolute bg-white/95 backdrop-blur-md rounded-full font-black tracking-widest shadow-sm flex items-center gap-1 border border-white/50",
                compact
                  ? "top-2 left-2 px-2 py-0.5 text-[9px] max-md:max-w-[calc(100%-2.5rem)] truncate"
                  : "top-3 left-3 px-3 py-1 text-[10px]"
              )}
              style={{ color: themeColor }}
            >
              <MapPin size={compact ? 9 : 10} className="shrink-0" />
              <span className="truncate">{displayArea}</span>
            </div>

            <div
              className={cn(
                "absolute w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md",
                compact ? "top-2 right-2 max-md:hidden" : "top-3 right-3"
              )}
              style={{ color: themeColor }}
            >
              <ArrowUpRight size={16} />
            </div>
          </div>

          {/* Information Area */}
          <div
            className={cn(
              "pb-0 flex flex-col flex-grow bg-white",
              compact ? "p-3 max-md:p-3 md:p-6" : "p-6"
            )}
          >
            <h3
              className={cn(
                "font-serif font-bold text-gray-900 leading-snug transition-colors group-hover:text-[var(--theme-color)] line-clamp-2 md:line-clamp-1",
                compact ? "text-sm mb-1 md:text-xl md:mb-2" : "text-xl mb-2"
              )}
            >
              {displayName}
            </h3>

            {(displayCity || displayAddress) && (
              <p
                className={cn(
                  "text-gray-400 flex items-center gap-1 line-clamp-1",
                  compact ? "text-[10px] mb-2 max-md:hidden md:text-[11px] md:mb-3" : "text-[11px] mb-3"
                )}
              >
                <MapPin size={10} className="shrink-0" />
                <span className="truncate">
                  {displayArea}
                  {displayCity && ` ${displayCity}`}
                  {displayAddress && ` ${displayAddress}`}
                </span>
              </p>
            )}

            <div className={cn("flex flex-wrap items-center gap-2", compact ? "mb-2 md:mb-4" : "mb-4")}>
              {dynamicTags.map((tag, index) => (
                <span
                  key={index}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md bg-gray-50 text-gray-500 font-black tracking-wider border border-gray-100",
                    compact
                      ? "px-1.5 py-0.5 text-[8px] md:px-2.5 md:py-1 md:text-[9px]"
                      : "px-2.5 py-1 text-[9px]",
                    index >= 2 && compact && "max-md:hidden"
                  )}
                >
                  <Users size={10} />
                  {tag}
                </span>
              ))}
            </div>

            <p
              className={cn(
                "text-gray-500 leading-relaxed font-medium",
                compact
                  ? "text-xs line-clamp-2 mb-3 md:text-sm md:line-clamp-3 md:mb-6"
                  : "text-sm line-clamp-3 mb-6"
              )}
            >
              {summaryText}
            </p>
          </div>
        </Link>

        {/* Footer: 外链优先新标签；内嵌浏览器拦截时降级为当前页；z-20 避免被 transform 层盖住 */}
        <div
          className={cn(
            "relative z-20 flex items-center justify-between gap-3 border-t border-gray-100",
            compact ? "mx-3 mb-3 pt-2 max-md:gap-1.5 md:mx-6 md:mb-6 md:pt-4" : "mx-6 mb-6 pt-4"
          )}
        >
          <div className="flex flex-wrap items-center gap-3 md:gap-2">
            {showPhonePublic && (
              <a href={`tel:${club.phone}`} className={cn(contactIconWrap, "border border-emerald-100 text-emerald-600")} title={t("cardLinkPhone", { phone: club.phone! })}>
                <Phone className="w-[18px] h-[18px] md:w-3.5 md:h-3.5" />
              </a>
            )}
            {club.email && (
              <a href={`mailto:${club.email}`} className={cn(contactIconWrap, "border border-gray-200 text-cyan-600")} title={t("cardLinkEmail", { email: club.email })}>
                <Mail className="w-[18px] h-[18px] md:w-3.5 md:h-3.5" />
              </a>
            )}
            {websiteHref && (
              <ClubExternalAnchor
                href={websiteHref}
                className={cn(contactIconWrap, "border border-blue-100 text-blue-600")}
                title={t("cardLinkWebsite")}
              >
                <Globe className="w-[18px] h-[18px] md:w-3.5 md:h-3.5" />
              </ClubExternalAnchor>
            )}
            {instagramHref && (
              <ClubExternalAnchor
                href={instagramHref}
                className={cn(contactIconWrap, "border border-pink-100 text-pink-600")}
                title={t("cardLinkInstagram")}
              >
                <Instagram className="w-[18px] h-[18px] md:w-3.5 md:h-3.5" />
              </ClubExternalAnchor>
            )}
            {twitterHref && (
              <ClubExternalAnchor
                href={twitterHref}
                className={cn(contactIconWrap, "border border-gray-200 text-black")}
                title={t("cardLinkTwitter")}
              >
                <Twitter className="w-[18px] h-[18px] md:w-3.5 md:h-3.5" />
              </ClubExternalAnchor>
            )}
            {facebookHref && (
              <ClubExternalAnchor
                href={facebookHref}
                className={cn(contactIconWrap, "border border-indigo-100 text-indigo-600")}
                title={t("cardLinkFacebook")}
              >
                <Facebook className="w-[18px] h-[18px] md:w-3.5 md:h-3.5" />
              </ClubExternalAnchor>
            )}
            {!showPhonePublic && !club.email && !websiteHref && !instagramHref && !twitterHref && !facebookHref && (
              <span className="text-[9px] text-gray-300 font-medium">—</span>
            )}
          </div>

          <Link href={detailLink} className="text-[10px] font-black text-gray-300 group-hover:text-[var(--theme-color)] transition-colors uppercase tracking-widest">
            {t("cardDetails")}
          </Link>
        </div>
      </div>
    </Ceramic>
  );
};

export default ClubCard;
