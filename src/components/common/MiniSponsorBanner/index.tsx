"use client";
import React from "react";
// ✨ 引入 CSS Module
import styles from "./styles.module.css";

// 模拟赞助商数据
const sponsors = [
  { id: 1, name: "SUMOME", color: "bg-[#1B1C37]" },
  { id: 2, name: "Premium", color: "bg-[#A82429]" },
  { id: 3, name: "Golden", color: "bg-[#C39B4F]" },
  { id: 4, name: "Memory", color: "bg-[#5D3F6A]" },
  { id: 5, name: "Future", color: "bg-[#2F4F4F]" },
];

const MiniSponsorBanner = () => {
  // 复制更多份以确保在窄屏幕滚动时无缝连接
  const loopData = [
    ...sponsors,
    ...sponsors,
    ...sponsors,
    ...sponsors,
    ...sponsors,
  ];

  return (
    // 容器高度调整为 180px，适应侧边栏
    // ✨ 应用 styles.maskGradient 类名
    <div
      className={`relative w-full overflow-hidden h-[180px] z-10 select-none ${styles.maskGradient}`}
    >
      {/* 轨道：调整 gap 和 padding */}
      {/* ✨ 应用 styles.scrollAnimation 类名 */}
      <div
        className={`flex absolute top-6 left-0 gap-6 pl-4 ${styles.scrollAnimation}`}
      >
        {loopData.map((item, idx) => (
          // 容器：摇摆动画
          // ✨ 应用 styles.swayAnimation 类名
          <div
            key={idx}
            className={`relative flex flex-col items-center origin-top ${styles.swayAnimation}`}
            style={{ animationDelay: `${idx * -0.7}s` }}
          >
            {/* 1. 悬挂杆 (尺寸缩小) */}
            <div className="w-[90px] h-[6px] bg-gradient-to-b from-[#D4AF37] to-[#8B6E2F] rounded-full relative z-20 shadow-sm border-b border-[#6d541b]">
              <div className="absolute -top-[1px] left-2 w-[3px] h-[8px] border border-[#8B6E2F] bg-[#5e4715] rounded-sm"></div>
              <div className="absolute -top-[1px] right-2 w-[3px] h-[8px] border border-[#8B6E2F] bg-[#5e4715] rounded-sm"></div>
            </div>

            {/* 2. 旗帜主体 (尺寸缩小) */}
            <div
              className={`
              relative w-[80px] h-[120px] -mt-[3px] z-10 
              flex flex-col items-center justify-center
              shadow-md border-x border-black/10
              ${item.color}
            `}
            >
              {/* 顶部阴影 */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-black/20 to-transparent"></div>

              {/* 3. 广告位 (尺寸缩小) */}
              <div className="relative z-20 bg-white/95 w-[70px] h-[105px] flex items-center justify-center py-2">
                <span className="block writing-vertical text-center font-serif font-bold text-sumo-dark text-[10px] tracking-widest h-full mx-auto leading-relaxed">
                  {item.name}
                </span>

                {/* 纸张纹理 */}
                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply pointer-events-none"></div>
              </div>
            </div>

            {/* 4. 底部流苏 (尺寸缩小) */}
            <div className="w-[80px] h-[16px] bg-gradient-to-b from-transparent to-black/10 relative overflow-hidden">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, #D4AF37, #F4C430 1px, transparent 1px, transparent 3px)",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniSponsorBanner;
