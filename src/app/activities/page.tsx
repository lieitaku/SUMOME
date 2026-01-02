"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Clock } from "lucide-react";
import { activitiesData } from "@/data/mockData";
import WaveDivider from "@/components/home/WaveDivider";

const ActivitiesPage = () => {
  const displayData = activitiesData;

  return (
    <div className="bg-sumo-bg min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* ==================== 1. Page Header (Hero) ==================== */}
        <section className="relative pt-40 pb-20 bg-sumo-dark text-white overflow-hidden">
          {/* 背景纹理 */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay z-0"
            style={{
              backgroundImage: "url('/images/bg/washi.png')",
              backgroundRepeat: "repeat",
            }}
          ></div>

          {/* 装饰光晕 */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-sumo-gold/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="container mx-auto px-6 text-center relative z-10 reveal-up">
            <p className="text-sumo-gold text-xs font-bold tracking-[0.3em] mb-4 uppercase">
              ACTIVITY REPORT
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              イベント・活動記録
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-loose font-medium">
              SUMOMEが主催・参加したイベントの様子をお届けします。
            </p>
          </div>
        </section>

        {/* ==================== 2. 列表内容区 ==================== */}
        <section className="relative py-28 px-6">
          {/* 顶部波浪 */}
          <div className="absolute top-0 w-full left-0">
            <WaveDivider
              fill="fill-sumo-dark"
              isRotated={false}
              withTexture={true}
            />
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            {/* 网格布局 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {displayData.map((act, index) => (
                <Link
                  // 链接到详情页，使用 act.id
                  href={`/activities/${act.id}`}
                  key={`${act.id}-${index}`}
                  className="group flex flex-col h-full bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2"
                >
                  {/* A. 图片区域 */}
                  <div className="relative overflow-hidden aspect-[4/3] w-full">
                    {/* 日期徽章 */}
                    <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-2 text-center shadow-lg rounded-sm border-t-2 border-sumo-gold group-hover:bg-sumo-gold group-hover:text-white transition-colors duration-300">
                      <span className="block text-xs font-bold uppercase tracking-wider mb-0.5">
                        {act.date.split(".")[1]}月
                      </span>
                      <span className="block text-xl font-serif font-bold leading-none">
                        {act.date.split(".")[2]}
                      </span>
                    </div>

                    {/* 图片本体 */}
                    <Image
                      src={act.img}
                      alt={act.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

                    <div className="absolute bottom-4 right-4 bg-sumo-dark text-white text-[10px] font-bold px-2 py-1 tracking-widest uppercase">
                      EVENT
                    </div>
                  </div>

                  {/* B. 内容区域 */}
                  <div className="p-8 flex flex-col flex-grow relative">
                    <div className="absolute left-0 top-8 bottom-8 w-[3px] bg-sumo-gold/20 group-hover:bg-sumo-gold transition-colors duration-500"></div>

                    <h3 className="text-xl font-serif font-bold text-sumo-dark leading-relaxed mb-4 group-hover:text-sumo-red transition-colors line-clamp-2 pl-4">
                      {act.title}
                    </h3>

                    <div className="pl-4 mt-auto space-y-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-sumo-gold" />
                          <span>{act.date}</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-sumo-gold" />
                          <span className="line-clamp-1">{act.location}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between group/btn">
                        <span className="text-xs font-bold tracking-[0.1em] text-gray-400 group-hover:text-sumo-dark transition-colors">
                          VIEW REPORT
                        </span>
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-sumo-red group-hover:bg-sumo-red transition-all duration-300">
                          <ArrowRight
                            size={14}
                            className="text-gray-400 group-hover:text-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-24 flex justify-center items-center gap-4">
              {/* Disable Prev */}
              <button
                disabled
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 cursor-not-allowed"
              >
                &lt;
              </button>

              {/* Active Page 1 */}
              <button className="w-12 h-12 flex items-center justify-center rounded-full text-sm font-bold font-serif bg-sumo-dark text-white shadow-lg scale-110">
                1
              </button>

              {/* Disable Next */}
              <button
                disabled
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 cursor-not-allowed"
              >
                &gt;
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ActivitiesPage;
