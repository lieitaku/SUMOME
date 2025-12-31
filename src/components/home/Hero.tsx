"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import RabbitBanner from "@/components/home/RabbitBanner";
import { heroImagesData } from "@/data/mockData";
import { cn } from "@/lib/utils";
import WaveDivider from "@/components/home/WaveDivider";

/**
 * Hero Component
 * ------------------------------------------------------------------
 * 首页首屏组件 (The Face of the Website)
 *
 * 核心功能：
 * 1. 背景轮播：读取 heroImagesData 实现多图淡入淡出切换。
 * 2. 视觉冲击：使用 Ken Burns 风格的混合模式处理背景。
 * 3. 品牌表达：竖排文字 (Writing Vertical) 展示核心标语“心技体”。
 * ------------------------------------------------------------------
 */
const Hero = () => {
  // 当前背景图索引
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // 图片自动轮播逻辑
  useEffect(() => {
    // 设置 5秒 (5000ms) 切换间隔
    const interval = setInterval(() => {
      setCurrentImgIndex((prevIndex) =>
        prevIndex === heroImagesData.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen flex flex-col pt-32 md:pt-24 items-center overflow-hidden">
      {/* 1. 背景层 (Background Layer)
          使用 opacity 控制显隐，避免 DOM 卸载导致的闪烁
      */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none bg-sumo-bg">
        {heroImagesData.map((imgSrc, index) => (
          <div
            key={imgSrc}
            className={cn(
              "absolute inset-0 transition-opacity ease-in-out",
              // duration-4000ms 营造极慢速、沉浸式的呼吸感切换
              "duration-[4000ms]",
              index === currentImgIndex ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={imgSrc}
              alt={`Hero Background ${index + 1}`}
              fill
              // 仅第一张图开启 Priority (LCP 优化)，其余懒加载
              priority={index === 0}
              className="object-cover object-top grayscale opacity-15 mix-blend-multiply"
            />
          </div>
        ))}

        {/* 径向渐变遮罩：营造中心聚焦感 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(252,250,247,0.6)_70%,#fcfaf7_100%)] z-10"></div>
      </div>

      {/* 2. 装饰层 (Decoration Layer) - 旋转土俵圆环 */}
      <div className="absolute top-[-10%] right-[-10%] w-[80vh] h-[80vh] rounded-full border-[1px] border-sumo-gold/30 animate-[spin_60s_linear_infinite] pointer-events-none z-0"></div>

      {/* 3. 核心内容层 (Main Content) */}
      <div className="container mx-auto px-6 relative z-10 h-[80vh] w-full flex items-center reveal-up">
        <div className="grid grid-cols-12 w-full gap-8">
          {/* 左侧：主标题 (竖排) */}
          <div className="col-span-4 flex justify-start pl-4 md:pl-2">
            <div className="writing-vertical">
              <h1 className="text-7xl md:text-8xl font-bold leading-none tracking-widest text-sumo-dark whitespace-nowrap py-40 border-l-4 border-sumo-gold pl-6 drop-shadow-sm">
                心<span className="text-sumo-red my-4">・</span>技
                <span className="text-sumo-red my-4">・</span>体
              </h1>
            </div>
          </div>

          {/* 中间：副标题 (竖排) */}
          <div className="col-span-4 flex justify-center items-start pt-10">
            <div className="writing-vertical flex flex-col gap-6 items-center">
              <p className="text-sumo-gold text-xs font-bold tracking-[0.4em] uppercase whitespace-nowrap">
                The Spirit of Sumo
              </p>
              <p className="text-sumo-dark/80 text-sm font-medium tracking-[0.3em] whitespace-nowrap border-t border-sumo-dark/10 pt-4">
                日本伝統文化を、次世代へ。
              </p>
            </div>
          </div>

          {/* 右侧：留白 (Spacer) */}
          <div className="col-span-4"></div>
        </div>
      </div>

      {/* 4. 悬浮标语 (Floating Text) */}
      <div className="absolute bottom-50 md:bottom-[28rem] right-6 md:right-[15%] z-10 writing-vertical reveal-up delay-200">
        <h2 className="text-base md:text-lg font-medium text-sumo-dark tracking-[0.4em] whitespace-nowrap">
          ここに、極まる<span className="text-sumo-red">。</span>
        </h2>
      </div>

      {/* 5. 底部横幅层 (Bottom Banner Layer) - 包含波浪和跑马灯 */}
      <div className="absolute bottom-0 w-full z-1">
        {/* ✨ 核心修复：融合渐变层 (The Blender)
            作用：在波浪上方制造一层“雾”，把背景图平滑过渡到波浪的颜色。
            注意：from-sumo-bg 必须和 WaveDivider 的 fill 颜色完全一致！
        */}
        <div className="absolute bottom-[-1px] w-full h-[250px] bg-gradient-to-t from-sumo-bg via-sumo-bg/80 to-transparent z-10 pointer-events-none"></div>

        {/* ✨ 波浪组件
            1. fill="fill-sumo-bg": 颜色必须和上面的 gradient from-颜色一致
            2. -mb-[1px]: 负边距，消除屏幕缩放可能产生的 1px 白线缝隙
            3. z-20: 确保波浪盖在渐变层之上，边缘清晰
        */}
        <div className="relative z-20 w-full -mb-[1px]">
          <WaveDivider fill="fill-sumo-bg" isRotated={false} />
        </div>

        {/* 跑马灯组件 (放在波浪之上或融合在底部) 
            注意：RabbitBanner 现在应该看起来是“浮”在波浪上方的
        */}
        {/*<div className="relative z-30 bg-sumo-bg pb-4">
          <RabbitBanner />
        </div>*/}
      </div>
    </section>
  );
};

export default Hero;
