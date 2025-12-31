"use client";

import React from "react";
import WaveDivider from "@/components/home/WaveDivider";
import Button from "@/components/ui/Button"; // 1. 引入封装的高级按钮

/**
 * CTA (Call to Action) Component
 * ------------------------------------------------------------------
 * 首页底部的行动号召区域。
 * 视觉上使用深色背景 + 金色按钮，引导用户进入“俱乐部搜索”页面。
 * ------------------------------------------------------------------
 */
const CTA = () => {
  return (
    <section className="py-32 md:py-40 bg-sumo-dark text-white relative overflow-hidden">
      {/* 1. 顶部波浪 (过渡上一板块) */}
      <div className="absolute top-0 left-0 w-full leading-[0]">
        <WaveDivider fill="fill-sumo-bg" isRotated={false} />
      </div>

      {/* 2. 背景装饰层 */}
      {/* 和纸纹理：建议后期改为本地图片 /images/patterns/washi.png */}
      <div className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/washi.png')] opacity-80 mix-blend-overlay pointer-events-none"></div>

      {/* 氛围光：右侧红色光晕 */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sumo-red rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      {/* 3. 核心内容层 */}
      <div className="container mx-auto px-6 text-center relative z-10 reveal-up">
        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-12 tracking-wide leading-tight">
          未来の横綱を
          <br />
          ここから
        </h2>

        {/* 4. 使用封装好的 Button 组件 */}
        {/* variant="gold" 对应金色 VIP 风格，withShine 开启扫光特效 */}
        <Button
          href="/clubs"
          variant="gold"
          withShine
          className="px-12 py-5 text-lg font-bold tracking-[0.2em] shadow-[0_0_30px_rgba(195,155,79,0.4)]"
        >
          クラブを探す
        </Button>
      </div>

      {/* 5. 底部波浪 (过渡到 Footer) */}
      {/* 使用 absolute bottom-0 确保紧贴底部 */}
      <div className="absolute bottom-0 left-0 w-full leading-[0]">
        {/* 注意：如果 Footer 是深色，这里 fill 应该改为 fill-footer-bg，或者保持 fill-sumo-bg 并使用 isRotated={true} 制造缺口 */}
        {/* 假设 Footer 背景是默认的 sumo-bg (浅色)，则这里保持 fill-sumo-bg 是对的 */}
        <WaveDivider fill="fill-sumo-bg" isRotated={true} />
      </div>
    </section>
  );
};

export default CTA;
