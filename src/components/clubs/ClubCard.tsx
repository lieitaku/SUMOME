"use client";

import React, { useMemo } from "react";
import Link from "@/components/ui/TransitionLink";
import Image from "next/image";
import { MapPin, Instagram, Twitter, ArrowUpRight, Users, Phone, Mail, Globe } from "lucide-react";
import { cn, getMainImageObjectPosition, getMainImageScale } from "@/lib/utils";
import Ceramic from "@/components/ui/Ceramic";
import { type Club } from "@prisma/client";

type ClubCardProps = {
  club: Club;
  className?: string;
  accentColor?: string;
};

const DEFAULT_COLOR = "#2454a4";

const ClubCard = ({ club, className, accentColor }: ClubCardProps) => {
  // --- 1. Hooks ---
  const summaryText = useMemo(() => {
    if (club.description) {
      return club.description.length > 60
        ? club.description.substring(0, 60) + "..."
        : club.description;
    }
    return "道場の詳細は現在準備中です。";
  }, [club.description]);

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
  const displayImage = club.mainImage || "/images/placeholder.jpg";
  const mainImagePosition = getMainImageObjectPosition(club.mainImagePosition);
  const mainImageScale = getMainImageScale(club.mainImageScale);
  const useBackgroundCover = mainImageScale > 1;

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
                }}
                aria-hidden
              />
            ) : (
              <Image
                src={displayImage}
                alt={club.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: mainImagePosition }}
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
              {club.name}
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
        <div className="mx-6 mb-6 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {club.phone && (
              <a href={`tel:${club.phone}`} className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 hover:scale-110 transition-all" title={`電話: ${club.phone}`}>
                <Phone size={10} className="text-emerald-500" />
              </a>
            )}
            {club.email && (
              <a href={`mailto:${club.email}`} className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 hover:scale-110 transition-all" title={`メール: ${club.email}`}>
                <Mail size={10} className="text-blue-500" />
              </a>
            )}
            {club.website && (
              <a href={club.website} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center hover:bg-purple-100 hover:scale-110 transition-all" title="公式サイト">
                <Globe size={10} className="text-purple-500" />
              </a>
            )}
            {club.instagram && (
              <a href={`https://instagram.com/${club.instagram}`} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 hover:scale-110 transition-all" title="Instagram">
                <Instagram size={10} className="text-pink-500" />
              </a>
            )}
            {club.twitter && (
              <a href={`https://twitter.com/${club.twitter}`} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-sky-50 flex items-center justify-center hover:bg-sky-100 hover:scale-110 transition-all" title="X (Twitter)">
                <Twitter size={10} className="text-sky-500" />
              </a>
            )}
            {!club.phone && !club.email && !club.website && !club.instagram && !club.twitter && (
              <span className="text-[9px] text-gray-300 font-medium">—</span>
            )}
          </div>

          <Link href={detailLink} className="text-[10px] font-black text-gray-300 group-hover:text-[var(--theme-color)] transition-colors uppercase tracking-widest">
            Details
          </Link>
        </div>
      </div>
    </Ceramic>
  );
};

export default ClubCard;
