"use client";

import React from "react";
import WaveDivider from "@/components/home/WaveDivider";
import Introduction from "./Introduction";
import ServiceCard from "./ServiceCard";

// 数据定义 (如果数据将来变多，可以移到 src/data/mockData.ts)
const SERVICE_DATA = [
  {
    id: "01",
    kanji: "探",
    title: "SEARCH",
    desc: "全国のクラブを\n地域・条件から検索",
    img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2670&auto=format&fit=crop",
    delay: "",
  },
  {
    id: "02",
    kanji: "結",
    title: "CONNECT",
    desc: "見学・体験申し込みで\n新しい一歩を",
    img: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2670&auto=format&fit=crop",
    delay: "delay-100",
  },
  {
    id: "03",
    kanji: "録",
    title: "ARCHIVE",
    desc: "活動の記録を\n美しいフォトブックに",
    img: "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?q=80&w=1000&auto=format&fit=crop",
    delay: "delay-200",
  },
];

const AboutService = () => {
  return (
    <section className="relative bg-sumo-dark text-white overflow-hidden pb-32">
      {/* 背景纹理 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-80 mix-blend-overlay"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/washi.png")`,
        }}
      ></div>

      {/* 这里的 withTexture={true} 确保波浪也有纹理，过渡更自然 */}
      <WaveDivider fill="fill-sumo-bg" isRotated={false} withTexture={true} />

      {/* 第一部分：介绍 (About) */}
      <div className="container mx-auto px-6 pt-40 pb-32 relative z-10">
        <Introduction />
      </div>

      {/* 第二部分：三本柱 (Service) */}
      <div className="container mx-auto px-6 relative z-10 mt-10">
        <div className="text-center mb-24 reveal-up">
          <p className="text-sumo-gold text-xs font-bold tracking-[0.2em] mb-4 uppercase">
            OUR SERVICE
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">
            SUMOMEの<span className="text-sumo-red">三</span>本柱
          </h2>
          <div className="w-24 h-1 bg-sumo-gold mx-auto mt-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {SERVICE_DATA.map((item, idx) => (
            <ServiceCard
              key={item.id}
              {...item}
              delayClass={item.delay}
              isStaggered={idx === 1} // 中间那个(索引1)错位显示，增加视觉韵律
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutService;
