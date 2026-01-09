"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const Introduction = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
      {/* 左侧：视觉重心 (图片) 
          改为：左图右文 (或者保持原样)，这里我根据瑞士风格调整为“图文强对比”
      */}
      <div className="relative w-full lg:w-1/2 h-[400px] lg:h-[500px] reveal-up group">
        {/* 装饰框：极简黑线框，稍微错位 */}
        <div className="absolute top-4 left-4 w-full h-full border-2 border-gray-100 z-0 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"></div>

        {/* 图片容器 */}
        <div className="relative w-full h-full z-10 overflow-hidden bg-gray-100">
          {/* 建议换成一张高清的、有人文感的黑白或低饱和度照片 */}
          <Image
            src="/images/bg/about-intro.jpg"
            alt="About Sumome"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* 右侧：叙事 (文字) */}
      <div className="w-full lg:w-1/2 flex flex-col items-start lg:pl-10 reveal-up delay-100">
        {/* 小标：品牌蓝 */}
        <span className="text-sumo-brand font-sans text-xs font-bold tracking-[0.2em] mb-6 block uppercase">
          About The Project
        </span>

        {/* 大标题：墨色 + 红色强调 */}
        <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-wide text-sumo-text mb-8 font-serif">
          相撲の<span className="text-sumo-red">熱</span>を、
          <br />
          世界へ<span className="text-sumo-brand">届</span>ける。
        </h2>

        {/* 正文：深灰，易读 */}
        <div className="text-sumo-text/80 text-base leading-loose tracking-wide font-medium space-y-6">
          <p>
            SUMOMEは、国技「相撲」の魅力をテクノロジーの力で最大化する次世代プラットフォームです。
          </p>
          <p>
            地域に根付くクラブと相撲を愛するすべての人を繋ぎ、未来の土俵を守り抜くために。
            私たちは、伝統と革新の架け橋となります。
          </p>
        </div>

        {/* 链接：简单的文字链 + 箭头 */}
        <Link
          href="/about"
          className="group inline-flex items-center gap-2 mt-10 text-sumo-brand border-b border-sumo-brand pb-1 hover:text-sumo-dark hover:border-sumo-dark transition-all"
        >
          <span className="text-sm font-bold tracking-widest">
            MORE DETAILS
          </span>
          <ArrowRight
            size={16}
            className="transform group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </div>
  );
};

export default Introduction;
