// src/components/common/PageHero.tsx
"use client";

import React from "react";
import Link from "@/components/ui/TransitionLink";

type PageHeroProps = {
  title: string; // 显示的标题 (如: 北海道)
  enTitle?: string; // 背景水印用的罗马字 (如: HOKKAIDO)
  subtitle?: string; // 副标题
  backLink?: {
    href: string;
    label: string;
  };
};

const PageHero = ({
  title,
  enTitle,
  subtitle,
  backLink = { href: "/", label: "TOPに戻る" },
}: PageHeroProps) => {
  return (
    <section className="relative pt-40 pb-32 px-6 overflow-hidden bg-vivid-sky text-sumo-dark">
      {/* 1. 背景纹理 */}
      <div
        className="absolute inset-0 opacity-15 mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: `url('/images/bg/washi.png')` }}
      ></div>

      {/* 2. 氛围装饰 (蓝天下的光晕 - 稍微减淡一点，以免影响蓝色的纯度) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-[120px] opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

      {/* 3. 背景大字水印 (使用 enTitle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[13vw] font-sans font-black text-sumo-brand opacity-[0.07] select-none whitespace-nowrap pointer-events-none tracking-tighter">
        {/* 如果传了 enTitle 就用，没传就用 title 兜底 */}
        {(enTitle || title).toUpperCase()}
      </div>

      {/* 4. 内容区域 */}
      <div className="container mx-auto text-center relative z-10 reveal-up">
        <Link
          href={backLink.href}
          className="inline-block mb-6 text-gray-500 hover:text-sumo-brand text-xs tracking-widest border-b border-gray-300 pb-1 transition-colors font-bold"
        >
          ← {backLink.label}
        </Link>

        <p className="text-sumo-gold text-xs font-bold tracking-[0.3em] mb-6 uppercase flex items-center justify-center gap-4">
          <span className="w-8 h-[2px] bg-sumo-gold"></span>
          Area Information
          <span className="w-8 h-[2px] bg-sumo-gold"></span>
        </p>

        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-wide mb-6 text-sumo-dark drop-shadow-sm">
          {title}
        </h1>

        {subtitle && (
          <p className="text-gray-600 font-serif tracking-widest text-sm font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default PageHero;
