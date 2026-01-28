"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Tag, Instagram, Twitter, ArrowUpRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import Ceramic from "@/components/ui/Ceramic";
import { type Club } from "@prisma/client";

type ClubCardProps = {
  club: Club;
  className?: string;
  accentColor?: string;
};

const DEFAULT_COLOR = "#2454a4";

const ClubCard = ({ club, className, accentColor }: ClubCardProps) => {
  // --- 1. Hooks 必须放在组件最顶部，不能在任何 return 之后 ---

  // 📝 修正 Content 逻辑
  const summaryText = useMemo(() => {
    if (club.description) {
      return club.description.length > 60
        ? club.description.substring(0, 60) + "..."
        : club.description;
    }
    return "道場の詳細は現在準備中です。";
  }, [club.description]);

  // 🏷️ 修正 Tags 逻辑 (利用已有字段生成动态标签)
  const dynamicTags = useMemo(() => {
    const tags: string[] = [];
    if (club.target) tags.push(club.target);
    if (club.representative) tags.push("指導者在籍");
    return tags.slice(0, 2);
  }, [club.target, club.representative]);

  // --- 2. 所有的 Hooks 定义完后，再进行早退 (Early Return) ---

  // 🛡️ 隐藏官方总部/假俱乐部
  if (club.slug === "official-hq") return null;

  const themeColor = accentColor || DEFAULT_COLOR;
  const detailLink = `/clubs/${club.slug}`;
  const displayImage = club.mainImage || "/images/placeholder.jpg";

  return (
    <Ceramic
      style={
        {
          "--theme-color": themeColor,
          "--theme-shadow": `0 15px 30px color-mix(in srgb, ${themeColor}, transparent 85%)`,
        } as React.CSSProperties
      }
      className={cn(
        "flex flex-col h-full overflow-hidden isolate group cursor-pointer",
        "hover:border-b-[var(--theme-color)]",
        "hover:shadow-[var(--theme-shadow)]",
        className,
      )}
    >
      <Link href={detailLink} className="flex flex-col h-full">
        {/* Visual Area */}
        <div className="relative aspect-[16/10] block overflow-hidden z-0 bg-gray-100">
          <Image
            src={displayImage}
            alt={club.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
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
        <div className="p-6 flex flex-col flex-grow bg-white">
          <h3 className="text-xl font-serif font-bold text-gray-900 leading-snug mb-3 transition-colors group-hover:text-[var(--theme-color)] line-clamp-1">
            {club.name}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {dynamicTags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 text-gray-500 text-[9px] font-black tracking-wider border border-gray-100 uppercase"
              >
                {index === 0 ? <Users size={10} /> : <Tag size={10} />}
                {tag}
              </span>
            ))}
          </div>

          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6 font-medium">
            {summaryText}
          </p>

          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-1">
                {club.instagram && (
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border border-white">
                    <Instagram size={10} className="text-gray-400" />
                  </div>
                )}
                {club.twitter && (
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border border-white">
                    <Twitter size={10} className="text-gray-400" />
                  </div>
                )}
              </div>
              <span className="text-[9px] text-gray-400 font-bold tracking-tighter uppercase">
                {club.phone ? "Contact Ready" : "Inquiry Only"}
              </span>
            </div>

            <span className="text-[10px] font-black text-gray-300 group-hover:text-[var(--theme-color)] transition-colors uppercase tracking-[0.15em]">
              Details
            </span>
          </div>
        </div>
      </Link>
    </Ceramic>
  );
};

export default ClubCard;