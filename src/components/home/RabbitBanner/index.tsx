"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import RabbitActor from "./RabbitActor";
import {
  RABBIT_VARIANTS,
  RAW_SPONSORS,
  RABBIT_PROBABILITY_POOL,
} from "./config";

// 赞助商数据类型
export type SponsorItem = {
  id: string | number;
  image: string;
  alt: string;
  link?: string | null;
  category?: "club" | "sponsor"; // 类别（用于混合模式排序）
};

// 显示模式
export type BannerDisplayMode = "all" | "club" | "sponsor" | "mixed";

interface RabbitWalkingBannerProps {
  scale?: number;
  containerHeight?: string;
  sponsors?: SponsorItem[]; // 动态传入的赞助商数据
  displayMode?: BannerDisplayMode; // 显示模式（默认混合模式）
}

// 最小赞助商数量（确保能填满屏幕）
const MIN_SPONSOR_COUNT = 8;

function isInternalNavHref(href: string) {
  const t = href.trim();
  return t.startsWith("/") && !t.startsWith("//");
}

function SponsorFlagLink({
  href,
  ariaLabel,
  className,
  children,
  onPointerEnter,
  onPointerLeave,
}: {
  href: string;
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
  onPointerEnter?: React.PointerEventHandler<HTMLElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLElement>;
}) {
  const t = href.trim();
  if (isInternalNavHref(t)) {
    return (
      <Link
        href={t}
        className={className}
        aria-label={ariaLabel}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        {children}
      </Link>
    );
  }
  return (
    <a
      href={t}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </a>
  );
}

