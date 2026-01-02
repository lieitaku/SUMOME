"use client";

import React from "react";
import Image from "next/image";
import RabbitBanner from "@/components/home/RabbitBanner";

const Hero = () => {
  return (
    <section className="relative w-full h-screen flex flex-col items-center overflow-hidden">
      {/* 1. 背景层 (Background Layer) */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none bg-sumo-bg">
        <div className="absolute inset-0">
          <Image
            src="/images/bg/hero-bg-1.jpg"
            alt="Hero Background"
            fill
            priority
            className="object-cover object-top opacity-100"
          />
          {/* 极淡的暗角，仅为了聚光 */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]"></div>
        </div>
      </div>

      {/* 2. 核心内容层 (Magazine Masthead Style) */}
      {/* ✨ 修改 1：去掉了 container mx-auto px-6，改为 w-full，让内容可以贴边 */}
      <div className="relative z-10 h-[75vh] w-full flex flex-col justify-center reveal-up">
        {/* --- 玻璃质感横向通栏 (腰封风格) --- */}
        {/* ✨ 修改 2：
            - rounded-r-sm: 只有右边有圆角，左边是直角
            - pl-6 md:pl-24: 左侧内边距加大，保证文字不会紧贴屏幕边缘，视觉上舒服
            - pr-12: 右侧留出空间给水印
        */}
        <div className="relative bg-white/90 backdrop-blur-md shadow-2xl border-l-[12px] border-sumo-red py-8 px-6 md:pl-16 md:pr-16 md:py-10 max-w-fit mr-auto rounded-r-sm">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-20">
            {/* 主标题：心技体 */}
            {/* ✨ 修改 3：字体从 8xl 调小到 7xl，保持精致感 */}
            <h1 className="text-5xl md:text-7xl font-bold leading-none tracking-widest text-sumo-dark whitespace-nowrap drop-shadow-sm font-serif">
              心<span className="text-sumo-red mx-1 md:mx-2">・</span>技
              <span className="text-sumo-red mx-1 md:mx-2">・</span>体
            </h1>

            {/* 副标题组 */}
            <div className="flex flex-col gap-2 pb-1 md:pb-2">
              <p className="text-sumo-gold text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">
                The Spirit of Sumo
              </p>
              <p className="text-gray-600 text-xs md:text-sm font-medium tracking-[0.2em] border-t border-gray-300 pt-2 mt-1">
                日本伝統文化を、次世代へ。
              </p>
            </div>
          </div>

          {/* ✨ 修改 4：修复被遮挡的 SUMOME 水印 
              - 改为 bottom-0 right-4: 放在右下角，避免和顶部文字打架
              - leading-none: 防止行高导致的裁剪
              - z-0: 确保它在背景层，不会挡住文字
          */}
          <div className="absolute bottom-[-10px] right-2 md:right-4 p-0 opacity-10 pointer-events-none select-none overflow-visible">
            <span className="font-serif text-6xl md:text-8xl text-sumo-gold leading-none whitespace-nowrap">
              SUMOME
            </span>
          </div>
        </div>
      </div>

      {/* 3. 底部横幅层 */}
      <div className="absolute bottom-0 w-full z-1">
        {/* 底部融合渐变 */}
        <div className="absolute bottom-[-1px] w-full h-[300px] bg-gradient-to-t from-sumo-bg via-sumo-bg/90 to-transparent z-10 pointer-events-none"></div>

        <div className="relative z-50">
          <RabbitBanner />
        </div>
      </div>
    </section>
  );
};

export default Hero;
