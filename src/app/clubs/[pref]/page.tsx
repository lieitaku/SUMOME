"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Camera, ArrowRight, Info, ChevronLeft } from "lucide-react";

// --- 数据源 ---
import { clubsData } from "@/data/clubs";
import { PREFECTURE_DATABASE } from "@/data/prefectures";
import { getSponsorsByPrefecture } from "@/data/sponsorsData";

// --- 组件 ---
import ScrollToTop from "@/components/common/ScrollToTop";
import MiniSponsorBanner from "@/components/common/MiniSponsorBanner";
import RikishiTable from "@/components/clubs/RikishiTable";
import ClubCard from "@/components/clubs/ClubCard";
import Ceramic from "@/components/ui/Ceramic";
import { cn } from "@/lib/utils";

const PrefecturePage = () => {
  const params = useParams();
  const prefSlug = params.pref as string;

  // 页面加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  // --- 数据获取 ---
  const prefData = PREFECTURE_DATABASE[prefSlug];
  // 如果没有数据，提供默认占位符
  const displayData = prefData || {
    name: prefSlug.toUpperCase(),
    introTitle: `${prefSlug}の相撲事情`,
    introText: "現在、この地域の詳細情報は準備中です。",
    bannerImg: "",
    rikishiList: [],
  };

  // 筛选当前地区的俱乐部
  const filteredClubs = clubsData.filter((club) =>
    club.area.includes(displayData.name),
  );

  // 获取当地赞助商
  const localSponsors = getSponsorsByPrefecture(prefSlug);

  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* =========================================
            第1部分：碧空标题区 (Blue Sky Hero)
           ========================================= */}
        <section className="relative pt-40 pb-32 overflow-hidden bg-sumo-brand text-white shadow-xl">
          {/* 渐变背景 */}
          <div className="absolute inset-0 bg-gradient-to-b from-sumo-brand to-[#2454a4]"></div>

          {/* 网格纹理装饰 */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* 英文大字水印 (Watermark) */}
          <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 text-[18vw] font-black text-white opacity-[0.04] select-none pointer-events-none leading-none z-0 mix-blend-overlay uppercase tracking-tighter font-sans">
            {prefSlug}
          </div>

          <div className="container mx-auto px-6 relative z-10">
            {/* 返回面包屑 */}
            <div className="mb-8 reveal-up">
              <Link
                href="/clubs"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase group"
              >
                <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-sumo-brand transition-all">
                  <ChevronLeft size={14} />
                </div>
                Back to Map
              </Link>
            </div>

            {/* 标题内容 */}
            <div className="reveal-up delay-100">
              <div className="flex items-center gap-3 mb-4 opacity-80">
                <span className="h-[1px] w-10 bg-white/50"></span>
                <span className="text-xs font-bold tracking-[0.3em] uppercase">
                  Prefecture Info
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight mb-6 text-white drop-shadow-sm">
                {displayData.name}
              </h1>
              <p className="text-white/80 font-medium tracking-wide max-w-xl leading-relaxed">
                {displayData.name}の相撲クラブ・道場情報、
                <br className="hidden md:inline" />
                および出身力士のデータベース。
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            第2部分：顶级合作伙伴 (Top Partners)
           ========================================= */}
        <section className="relative px-6 z-20">
          <div className="container mx-auto max-w-6xl relative -mt-20">
            <Ceramic
              interactive={false}
              className="border-b-sumo-brand shadow-[0_20px_50px_rgba(36,84,164,0.15)]"
            >
              <div className="p-8 md:p-12 text-center">
                <div className="mb-8 flex justify-center">
                  <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-sumo-brand/5 border border-sumo-brand/20 text-sumo-brand text-[10px] font-bold tracking-[0.2em] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-sumo-brand"></span>
                    Official Top Partners
                  </span>
                </div>
                <div className="max-w-4xl mx-auto">
                  <MiniSponsorBanner />
                </div>
              </div>
            </Ceramic>
          </div>
        </section>

        {/* =========================================
            第3部分：主要内容区域 (Grid Layout)
           ========================================= */}
        <section className="relative pb-24 px-6 pt-20">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* === 左侧边栏 (lg:sticky 只在电脑端吸顶) === */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start flex flex-col gap-8">
                {/* 1. 简介卡片 (Intro Card) */}
                <Ceramic
                  interactive={false}
                  className="p-8 border-b-sumo-brand shadow-sm"
                >
                  <h3 className="text-lg font-bold text-sumo-dark mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sumo-brand/10 flex items-center justify-center text-sumo-brand">
                      <Info size={16} />
                    </div>
                    {displayData.introTitle}
                  </h3>
                  <p className="text-sm text-gray-500 leading-[1.8] text-justify font-medium">
                    {displayData.introText}
                  </p>
                </Ceramic>

                {/* 2. 地区支持者 (Local Supporters) */}
                <Ceramic
                  interactive={false}
                  className="border-b-sumo-brand shadow-sm p-0"
                >
                  <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <p className="text-[10px] text-gray-400 tracking-widest font-bold uppercase">
                      Local Supporters
                    </p>
                    <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono text-sumo-brand font-bold">
                      {localSponsors.length}
                    </span>
                  </div>

                  <div className="relative py-10 bg-white group overflow-hidden">
                    {/* 左右渐变遮罩 */}
                    <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                    {/* 滚动内容区域 */}
                    <div className="flex gap-6 animate-infinite-scroll hover:[animation-play-state:paused] w-max px-6">
                      {[...localSponsors, ...localSponsors].map(
                        (sponsor, idx) => (
                          <div
                            key={`${sponsor.id}-${idx}`}
                            className="flex-shrink-0"
                          >
                            {/* 海报卡片: 3:4 比例 */}
                            <div className="w-40 aspect-[3/4] bg-white rounded-xl border border-gray-100 flex items-center justify-center p-2 hover:border-sumo-brand/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative group/item">
                              <img
                                src={sponsor.img}
                                alt={sponsor.name}
                                className="w-full h-full rounded-lg object-cover opacity-80 grayscale group-hover/item:opacity-100 group-hover/item:grayscale-0 transition-all duration-500"
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="block py-4 bg-gray-50 text-center border-t border-gray-100 hover:bg-sumo-brand hover:text-white transition-colors group"
                  >
                    <span className="text-[10px] font-bold tracking-wider flex items-center justify-center gap-2">
                      スポンサーについてのお問い合わせ
                      <ArrowRight
                        size={10}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </Link>
                </Ceramic>
              </div>

              {/* === 右侧主内容 === */}
              <div className="lg:col-span-8 flex flex-col gap-12">
                {/* 1. 风景横幅 (Banner) */}
                {displayData.bannerImg && (
                  <div className="group relative aspect-[21/9] rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={displayData.bannerImg}
                      alt={`${displayData.name}の風景`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sumo-brand/80 to-transparent flex items-end p-8">
                      <div className="text-white">
                        <p className="text-[10px] font-bold tracking-widest mb-2 flex items-center gap-2 opacity-80 border-b border-white/30 pb-2 inline-block">
                          <Camera size={12} /> LOCAL SCENE
                        </p>
                        <p className="font-serif font-bold text-2xl tracking-wide">
                          {displayData.name}の相撲風景
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. 俱乐部列表 (Club List) */}
                <div>
                  <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-200/60">
                    <div>
                      <h2 className="text-3xl font-serif font-black text-gray-900 flex items-center gap-3">
                        クラブ一覧
                      </h2>
                      <p className="text-xs text-gray-400 font-bold tracking-widest mt-2 uppercase">
                        Registered Sumo Clubs
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-serif font-black text-sumo-brand">
                        {filteredClubs.length}
                      </span>
                      <span className="text-xs text-gray-400 font-bold ml-1">
                        件
                      </span>
                    </div>
                  </div>

                  {filteredClubs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {filteredClubs.map((club, idx) => (
                        <div
                          key={club.id}
                          className="reveal-up"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <ClubCard club={club} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Ceramic
                      interactive={false}
                      className="p-16 text-center border-dashed border-2"
                    >
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <MapPin size={24} />
                      </div>
                      <p className="text-gray-400 font-medium">
                        現在、この地域の掲載クラブはありません。
                      </p>
                    </Ceramic>
                  )}
                </div>

                {/* 3. 力士一览表 (Rikishi Table) */}
                <div>
                  <Ceramic
                    interactive={false}
                    className="border-b-sumo-brand shadow-sm p-0"
                  >
                    <RikishiTable
                      rikishiList={displayData.rikishiList}
                      prefectureName={displayData.name}
                    />
                  </Ceramic>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ScrollToTop />
    </div>
  );
};

export default PrefecturePage;
