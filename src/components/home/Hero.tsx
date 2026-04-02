"use client";

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import RabbitBanner from "@/components/home/RabbitBanner/RabbitBannerDynamic";
import type { SponsorItem, BannerDisplayMode } from "@/components/home/RabbitBanner";

type HeroProps = {
  sponsors?: SponsorItem[];
  /** 旗子显示模式：全部 / 仅俱乐部 / 仅赞助商 / 混合（由后台「旗子显示设置」控制） */
  displayMode?: BannerDisplayMode;
  /** 使用视频背景时传入 MP4（可选，与 videoWebmSrc 二选一或同时提供） */
  videoSrc?: string;
  /** WebM 视频，体积通常更小；可只提供 WebM，现代浏览器均支持 */
  videoWebmSrc?: string;
  /** 竖屏/手机端 WebM 视频（9:16），不传则竖屏沿用 videoWebmSrc */
  videoWebmSrcMobile?: string;
  /** 竖屏/手机端 MP4（可选） */
  videoSrcMobile?: string;
  /** 视频封面图（建议从视频截一帧），用于首屏 LCP，使用视频时必填 */
  posterSrc?: string;
  /** 竖屏/手机端封面图（可选），不传则竖屏沿用 posterSrc */
  posterSrcMobile?: string;
};

/** 视口为竖屏或宽高比 ≤1（手机/窄屏）时为 true，用于选择竖屏视频 */
function useIsPortraitOrNarrow() {
  const [portrait, setPortrait] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-aspect-ratio: 1/1)");
    const update = () => setPortrait(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return portrait;
}

/** 视口横向 < 370px 时为窄屏（卡片两行） */
function useNarrowCard() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 369px)");
    const update = () => setNarrow(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return narrow;
}

