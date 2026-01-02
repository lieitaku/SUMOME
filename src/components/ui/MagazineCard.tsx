"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type MagazineCardProps = {
  src: string;
  idx?: number;
  href?: string; // 允许作为链接使用，也可以只是展示
  title?: string; // 可选的标题，用于 Alt
};

const MagazineCard = ({ src, idx = 0, href, title }: MagazineCardProps) => {
  // 定义卡片的核心内容，无论是否有 Link 包裹，长相是一样的
  const CardContent = (
    <div
      className="
        relative 
        w-full h-full
        aspect-[3/4]
        flex-shrink-0 group cursor-pointer perspective-1000
        transition-all duration-500 ease-out
        rounded-sm
        /* 物理上浮 */
        hover:-translate-y-4
        /* 阴影处理 */
        drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]
        hover:drop-shadow-[0_25px_40px_rgba(0,0,0,0.7)]
      "
    >
      {/* 图片包裹层 - 设置 overflow-hidden 确保滑块不会滑出书本范围 */}
      <div className="relative w-full h-full rounded-sm overflow-hidden border border-white/5 bg-gray-800">
        <Image
          src={src}
          alt={title || `Magazine Vol.${idx + 1}`}
          fill
          sizes="(max-width: 768px) 200px, 280px"
          className="object-cover"
        />

        {/* 光泽层 */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>

        {/* 装订线 */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-r from-black/40 to-transparent pointer-events-none z-30 rounded-l-sm"></div>

        {/* 高级感侧滑腰封 (The Editorial Slide)*/}
        <div
          className="
            absolute bottom-8 left-0 w-full h-16
            bg-sumo-dark /* 深色背景 */
            border-y border-sumo-gold /* 上下金线 */
            z-20
            /* 布局：两端对齐 */
            flex items-center justify-between px-6
            /* 动画：初始位置在左侧 (-101%)，悬停时滑回 (0) */
            translate-x-[-101%] group-hover:translate-x-0
            transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] /* 丝滑贝塞尔 */
          "
        >
          {/* 左侧：文字组 */}
          <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] text-sumo-gold tracking-[0.2em] font-sans uppercase opacity-80">
              READ ENTRY
            </span>
            <span className="text-white text-sm font-serif font-bold tracking-widest">
              詳細を見る
            </span>
          </div>

          {/* 右侧：极简箭头 */}
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-sumo-gold transition-colors duration-300">
            <ArrowRight
              size={14}
              className="text-white group-hover:text-sumo-gold transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // 如果传了 href，就用 Link 包裹；否则只是一个 div 展示
  return href ? (
    <Link href={href} className="block w-full h-full">
      {CardContent}
    </Link>
  ) : (
    CardContent
  );
};

export default MagazineCard;
