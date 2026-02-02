"use client";

import React from "react";
import JapanMap from "@/components/clubs/JapanMap";
import Link from "@/components/ui/TransitionLink";
import { Search, MapPin, ArrowRight } from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";

const ClubsPage = () => {
  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* === Hero Area === */}
        <section className="relative pt-48 pb-32 overflow-hidden">
          {/* Background Decoration */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(36, 84, 164, 0.03) 1px, transparent 1px),
                               linear-gradient(to bottom, rgba(36, 84, 164, 0.03) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-20 left-10 md:left-1/4 text-[40vw] md:text-[25vw] font-serif font-bold text-sumo-brand opacity-[0.03] select-none pointer-events-none leading-none z-0 mix-blend-multiply">
            47
          </div>

          <div className="container mx-auto px-6 relative z-10">
            {/* Title Section */}
            <div className="text-center mb-16 md:mb-20 reveal-up">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-gray-100">
                <MapPin size={12} className="text-sumo-brand" />
                <span className="text-[10px] font-bold tracking-widest text-sumo-brand uppercase">
                  Area Search
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-black text-gray-900 mb-6 tracking-tight">
                都道府県から探す
              </h1>
              <p className="text-gray-500 text-sm md:text-base font-medium tracking-widest max-w-lg mx-auto leading-loose">
                日本全国の相撲クラブ・道場を網羅。
                <br className="hidden md:block" />
                あなたの地域のコミュニティを見つけましょう。
              </p>
            </div>

            {/* Map Section */}
            <div className="mb-24 reveal-up delay-100">
              <JapanMap />
            </div>

            {/* --- Advanced Search Button (Using Ceramic) --- */}
            <div className="flex justify-center reveal-up delay-200">
              <Ceramic
                as={Link}
                href="/clubs/"
                className="flex items-center gap-6 px-8 py-5 md:px-12 md:py-7 bg-white group"
              >
                {/* 1. 左侧图标 */}
                <div
                  className="w-12 h-12 rounded-xl bg-[#F4F5F7] text-sumo-brand flex items-center justify-center 
                             group-hover:bg-sumo-brand group-hover:text-white transition-colors duration-300"
                >
                  <Search size={22} strokeWidth={2.5} />
                </div>

                {/* 2. 文字内容 */}
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-0.5 group-hover:text-sumo-brand transition-colors">
                    Advanced Search
                  </span>
                  <span className="text-lg md:text-xl font-bold text-gray-800 tracking-wide">
                    条件・キーワードで詳しく検索
                  </span>
                </div>

                {/* 3. 右侧箭头 */}
                <div
                  className="hidden md:flex w-8 h-8 items-center justify-center rounded-full border border-gray-200 text-gray-300 
                             group-hover:border-sumo-brand group-hover:text-sumo-brand group-hover:rotate-45 transition-all duration-300 ml-2"
                >
                  <ArrowRight size={16} />
                </div>
              </Ceramic>
            </div>
          </div>
        </section>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-sumo-brand/20 to-transparent"></div>
      </main>
    </div>
  );
};

export default ClubsPage;
