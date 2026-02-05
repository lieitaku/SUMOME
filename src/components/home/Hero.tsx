"use client";

import React, { useState, useEffect } from "react";
import RabbitBanner, { type SponsorItem } from "@/components/home/RabbitBanner";

type HeroProps = {
  sponsors?: SponsorItem[]; // 动态赞助商数据
};

const Hero = ({ sponsors }: HeroProps) => {
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

  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    // 简单的 4 帧轮播
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

      </svg>

      {/* 2. 底部渐变 */}
      <div className="absolute bottom-0 left-0 w-full h-[15vh] bg-gradient-to-t from-sumo-bg via-sumo-bg/80 to-transparent z-10 pointer-events-none" />

      {/* 3. UI 层 (保持不变) */}
      <div className="absolute z-30 reveal-up top-32 left-1/2 -translate-x-1/2 w-[92vw] max-w-[600px]">
        <div className="relative flex flex-row items-stretch rounded-2xl overflow-hidden h-[80px] md:h-[90px] shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
          {/* 毛玻璃背景层 - 更模糊、更难透光 */}
          <div className="absolute inset-0 bg-white/90 backdrop-blur-[60px] backdrop-saturate-[1.5]" />
          {/* 玻璃光泽层 - 顶部微光 */}
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />

          <div className="bg-sumo-red text-white w-[60px] md:w-[80px] flex flex-col justify-center items-center shrink-0 relative overflow-hidden z-10">
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
            <span className="text-[10px] md:text-xs font-bold leading-none opacity-90 font-serif">20</span>
            <span className="text-2xl md:text-3xl font-black tracking-tighter leading-none my-0.5 font-serif">26</span>
            <div className="flex flex-col items-center border-t border-white/30 pt-1 mt-1 w-8">
              <span className="text-[10px] md:text-xs font-bold leading-none">年</span>
              <span className="text-[8px] md:text-[9px] tracking-widest opacity-90 mt-0.5 transform scale-90">始動</span>
            </div>
          </div>
          <div className="flex-grow flex flex-col justify-center px-5 md:px-8 relative">
            <div className="absolute inset-0 bg-[url('/images/bg/noise.png')] opacity-10 pointer-events-none mix-blend-multiply"></div>
            <div className="relative z-10 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3 md:gap-6">
                <h1 className="flex items-center gap-2 md:gap-4 font-serif text-sumo-text leading-none select-none">
                  <span className="text-3xl md:text-4xl font-black tracking-tighter text-sumo-red">心</span>
                  <span className="w-px h-3 bg-gray-400/50 rotate-12"></span>
                  <span className="text-3xl md:text-4xl font-black tracking-tighter text-sumo-red">技</span>
                  <span className="w-px h-3 bg-gray-400/50 rotate-12"></span>
                  <span className="text-3xl md:text-4xl font-black tracking-tighter text-sumo-red">体</span>
                </h1>
              </div>
              <div className="flex flex-col items-end border-l border-gray-400/30 pl-4 md:pl-8 ml-2">
                <p className="font-serif text-base md:text-xl font-bold text-sumo-text tracking-widest leading-none mb-1 text-right whitespace-nowrap">伝統を未来へ</p>
                <p className="hidden md:block font-sans text-xs text-gray-500 font-medium tracking-wider uppercase text-right">Tradition & Future</p>
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

      {/* RabbitBanner */}
      <div className="absolute bottom-0 w-full z-30">
        <RabbitBanner sponsors={sponsors} />
      </div>
    </section>
  );
};

export default Hero;