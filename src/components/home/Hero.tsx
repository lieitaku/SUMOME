"use client";

import React from "react";
import Image from "next/image";
import RabbitBanner from "@/components/home/RabbitBanner";

const Hero = () => {
  return (
    <section className="relative w-full h-screen flex flex-col items-center overflow-hidden bg-sumo-bg">
      {/* 1. 背景层 (不变) */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/images/bg/hero-bg-1.jpg"
          alt="Sumo Spirit"
          fill
          priority
          className="object-cover object-top"
          style={{ filter: "brightness(0.9) contrast(1.1)" }}
        />
        <div className="absolute bottom-0 w-full h-[30vh] bg-gradient-to-t from-sumo-bg via-sumo-bg/80 to-transparent" />
      </div>

      {/* 2. 核心内容层 (左上角) */}
      {/* 调整：p-8 md:p-12 保持边距 */}
      <div className="absolute top-20 left-20 z-10 p-8 md:p-12 reveal-up">
        {/* --- 🆕 新设计：双层方块铭牌 (Stacked Block Plaque) --- */}
        {/* Flex 布局：左侧红条 + 右侧内容区 */}
        <div className="relative bg-white shadow-[0_25px_50px_rgba(0,0,0,0.15)] flex flex-row group overflow-hidden max-w-[380px]">
          {/* 顶部装饰红线 (Hover动效) */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-sumo-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-30"></div>

          {/* Part A: 左侧红色脊柱 (Visual Spine) - 贯穿全高 */}
          <div className="w-16 bg-sumo-red text-white flex flex-col justify-between items-center py-6 relative z-10 shrink-0">
            {/* 顶部 EST */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-bold tracking-widest opacity-80 mb-1">
                EST.
              </span>
              <span className="font-serif text-xl font-black leading-none">
                25
              </span>
            </div>

            {/* 底部装饰线 */}
            <div className="w-[1px] h-12 bg-white/30"></div>
          </div>

          {/* Part B & C: 右侧内容区 (上下堆叠) */}
          <div className="flex flex-col bg-white relative">
            {/* 纹理背景 */}
            <div className="absolute inset-0 bg-[url('/images/bg/noise.png')] opacity-10 pointer-events-none mix-blend-multiply z-0"></div>

            {/* B: 上半部分 - 核心视觉 (心技体) */}
            {/* py-8 px-8: 增加留白 */}
            <div className="relative z-10 px-8 pt-8 pb-4">
              <h1 className="flex items-center gap-5 font-serif text-sumo-text leading-none select-none">
                <div className="flex flex-col items-center gap-1 group/text cursor-default">
                  <span className="text-5xl font-black tracking-tighter group-hover/text:text-sumo-red transition-colors duration-300">
                    心
                  </span>
                </div>

                <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>

                <div className="flex flex-col items-center gap-1 group/text cursor-default">
                  <span className="text-5xl font-black tracking-tighter group-hover/text:text-sumo-red transition-colors duration-300">
                    技
                  </span>
                </div>

                <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>

                <div className="flex flex-col items-center gap-1 group/text cursor-default">
                  <span className="text-5xl font-black tracking-tighter group-hover/text:text-sumo-red transition-colors duration-300">
                    体
                  </span>
                </div>
              </h1>
            </div>

            {/* 分割线 */}
            <div className="w-full h-[1px] bg-gray-100 px-8 box-content opacity-50"></div>

            {/* C: 下半部分 - 理念文案 (放在下面，颜色低调) */}
            <div className="relative z-10 px-8 py-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-1 bg-sumo-red rounded-full"></div>
                <span className="text-[8px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                  Philosophy
                </span>
              </div>
              <p className="font-serif text-base font-bold text-sumo-text tracking-widest leading-none mb-1">
                伝統と未来の融合
              </p>
              <p className="font-sans text-[9px] text-gray-400 font-medium tracking-wider">
                Bridging Tradition & Future
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 底部横幅层 */}
      <div className="absolute bottom-0 w-full z-30">
        <RabbitBanner />
      </div>
    </section>
  );
};

export default Hero;
