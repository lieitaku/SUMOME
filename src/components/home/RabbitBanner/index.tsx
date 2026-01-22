"use client";

import React, { useMemo } from "react";
import RabbitActor from "./RabbitActor";
import {
  RABBIT_VARIANTS,
  RAW_SPONSORS,
  RABBIT_PROBABILITY_POOL,
} from "./config";

interface RabbitWalkingBannerProps {
  scale?: number; // 整体缩放比例，默认为 1（原始尺寸）
  containerHeight?: string; // 容器高度，默认为 "500px"
}

export default function RabbitWalkingBanner({
  scale = 1,
  containerHeight = "500px",
}: RabbitWalkingBannerProps = {}) {
  // --- 1. 数据准备 (使用 4 组以增加离屏缓冲) ---
  // 使用 useMemo 确保数据引用稳定，不会触发 React 重渲染
  const loopData = useMemo(() => {
    return [...RAW_SPONSORS, ...RAW_SPONSORS, ...RAW_SPONSORS, ...RAW_SPONSORS];
  }, []);

  // --- 2. 物理参数 (根据 scale 调整) ---
  const UNIT_WIDTH = 320 * scale;
  const GAP = -50 * scale;
  const SPEED_PX_PER_SEC = 50 * scale;

  // 计算滚动参数
  // 💡 核心修改：我们只滚动 1 组的距离，但我们有 4 组数据支撑
  const ONE_CYCLE_DISTANCE = (UNIT_WIDTH + GAP) * RAW_SPONSORS.length;
  const DURATION = ONE_CYCLE_DISTANCE / SPEED_PX_PER_SEC;

  return (
    <>
      <style jsx>{`
        @keyframes scrollRabbit {
          0% {
            /* 从第 0 组开始 */
            transform: translate3d(0, 0, 0);
          }
          100% {
            /* 滚到第 1 组结束的位置 */
            /* 使用 translate3d 强制开启 GPU 加速 */
            transform: translate3d(var(--scroll-dist), 0, 0);
          }
        }
        .animate-scroll {
          animation: scrollRabbit var(--scroll-duration) linear infinite;
          width: max-content;
          /* 告诉浏览器这个属性会变，请提前准备 */
          will-change: transform;
          /* 确保子元素在 3D 空间中，减少重绘 */
          transform-style: preserve-3d;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* --- Banner 主容器 --- */}
      <div
        className="relative w-full overflow-visible pointer-events-none"
        aria-hidden="true"
        style={{
          height: containerHeight,
          zIndex: 30, // 提高层级，确保显示在其他元素上方
          // 强制这一块区域不参与浏览器的"内容可见性"优化
          // 强迫浏览器渲染离屏内容
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
            // 🛠️ 确保每一轮的兔子长得一模一样
            const dataIndex = idx % RAW_SPONSORS.length;
            const poolIndex = dataIndex % RABBIT_PROBABILITY_POOL.length;
            const variantIndex = RABBIT_PROBABILITY_POOL[poolIndex];

            // 安全获取配置
            const variant = RABBIT_VARIANTS[variantIndex] || RABBIT_VARIANTS[0];

            const { bottom, left, scale: flagScale = 0.8, size, tassel } = variant.flagStyle;
            const flagW = (size?.width ?? 170) * scale;
            const flagH = (size?.height ?? 240) * scale;
            const barW = flagW + 24 * scale;
            const tasselW = (tassel?.width ?? (size?.width ?? 170) - 1) * scale;
            const tasselH = (tassel?.height ?? 30) * scale;

            // 调整位置以适应缩放
            const adjustedBottom = parseFloat(bottom) * scale;
            const adjustedLeft = parseFloat(left) * scale;
            const adjustedFlagScale = flagScale * scale;

            return (
              <div
                key={`${item.id}-${idx}`} // Key 保持稳定
                className="relative flex justify-center"
                style={{
                  width: UNIT_WIDTH,
                  height: UNIT_WIDTH,
                  marginRight: GAP,
                  // 强制每一个单元都在 GPU 层
                  transform: "translateZ(0)",
                }}
              >
                {/* Rabbit Body */}
                <div
                  className="absolute inset-0 z-0"
                  style={{
                    ...variant.bodyStyle,
                    transform: variant.bodyStyle?.transform
                      ? `${variant.bodyStyle.transform} scale(${scale})`
                      : `scale(${scale})`,
                    transformOrigin: "center bottom",
                  }}
                >
                  <RabbitActor rivSrc={variant.rivSrc} />
                </div>

                {/* Flag + Hand */}
                <div className="absolute inset-0 z-10">
                  <div
                    className="absolute w-full flex justify-center transition-all"
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
                        {/* Bar */}
                        <div
                          className="bg-gradient-to-r from-[#D4AF37] via-[#F4C430] to-[#D4AF37] rounded-full relative z-20 shadow-lg border border-[#B8860B]"
                          style={{
                            width: `${barW}px`,
                            height: `${8 * scale}px`,
                          }}
                        ></div>

                        {/* Flag Face */}
                        <div
                          className="relative z-10 shadow-2xl bg-[#FDFBF7] flex items-center justify-center overflow-hidden border-x border-black/5"
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
                            className="relative z-10 shadow-sm rounded-sm w-[85%] h-auto object-contain"
                          />
                          <div className="absolute inset-0 bg-black/5 mix-blend-multiply z-20 pointer-events-none"></div>
                        </div>

                        {/* Tassel */}
                        <div
                          className="bg-gradient-to-b from-transparent to-black/5 relative z-10 -mt-[1px]"
                          style={{ width: `${tasselW}px`, height: `${tasselH}px` }}
                        >
                          <div
                            className="w-full h-full"
                            style={{
                              backgroundImage:
                                "repeating-linear-gradient(90deg, #D4AF37, #F4C430 2px, transparent 2px, transparent 4px)",
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