export default function RabbitWalkingBanner({
  scale = 1,
  containerHeight = "500px",
  sponsors,
  displayMode = "mixed", // 默认混合模式
}: RabbitWalkingBannerProps = {}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 处理赞助商数据：智能填充 + 模式处理
  const { baseSponsors, cycleCount } = useMemo(() => {
    // 使用传入的 sponsors，否则使用默认数据
    const isUsingFallback = !sponsors || sponsors.length === 0;
    let originalSponsors: SponsorItem[] = isUsingFallback ? RAW_SPONSORS : sponsors;

    // 根据 displayMode 筛选和排序
    if (displayMode === "club") {
      // 只显示俱乐部
      originalSponsors = originalSponsors.filter(s => s.category === "club" || !s.category);
    } else if (displayMode === "sponsor") {
      // 只显示赞助商
      originalSponsors = originalSponsors.filter(s => s.category === "sponsor");
    } else if (displayMode === "mixed") {
      // 混合模式：先全部俱乐部，再全部赞助商
      const clubs = originalSponsors.filter(s => s.category === "club" || !s.category);
      const sponsorsList = originalSponsors.filter(s => s.category === "sponsor");
      originalSponsors = [...clubs, ...sponsorsList];
    } else if (displayMode === "all") {
      // すべて表示：穿插（club → sponsor → club → sponsor …）
      const clubs = originalSponsors.filter(s => s.category === "club" || !s.category);
      const sponsorsList = originalSponsors.filter(s => s.category === "sponsor");
      const interleaved: SponsorItem[] = [];
      const maxLen = Math.max(clubs.length, sponsorsList.length);
      for (let i = 0; i < maxLen; i++) {
        if (i < clubs.length) interleaved.push(clubs[i]);
        if (i < sponsorsList.length) interleaved.push(sponsorsList[i]);
      }
      originalSponsors = interleaved;
    }

    // 若筛选后为空且当前用的是默认数据（RAW_SPONSORS 无 category，在 sponsor 模式下会被筛光），则退化为显示默认列表，避免兔子 banner 不显示
    if (originalSponsors.length === 0 && isUsingFallback) {
      originalSponsors = RAW_SPONSORS;
    }
    if (originalSponsors.length === 0) {
      return { baseSponsors: [], cycleCount: 0 };
    }

    // 智能填充：确保至少有 MIN_SPONSOR_COUNT 个
    let filled = [...originalSponsors];
    // 💡 优化：如果赞助商数量非常多，不要全部渲染，限制最大显示数量以减轻 GPU 负担
    const MAX_VISIBLE_SPONSORS = isMobile ? 12 : 20;
    const truncatedSponsors = originalSponsors.slice(0, MAX_VISIBLE_SPONSORS);
    
    while (filled.length < MIN_SPONSOR_COUNT && truncatedSponsors.length > 0) {
      filled = [...filled, ...truncatedSponsors];
    }
    // 截取到合理数量（避免过多）
    filled = filled.slice(0, Math.max(MIN_SPONSOR_COUNT, truncatedSponsors.length));

    return {
      baseSponsors: filled,
      cycleCount: filled.length,
    };
  }, [sponsors, displayMode, isMobile]);

  // 生成循环数据 - 移动端减少数量以提高性能
  const loopData = useMemo(() => {
    if (baseSponsors.length === 0) return [];
    // 移动端：2次循环，桌面端：3次循环（减少数量提高性能）
    if (isMobile) {
      return [...baseSponsors, ...baseSponsors];
    }
    return [...baseSponsors, ...baseSponsors, ...baseSponsors];
  }, [isMobile, baseSponsors]);

  const UNIT_WIDTH = 320 * scale;
  const GAP = (isMobile ? -110 : -50) * scale;
  // 移动端降低速度以减少 CPU 负担
  const SPEED_PX_PER_SEC = (isMobile ? 35 : 50) * scale;
  // 动画周期 = 基础数量 × 单位宽度（确保无缝循环）
  // 💡 取整：Safari 对亚像素值的舍入与 Chrome 不同，不取整会导致循环接缝处出现可见跳帧
  const ONE_CYCLE_DISTANCE = Math.round((UNIT_WIDTH + GAP) * cycleCount);
  const DURATION = cycleCount > 0 ? ONE_CYCLE_DISTANCE / SPEED_PX_PER_SEC : 0;

  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const marqueeAnimRef = useRef<Animation | null>(null);
  const flagResumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 用 Web Animations API 驱动横向滚动，避免 CSS animation-play-state: paused
  // 与 keyframes 里 translateX(var(--x)) 在部分浏览器下暂停时跳到错误位置的问题。
  useEffect(() => {
    const el = marqueeTrackRef.current;
    if (!el || DURATION <= 0) return;

    marqueeAnimRef.current?.cancel();
    const anim = el.animate(
      [
        { transform: "translateX(0)" },
        { transform: `translateX(-${ONE_CYCLE_DISTANCE}px)` },
      ],
      {
        duration: DURATION * 1000,
        iterations: Infinity,
        easing: "linear",
      }
    );
    marqueeAnimRef.current = anim;
    return () => {
      anim.cancel();
      marqueeAnimRef.current = null;
    };
  }, [ONE_CYCLE_DISTANCE, DURATION]);

  useEffect(() => {
    return () => {
      if (flagResumeTimerRef.current) {
        clearTimeout(flagResumeTimerRef.current);
        flagResumeTimerRef.current = null;
      }
    };
  }, []);

  // 仅在桌面端、指针落在可点击旗帜链上时暂停；短延迟恢复，避免相邻旗面间移动时闪一下继续滚。
  const onFlagPointerEnter = useCallback(() => {
    if (isMobile) return;
    if (flagResumeTimerRef.current) {
      clearTimeout(flagResumeTimerRef.current);
      flagResumeTimerRef.current = null;
    }
    marqueeAnimRef.current?.pause();
  }, [isMobile]);

  const onFlagPointerLeave = useCallback(() => {
    if (isMobile) return;
    if (flagResumeTimerRef.current) clearTimeout(flagResumeTimerRef.current);
    flagResumeTimerRef.current = setTimeout(() => {
      marqueeAnimRef.current?.play();
      flagResumeTimerRef.current = null;
    }, 80);
  }, [isMobile]);

  // 如果没有赞助商，显示空状态
  if (baseSponsors.length === 0) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        .rabbit-marquee-track {
          width: max-content;
          /* 💡 will-change 已经能提升为独立合成层，不需要 translate3d / perspective 等 3D 技巧 */
          will-change: transform;
          /* 💡 Safari 抗闪烁 */
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `}</style>

      <div
        className="relative w-full overflow-hidden select-none"
        style={{
          height: containerHeight,
          zIndex: 30,
          /* ⚠️ 已移除 contain 和 contentVisibility：
             Safari 可能因 contain 触发意外重排，导致 CSS 动画被重置。
             这个横向滚动区域本身就在 overflow:hidden 容器内，
             浏览器已经自动做了必要的渲染裁剪。 */
        }}
      >
        <div
          ref={marqueeTrackRef}
          className="rabbit-marquee-track flex absolute bottom-0 left-0 items-end"
        >
          {loopData.map((item, idx) => {
            // 使用 cycleCount 而不是 RAW_SPONSORS.length 来计算索引
            const dataIndex = idx % cycleCount;
            const poolIndex = dataIndex % RABBIT_PROBABILITY_POOL.length;
            const variantIndex = RABBIT_PROBABILITY_POOL[poolIndex];
            const variant = RABBIT_VARIANTS[variantIndex] || RABBIT_VARIANTS[0];

            const { bottom, left, scale: flagScale = 0.8, size, tassel } = variant.flagStyle;

            const UNIFORM_FLAG_WIDTH = 180;
            const flagW = UNIFORM_FLAG_WIDTH * scale;
            const flagH = (size?.height ?? 240) * scale;
            const barW = flagW + 24 * scale;
            const tasselW = (flagW - 4 * scale);
            const tasselH = (tassel?.height ?? 45) * scale;

            const adjustedBottom = parseFloat(bottom) * scale;
            const adjustedLeft = parseFloat(left) * scale;
            const adjustedFlagScale = flagScale * scale;

            const baseTransform = variant.bodyStyle?.transform || "";
            // ⚠️ 已移除 translateZ(0)，避免在 Safari 中触发不必要的 3D 合成层
            const finalBodyTransform = `${baseTransform} scale(${scale})`;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { transform: _ignored, ...restBodyStyle } = variant.bodyStyle || {};

            const flagHref = item.link?.trim();
            const flagLinkLabel = item.alt || "スポンサー";

            return (
              <div
                key={`${item.id}-${idx}`}
                className="relative flex justify-center pointer-events-none"
                style={{
                  width: UNIT_WIDTH,
                  height: UNIT_WIDTH,
                  marginRight: GAP,
                  // 💡 Safari z-index 终极修复：在每个项目容器内建立局部 3D 空间。
                  // 原理：Safari 的 WebGL canvas 会自动提升到 GPU 合成层，
                  // 普通 DOM 的 z-index 无法与之竞争。
                  // 解法：用 preserve-3d 创建局部 3D 空间，
                  // 然后用 translateZ 在物理层面把旗帜推到 canvas 前面。
                  // ⚠️ 注意：preserve-3d 只在每个小容器内部，不在滚动容器上，
                  //    所以不会出现之前的"旗帜跟不上滚动"的问题。
                  transformStyle: "preserve-3d",
                  WebkitTransformStyle: "preserve-3d",
                }}
              >
                {/* --- Rabbit Body (Z=0, 在后面) --- */}
                <div
                  className="absolute inset-0"
                  style={{
                    transformOrigin: "center bottom",
                    ...restBodyStyle,
                    // translateZ(0) 把身体固定在 Z=0 平面
                    transform: `${finalBodyTransform} translateZ(0px)`,
                  }}
                >
                  {/* 移动端降低动画速率以减少 GPU 负担 */}
                  <RabbitActor rivSrc={variant.rivSrc} playbackRate={isMobile ? 0.4 : 0.6} />
                </div>

                {/* --- Flag + Hand (Z=2px, 在前面) --- */}
                {/* 💡 translateZ(2px) 把旗帜推到身体前方 2px。
                   在 preserve-3d 中，Z 值大 = 离观察者更近 = 视觉上在前面。
                   没有设 perspective，所以不会产生透视变形，纯粹用于控制层级。 */}
                <div
                  className="absolute inset-0"
                  style={{
                    transform: "translateZ(2px)",
                  }}
                >
                  <div
                    className="absolute w-full flex justify-center"
                    style={{
                      bottom: `${adjustedBottom}px`,
                      left: `${adjustedLeft}px`,
                    }}
                  >
                    <div
                      className="origin-bottom"
                      style={{ transform: `scale(${adjustedFlagScale})` }}
                    >
                      {flagHref ? (
                        <SponsorFlagLink
                          href={flagHref}
                          ariaLabel={flagLinkLabel}
                          className="relative flex flex-col items-center group pointer-events-auto cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-sumo-brand focus-visible:ring-offset-2 rounded-sm"
                          onPointerEnter={onFlagPointerEnter}
                          onPointerLeave={onFlagPointerLeave}
                        >
                          {/* 1. Bar */}
                          <div
                            className={`bg-gradient-to-r from-[#D4AF37] via-[#F4C430] to-[#D4AF37] rounded-full relative z-30 border border-[#B8860B] ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}
                            style={{
                              width: `${barW}px`,
                              height: `${8 * scale}px`,
                            }}
                          />

                          {/* 2. Flag Face */}
                          <div
                            className={`relative z-20 bg-[#FDFBF7] flex items-center justify-center overflow-hidden border-x border-black/5 ${isMobile ? 'shadow-lg' : 'shadow-2xl'}`}
                            style={{
                              width: `${flagW}px`,
                              height: `${flagH}px`,
                              marginTop: `${-6 * scale}px`,
                            }}
                          >
                            <div
                              className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/20 to-transparent z-30 pointer-events-none"
                              style={{ height: `${6 * scale}px` }}
                            />
                            <img
                              src={item.image}
                              alt=""
                              loading="lazy"
                              className="relative z-10 shadow-sm rounded-sm w-[85%] h-auto object-contain pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-black/5 mix-blend-multiply z-20 pointer-events-none" />
                          </div>

                          {/* 3. Tassel */}
                          <div
                            className="relative z-10"
                            style={{
                              width: `${tasselW}px`,
                              height: `${tasselH}px`,
                              marginTop: `${-8 * scale}px`,
                            }}
                          >
                            <div
                              className="w-full h-full pointer-events-none"
                              style={{
                                background: "linear-gradient(to bottom, #B8860B, #FFD700, #B8860B)",
                                maskImage: "repeating-linear-gradient(90deg, black, black 3px, transparent 3px, transparent 4px)",
                                WebkitMaskImage: "repeating-linear-gradient(90deg, black, black 3px, transparent 3px, transparent 4px)",
                                clipPath: "polygon(0 0, 100% 0, 98% 100%, 2% 100%)",
                              }}
                            />
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                boxShadow: "inset 0 4px 6px rgba(0,0,0,0.3)",
                                clipPath: "polygon(0 0, 100% 0, 98% 100%, 2% 100%)",
                              }}
                            />
                          </div>
                        </SponsorFlagLink>
                      ) : (
                        <div className="relative flex flex-col items-center group">
                          <div
                            className={`bg-gradient-to-r from-[#D4AF37] via-[#F4C430] to-[#D4AF37] rounded-full relative z-30 border border-[#B8860B] ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}
                            style={{
                              width: `${barW}px`,
                              height: `${8 * scale}px`,
                            }}
                          />

                          <div
                            className={`relative z-20 bg-[#FDFBF7] flex items-center justify-center overflow-hidden border-x border-black/5 ${isMobile ? 'shadow-lg' : 'shadow-2xl'}`}
                            style={{
                              width: `${flagW}px`,
                              height: `${flagH}px`,
                              marginTop: `${-6 * scale}px`,
                            }}
                          >
                            <div
                              className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/20 to-transparent z-30 pointer-events-none"
                              style={{ height: `${6 * scale}px` }}
                            />
                            <img
                              src={item.image}
                              alt={item.alt}
                              loading="lazy"
                              className="relative z-10 shadow-sm rounded-sm w-[85%] h-auto object-contain"
                            />
                            <div className="absolute inset-0 bg-black/5 mix-blend-multiply z-20 pointer-events-none" />
                          </div>

                          <div
                            className="relative z-10"
                            style={{
                              width: `${tasselW}px`,
                              height: `${tasselH}px`,
                              marginTop: `${-8 * scale}px`,
                            }}
                          >
                            <div
                              className="w-full h-full"
                              style={{
                                background: "linear-gradient(to bottom, #B8860B, #FFD700, #B8860B)",
                                maskImage: "repeating-linear-gradient(90deg, black, black 3px, transparent 3px, transparent 4px)",
                                WebkitMaskImage: "repeating-linear-gradient(90deg, black, black 3px, transparent 3px, transparent 4px)",
                                clipPath: "polygon(0 0, 100% 0, 98% 100%, 2% 100%)",
                              }}
                            />
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                boxShadow: "inset 0 4px 6px rgba(0,0,0,0.3)",
                                clipPath: "polygon(0 0, 100% 0, 98% 100%, 2% 100%)",
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hand（装飾のためクリックは旗エリアへ透過） */}
                  <div
                    className="absolute inset-0 z-20 pointer-events-none"
                    style={{
                      ...variant.handStyle,
                      transform: variant.handStyle?.transform
                        ? `${variant.handStyle.transform} scale(${scale})`
                        : `scale(${scale})`,
                      transformOrigin: "center bottom",
                    }}
                  >
                    <img
                      src={variant.hand}
                      alt="Hand"
                      loading="lazy"
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}