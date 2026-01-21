"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Club } from "@/data/clubs";
import Ceramic from "@/components/ui/Ceramic";

type ClubCardProps = {
  club: Club;
  className?: string;
  accentColor?: string;
};

const DEFAULT_COLOR = "#2454a4"; // 默认品牌蓝

const ClubCard = ({ club, className, accentColor }: ClubCardProps) => {
  // 1. 确定当前卡片的主题色
  const themeColor = accentColor || DEFAULT_COLOR;

  return (
    <Ceramic
      // ✨ 关键修改 1: 注入 CSS 变量，而不是直接写死样式
      // 我们定义了 --theme-color (边框用) 和 --theme-shadow (阴影用)
      // color-mix 是现代 CSS 语法，可以自动把颜色变淡作为阴影
      style={
        {
          "--theme-color": themeColor,
          "--theme-shadow": `0 15px 30px color-mix(in srgb, ${themeColor}, transparent 85%)`,
        } as React.CSSProperties
      }
      // ✨ 关键修改 2: 使用 Tailwind 的 hover 类覆盖 Ceramic 的默认设置
      // hover:border-b-[var(--theme-color)] -> 覆盖默认的蓝色底边
      // hover:shadow-[var(--theme-shadow)] -> 覆盖默认的蓝色阴影
      className={cn(
        "flex flex-col h-full overflow-hidden isolate",
        "hover:border-b-[var(--theme-color)]",
        "hover:shadow-[var(--theme-shadow)]",
        className,
      )}
    >
      {/* ==================== 1. 图片区域 ==================== */}
      <Link
        href={`/clubs/${club.id}`}
        className="relative aspect-[4/3] block overflow-hidden z-0"
      >
        <Image
          src={club.mainImage}
          alt={club.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* 遮罩：Hover 时加深一点点 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />

        {/* 地区标签 */}
        <div
          className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest shadow-sm flex items-center gap-1 border border-white/50"
          style={{ color: themeColor }}
        >
          <MapPin size={10} />
          {club.area}
        </div>
      </Link>

      {/* ==================== 2. 内容区域 ==================== */}
      <div className="p-5 flex flex-col flex-grow">
        {/* 标题 */}
        <div className="mb-3">
          <Link href={`/clubs/${club.id}`}>
            <h3 className="text-lg font-serif font-bold text-gray-800 leading-snug transition-colors line-clamp-1 group-hover:text-[var(--theme-color)]">
              {club.name}
            </h3>
          </Link>
        </div>

        {/* 标签 */}
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

        {/* 底部按钮 */}
        <div className="mt-auto">
          <Link
            href={`/clubs/${club.id}`}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300",
              "text-xs font-bold tracking-widest",
              // 默认状态
              "bg-gray-50 border border-gray-100 text-gray-500",
              "md:bg-white",
              // Hover 状态：背景变主题色，边框变主题色，文字变白
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
