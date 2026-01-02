"use client";

import React from "react";
import WaveDivider from "@/components/home/WaveDivider";
import JapanMap from "@/components/clubs/JapanMap";
import Link from "next/link";
import { Search } from "lucide-react";

const ClubsPage = () => {
  return (
    <div className="antialiased bg-sumo-bg min-h-screen flex flex-col">
      <main className="flex-grow">
        <section className="relative bg-sumo-dark text-white pt-40 pb-20 px-6 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: `url("https://www.transparenttextures.com/patterns/washi.png")`,
            }}
          ></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-sumo-gold rounded-full blur-[200px] opacity-10 pointer-events-none"></div>
          {/* 巨大背景字 */}
          <div className="absolute top-1/5 right-0 -translate-y-1/2 text-[15vw] font-serif font-bold text-white opacity-[0.03] select-none whitespace-nowrap pointer-events-none">
            MAPS
          </div>
          <div className="container mx-auto relative z-10 text-center">
            <p className="text-sumo-gold text-xs font-bold tracking-[0.3em] mb-6 uppercase flex items-center justify-center gap-4">
              <span className="w-8 h-[1px] bg-sumo-gold"></span>
              Search by Map
              <span className="w-8 h-[1px] bg-sumo-gold"></span>
            </p>
            <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-wide mb-12">
              都道府県から探す
            </h1>

            <div className="mb-12 reveal-up">
              <JapanMap />
            </div>

            <div className="flex justify-center reveal-up delay-100">
              <Link
                href="/clubs/search"
                className="group relative inline-flex items-center 
                           /* 手机端极限压缩样式 */
                           gap-1.5 px-4 py-3 
                           /* 电脑端正常样式 */
                           md:gap-3 md:px-8 md:py-4 
                           
                           bg-white/10 border border-white/20 backdrop-blur-md rounded-full 
                           hover:bg-white hover:text-sumo-dark transition-all duration-300
                           
                           /* ✨ 核心：强制不换行 */
                           whitespace-nowrap"
              >
                <Search className="w-3 h-3 md:w-5 md:h-5" />
                <span className="font-bold tracking-wider text-[11px] md:text-base">
                  条件・キーワードで詳しく検索
                </span>
                <span className="ml-1 md:ml-2 w-4 h-4 md:w-6 md:h-6 rounded-full bg-sumo-red text-white flex items-center justify-center text-[10px] md:text-xs group-hover:bg-sumo-dark transition-colors">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
        <div className="relative bg-sumo-dark">
          <WaveDivider
            fill="fill-sumo-dark"
            isRotated={false}
            withTexture={true}
          />
        </div>
      </main>
    </div>
  );
};

export default ClubsPage;
