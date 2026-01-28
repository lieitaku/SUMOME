"use client";

import React, { useMemo, useState, useEffect } from "react";
import RabbitActor from "./RabbitActor";
import {
  RABBIT_VARIANTS,
  RAW_SPONSORS,
  RABBIT_PROBABILITY_POOL,
} from "./config";

interface RabbitWalkingBannerProps {
  scale?: number;
  containerHeight?: string;
}

export default function RabbitWalkingBanner({
  scale = 1,
  containerHeight = "500px",
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

  // 生成循环数据 (48个)
  const loopData = useMemo(() => {
    return [...RAW_SPONSORS, ...RAW_SPONSORS, ...RAW_SPONSORS, ...RAW_SPONSORS];
  }, []);

  const UNIT_WIDTH = 320 * scale;
  const GAP = (isMobile ? -110 : -50) * scale;
  const SPEED_PX_PER_SEC = 50 * scale;
  const ONE_CYCLE_DISTANCE = (UNIT_WIDTH + GAP) * RAW_SPONSORS.length;
  const DURATION = ONE_CYCLE_DISTANCE / SPEED_PX_PER_SEC;

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
            const dataIndex = idx % RAW_SPONSORS.length;
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
                  }}
                >
                  <RabbitActor rivSrc={variant.rivSrc} playbackRate={0.6} />
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

                        {/* 1. Bar */}
                        <div
                          className="bg-gradient-to-r from-[#D4AF37] via-[#F4C430] to-[#D4AF37] rounded-full relative z-30 shadow-lg border border-[#B8860B]"
                          style={{
                            width: `${barW}px`,
                            height: `${8 * scale}px`,
                          }}
                        ></div>

                        {/* 2. Flag Face */}
                        <div
                          className="relative z-20 shadow-2xl bg-[#FDFBF7] flex items-center justify-center overflow-hidden border-x border-black/5"
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