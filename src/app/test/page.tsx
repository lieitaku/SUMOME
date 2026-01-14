"use client";
import React, { useState, useEffect } from "react";

/**
 * ==============================================================================
 * 🎨 配置区域
 * ==============================================================================
 */
type RabbitVariant = {
  frames: string[];
  hand: string;
  flagStyle: { bottom: string; left: string; scale?: number };
};

const RABBIT_VARIANTS: RabbitVariant[] = [
  // Type 1
  {
    frames: ["/rabbit/1-1.png", "/rabbit/1-2.png", "/rabbit/1-3.png"],
    hand: "/rabbit/hand-1.png",
    flagStyle: { bottom: "20px", left: "3px", scale: 0.7 },
  },
  // Type 2
  {
    frames: ["/rabbit/2-1.png", "/rabbit/2-2.png", "/rabbit/2-3.png"],
    hand: "/rabbit/hand-2.png",
    flagStyle: { bottom: "-10px", left: "3px", scale: 0.7 },
  },
  // Type 3
  {
    frames: ["/rabbit/3-1.png", "/rabbit/3-2.png", "/rabbit/3-3.png"],
    hand: "/rabbit/hand-3.png",
    flagStyle: { bottom: "30px", left: "-42px", scale: 0.72 },
  },
  // Type 4
  {
    frames: ["/rabbit/4-1.png", "/rabbit/4-2.png", "/rabbit/4-3.png"],
    hand: "/rabbit/hand-4.png",
    flagStyle: { bottom: "20px", left: "33px", scale: 0.72 },
  },
];

// RabbitActor 组件保持不变
interface RabbitProps {
  frames: string[];
  fps?: number;
}
const InternalRabbitActor: React.FC<RabbitProps> = ({ frames, fps = 8 }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const sequence = [0, 1, 2, 1];
  useEffect(() => {
    setIsLoaded(false);
    let loadedCount = 0;
    frames.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frames.length) setIsLoaded(true);
      };
    });
  }, [frames]);
  useEffect(() => {
    if (!isLoaded) return;
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % sequence.length);
    }, 1000 / fps);
    return () => clearInterval(timer);
  }, [fps, isLoaded]);
  const currentFrameIndex = sequence[stepIndex];
  return (
    <div className="w-full h-full">
      {isLoaded && (
        <img
          src={frames[currentFrameIndex]}
          alt="Rabbit"
          className="w-full h-full object-contain pointer-events-none"
        />
      )}
    </div>
  );
};

// 模拟来自数据库的动态赞助商列表
// 即使这里变成了 20 个、50 个，动画依然稳如泰山
const RAW_SPONSORS = [
  { id: 1, name: "SUMOME", color: "bg-[#1B1C37]" },
  { id: 2, name: "Premium", color: "bg-[#A82429]" },
  { id: 3, name: "Golden", color: "bg-[#C39B4F]" },
  { id: 4, name: "Memory", color: "bg-[#5D3F6A]" },
  { id: 5, name: "Future", color: "bg-[#2F4F4F]" },
  // 你可以在这里加更多测试...
];

/**
 * ==============================================================================
 * 主组件: RabbitWalkingBanner
 * ==============================================================================
 */
export default function RabbitWalkingBanner() {
  // 1. 数据预处理
  // 如果赞助商太少（比如少于5个），我们多复制几份，防止在大屏幕上填不满出现空白
  // 如果赞助商很多，复制 3 份依然是标准做法 (1份展示，1份无缝连接，1份缓冲)
  let loopData = [...RAW_SPONSORS, ...RAW_SPONSORS, ...RAW_SPONSORS];

  // 安全检查：如果数据极少，强制增加复制次数
  if (RAW_SPONSORS.length < 5) {
    loopData = [...loopData, ...RAW_SPONSORS, ...RAW_SPONSORS];
  }

  // 尺寸配置
  const UNIT_WIDTH = 320;
  const GAP = 0;

  // 自动计算逻辑 (Smart Logic)
  // 1. 计算单组数据的总长度 (作为动画循环的一个周期)
  const ONE_CYCLE_DISTANCE = (UNIT_WIDTH + GAP) * RAW_SPONSORS.length;

  // 2. 设定目标速度 (像素/秒)
  // 50px/s 是比较悠闲的走路速度。如果你想快点，改大这个数。
  const SPEED_PX_PER_SEC = 50;

  // 3. 动态计算动画时长
  const DURATION = ONE_CYCLE_DISTANCE / SPEED_PX_PER_SEC;

  return (
    <>
      <style jsx global>{`
        :root {
          /* 传给 CSS: 每次循环移动的精确距离 */
          --scroll-dist: -${ONE_CYCLE_DISTANCE}px;
          /* 传给 CSS: 动态计算出的恒定时间 */
          --scroll-duration: ${DURATION}s;
        }

        @keyframes scrollRabbit {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(var(--scroll-dist));
          }
        }

        .animate-scroll {
          /* 使用动态时间 */
          animation: scrollRabbit var(--scroll-duration) linear infinite;
          width: max-content;
          will-change: transform;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div
        className="relative w-full overflow-hidden h-[500px] pointer-events-none z-20"
        aria-hidden="true"
      >
        <div
          className="flex absolute bottom-0 left-0 animate-scroll items-end"
          // 这里是为了兼容性，再次显式注入 CSS 变量
          style={
            {
              "--scroll-dist": `-${ONE_CYCLE_DISTANCE}px`,
              "--scroll-duration": `${DURATION}s`,
            } as React.CSSProperties
          }
        >
          {loopData.map((item, idx) => {
            // 确保每一轮循环的兔子分配完全一致
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
                {/* Rabbit */}
                <div className="absolute inset-0 z-0">
                  <InternalRabbitActor frames={variant.frames} fps={2} />
                </div>
                {/* Flag + Hand */}
                <div className="absolute inset-0 z-10">
                  <div
                    className="absolute w-full flex justify-center transition-all"
                    style={{ bottom, left }}
                  >
                    <div
                      className="origin-bottom"
                      style={{ transform: `scale(${scale})` }}
                    >
                      <div className="relative flex flex-col items-center">
                        {/* 旗帜组件内容 */}
                        <div className="w-[180px] h-[8px] bg-gradient-to-r from-[#D4AF37] via-[#F4C430] to-[#D4AF37] rounded-full relative z-20 shadow-lg border border-[#B8860B]"></div>
                        <div
                          className={`relative w-[170px] h-[280px] -mt-[6px] z-10 flex flex-col items-center justify-center shadow-2xl border-x border-black/10 ${item.color}`}
                        >
                          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/30 to-transparent z-10"></div>
                          <div className="relative z-20 bg-[#FDFBF7] w-[150px] h-[250px] flex items-center justify-center shadow-inner">
                            <span className="block writing-vertical text-center font-serif font-black text-slate-900 text-4xl tracking-[0.2em] h-full mx-auto py-6 leading-none opacity-90">
                              {item.name}
                            </span>
                          </div>
                        </div>
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
                    </div>
                  </div>
                  {/* Hand */}
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
