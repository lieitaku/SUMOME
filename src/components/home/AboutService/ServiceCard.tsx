"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "@/components/ui/TransitionLink";
import Image from "next/image";

type ServiceProps = {
  id: string;
  kanji: string;
  title: string;
  desc: string;
  img: string;
  delayClass?: string;
  isStaggered?: boolean;
  href: string;
  themeGradient?: string;
  shadowColor?: string;
};

const ServiceCard = ({
  id,
  kanji,
  title,
  desc,
  img,
  delayClass,
  isStaggered,
  href,
  themeGradient = "bg-gray-100",
  shadowColor = "shadow-gray-500/20",
}: ServiceProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "group relative block h-full w-full reveal-up",
        delayClass,
        isStaggered ? "md:mt-16" : "",
      )}
    >
      {/* === 卡片容器 === */}
      <div
        className={cn(
          "relative h-full overflow-hidden flex flex-col min-h-[420px] transition-all duration-500 rounded-sm",
          "hover:-translate-y-2 hover:shadow-2xl",
          themeGradient,
          shadowColor,
          "text-white",
          "antialiased", // 保持抗锯齿
        )}
      >
        {/* --- 0. 噪点纹理 --- */}
        <div className="absolute inset-0 bg-[url('/images/bg/noise.png')] opacity-20 mix-blend-overlay pointer-events-none z-0"></div>

        {/* --- 1. 背景图片 --- */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* --- 2. 内容区域 --- */}
        <div className="relative z-10 p-8 flex flex-col h-full">
          {/* 顶部：编号与箭头 */}
          <div className="flex justify-between items-start mb-8">
            <span className="text-xs font-bold font-sans tracking-widest border border-white/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
              {id}
            </span>
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-md group-hover:bg-white group-hover:text-sumo-brand transition-all duration-300 shadow-sm">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>

          {/* 中部：视觉中心 (已调换层级) */}
          {/* 添加 overflow-hidden 防止巨大的英文背景撑开容器 */}
          <div className="flex-grow relative flex flex-col justify-center items-center py-6 overflow-hidden">
            {/* 1. 英文标题 (新的背景层 Background Layer) */}
            <h3
              className="absolute center font-black tracking-widest text-white opacity-10 transition-all duration-700 select-none whitespace-nowrap z-0
                         text-[2rem] md:text-[2rem] /* 字号巨大化 */
                         scale-110 group-hover:scale-125 /* 悬浮时的呼吸感 */"
            >
              {title}
            </h3>

            {/* 2. 汉字 (新的前景层 Foreground Layer) */}
            <span
              className="relative z-10 font-serif font-black text-white drop-shadow-lg transition-transform duration-500 group-hover:-translate-y-2
                         text-7xl md:text-8xl "
            >
              {kanji}
            </span>
          </div>
          {/* 底部：描述与分割线 */}
          <div className="mt-auto relative z-10">
            <div className="w-12 h-[3px] bg-white mb-5 group-hover:w-full transition-all duration-500 shadow-sm"></div>
            <p className="text-sm font-bold text-white leading-relaxed whitespace-pre-line tracking-wide drop-shadow-sm">
              {desc}
            </p>
          </div>
        </div>

        {/* 光泽效果 */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none z-20"></div>
      </div>
    </Link>
  );
};

export default ServiceCard;
