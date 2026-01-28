"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import RabbitBanner from "@/components/home/RabbitBanner";
import { ChevronRight } from "lucide-react";

// 模拟新闻数据
const NEWS_ITEMS = [
  { id: 1, type: "INTERVIEW", date: "01.28", title: "横綱・照ノ富士：不屈の魂を語る", link: "#" },
  { id: 2, type: "REPORT", date: "02.01", title: "2026年 春巡業の日程が決定", link: "#" },
  { id: 3, type: "PICKUP", date: "02.14", title: "新世代の力士たち特集", link: "#" },
];

const Hero = () => {
  // 新闻轮播逻辑
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % NEWS_ITEMS.length);
    }, 4000); // 4秒切换一次
    return () => clearInterval(interval);
  }, []);

  const currentNews = NEWS_ITEMS[currentNewsIndex];

  return (
    <section className="relative w-full h-screen flex flex-col items-center overflow-hidden bg-sumo-bg">
      {/* 1. 背景层 */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/images/bg/hero-bg-1.jpg"
          alt="Sumo Spirit"
          fill
          priority
          className="object-cover object-top"
          style={{ filter: "brightness(0.85) contrast(1.1)" }}
        />
        <div className="absolute bottom-0 w-full h-[40vh] bg-gradient-to-t from-sumo-bg via-sumo-bg/60 to-transparent" />
      </div>

      {/* 2. 核心宣传卡片层 (Ticket Style) */}
      <div className="absolute z-10 reveal-up top-32 left-1/2 -translate-x-1/2 w-[92vw] max-w-[600px]">
        <div className="relative bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-row items-stretch rounded-sm overflow-hidden h-[80px] md:h-[90px] group transition-transform duration-500 hover:translate-y-[-2px]">

          <div className="absolute top-0 left-0 h-[3px] bg-sumo-red w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left z-20"></div>

          {/* Part A: 左侧红色强调区 */}
          <div className="bg-sumo-red text-white w-[60px] md:w-[80px] flex flex-col justify-center items-center shrink-0 relative overflow-hidden z-10">
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
            <span className="text-[10px] md:text-xs font-bold leading-none opacity-90 font-serif">20</span>
            <span className="text-2xl md:text-3xl font-black tracking-tighter leading-none my-0.5 font-serif">26</span>
            <div className="flex flex-col items-center border-t border-white/30 pt-1 mt-1 w-8">
              <span className="text-[10px] md:text-xs font-bold leading-none">年</span>
              <span className="text-[8px] md:text-[9px] tracking-widest opacity-90 mt-0.5 transform scale-90">始動</span>
            </div>
          </div>

          {/* Part B: 右侧内容 */}
          <div className="flex-grow flex flex-col justify-center px-5 md:px-8 relative bg-white">
            <div className="absolute inset-0 bg-[url('/images/bg/noise.png')] opacity-20 pointer-events-none mix-blend-multiply"></div>
            <div className="relative z-10 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3 md:gap-6">
                <h1 className="flex items-center gap-2 md:gap-4 font-serif text-sumo-text leading-none select-none">
                  <span className="text-3xl md:text-4xl font-black tracking-tighter group-hover:text-sumo-red transition-colors duration-300">心</span>
                  <span className="w-[1px] h-3 bg-gray-300 rotate-12"></span>
                  <span className="text-3xl md:text-4xl font-black tracking-tighter group-hover:text-sumo-red transition-colors duration-300">技</span>
                  <span className="w-[1px] h-3 bg-gray-300 rotate-12"></span>
                  <span className="text-3xl md:text-4xl font-black tracking-tighter group-hover:text-sumo-red transition-colors duration-300">体</span>
                </h1>
              </div>
              <div className="flex flex-col items-end border-l border-gray-100 pl-4 md:pl-8 ml-2">
                <p className="font-serif text-[10px] md:text-sm font-bold text-sumo-text tracking-widest leading-none mb-1 text-right whitespace-nowrap">伝統を未来へ</p>
                <p className="hidden md:block font-sans text-[8px] text-gray-400 font-medium tracking-wider uppercase text-right">Tradition & Future</p>
              </div>
            </div>
            {/* 星取表装饰 */}
            <div className="absolute bottom-2 right-3 flex gap-1 opacity-20 pointer-events-none">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full border border-gray-800 bg-transparent"></span>
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gray-800"></span>
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full border border-gray-800 bg-transparent"></span>
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full border border-gray-800 bg-transparent"></span>
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gray-800"></span>
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full border border-gray-800 bg-transparent"></span>
            </div>
          </div>
        </div>
      </div>

      {/* ✨ NEW: 高级感通知模块 (News Widget) - 居中版 */}
      {/* - left-1/2 -translate-x-1/2: 水平绝对居中
          - bottom-24 md:bottom-28: 距离底部留出空间，完全避开 RabbitBanner
          - w-[90vw] max-w-[340px]: 稍微加宽，适配居中布局
      */}
      <div className="absolute z-20 top-60 md:top-60 left-1/2 -translate-x-1/2 w-[90vw] max-w-[340px]">
        <a href={currentNews.link} className="block group/news">
          <div className="flex items-stretch bg-black/20 backdrop-blur-lg border border-white/10 rounded-sm overflow-hidden transition-all duration-300 hover:bg-black/30 hover:border-white/20 hover:scale-[1.02]">

            {/* 1. 左侧：竖排标签 (Vertical Label) */}
            <div className="w-[28px] md:w-[32px] bg-sumo-red/90 flex items-center justify-center py-2 shrink-0">
              <span className="text-[9px] md:text-[10px] font-bold text-white tracking-widest opacity-90" style={{ writingMode: 'vertical-rl' }}>
                最新情報
              </span>
            </div>

            {/* 2. 右侧：内容区 (Content) */}
            <div className="flex-grow py-3 px-4 flex flex-col justify-center relative min-h-[70px]">
              {/* 装饰：顶部微光细线 */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[9px] md:text-[10px] text-white/80 tracking-wider">
                  {currentNews.date}
                </span>
                {/* 标签改为更低调的黑底白字或半透明，增加高级感 */}
                <span className="text-[8px] md:text-[9px] font-bold text-white bg-white/10 border border-white/10 px-1.5 py-[1px] rounded-[1px]">
                  {currentNews.type}
                </span>
              </div>

              {/* 标题 */}
              <h3 key={currentNewsIndex} className="text-xs md:text-sm font-medium text-white leading-snug line-clamp-2 animate-in fade-in slide-in-from-bottom-2 duration-500 drop-shadow-sm">
                {currentNews.title}
              </h3>

              {/* Arrow Icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover/news:opacity-100 group-hover/news:translate-x-0 transition-all duration-300 text-white/80">
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* 3. 底部横幅层 */}
      <div className="absolute bottom-0 w-full z-30">
        <RabbitBanner />
      </div>
    </section>
  );
};

export default Hero;