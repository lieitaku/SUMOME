"use client";

import React from "react";
import Image from "next/image";
import RabbitBanner from "@/components/home/RabbitBanner";
import { cn } from "@/lib/utils";

const Hero = () => {
  return (
    <section className="relative w-full h-screen flex flex-col items-center overflow-hidden bg-sumo-bg">
      {/* 1. 背景层 (Background Layer) */}
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

      {/* 2. 核心内容层 */}
      <div className="relative z-10 w-full h-full container mx-auto px-6 flex flex-col justify-center pb-40 reveal-up">
        {/* --- 高级感排版容器 --- */}
        <div className="relative group max-w-2xl">
          {/* 左上角标签：始创年份 */}
          <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-16 h-16 md:w-20 md:h-20 bg-sumo-red z-20 flex flex-col items-center justify-center text-white shadow-lg">
            <span className="font-sans font-bold text-[10px] md:text-xs tracking-widest opacity-80">
              EST.
            </span>
            <span className="font-serif font-black text-lg md:text-2xl leading-none mt-0.5">
              25
            </span>
          </div>

          {/* 白色卡片容器 */}
          <div className="relative bg-[#ffffff] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.2)] overflow-hidden">
            {/* 背景噪点纹理 */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.05]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            ></div>

            {/* 极细的装饰线 */}
            <div className="absolute top-0 left-8 md:left-12 w-[1px] h-full bg-gray-200 z-0" />

            {/* 右上角装饰：星取表 (Win/Loss Record) */}
            <div className="absolute top-6 right-6 md:top-8 md:right-8 flex flex-col items-end opacity-30">
              <div className="flex gap-1.5 mb-1">
                {/* 模拟相扑战绩：白星(胜)与黑星(负) */}
                {/* 这是一个固定的数组，不会导致 hydration mismatch 报错 */}
                {["win", "win", "loss", "win", "win", "loss"].map(
                  (status, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full border border-black",
                        status === "loss" ? "bg-black" : "bg-transparent", // loss=黑星(实心), win=白星(空心)
                      )}
                    />
                  ),
                )}
              </div>
              <span className="text-[8px] font-mono tracking-widest text-black">
                RECORD NO. 25-01
              </span>
            </div>

            <div className="relative z-10 flex flex-col gap-8">
              {/* Top Label */}
              <div className="flex items-center gap-4">
                <span className="h-[1px] w-8 bg-sumo-text"></span>
                <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase text-sumo-text/60 font-sans">
                  The Philosophy
                </span>
              </div>

              {/* Main Title: 心技体 */}
              <h1 className="flex items-center gap-4 md:gap-8 font-serif text-sumo-text leading-none select-none">
                <span className="text-6xl md:text-8xl font-black tracking-tighter">
                  心
                </span>
                {/* 几何圆点 */}
                <span className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-sumo-red opacity-80"></span>
                <span className="text-6xl md:text-8xl font-black tracking-tighter">
                  技
                </span>
                <span className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-sumo-red opacity-80"></span>
                <span className="text-6xl md:text-8xl font-black tracking-tighter">
                  体
                </span>
              </h1>

              {/* Description */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-gray-200">
                {/* 左侧 */}
                <p className="font-serif text-lg md:text-xl font-bold text-sumo-text tracking-widest">
                  伝統を、
                  <br className="md:hidden" />
                  未来へ繋ぐ。
                </p>

                {/* 右侧 */}
                <div className="text-right">
                  <p className="font-sans text-[10px] md:text-xs font-medium text-gray-400 tracking-[0.2em] uppercase leading-relaxed">
                    Spirit • Technique • Body
                    <br />
                    The Essence of Sumo
                  </p>
                </div>
              </div>
            </div>

            {/* 背景水印 */}
            <div className="absolute -left-5 -bottom-8 text-[8rem] font-serif font-black text-gray-900 opacity-[0.05] select-none pointer-events-none leading-none z-0">
              SUMOME
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
