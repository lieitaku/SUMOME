"use client";
import React from "react";

// ★★★ 请在这里替换为你实际的图片路径 ★★★
// 建议至少放 5-6 张不同的封面，效果更好。
const magazineCovers = [
  // 注意：路径以 / 开头，不需要 public，且必须用正斜杠 /
  "/images/magazines/cover (1).jpg",
  "/images/magazines/cover (2).jpg",
  "/images/magazines/cover (3).jpg",
  "/images/magazines/cover (4).jpg",
  "/images/magazines/cover (5).jpg",
  "/images/magazines/cover (6).jpg",
  "/images/magazines/cover (7).jpg",
  "/images/magazines/cover (8).jpg",
  "/images/magazines/cover (9).jpg",
];

const MagazineCarousel = () => {
  // 为了实现无缝滚动，我们需要把数据复制一份拼接在后面
  const carouselData = [...magazineCovers, ...magazineCovers];

  return (
    <section className="py-20 bg-sumo-dark overflow-hidden relative">
      {/* 标题区 */}
      <div className="container mx-auto px-6 text-center mb-12 relative z-10">
        <p className="text-sumo-gold text-xs font-bold tracking-[0.2em] mb-4 uppercase">
          OUR ARCHIVES
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
          フォトブック情報誌
        </h2>
      </div>

      {/* ★★★ 核心滚动区域 ★★★ */}
      <div className="relative w-full">
        {/* 左右两侧的深色渐变遮罩，制造高级感和景深 */}
        <div className="absolute top-0 left-0 h-full w-24 md:w-48 bg-gradient-to-r from-sumo-dark to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 h-full w-24 md:w-48 bg-gradient-to-l from-sumo-dark to-transparent z-10 pointer-events-none"></div>

        {/* 滚动轨道：复用之前的 animate-slow-scroll 动画 */}
        <div className="flex gap-8 w-max animate-slow-scroll hover:[animation-play-state:paused] py-8 px-4">
          {carouselData.map((src, idx) => (
            <div
              key={idx}
              // 设置固定高度，宽度自适应。加上阴影和过渡效果。
              className="relative h-[300px] md:h-[400px] w-auto flex-shrink-0 group cursor-pointer perspective-1000"
            >
              {/* 图片本体 */}
              <img
                src={src}
                alt={`Magazine Vol.${(idx % magazineCovers.length) + 1}`}
                className="h-full w-auto object-cover rounded-sm 
                           shadow-[0_10px_20px_rgba(0,0,0,0.3)] /* 默认深邃阴影 */
                           transition-all duration-500 ease-out 
                           group-hover:-translate-y-4 /* 悬停上浮 */
                           group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.5)] /* 悬停阴影加深加大 */
                           group-hover:scale-[1.02] /* 微微放大 */
                           "
              />

              {/* 可选：光泽层，增加物理质感 */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-sm"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MagazineCarousel;
