"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Tag, Instagram, Twitter, Facebook, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
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
        "flex flex-col h-full overflow-hidden isolate group cursor-pointer", // 整个卡片可点击
        "hover:border-b-[var(--theme-color)]",
        "hover:shadow-[var(--theme-shadow)]",
        className,
      )}
    >
      {/* 整个卡片是 Link，提升交互体验 */}
      <Link href={detailLink} className="flex flex-col h-full">

        {/* ==================== 1. 图片区域 ==================== */}
        <div className="relative aspect-[16/10] block overflow-hidden z-0 bg-gray-100">
          <Image
            src={club.mainImage}
            alt={club.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* 遮罩 */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />

          {/* 地区标签 (左上) */}
          <div
            className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest shadow-sm flex items-center gap-1 border border-white/50"
            style={{ color: themeColor }}
          >
            <MapPin size={10} />
            {club.area}
          </div>

          {/* 装饰箭头 (右上，Hover时出现) */}
          <div
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md"
            style={{ color: themeColor }}
          >
            <ArrowUpRight size={16} />
          </div>
        </div>

        {/* ==================== 2. 内容区域 ==================== */}
        <div className="p-6 flex flex-col flex-grow bg-white">

          {/* 标题 */}
          <h3 className="text-xl font-serif font-bold text-gray-900 leading-snug mb-3 transition-colors group-hover:text-[var(--theme-color)] line-clamp-1">
            {club.name}
          </h3>

          {/* 标签 (仅显示前2个，保持整洁) */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {club.tags &&
              club.tags.length > 0 &&
              club.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 text-gray-500 text-[10px] font-bold tracking-wider border border-gray-100"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
          </div>

          {/* 简介文本 (新增) */}
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6 font-medium">
            {club.description || club.content.substring(0, 60) + "..."}
          </p>

          {/* 底部：SNS 与 氛围展示 (新增设计点) */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* 模拟 SNS 图标 (如果有真实数据可替换) */}
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[1.5px] shadow-sm">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <Instagram size={12} className="text-gray-600" />
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-black p-[1.5px] shadow-sm">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <Twitter size={12} className="text-gray-600" />
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 font-bold tracking-wide">
                Active on SNS
              </span>
            </div>

            <span className="text-[10px] font-bold text-gray-300 group-hover:text-[var(--theme-color)] transition-colors uppercase tracking-widest flex items-center gap-1">
              View Detail
            </span>
          </div>
        </div>
      </Link>
    </Ceramic>
  );
};

export default ClubCard;