"use client";

import React, { useMemo, useState, useEffect } from "react";
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
    let originalSponsors: SponsorItem[] = sponsors && sponsors.length > 0
      ? sponsors
      : RAW_SPONSORS;

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
      const sponsors = originalSponsors.filter(s => s.category === "sponsor");
      originalSponsors = [...clubs, ...sponsors];
    }
    // displayMode === "all" 时保持原顺序

    // 如果没有赞助商，返回空
    if (originalSponsors.length === 0) {
      return { baseSponsors: [], cycleCount: 0 };
    }

    // 智能填充：确保至少有 MIN_SPONSOR_COUNT 个
    let filled = [...originalSponsors];
    while (filled.length < MIN_SPONSOR_COUNT && originalSponsors.length > 0) {
      filled = [...filled, ...originalSponsors];
    }
    // 截取到合理数量（避免过多）
    filled = filled.slice(0, Math.max(MIN_SPONSOR_COUNT, originalSponsors.length));

    return {
      baseSponsors: filled,
      cycleCount: filled.length,
    };
  }, [sponsors, displayMode]);

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
  const ONE_CYCLE_DISTANCE = (UNIT_WIDTH + GAP) * cycleCount;
  const DURATION = cycleCount > 0 ? ONE_CYCLE_DISTANCE / SPEED_PX_PER_SEC : 0;

  // 如果没有赞助商，显示空状态
  if (baseSponsors.length === 0) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        @keyframes scrollRabbit {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(var(--scroll-dist), 0, 0); }
        }
        .animate-scroll {
          animation: scrollRabbit var(--scroll-duration) linear infinite;
          width: max-content;
          /* 💡 核心 CSS 优化：告诉浏览器这是一个独立的合成层 */
          will-change: transform;
          /* 💡 修复 iOS 闪烁 */
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          perspective: 1000px;
          transform-style: preserve-3d;
        }
        /* 移动端不建议 hover 暂停，因为滚动惯性可能导致卡住 */
        @media (min-width: 768px) {
            .animate-scroll:hover {
                animation-play-state: paused;
            }
        }
      `}</style>

      <div
        className="relative w-full overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
        style={{
          height: containerHeight,
          zIndex: 30,
          // 💡 优化：content-visibility 帮助浏览器跳过屏幕外渲染计算
          contentVisibility: "auto",
          containIntrinsicSize: `${5000 * scale}px`,
        }}
      >
        <div
          className="flex absolute bottom-0 left-0 animate-scroll items-end"
          style={
            {
              "--scroll-dist": `-${ONE_CYCLE_DISTANCE}px`,
              "--scroll-duration": `${DURATION}s`,
            } as React.CSSProperties
          }
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
            const finalBodyTransform = `${baseTransform} scale(${scale}) translateZ(0)`;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { transform: _ignored, ...restBodyStyle } = variant.bodyStyle || {};

            return (
              <div
                key={`${item.id}-${idx}`}
                className="relative flex justify-center"
                style={{
                  width: UNIT_WIDTH,
                  height: UNIT_WIDTH,
                  marginRight: GAP,
                  // 💡 优化：移除不必要的 transformStyle 传递，减少层级复杂度
                  // transformStyle: "preserve-3d", 
                }}
              >
                {/* --- Rabbit Body (z-index: 0) --- */}
                <div
                  className="absolute inset-0"
                  style={{
                    zIndex: 0,
                    transformOrigin: "center bottom",
                    ...restBodyStyle,
                    transform: finalBodyTransform,
                    // 移动端优化：使用 contain 隔离渲染
                    contain: "layout style paint",
                  }}
                >
                  {/* 移动端降低动画速率以减少 GPU 负担 */}
                  <RabbitActor rivSrc={variant.rivSrc} playbackRate={isMobile ? 0.4 : 0.6} />
                </div>

                {/* --- Flag + Hand (z-index: 20) --- */}
                {/* 💡 优化：将静态图片部分标记为 isolate，避免与 Rive 画布发生重绘干扰 
                   但 transform: translateZ(1px) 必须保留以确保层级覆盖
                */}
                <div
                  className="absolute inset-0"
                  style={{
                    zIndex: 20,
                    transform: "translateZ(1px)"
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
                      <div className="relative flex flex-col items-center group">

                        {/* 1. Bar - 移动端简化阴影 */}
                        <div
                          className={`bg-gradient-to-r from-[#D4AF37] via-[#F4C430] to-[#D4AF37] rounded-full relative z-30 border border-[#B8860B] ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}
                          style={{
                            width: `${barW}px`,
                            height: `${8 * scale}px`,
                          }}
                        ></div>

                        {/* 2. Flag Face - 移动端简化阴影 */}
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
                          ></div>
                          <img
                            src={item.image}
                            alt={item.alt}
                            loading="lazy"
                            className="relative z-10 shadow-sm rounded-sm w-[85%] h-auto object-contain"
                          />
                          <div className="absolute inset-0 bg-black/5 mix-blend-multiply z-20 pointer-events-none"></div>
                        </div>

                        {/* 3. Tassel */}
                        <div
                          className="relative z-10"
                          style={{
                            width: `${tasselW}px`,
                            height: `${tasselH}px`,
                            marginTop: `${-8 * scale}px`
                          }}
                        >
                          <div
                            className="w-full h-full"
                            style={{
                              background: "linear-gradient(to bottom, #B8860B, #FFD700, #B8860B)",
                              maskImage: "repeating-linear-gradient(90deg, black, black 3px, transparent 3px, transparent 4px)",
                              WebkitMaskImage: "repeating-linear-gradient(90deg, black, black 3px, transparent 3px, transparent 4px)",
                              clipPath: "polygon(0 0, 100% 0, 98% 100%, 2% 100%)"
                            }}
                          ></div>
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              boxShadow: "inset 0 4px 6px rgba(0,0,0,0.3)",
                              clipPath: "polygon(0 0, 100% 0, 98% 100%, 2% 100%)"
                            }}
                          ></div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Hand */}
                  <div
                    className="absolute inset-0 z-20"
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