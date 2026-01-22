"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
// 假设 Club 类型定义在 data/clubs
import { type Club } from "@/data/clubs";
import Ceramic from "@/components/ui/Ceramic";

type ClubCardProps = {
  club: Club;
  className?: string;
  accentColor?: string;
};

const DEFAULT_COLOR = "#2454a4";

const ClubCard = ({ club, className, accentColor }: ClubCardProps) => {
  const themeColor = accentColor || DEFAULT_COLOR;

  // ✨ 修复点 1：构建新的详情页路径
  // 加上 /detail/ 前缀，避免与 [pref] 路由冲突
  const detailLink = `/clubs/detail/${club.id}`;

  return (
    <Ceramic
      style={
        {
          "--theme-color": themeColor,
          "--theme-shadow": `0 15px 30px color-mix(in srgb, ${themeColor}, transparent 85%)`,
        } as React.CSSProperties
      }
      className={cn(
        "flex flex-col h-full overflow-hidden isolate",
        "hover:border-b-[var(--theme-color)]",
        "hover:shadow-[var(--theme-shadow)]",
        className,
      )}
    >
      {/* 图片区域 */}
      <Link
        href={detailLink} // ✨ 修复点 2：应用新链接
        className="relative aspect-[4/3] block overflow-hidden z-0"
      >
        <Image
          src={club.mainImage}
          alt={club.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />

        <div
          className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest shadow-sm flex items-center gap-1 border border-white/50"
          style={{ color: themeColor }}
        >
          <MapPin size={10} />
          {club.area}
        </div>
      </Link>

      {/* 内容区域 */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <Link href={detailLink}> {/* ✨ 修复点 3：应用新链接 */}
            <h3 className="text-lg font-serif font-bold text-gray-800 leading-snug transition-colors line-clamp-1 group-hover:text-[var(--theme-color)]">
              {club.name}
            </h3>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {club.tags &&
            club.tags.length > 0 &&
            club.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 text-gray-500 text-[10px] font-bold tracking-wider border border-gray-100"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
        </div>

        <div className="mt-auto">
          <Link
            href={detailLink} // ✨ 修复点 4：应用新链接
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300",
              "text-xs font-bold tracking-widest",
              "bg-gray-50 border border-gray-100 text-gray-500",
              "md:bg-white",
              "group-hover:text-white group-hover:shadow-md",
              "group-hover:bg-[var(--theme-color)] group-hover:border-[var(--theme-color)]",
            )}
          >
            <span>詳細を見る</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </Ceramic>
  );
};

export default ClubCard;