/** 顶部心技体卡片，视频/图片两种模式共用 */
function HeroContent() {
  const narrow = useNarrowCard();
  return (
    <div
      className={`relative flex flex-row items-stretch rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.1)] ${
        narrow ? "min-h-[80px]" : "h-[80px] md:h-[90px]"
      }`}
    >
      <div className="absolute inset-0 bg-white/90 backdrop-blur-[60px] backdrop-saturate-[1.5]" />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
      <div className="bg-sumo-red text-white w-[60px] md:w-[80px] flex flex-col justify-center items-center shrink-0 relative overflow-hidden z-10 self-stretch min-h-full">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
        <span className="text-[10px] md:text-xs font-bold leading-none opacity-90 font-serif">20</span>
        <span className="text-2xl md:text-3xl font-black tracking-tighter leading-none my-0.5 font-serif">26</span>
        <div className="flex flex-col items-center border-t border-white/30 pt-1 mt-1 w-8">
          <span className="text-[10px] md:text-xs font-bold leading-none">年</span>
          <span className="text-[8px] md:text-[9px] tracking-widest opacity-90 mt-0.5 transform scale-90">始動</span>
        </div>
      </div>
      <div className="flex-grow flex flex-col justify-center px-5 md:px-8 relative min-w-0">
        <div
          className={`relative z-10 flex justify-between gap-2 ${
            narrow ? "flex-col items-start gap-2" : "flex-row items-center gap-0"
          }`}
        >
          <div className="flex items-center gap-3 md:gap-6">
            <h1 className="flex items-center gap-2 md:gap-4 font-serif text-sumo-text leading-none select-none">
              <span className="text-3xl md:text-4xl font-black tracking-tighter text-sumo-red">心</span>
              <span className="w-px h-3 bg-gray-400/50 rotate-12"></span>
              <span className="text-3xl md:text-4xl font-black tracking-tighter text-sumo-red">技</span>
              <span className="w-px h-3 bg-gray-400/50 rotate-12"></span>
              <span className="text-3xl md:text-4xl font-black tracking-tighter text-sumo-red">体</span>
            </h1>
          </div>
          <div
            className={`flex flex-col items-end border-gray-400/30 min-w-0 flex-shrink ${
              narrow ? "border-l-0 pl-0 ml-0 self-end" : "border-l pl-4 md:pl-8 ml-2"
            }`}
          >
            <p
              className="font-serif font-bold text-sumo-text tracking-widest leading-none mb-1 text-right whitespace-nowrap"
              style={{ fontSize: "clamp(0.875rem, 4.2vw, 1.25rem)" }}
            >
              伝統を未来へ
            </p>
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

/** 与 Tailwind `md:` 一致：视口宽度 < 768px 时使用 HAKUHO_SIDE_MOBILE */
const HAKUHO_SIDE_BREAKPOINT_PX = 768;

function useIsHakuhoMobileLayout() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${HAKUHO_SIDE_BREAKPOINT_PX - 1}px)`);
    const update = () => setMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return mobile;
}

type HakuhoSideLayout = {
  maxWidthPx: number;
  maxHeightPx: number;
  padLeftPx: number;
  padRightPx: number;
  nudgeLeft: { x: number; y: number };
  nudgeRight: { x: number; y: number };
  verticalAlign: "center" | "start" | "end";
};

/**
 * 左右白鹏装饰（桌面 ≥768px）
 *
 * 比例参考底部悬赏旗（`RabbitWalkingBanner` 旗面约 180×260×scale）；当前数值为你本机配置。
 *
 * 手动调整：
 * - maxWidthPx / maxHeightPx：显示上限（object-contain，A4 竖图在框内等比缩放）
 * - padLeftPx / padRightPx：离左/右屏幕边缘
 * - nudgeLeft / nudgeRight：半区内平移（x 右为正、y 下为正）
 * - verticalAlign：'center' | 'start' | 'end'
 */
const HAKUHO_SIDE_DESKTOP: HakuhoSideLayout = {
  maxWidthPx: Math.round(180 * 1.2),
  maxHeightPx: Math.round(260 * 1.2),
  padLeftPx: 8,
  padRightPx: 8,
  nudgeLeft: { x: 300, y: -265 },
  nudgeRight: { x: -300, y: -265 },
  verticalAlign: "center",
};

/**
 * 左右白鹏装饰（移动端，视口宽度小于 768px）——与桌面完全独立，可单独改比例与位置。
 * 默认与桌面相同；按需改小 max* 或调整 nudge / padding。
 */
const HAKUHO_SIDE_MOBILE: HakuhoSideLayout = {
  maxWidthPx: Math.round(180 * 0.55),
  maxHeightPx: Math.round(260 * 0.55),
  padLeftPx: 8,
  padRightPx: 8,
  nudgeLeft: { x: 250, y: -150 },
  nudgeRight: { x: -250, y: -150 },
  verticalAlign: "center",
};

type HakuhoSideId = "left" | "right";

/** 手机端侧图：长按放大倍数（translate 到视口中心 + scale，仍单张 img） */
const HAKUHO_LONG_PRESS_MS = 280;
const HAKUHO_PINCH_SCALE = 2;
/** 长按放大时锚点相对视口几何中心再往上（px，4 的倍数） */
const HAKUHO_ZOOM_ANCHOR_UP_PX = 64;
/** 侧图顶边与「心技体」卡片底边的间距（px） */
const HAKUHO_CARD_CLEARANCE_PX = 16;

type HeroHakuhoSidePanelsProps = {
  /** 包裹 HeroContent 的外壳，用于手机端计算侧图与卡片的避让 */
  heroCardShellRef: React.RefObject<HTMLDivElement | null>;
};

function HeroHakuhoSidePanels({ heroCardShellRef }: HeroHakuhoSidePanelsProps) {
  const isMobileLayout = useIsHakuhoMobileLayout();
  const [zoomSide, setZoomSide] = useState<HakuhoSideId | null>(null);
  const [zoomPan, setZoomPan] = useState<{ x: number; y: number } | null>(null);
  const [cardAvoidYOffset, setCardAvoidYOffset] = useState(0);
  const leftImgRef = useRef<HTMLImageElement | null>(null);
  const rightImgRef = useRef<HTMLImageElement | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTargetSideRef = useRef<HakuhoSideId | null>(null);
  const { maxWidthPx, maxHeightPx, padLeftPx, padRightPx, nudgeLeft, nudgeRight, verticalAlign } =
    isMobileLayout ? HAKUHO_SIDE_MOBILE : HAKUHO_SIDE_DESKTOP;

  const itemsAlign =
    verticalAlign === "start" ? "items-start" : verticalAlign === "end" ? "items-end" : "items-center";

  const imgBaseStyle: React.CSSProperties = {
    width: "auto",
    height: "auto",
    maxWidth: maxWidthPx,
    maxHeight: maxHeightPx,
    objectFit: "contain",
    filter:
      "drop-shadow(0 4px 14px rgba(0,0,0,0.12)) drop-shadow(0 12px 36px rgba(0,0,0,0.18))",
  };

  const measureCardOverlapAvoidance = useCallback(() => {
    if (!isMobileLayout) {
      setCardAvoidYOffset(0);
      return;
    }
    const shell = heroCardShellRef.current;
    const imgEl = leftImgRef.current;
    if (!shell || !imgEl) return;
    const card = shell.getBoundingClientRect();
    const img = imgEl.getBoundingClientRect();
    const needDown = Math.round(card.bottom + HAKUHO_CARD_CLEARANCE_PX - img.top);
    setCardAvoidYOffset(Math.max(0, needDown));
  }, [isMobileLayout, heroCardShellRef]);

  useLayoutEffect(() => {
    if (!isMobileLayout) {
      setCardAvoidYOffset(0);
      return;
    }
    measureCardOverlapAvoidance();
    const shell = heroCardShellRef.current;
    const imgEl = leftImgRef.current;
    const roShell = shell ? new ResizeObserver(measureCardOverlapAvoidance) : null;
    const roImg = imgEl ? new ResizeObserver(measureCardOverlapAvoidance) : null;
    if (shell) roShell?.observe(shell);
    if (imgEl) roImg?.observe(imgEl);
    const onWin = () => measureCardOverlapAvoidance();
    window.addEventListener("resize", onWin);
    window.addEventListener("orientationchange", onWin);
    return () => {
      roShell?.disconnect();
      roImg?.disconnect();
      window.removeEventListener("resize", onWin);
      window.removeEventListener("orientationchange", onWin);
    };
  }, [isMobileLayout, measureCardOverlapAvoidance]);

  const mobileNudgeY = isMobileLayout ? cardAvoidYOffset : 0;

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current != null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressTargetSideRef.current = null;
  };

  const onSidePointerDown = (side: HakuhoSideId) => (e: React.PointerEvent<HTMLImageElement>) => {
    if (!isMobileLayout) return;
    if (longPressTimerRef.current != null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressTargetSideRef.current = side;
    longPressTimerRef.current = setTimeout(() => {
      longPressTimerRef.current = null;
      if (longPressTargetSideRef.current !== side) return;
      const el = side === "left" ? leftImgRef.current : rightImgRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const vx = window.innerWidth / 2;
      const vy = window.innerHeight / 2 - HAKUHO_ZOOM_ANCHOR_UP_PX;
      setZoomPan({
        x: Math.round(vx - cx),
        y: Math.round(vy - cy),
      });
      setZoomSide(side);
    }, HAKUHO_LONG_PRESS_MS);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onSidePointerUpEnd = (e: React.PointerEvent<HTMLImageElement>) => {
    clearLongPressTimer();
    setZoomSide(null);
    setZoomPan(null);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const mobileImgStyle = (side: HakuhoSideId): React.CSSProperties | undefined => {
    if (!isMobileLayout) return undefined;
    const zoomed = zoomSide === side;
    const panX = zoomed && zoomPan ? zoomPan.x : 0;
    const panY = zoomed && zoomPan ? zoomPan.y : 0;
    return {
      pointerEvents: "auto",
      touchAction: "manipulation",
      transform: zoomed
        ? `translate(${panX}px, ${panY}px) scale(${HAKUHO_PINCH_SCALE})`
        : "translate(0px, 0px) scale(1)",
      transformOrigin: "center center",
      transition: zoomed
        ? "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)"
        : "transform 360ms cubic-bezier(0.34, 1.18, 0.64, 1)",
    };
  };

  return (
    <>
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 flex w-1/2 ${itemsAlign} justify-start ${
          zoomSide === "left" ? "z-50" : "z-20"
        }`}
        style={{ paddingLeft: padLeftPx }}
        aria-hidden
      >
        <div
          style={{
            transform: `translate(${nudgeLeft.x}px, ${nudgeLeft.y + mobileNudgeY}px)`,
          }}
        >
          <img
            ref={leftImgRef}
            src="/images/hero/hakuho1.webp"
            alt=""
            draggable={false}
            className="select-none object-left rounded-sm"
            style={{ ...imgBaseStyle, ...mobileImgStyle("left") }}
            onLoad={isMobileLayout ? measureCardOverlapAvoidance : undefined}
            onPointerDown={isMobileLayout ? onSidePointerDown("left") : undefined}
            onPointerUp={isMobileLayout ? onSidePointerUpEnd : undefined}
            onPointerCancel={isMobileLayout ? onSidePointerUpEnd : undefined}
            onContextMenu={isMobileLayout ? (ev) => ev.preventDefault() : undefined}
          />
        </div>
      </div>
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 flex w-1/2 ${itemsAlign} justify-end ${
          zoomSide === "right" ? "z-50" : "z-20"
        }`}
        style={{ paddingRight: padRightPx }}
        aria-hidden
      >
        <div
          style={{
            transform: `translate(${nudgeRight.x}px, ${nudgeRight.y + mobileNudgeY}px)`,
          }}
        >
          <img
            ref={rightImgRef}
            src="/images/hero/hakuho2.webp"
            alt=""
            draggable={false}
            className="select-none object-right rounded-sm"
            style={{ ...imgBaseStyle, ...mobileImgStyle("right") }}
            onLoad={isMobileLayout ? measureCardOverlapAvoidance : undefined}
            onPointerDown={isMobileLayout ? onSidePointerDown("right") : undefined}
            onPointerUp={isMobileLayout ? onSidePointerUpEnd : undefined}
            onPointerCancel={isMobileLayout ? onSidePointerUpEnd : undefined}
            onContextMenu={isMobileLayout ? (ev) => ev.preventDefault() : undefined}
          />
        </div>
      </div>
    </>
  );
}

const Hero = ({
  sponsors,
  displayMode,
  videoSrc,
  videoWebmSrc,
  videoWebmSrcMobile,
  videoSrcMobile,
  posterSrc,
  posterSrcMobile,
}: HeroProps) => {
  const hasAnyVideo = Boolean(videoSrc || videoWebmSrc || videoWebmSrcMobile || videoSrcMobile);
  const hasAnyPoster = Boolean(posterSrc || posterSrcMobile);
  const useVideo = hasAnyPoster && hasAnyVideo;
  const isMobileView = useIsPortraitOrNarrow();
  const [canLoadVideo, setCanLoadVideo] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroCardShellRef = useRef<HTMLDivElement>(null);

  const effectiveWebm = isMobileView && videoWebmSrcMobile ? videoWebmSrcMobile : videoWebmSrc;
  const effectiveMp4 = isMobileView && videoSrcMobile ? videoSrcMobile : videoSrc;
  const effectivePoster = (isMobileView ? (posterSrcMobile ?? posterSrc) : (posterSrc ?? posterSrcMobile)) ?? "";

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

  // ========== 视频背景模式：横屏用 16:9，竖屏用 9:16 ==========
  if (useVideo) {
    return (
      <section className="relative w-full h-screen overflow-hidden bg-sumo-bg shadow-[0_4px_30px_-12px_rgba(0,0,0,0.15)]">
        {/* 背景层：poster 立即显示 → 视频加载后淡入；视频用 min-w/min-h + 居中确保填满无黑边 */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={effectivePoster}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
              videoPlaying ? "opacity-0" : "opacity-100"
            }`}
            aria-hidden
            fetchPriority="high"
          />
          {canLoadVideo && (effectiveWebm || effectiveMp4) && (
            <video
              key={isMobileView ? "mobile" : "desktop"}
              ref={videoRef}
              className="absolute top-1/2 left-1/2 block min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 scale-[1.02] object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={effectivePoster}
              preload="metadata"
              onPlaying={onVideoPlaying}
              aria-hidden
            >
              {effectiveWebm && <source src={effectiveWebm} type="video/webm" />}
              {effectiveMp4 && <source src={effectiveMp4} type="video/mp4" />}
            </video>
          )}
        </div>
        <HeroHakuhoSidePanels heroCardShellRef={heroCardShellRef} />
        <div
          ref={heroCardShellRef}
          className="absolute z-30 reveal-up top-32 left-1/2 -translate-x-1/2 w-[92vw] max-w-[600px]"
        >
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
    <section className="relative w-full h-screen overflow-hidden bg-sumo-bg shadow-[0_4px_30px_-12px_rgba(0,0,0,0.15)]">
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

      <HeroHakuhoSidePanels heroCardShellRef={heroCardShellRef} />

      <div
        ref={heroCardShellRef}
        className="absolute z-30 reveal-up top-32 left-1/2 -translate-x-1/2 w-[92vw] max-w-[600px]"
      >
        <HeroContent />
      </div>
      <div className="absolute bottom-0 w-full z-30">
        <RabbitBanner sponsors={sponsors} displayMode={displayMode} />
      </div>
    </section>
  );
};

export default Hero;