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
        <div className="absolute bottom-0 w-full h-[20vh] bg-gradient-to-t from-sumo-bg via-sumo-bg/50 to-transparent" />
      </div>

      {/* 2. 核心内容层 */}
      {/* - 手机版: top-24 left-4 (左侧悬浮)
         - 电脑版: md:top-20 md:left-20 (保持原样)
      */}
      <div className="absolute z-10 reveal-up top-24 left-4 md:top-32 md:left-32">
        {/* --- 容器设计 --- */}
        {/* - w-[200px]: 手机版宽度锁定在 200px (精致矩形)
           - md:w-auto: 电脑版自动宽度
           - md:max-w-[380px]: 电脑版最大宽度
        */}
        <div className="relative bg-white shadow-[0_20px_40px_rgba(0,0,0,0.25)] flex flex-row group overflow-hidden rounded-sm w-[200px] md:w-auto md:max-w-[380px]">
          {/* 装饰：顶部悬浮红线 (Hover动效) */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-sumo-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-30"></div>

          {/* Part A: 极简红色侧边条 (Slim Accent) */}
          {/* 手机版只是一条细红线，电脑版是宽红块 */}
          <div className="w-1.5 md:w-16 bg-sumo-red text-white flex flex-col justify-center items-center relative z-10 shrink-0 transition-all duration-300">
            {/* 电脑版内容 (手机版隐藏) */}
            <div className="hidden md:flex flex-col items-center py-6 h-full justify-between">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold tracking-widest opacity-80 mb-1">
                  20<br />26
                </span>
                <span className="text-[10px] font-bold tracking-widest opacity-80 mb-1 pt-1">
                  年<br />作<br />成
                </span>
              </div>
              <div className="w-[1px] h-12 bg-white/30"></div>
            </div>
          </div>

          {/* Part B: 内容区 */}
          <div className="flex flex-col bg-white relative w-full">
            {/* 纹理背景 */}
            <div className="absolute inset-0 bg-[url('/images/bg/noise.png')] opacity-10 pointer-events-none mix-blend-multiply z-0"></div>

            {/* B1: 顶部信息 (手机版特供) */}
            <div className="md:hidden px-4 pt-3 flex justify-between items-center opacity-60 relative z-10">
              <span className="text-[8px] font-bold tracking-widest uppercase">
                2026年作成
              </span>
              <span className="text-[8px] font-mono tracking-widest">JPN</span>
            </div>

            {/* B2: 核心视觉 (心技体) - 横向排列 */}
            <div className="relative z-10 px-4 py-2 md:px-8 md:pt-8 md:pb-4">
              <h1 className="flex items-center justify-between md:justify-start md:gap-5 font-serif text-sumo-text leading-none select-none">
                <span className="text-3xl md:text-5xl font-black tracking-tighter group-hover:text-sumo-red transition-colors duration-300">
                  心
                </span>

                {/* 装饰点 */}
                <span className="w-1 h-1 bg-gray-200 rounded-full md:w-1.5 md:h-1.5"></span>

                <span className="text-3xl md:text-5xl font-black tracking-tighter group-hover:text-sumo-red transition-colors duration-300">
                  技
                </span>

                <span className="w-1 h-1 bg-gray-200 rounded-full md:w-1.5 md:h-1.5"></span>

                <span className="text-3xl md:text-5xl font-black tracking-tighter group-hover:text-sumo-red transition-colors duration-300">
                  体
                </span>
              </h1>
            </div>

            {/* 分割线 */}
            <div className="w-full px-4 md:px-8 box-content opacity-50 relative z-10">
              <div className="w-full h-[1px] bg-gray-100 hidden md:block"></div>
              {/* 手机版虚线 */}
              <div className="w-full h-[1px] border-t border-dashed border-gray-200 md:hidden"></div>
            </div>

            {/* B3: 底部信息区 */}
            <div className="relative z-10 px-4 py-3 md:px-8 md:py-5">
              {/* 电脑版文案 */}
              <div className="hidden md:block">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-1 bg-sumo-red rounded-full"></div>
                  <span className="text-[8px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                    Philosophy
                  </span>
                </div>
                <p className="font-serif text-base font-bold text-sumo-text tracking-widest leading-none mb-1">
                  伝統を未来へ
                </p>
                <p className="font-sans text-[9px] text-gray-400 font-medium tracking-wider">
                  Bridging Tradition & Future
                </p>
              </div>

              {/* 手机版特供：极简数据行 (Smart Money Style) */}
              <div className="md:hidden flex justify-between items-end">
                <div>
                  <p className="font-serif text-[10px] font-bold text-sumo-text tracking-widest leading-none mb-1">
                    伝統を未来へ
                  </p>
                  <p className="font-sans text-[7px] text-gray-400 tracking-wider">
                    Tradition & Future
                  </p>
                </div>

                {/* 呼吸灯状态 */}
                <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-[2px] border border-gray-100">
                  <div className="relative flex h-1 w-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1 w-1 bg-green-500"></span>
                  </div>
                  <span className="text-[6px] font-mono text-gray-400 tracking-tighter">
                    LIVE
                  </span>
                </div>
              </div>
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
