"use client";
import React from "react";
import MagazineCard from "@/components/ui/MagazineCard";

// 将简单的字符串数组改为对象数组
// 这样每一张图片 (src) 都明确绑定了一个目标 ID (id)
const magazineList = [
  { id: "vol-01", src: "/images/magazines/cover-1.jpg" },
  { id: "vol-02", src: "/images/magazines/cover-2.jpg" },
  { id: "vol-03", src: "/images/magazines/cover-3.jpg" },
  { id: "vol-04", src: "/images/magazines/cover-4.jpg" },
  { id: "vol-05", src: "/images/magazines/cover-5.jpg" },
  { id: "vol-06", src: "/images/magazines/cover-6.jpg" },
  { id: "vol-07", src: "/images/magazines/cover-7.jpg" },
  { id: "vol-08", src: "/images/magazines/cover-8.jpg" },
  { id: "vol-09", src: "/images/magazines/cover-9.jpg" },
];

const MagazineCarousel = () => {
  // 复制一份数据以实现无缝滚动
  const carouselData = [...magazineList, ...magazineList];

  return (
    <section className="py-24 bg-sumo-dark overflow-hidden relative">
      {/* 背景纹理层 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay z-0"
        style={{
          backgroundImage: "url('/images/bg/washi.png')",
          backgroundRepeat: "repeat",
        }}
      ></div>

      {/* 标题区域 */}
      <div className="container mx-auto px-6 text-center mb-24 relative z-20 reveal-up">
        <p className="text-sumo-gold text-xs font-bold tracking-[0.2em] mb-4 uppercase">
          OUR ARCHIVES
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
          SUMOME フォトブック情報誌
        </h2>
        <div className="w-12 h-[1px] bg-sumo-gold/50 mx-auto mt-6"></div>
      </div>

      {/* 滚动区域 */}
      <div className="relative w-full z-10">
        <div className="absolute top-0 left-0 h-full w-24 md:w-64 bg-gradient-to-r from-sumo-dark via-sumo-dark/80 to-transparent z-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 h-full w-24 md:w-64 bg-gradient-to-l from-sumo-dark via-sumo-dark/80 to-transparent z-20 pointer-events-none"></div>

        <div className="flex w-max animate-slow-scroll paused-on-hover">
          {/* 这里解构 item，拿到 src 和 id */}
          {carouselData.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="relative px-4 md:px-8 py-10"
            >
              <div className="w-[200px] md:w-[280px]">
                {/* 传入 href 属性 */}
                {/* 组合成 /magazines/vol-01 这样的路径 */}
                <MagazineCard
                  src={item.src}
                  idx={idx}
                  href={`/magazines/${item.id}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MagazineCarousel;
