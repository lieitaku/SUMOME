"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import RabbitBanner from "@/components/home/RabbitBanner";
import { ChevronRight } from "lucide-react";

// ==========================================
// 🎛️ 人物控制器
// ==========================================
const CHAR_CONFIG = {
  // 1. 动画总时长 (秒)
  // 数字越大，动作越慢。比如 3 代表“3秒做完一套左左右右的动作”
  duration: 20,

  // 2. 大小控制 (像控制一张图一样控制整体)
  // w-[120vw]: 宽度占屏幕120% (手机端大一点霸气)
  // md:w-[800px]: 电脑端限制宽度
  size: "w-[40vw] md:w-[100px] lg:w-[150px]",

  // 3. 位置控制
  // horizontal: 水平位置 (left-1/2 -translate-x-1/2 是绝对居中)
  // vertical: 垂直位置 (bottom-0 贴底)
  // 你可以改成 right-[-50px] 让它靠右，或者 bottom-[-20px] 让它下沉
  position: "left-1/2 -translate-x-1/2 bottom-[320px] md:bottom-[260px]",

  // 4. 高度限制 (防止太高遮住标题)
  heightLimit: "h-[85vh] md:h-[95vh]",
};

// 模拟新闻数据
const NEWS_ITEMS = [
  { id: 1, type: "INTERVIEW", date: "01.28", title: "横綱・照ノ富士：不屈の魂を語る", link: "#" },
  { id: 2, type: "REPORT", date: "02.01", title: "2026年 春巡業の日程が決定", link: "#" },
  { id: 3, type: "PICKUP", date: "02.14", title: "新世代の力士たち特集", link: "#" },
];

const Hero = () => {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  // 自动计算每一帧的延迟时间
  // 比如总时长 3秒，那么间隔就是 0s, 0.75s, 1.5s, 2.25s
  const animStyles = useMemo(() => {
    const step = CHAR_CONFIG.duration / 4;
    return [
      { animationDuration: `${CHAR_CONFIG.duration}s`, animationDelay: '0s' },
      { animationDuration: `${CHAR_CONFIG.duration}s`, animationDelay: `${step}s` },
      { animationDuration: `${CHAR_CONFIG.duration}s`, animationDelay: `${step * 2}s` },
      { animationDuration: `${CHAR_CONFIG.duration}s`, animationDelay: `${step * 3}s` },
    ];
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % NEWS_ITEMS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentNews = NEWS_ITEMS[currentNewsIndex];

  return (
    <section className="relative w-full h-screen flex flex-col items-center overflow-hidden bg-sumo-bg">

      {/* 1. 背景层 */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">

        {/* A. 纯场景背景 */}
        <Image
          src="/images/hero/bg.webp"
          alt="Sumo Arena Background"
          fill
          priority
          className="object-cover object-top"
          style={{ filter: "brightness(0.85) contrast(1.1)" }}
        />

        {/* ========================================= */}
        {/* B. 人物动画层 (统一容器) */}
        {/* 这就是那个“框”，你控制这个框，里面的4张图就会乖乖听话 */}
        {/* ========================================= */}
        <div
          className={`
            absolute z-10 
            ${CHAR_CONFIG.position} 
            ${CHAR_CONFIG.size} 
            ${CHAR_CONFIG.heightLimit}
          `}
        >
          {/* 帧 1: 左1 */}
          <div className="absolute inset-0 animate-frame" style={animStyles[0]}>
            <Image src="/images/hero/l1.webp" alt="P1" fill className="object-contain object-bottom" priority />
          </div>

          {/* 帧 2: 左2 */}
          <div className="absolute inset-0 animate-frame opacity-0" style={animStyles[1]}>
            <Image src="/images/hero/l2.webp" alt="P2" fill className="object-contain object-bottom" priority />
          </div>

          {/* 帧 3: 右1 */}
          <div className="absolute inset-0 animate-frame opacity-0" style={animStyles[2]}>
            <Image src="/images/hero/r1.webp" alt="P3" fill className="object-contain object-bottom" priority />
          </div>

          {/* 帧 4: 右2 */}
          <div className="absolute inset-0 animate-frame opacity-0" style={animStyles[3]}>
            <Image src="/images/hero/r2.webp" alt="P4" fill className="object-contain object-bottom" priority />
          </div>

        </div>
        {/* --- 人物层结束 --- */}

        <div className="absolute bottom-0 w-full h-[40vh] bg-gradient-to-t from-sumo-bg via-sumo-bg/60 to-transparent z-20" />
      </div>

      {/* 2. 宣传卡片层 (保持不变) */}
      <div className="absolute z-10 reveal-up top-32 left-1/2 -translate-x-1/2 w-[92vw] max-w-[600px]">
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

      {/* 3. 新闻轮播模块 (保持不变) */}
      <div className="absolute z-20 top-60 md:top-60 left-1/2 -translate-x-1/2 w-[90vw] max-w-[340px]">
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

      {/* 4. 底部横幅层 */}
      <div className="absolute bottom-0 w-full z-30">
        <RabbitBanner />
      </div>
    </section>
  );
};

export default Hero;