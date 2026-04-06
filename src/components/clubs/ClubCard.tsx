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
import { clubDisplayDescription, clubDisplayName } from "@/lib/i18n-db";

type ExtendedClub = Club & {
  nameEn?: string | null;
  descriptionEn?: string | null;
  phoneVisibleOnPublicSite?: boolean;
};

type ClubCardProps = {
  club: ExtendedClub;
  className?: string;
  accentColor?: string;
};

const DEFAULT_COLOR = "#2454a4";

const ClubCard = ({ club, className, accentColor }: ClubCardProps) => {
  const locale = useLocale();
  const t = useTranslations("ClubDetail");
  const displayName = clubDisplayName(club, locale);
  // --- 1. Hooks ---
  const summaryText = useMemo(() => {
    const desc = clubDisplayDescription(club, locale);
    if (desc) {
      return desc.length > 60 ? desc.substring(0, 60) + "..." : desc;
    }
    return t("introFallback");
  }, [club, locale, t]);

  const dynamicTags = useMemo(() => {
    if (!club.target) return [];
    return club.target
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 4);
  }, [club.target]);

  // --- 2. Early Return ---
  if (club.slug === "official-hq") return null;

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
  /** 使用 w-11 h-11 替代 size-11 (Tailwind 3.3 不支持 size-*)，确保宽高固定为正圆 */
  const contactIconWrap =
    "inline-flex aspect-square w-11 h-11 md:w-7 md:h-7 shrink-0 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-[0.98]";

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
      <div className="flex flex-col h-full">
        <Link href={detailLink} className="flex flex-col flex-grow">
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

            <div
              className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black tracking-widest shadow-sm flex items-center gap-1 border border-white/50"
              style={{ color: themeColor }}
            >
              <MapPin size={10} />
              {club.area}
            </div>

            <div
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md"
              style={{ color: themeColor }}
            >
              <ArrowUpRight size={16} />
            </div>
          </div>

          {/* Information Area */}
          <div className="p-6 pb-0 flex flex-col flex-grow bg-white">
            <h3 className="text-xl font-serif font-bold text-gray-900 leading-snug mb-2 transition-colors group-hover:text-[var(--theme-color)] line-clamp-1">
              {displayName}
            </h3>

            {(club.city || club.address) && (
              <p className="text-[11px] text-gray-400 mb-3 flex items-center gap-1 line-clamp-1">
                <MapPin size={10} className="shrink-0" />
                <span className="truncate">
                  {club.area}{club.city && ` ${club.city}`}{club.address && ` ${club.address}`}
                </span>
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {dynamicTags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 text-gray-500 text-[9px] font-black tracking-wider border border-gray-100"
                >
                  <Users size={10} />
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6 font-medium">
              {summaryText}
            </p>
          </div>
        </Link>

        {/* Footer: 可独立点击的联系方式图标 */}
        <div className="mx-6 mb-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 md:gap-2">
            {showPhonePublic && (
              <a href={`tel:${club.phone}`} className={cn(contactIconWrap, "bg-emerald-50 hover:bg-emerald-100")} title={t("cardLinkPhone", { phone: club.phone! })}>
                <Phone className="w-[18px] h-[18px] md:w-3.5 md:h-3.5 text-emerald-600" />
              </a>
            )}
            {club.email && (
              <a href={`mailto:${club.email}`} className={cn(contactIconWrap, "bg-blue-50 hover:bg-blue-100")} title={t("cardLinkEmail", { email: club.email })}>
                <Mail className="w-[18px] h-[18px] md:w-3.5 md:h-3.5 text-blue-600" />
              </a>
            )}
            {club.website && (
              <a href={club.website} target="_blank" rel="noopener noreferrer" className={cn(contactIconWrap, "bg-purple-50 hover:bg-purple-100")} title={t("cardLinkWebsite")}>
                <Globe className="w-[18px] h-[18px] md:w-3.5 md:h-3.5 text-purple-600" />
              </a>
            )}
            {club.instagram && (
              <a href={`https://instagram.com/${club.instagram}`} target="_blank" rel="noopener noreferrer" className={cn(contactIconWrap, "bg-pink-50 hover:bg-pink-100")} title={t("cardLinkInstagram")}>
                <Instagram className="w-[18px] h-[18px] md:w-3.5 md:h-3.5 text-pink-600" />
              </a>
            )}
            {club.twitter && (
              <a href={`https://twitter.com/${club.twitter}`} target="_blank" rel="noopener noreferrer" className={cn(contactIconWrap, "bg-sky-50 hover:bg-sky-100")} title={t("cardLinkTwitter")}>
                <Twitter className="w-[18px] h-[18px] md:w-3.5 md:h-3.5 text-sky-600" />
              </a>
            )}
            {club.facebook && (
              <a href={`https://www.facebook.com/${club.facebook}`} target="_blank" rel="noopener noreferrer" className={cn(contactIconWrap, "bg-indigo-50 hover:bg-indigo-100")} title={t("cardLinkFacebook")}>
                <Facebook className="w-[18px] h-[18px] md:w-3.5 md:h-3.5 text-indigo-600" />
              </a>
            )}
            {!showPhonePublic && !club.email && !club.website && !club.instagram && !club.twitter && !club.facebook && (
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
