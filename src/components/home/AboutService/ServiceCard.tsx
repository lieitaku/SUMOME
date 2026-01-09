"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
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
      {/* === 线框容器 === */}
      <div className="relative h-full border border-gray-200 bg-white hover:border-sumo-brand transition-colors duration-500 overflow-hidden flex flex-col min-h-[400px]">
        {/* --- 1. 背景图层优化 --- 
            Mobile: opacity-10 (默认显示，有质感)
            Desktop (md): opacity-0 -> hover:opacity-10 (默认隐藏，悬停显示)
        */}
        <div className="absolute inset-0 opacity-10 md:opacity-0 md:group-hover:opacity-10 transition-opacity duration-700 pointer-events-none z-0">
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover grayscale"
          />
        </div>

        {/* 内容区域 */}
        <div className="relative z-10 p-8 flex flex-col h-full">
          {/* 顶部：编号与箭头 */}
          <div className="flex justify-between items-start mb-10">
            {/* 手机端 id 颜色加深一点，电脑端保持浅色 Hover 变深 */}
            <span className="text-xs font-bold text-sumo-brand md:text-gray-300 group-hover:text-sumo-brand transition-colors font-sans">
              {id}
            </span>
            <ArrowUpRight
              className="text-sumo-brand md:text-gray-300 group-hover:text-sumo-brand transition-colors duration-300"
              size={24}
            />
          </div>

          {/* 中部：汉字视觉中心 */}
          <div className="flex-grow flex flex-col justify-center items-center py-8">
            {/* 汉字：手机端显示为淡灰色(可见)，电脑端极淡 -> Hover变深 */}
            <span className="font-serif text-7xl font-black text-sumo-brand/20 md:text-gray-100 group-hover:text-sumo-brand/20 transition-colors duration-500 select-none">
              {kanji}
            </span>
            {/* 英文标题 */}
            <h3 className="text-2xl font-bold tracking-widest text-sumo-text mt-[-1rem] group-hover:translate-y-[-4px] transition-transform duration-300">
              {title}
            </h3>
          </div>

          {/* 底部：描述与分割线 */}
          <div className="mt-auto">
            {/* 分割线：手机端也可以让它稍微显现一点，或者保持 Hover 逻辑 */}
            <div className="w-8 h-[2px] bg-sumo-red mb-4 group-hover:w-full transition-all duration-500"></div>
            <p className="text-sm font-medium text-gray-500 leading-relaxed whitespace-pre-line group-hover:text-sumo-text transition-colors">
              {desc}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
