"use client";

import React from "react";
import Link from "@/components/ui/TransitionLink";
import { ArrowRight } from "lucide-react";

const Introduction = () => {
  return (
    // 1. 调整主容器：移动端竖向，PC端横向（标题在左，正文在右），整体作为一个元素居中
    <div className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-24 w-full lg:w-fit mx-auto">
      
      {/* 2. 标题区域：PC端竖排，字号放大，放在左侧 */}
      <div className="w-full lg:w-auto flex justify-start reveal-up">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight lg:leading-normal tracking-wide text-sumo-text font-serif vertical-title">
          相撲の<span className="text-sumo-red">熱</span>を、
          <br />
          世界へ<span className="text-sumo-brand">届</span>ける。
        </h2>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 1024px) {
          .vertical-title {
            writing-mode: vertical-rl;
            text-orientation: upright;
            height: 480px; /* 限制高度，让文字自然排版 */
          }
        }
      `}} />

      {/* 3. 正文与链接区域：保持横排，PC端靠右，限制合适宽度 */}
      <div className="w-full lg:w-[500px] flex flex-col items-start reveal-up delay-100">
        <div className="text-sumo-text/80 text-base leading-loose tracking-wide font-medium space-y-4 mb-1">
          SUMOMEは、国技「相撲」の魅力をテクノロジーの力で最大化する次世代プラットフォームです。<br />
          地域に根付くクラブと相撲を愛するすべての人を繋ぎ、未来の土俵を守るために、
          私たちは伝統と革新の架け橋となります。
        </div>
        
        {/* 链接 */}
        <Link
          href="/about"
          className="group inline-flex items-center gap-2 mt-3 text-sumo-brand border-b border-sumo-brand pb-1 hover:text-sumo-dark hover:border-sumo-dark transition-all md:mt-10"
        >
          <span className="text-sm font-bold tracking-widest">
            詳細を見る
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
