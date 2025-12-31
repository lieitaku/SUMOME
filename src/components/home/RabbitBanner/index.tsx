"use client";
import React from "react";
// 引入局部样式 (CSS Module)
import styles from "./styles.module.css";

// 模拟赞助商数据
const sponsors = [
  { id: 1, name: "SUMOME Corp", color: "bg-[#1B1C37]" },
  { id: 2, name: "Premium 753", color: "bg-[#A82429]" },
  { id: 3, name: "Golden Sumo", color: "bg-[#C39B4F]" },
  { id: 4, name: "Memory Book", color: "bg-[#5D3F6A]" },
  { id: 5, name: "Future Lab", color: "bg-[#2F4F4F]" },
];

/**
 * RabbitBanner Component
 * ------------------------------------------------------------------
 * 首页底部的兔子跑马灯 (Kenshō-maku / 悬赏幕风格)。
 * 模拟大相扑比赛前的悬赏旗巡场效果。
 *
 * 动画逻辑：
 * 1. 整体水平滚动 (scrollAnimation)
 * 2. 单个旗帜左右摇摆 (swayAnimation)
 */
const RabbitBanner = () => {
  // 复制3份以配合 translateX(-33.33%) 的无缝循环逻辑
  const loopData = [...sponsors, ...sponsors, ...sponsors];

  return (
    // aria-hidden="true": 这是一个纯装饰性组件，不需要被屏幕阅读器读取
    <div
      className="relative w-full overflow-hidden h-[360px] pointer-events-none z-20"
      aria-hidden="true"
    >
      {/* 轨道层 */}
      <div
        className={`flex absolute bottom-0 left-0 gap-20 px-8 ${styles.scrollAnimation}`}
      >
        {loopData.map((item, idx) => (
          // 单个悬赏旗容器：应用摇摆动画
          <div
            key={`${item.id}-${idx}`}
            className={`relative flex flex-col items-center origin-top ${styles.swayAnimation}`}
            // 错开动画时间，营造自然的物理摆动感
            style={{ animationDelay: `${idx * -0.5}s` }}
          >
            {/* 1. 悬挂杆 (Bamboo Pole) */}
            <div className="w-[180px] h-[10px] bg-gradient-to-b from-[#D4AF37] to-[#8B6E2F] rounded-full relative z-20 shadow-md border-b border-[#6d541b]">
              {/* 金属扣环 */}
              <div className="absolute -top-[2px] left-3 w-[6px] h-[14px] border border-[#8B6E2F] bg-[#5e4715] rounded-sm"></div>
              <div className="absolute -top-[2px] right-3 w-[6px] h-[14px] border border-[#8B6E2F] bg-[#5e4715] rounded-sm"></div>
            </div>

            {/* 2. 旗帜主体 (Flag Body) */}
            <div
              className={`
                relative w-[160px] h-[240px] -mt-[5px] z-10 
                flex flex-col items-center justify-center
                shadow-xl border-x border-black/10
                ${item.color}
              `}
            >
              {/* 顶部阴影 (模拟布料下垂感) */}
              <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/20 to-transparent"></div>

              {/* 装饰性兔子背景 (Sumo Rabbit Watermark) */}
              <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-white/50"></div>
              </div>

              {/* 3. 中央广告位 (Content Area) */}
              <div className="relative z-20 bg-white/95 px-1 py-4 w-[140px] h-[210px] flex items-center justify-center">
                <span className="block writing-vertical text-center font-serif font-bold text-sumo-dark text-xl tracking-widest h-full mx-auto leading-relaxed">
                  {item.name}
                </span>
                {/* 纸张纹理叠加 */}
                <div className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
              </div>
            </div>

            {/* 4. 底部流苏 (Fringe) */}
            <div className="w-[160px] h-[32px] bg-gradient-to-b from-transparent to-black/10 relative overflow-hidden">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, #D4AF37, #F4C430 2px, transparent 2px, transparent 6px)",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RabbitBanner;
