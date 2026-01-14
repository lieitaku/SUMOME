"use client";

import React from "react";
import RabbitActor from "./RabbitActor";
import { RABBIT_VARIANTS, RAW_SPONSORS } from "./config";

/**
 * ==============================================================================
 * 🎬 主组件: RabbitWalkingBanner
 * ==============================================================================
 */
export default function RabbitWalkingBanner() {
  // --- 1. 数据处理：确保数据足够长以支持无缝循环 ---
  // 复制 3 份：1份展示，1份用于无缝衔接，1份缓冲
  let loopData = [...RAW_SPONSORS, ...RAW_SPONSORS, ...RAW_SPONSORS];

  // 安全检查：如果赞助商特别少，再多复制一份防止宽屏空白
  if (RAW_SPONSORS.length < 5) {
    loopData = [...loopData, ...RAW_SPONSORS, ...RAW_SPONSORS];
  }

  // --- 2. 物理参数配置 ---
  const UNIT_WIDTH = 320; // 每一组（兔子+旗帜）的宽度
  const GAP = 0; // 间距
  const SPEED_PX_PER_SEC = 50; // 移动速度：每秒 50px (走路速度)

  // 核心计算：一次完整循环的总距离
  const ONE_CYCLE_DISTANCE = (UNIT_WIDTH + GAP) * RAW_SPONSORS.length;

  // 核心计算：跑完一圈需要多少秒
  const DURATION = ONE_CYCLE_DISTANCE / SPEED_PX_PER_SEC;

  return (
    <>
      {/* --- CSS-in-JS: 动态关键帧动画 --- */}
      {/* 必须在这里写，因为 keyframes 依赖 JS 计算出的变量 */}
      <style jsx>{`
        @keyframes scrollRabbit {
          0% {
            transform: translateX(0);
          }
          100% {
            /* 移动到这里时，刚好第一组数据走完，无缝切换回 0 */
            transform: translateX(var(--scroll-dist));
          }
        }

        .animate-scroll {
          animation: scrollRabbit var(--scroll-duration) linear infinite;
          width: max-content; /* 宽度由内容撑开 */
          will-change: transform; /* 性能优化：告诉浏览器即将发生变换 */
        }

        /* 鼠标悬停时暂停，方便用户看清赞助商 */
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* --- Banner 容器 --- */}
      <div
        className="relative w-full overflow-hidden h-[500px] pointer-events-none z-20"
        aria-hidden="true"
      >
        <div
          className="flex absolute bottom-0 left-0 animate-scroll items-end"
          // 注入动态计算出的 CSS 变量
          style={
            {
              "--scroll-dist": `-${ONE_CYCLE_DISTANCE}px`,
              "--scroll-duration": `${DURATION}s`,
            } as React.CSSProperties
          }
        >
          {loopData.map((item, idx) => {
            // 智能分配：根据索引循环使用 4 种兔子变体
            const safeIndex =
              (idx % RAW_SPONSORS.length) % RABBIT_VARIANTS.length;
            const variant = RABBIT_VARIANTS[safeIndex];
            const { bottom, left, scale = 0.75 } = variant.flagStyle;

            return (
              <div
                key={`${item.id}-${idx}`}
                className="relative flex justify-center"
                style={{
                  width: UNIT_WIDTH,
                  height: UNIT_WIDTH,
                  marginRight: GAP,
                }}
              >
                {/* Layer 1: 兔子本体 (Z-Index: 0) */}
                <div className="absolute inset-0 z-0">
                  <RabbitActor frames={variant.frames} fps={2} />
                </div>

                {/* Layer 2: 旗帜 + 手 (Z-Index: 10) */}
                <div className="absolute inset-0 z-10">
                  {/* 旗帜定位容器 */}
                  <div
                    className="absolute w-full flex justify-center transition-all"
                    style={{ bottom, left }}
                  >
                    {/* 缩放容器 */}
                    <div
                      className="origin-bottom"
                      style={{ transform: `scale(${scale})` }}
                    >
                      {/* === 🚩 旗帜设计 Start === */}
                      <div className="relative flex flex-col items-center">
                        {/* 金色横杆 */}
                        <div className="w-[180px] h-[8px] bg-gradient-to-r from-[#D4AF37] via-[#F4C430] to-[#D4AF37] rounded-full relative z-20 shadow-lg border border-[#B8860B]"></div>

                        {/* 旗面主体 */}
                        <div
                          className={`relative w-[170px] h-[280px] -mt-[6px] z-10 flex flex-col items-center justify-center shadow-2xl border-x border-black/10 ${item.color}`}
                        >
                          {/* 顶部阴影 */}
                          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/30 to-transparent z-10"></div>

                          {/* 内部白纸区域 */}
                          <div className="relative z-20 bg-[#FDFBF7] w-[150px] h-[250px] flex items-center justify-center shadow-inner">
                            {/* 竖排文字 */}
                            <span className="block writing-vertical text-center font-serif font-black text-slate-900 text-4xl tracking-[0.2em] h-full mx-auto py-6 leading-none opacity-90">
                              {item.name}
                            </span>
                          </div>
                        </div>

                        {/* 底部流苏/装饰 */}
                        <div className="w-[160px] h-[50px] bg-gradient-to-b from-transparent to-black/5 relative">
                          <div
                            className="w-full h-full"
                            style={{
                              backgroundImage:
                                "repeating-linear-gradient(90deg, #D4AF37, #F4C430 4px, transparent 4px, transparent 8px)",
                            }}
                          ></div>
                        </div>
                      </div>
                      {/* === 🚩 旗帜设计 End === */}
                    </div>
                  </div>

                  {/* Layer 3: 手部遮挡 (Z-Index: 20) */}
                  <div className="absolute inset-0 z-20">
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
