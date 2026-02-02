"use client";

import React, { useState, useEffect, useMemo } from "react";
import RabbitBanner from "@/components/home/RabbitBanner";
import { ChevronRight } from "lucide-react";

// 新闻数据
const NEWS_ITEMS = [
  { id: 1, type: "INTERVIEW", date: "01.28", title: "横綱・照ノ富士：不屈の魂を語る", link: "#" },
  { id: 2, type: "REPORT", date: "02.01", title: "2026年 春巡業の日程が決定", link: "#" },
  { id: 3, type: "PICKUP", date: "02.14", title: "新世代の力士たち特集", link: "#" },
];

const Hero = () => {
  // ============================================================
  // 🔧 调试区：请直接在这里修改数值，保存后画面一定会变
  // ============================================================

  // 1. 垂直位置 (Y)
  // 背景图总高是 3136。
  // 数值越大，人越往下；数值越小，人越往上。
  // 试着改成 2000 (上浮) 或 2800 (下沉) 看看效果
  const CHAR_Y = 1300;

  // 2. 人物大小 (宽高像素值)
  // 嫌小就改成 900，嫌大就改成 600
  const CHAR_SIZE = 750;

  // ============================================================

  // 背景图真实尺寸 (不要改)
  const WORLD_W = 5440;
  const WORLD_H = 3136;

  // 自动计算水平居中 X (不要改)
  const CHAR_X = (WORLD_W - CHAR_SIZE) / 2;

  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);

  // 动画控制
  const duration = 20; // 动画慢一点

  useEffect(() => {
    // 简单的 4 帧轮播
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % NEWS_ITEMS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentNews = NEWS_ITEMS[currentNewsIndex];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-sumo-bg">

      {/* 1. SVG 场景层 */}
      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 背景图 */}
        <image
          href="/images/hero/bg.webp"
          width={WORLD_W}
          height={WORLD_H}
          x="0"
          y="0"
        />

        {/* 人物层：直接使用 x/y 属性，不再使用 transform */}

        {/* 帧 1 */}
        <image
          href="/images/hero/l1.webp"
          x={CHAR_X}
          y={CHAR_Y}
          width={CHAR_SIZE}
          height={CHAR_SIZE}
          className={`transition-opacity duration-300 ${frameIndex === 0 ? "opacity-100" : "opacity-0"}`}
        />
        {/* 帧 2 */}
        <image
          href="/images/hero/l2.webp"
          x={CHAR_X}
          y={CHAR_Y}
          width={CHAR_SIZE}
          height={CHAR_SIZE}
          className={`transition-opacity duration-300 ${frameIndex === 1 ? "opacity-100" : "opacity-0"}`}
        />
        {/* 帧 3 */}
        <image
          href="/images/hero/r1.webp"
          x={CHAR_X}
          y={CHAR_Y}
          width={CHAR_SIZE}
          height={CHAR_SIZE}
          className={`transition-opacity duration-300 ${frameIndex === 2 ? "opacity-100" : "opacity-0"}`}
        />
        {/* 帧 4 */}
        <image
          href="/images/hero/r2.webp"
          x={CHAR_X}
          y={CHAR_Y}
          width={CHAR_SIZE}
          height={CHAR_SIZE}
          className={`transition-opacity duration-300 ${frameIndex === 3 ? "opacity-100" : "opacity-0"}`}
        />

        {/* 🟥 红色参考线 (调试用) */}
        {/* 这条线显示了 CHAR_Y 的位置。如果你改了数值，这条红线一定会动！ */}
        {/* <line x1="0" y1={CHAR_Y} x2={WORLD_W} y2={CHAR_Y} stroke="red" strokeWidth="10" /> */}
      </svg>

      {/* 2. 底部渐变 */}
      <div className="absolute bottom-0 left-0 w-full h-[15vh] bg-gradient-to-t from-sumo-bg via-sumo-bg/80 to-transparent z-10 pointer-events-none" />

      {/* 3. UI 层 (保持不变) */}
      <div className="absolute z-30 reveal-up top-32 left-1/2 -translate-x-1/2 w-[92vw] max-w-[600px]">
        {/* ... Card Content (复用之前的代码即可) ... */}
        <div className="relative bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-row items-stretch rounded-sm overflow-hidden h-[80px] md:h-[90px] group transition-transform duration-500 hover:translate-y-[-2px]">
          <div className="absolute top-0 left-0 h-[3px] bg-sumo-red w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left z-20"></div>
          <div className="bg-sumo-red text-white w-[60px] md:w-[80px] flex flex-col justify-center items-center shrink-0 relative overflow-hidden z-10">
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
            <span className="text-[10px] md:text-xs font-bold leading-none opacity-90 font-serif">20</span>
            <span className="text-2xl md:text-3xl font-black tracking-tighter leading-none my-0.5 font-serif">26</span>
            <div className="flex flex-col items-center border-t border-white/30 pt-1 mt-1 w-8">
              <span className="text-[10px] md:text-xs font-bold leading-none">年</span>
              <span className="text-[8px] md:text-[9px] tracking-widest opacity-90 mt-0.5 transform scale-90">始動</span>
            </div>
          </div>
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

      {/* 新闻轮播 */}
      <div className="absolute z-30 top-60 md:top-60 left-1/2 -translate-x-1/2 w-[90vw] max-w-[340px]">
        {/* ... News Content (复用之前的代码即可) ... */}
        <a href={currentNews.link} className="block group/news">
          <div className="flex items-stretch bg-black/20 backdrop-blur-lg border border-white/10 rounded-sm overflow-hidden transition-all duration-300 hover:bg-black/30 hover:border-white/20 hover:scale-[1.02]">
            <div className="w-[28px] md:w-[32px] bg-sumo-red/90 flex items-center justify-center py-2 shrink-0">
              <span className="text-[9px] md:text-[10px] font-bold text-white tracking-widest opacity-90" style={{ writingMode: 'vertical-rl' }}>
                最新情報
              </span>
            </div>
            <div className="flex-grow py-3 px-4 flex flex-col justify-center relative min-h-[70px]">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[9px] md:text-[10px] text-white/80 tracking-wider">
                  {currentNews.date}
                </span>
                <span className="text-[8px] md:text-[9px] font-bold text-white bg-white/10 border border-white/10 px-1.5 py-[1px] rounded-[1px]">
                  {currentNews.type}
                </span>
              </div>
              <h3 key={currentNewsIndex} className="text-xs md:text-sm font-medium text-white leading-snug line-clamp-2 animate-in fade-in slide-in-from-bottom-2 duration-500 drop-shadow-sm">
                {currentNews.title}
              </h3>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover/news:opacity-100 group-hover/news:translate-x-0 transition-all duration-300 text-white/80">
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* RabbitBanner */}
      <div className="absolute bottom-0 w-full z-30">
        <RabbitBanner />
      </div>
    </section>
  );
};

export default Hero;