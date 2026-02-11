"use client";

import React, { useState, useEffect, useRef } from "react";
import RabbitBanner, { type SponsorItem, type BannerDisplayMode } from "@/components/home/RabbitBanner";

type HeroProps = {
  sponsors?: SponsorItem[];
  /** 旗子显示模式：全部 / 仅俱乐部 / 仅赞助商 / 混合（由后台「旗子显示设置」控制） */
  displayMode?: BannerDisplayMode;
  /** 使用视频背景时传入。建议先压缩视频到 2–5MB，并提供 poster 图保证首屏速度 */
  videoSrc?: string;
  /** WebM 可选，体积通常更小，优先使用 */
  videoWebmSrc?: string;
  /** 视频封面图（建议从视频截一帧），用于首屏 LCP，必填 */
  posterSrc?: string;
};

/** 顶部心技体卡片，视频/图片两种模式共用 */
function HeroContent() {
  return (
    <div className="relative flex flex-row items-stretch rounded-2xl overflow-hidden h-[80px] md:h-[90px] shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
      <div className="absolute inset-0 bg-white/90 backdrop-blur-[60px] backdrop-saturate-[1.5]" />
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
  );
}

const Hero = ({ sponsors, displayMode, videoSrc, videoWebmSrc, posterSrc }: HeroProps) => {
  const useVideo = Boolean(videoSrc && posterSrc);
  const [canLoadVideo, setCanLoadVideo] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 延迟加载视频：等页面主资源加载完再请求视频，避免拖慢 LCP
  useEffect(() => {
    if (!useVideo) return;
    const onLoad = () => setCanLoadVideo(true);
    if (typeof document !== "undefined" && document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [useVideo]);

  // 图片模式：4 帧轮播
  useEffect(() => {
    if (useVideo) return;
    const interval = setInterval(() => setFrameIndex((prev) => (prev + 1) % 4), 4000);
    return () => clearInterval(interval);
  }, [useVideo]);

  const onVideoPlaying = () => setVideoPlaying(true);

  // ========== 视频背景模式（16:9 循环） ==========
  if (useVideo) {
    return (
      <section className="relative w-full h-screen overflow-hidden bg-sumo-bg">
        {/* 背景层：poster 立即显示 → 视频加载后淡入 */}
        <div className="absolute inset-0 z-0">
          <img
            src={posterSrc}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              videoPlaying ? "opacity-0" : "opacity-100"
            }`}
            aria-hidden
            fetchPriority="high"
          />
          {canLoadVideo && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={posterSrc}
              preload="metadata"
              onPlaying={onVideoPlaying}
              aria-hidden
            >
              {videoWebmSrc && <source src={videoWebmSrc} type="video/webm" />}
              <source src={videoSrc!} type="video/mp4" />
            </video>
          )}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[15vh] bg-gradient-to-t from-sumo-bg via-sumo-bg/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute z-30 reveal-up top-32 left-1/2 -translate-x-1/2 w-[92vw] max-w-[600px]">
          <HeroContent />
        </div>
        <div className="absolute bottom-0 w-full z-30">
          <RabbitBanner sponsors={sponsors} displayMode={displayMode} />
        </div>
      </section>
    );
  }

  // ========== 原有图片 + 4 帧轮播模式 ==========
  const CHAR_Y = 1300;
  const CHAR_SIZE = 750;
  const WORLD_W = 5440;
  const WORLD_H = 3136;
  const CHAR_X = (WORLD_W - CHAR_SIZE) / 2;

  return (
    <section className="relative w-full h-screen overflow-hidden bg-sumo-bg">
      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <image href="/images/hero/bg.webp" width={WORLD_W} height={WORLD_H} x="0" y="0" />
        <image
          href="/images/hero/l1.webp"
          x={CHAR_X}
          y={CHAR_Y}
          width={CHAR_SIZE}
          height={CHAR_SIZE}
          className={`transition-opacity duration-300 ${frameIndex === 0 ? "opacity-100" : "opacity-0"}`}
        />
        <image
          href="/images/hero/l2.webp"
          x={CHAR_X}
          y={CHAR_Y}
          width={CHAR_SIZE}
          height={CHAR_SIZE}
          className={`transition-opacity duration-300 ${frameIndex === 1 ? "opacity-100" : "opacity-0"}`}
        />
        <image
          href="/images/hero/r1.webp"
          x={CHAR_X}
          y={CHAR_Y}
          width={CHAR_SIZE}
          height={CHAR_SIZE}
          className={`transition-opacity duration-300 ${frameIndex === 2 ? "opacity-100" : "opacity-0"}`}
        />
        <image
          href="/images/hero/r2.webp"
          x={CHAR_X}
          y={CHAR_Y}
          width={CHAR_SIZE}
          height={CHAR_SIZE}
          className={`transition-opacity duration-300 ${frameIndex === 3 ? "opacity-100" : "opacity-0"}`}
        />
      </svg>

      <div className="absolute bottom-0 left-0 w-full h-[15vh] bg-gradient-to-t from-sumo-bg via-sumo-bg/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute z-30 reveal-up top-32 left-1/2 -translate-x-1/2 w-[92vw] max-w-[600px]">
        <HeroContent />
      </div>
      <div className="absolute bottom-0 w-full z-30">
        <RabbitBanner sponsors={sponsors} displayMode={displayMode} />
      </div>
    </section>
  );
};

export default Hero;