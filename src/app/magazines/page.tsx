"use client";

import React from "react";
import { magazinesData } from "@/data/magazines";
import WaveDivider from "@/components/home/WaveDivider";
import MagazineCard from "@/components/ui/MagazineCard"; // 引入新组件

const MagazinesPage = () => {
  return (
    <div className="bg-sumo-bg min-h-screen">
      {/* Hero Area (保持不变) */}
      <section className="relative pt-40 pb-20 bg-sumo-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/washi.png')] mix-blend-overlay pointer-events-none"></div>
        <div className="container mx-auto px-6 text-center relative z-10 reveal-up">
          <p className="text-sumo-gold text-xs font-bold tracking-[0.3em] mb-4 uppercase">
            LIBRARY
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            冊子一覧
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-loose font-medium">
            SUMOMEが発行する公式情報誌のバックナンバーをご覧いただけます。
          </p>
        </div>
      </section>

      {/* Grid Area */}
      <section className="relative py-40 px-6">
        <div className="absolute top-0 w-full left-0">
          <WaveDivider
            fill="fill-sumo-dark"
            isRotated={false}
            withTexture={false}
          />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {magazinesData.map((mag) => (
              <div key={mag.id} className="group block relative">
                {/* A. 封面区域：使用封装组件 */}
                <div className="mb-8">
                  {/* 注意：MagazineCard 内部自带 aspect-[3/4] */}
                  <MagazineCard
                    src={mag.coverImage}
                    title={mag.title}
                    href={`/magazines/${mag.id}`} // 传入 href，使其变为链接
                  />
                </div>

                {/* B. 信息区域 (保持不变) */}
                <div className="text-center md:text-left px-2">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                    <span className="text-[10px] font-bold tracking-widest text-sumo-gold border border-sumo-gold/30 px-2 py-1 rounded-sm uppercase">
                      MAGAZINE
                    </span>
                    <span className="text-xs text-gray-400 font-serif">
                      {mag.publishDate}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-sumo-dark mb-2 group-hover:text-sumo-red transition-colors">
                    {mag.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium mb-4 line-clamp-1">
                    {mag.subTitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MagazinesPage;
