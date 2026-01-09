"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Search, Filter, X } from "lucide-react";
import { magazinesData } from "@/data/magazines";
import Ceramic from "@/components/ui/Ceramic";
import { cn } from "@/lib/utils";

const ALL_REGIONS = Array.from(new Set(magazinesData.map((m) => m.region)));

const MagazinesPage = () => {
  const [activeRegion, setActiveRegion] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  // 只要：1. 选了地区 OR 2. 输入了文字 OR 3. 正在输入(聚焦) -> 就上浮
  const isFilterActive =
    activeRegion !== "All" || searchQuery.length > 0 || isInputFocused;

  const filteredMagazines = useMemo(() => {
    return magazinesData.filter((mag) => {
      const matchRegion = activeRegion === "All" || mag.region === activeRegion;
      const query = searchQuery.toLowerCase();
      const matchSearch =
        searchQuery === "" ||
        mag.title.toLowerCase().includes(query) ||
        mag.description.toLowerCase().includes(query) ||
        mag.relatedClubs.some((club) => club.toLowerCase().includes(query));
      return matchRegion && matchSearch;
    });
  }, [activeRegion, searchQuery]);

  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* ==================== 1. Hero Section (保持不变) ==================== */}
        <section className="relative pt-40 pb-48 overflow-hidden bg-sumo-brand text-white shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-sumo-brand to-[#2454a4]"></div>
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 text-[20vw] font-black text-white opacity-[0.04] select-none pointer-events-none leading-none z-0 mix-blend-overlay tracking-tighter font-sans">
            LIBRARY
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 reveal-up">
              <BookOpen size={12} className="text-white" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">
                Official Publications
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight mb-6 text-white drop-shadow-sm reveal-up delay-100">
              冊子一覧
            </h1>
            <p className="text-white/80 font-medium tracking-wide max-w-xl mx-auto leading-relaxed reveal-up delay-200">
              SUMOMEが発行する公式情報誌のバックナンバー。
              <br className="hidden md:inline" />
              相撲の魅力を、美しいビジュアルと言葉で。
            </p>
          </div>
        </section>

        {/* ==================== 2. High-End Filter (交互式控制台) ==================== */}
        <section className="relative px-4 md:px-6 z-30 -mt-20 mb-12">
          <div className="container mx-auto max-w-6xl">
            <Ceramic
              interactive={false}
              className={cn(
                "bg-white p-1 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                "border-b-[4px] border-b-gray-200 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]",
                // 激活状态：蓝色底座 + 上浮
                isFilterActive &&
                  "border-b-sumo-brand -translate-y-2 shadow-[0_30px_60px_-10px_rgba(36,84,164,0.3)]",
              )}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 md:p-6">
                {/* 左侧：地区筛选 */}
                <div className="w-full md:w-auto flex flex-nowrap md:flex-wrap items-center gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide mask-fade-right md:mask-none">
                  <div className="flex items-center gap-2 mr-2 text-gray-400 text-xs font-bold tracking-widest uppercase whitespace-nowrap">
                    <Filter size={14} /> Region
                  </div>

                  <button
                    onClick={() => setActiveRegion("All")}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-shrink-0",
                      activeRegion === "All"
                        ? "bg-sumo-brand text-white shadow-md shadow-sumo-brand/20"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200",
                    )}
                  >
                    All
                  </button>

                  {ALL_REGIONS.map((region) => (
                    <button
                      key={region}
                      onClick={() => setActiveRegion(region)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-shrink-0",
                        activeRegion === region
                          ? "bg-sumo-brand text-white shadow-md shadow-sumo-brand/20"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200",
                      )}
                    >
                      {region}
                    </button>
                  ))}
                </div>

                {/* 分割线 */}
                <div className="hidden md:block w-px h-8 bg-gray-200 mx-4"></div>

                {/* 右侧：搜索框 */}
                <div className="w-full md:flex-grow relative group">
                  <div
                    className={cn(
                      "absolute inset-y-0 left-3 flex items-center pointer-events-none transition-colors",
                      isInputFocused ? "text-sumo-brand" : "text-gray-400",
                    )}
                  >
                    <Search size={16} />
                  </div>

                  <input
                    type="text"
                    placeholder="クラブ名、キーワードで検索..."
                    value={searchQuery}
                    onFocus={() => setIsInputFocused(true)} // 聚焦时激活
                    onBlur={() => setIsInputFocused(false)} // 失焦时取消(如果没内容)
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      "w-full h-10 pl-10 pr-4 rounded-lg text-sm font-medium transition-all",
                      // 默认状态：浅灰背景
                      "bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400",
                      // 聚焦状态：白背景 + 蓝边框 + 移除光晕(outline-none)
                      "focus:outline-none focus:bg-white focus:border-sumo-brand",
                    )}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-sumo-red transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </Ceramic>

            {/* 底部状态栏 */}
            <div className="mt-4 flex justify-between px-2 items-center">
              {isFilterActive && (
                <div className="text-xs font-bold text-sumo-brand animate-in fade-in slide-in-from-left-2">
                  {isInputFocused ? "Typing..." : "Filter Active"}
                </div>
              )}
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-auto">
                Showing{" "}
                <span className="text-sumo-dark text-base">
                  {filteredMagazines.length}
                </span>{" "}
                Issues
              </span>
            </div>
          </div>
        </section>

        {/* ==================== 3. Magazine Grid (保持不变) ==================== */}
        <section className="relative pb-32 px-6 z-20">
          <div className="container mx-auto max-w-6xl">
            {filteredMagazines.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                {filteredMagazines.map((mag) => (
                  <div
                    key={mag.id}
                    className="group block relative flex flex-col"
                  >
                    <Ceramic
                      as={Link}
                      href={`/magazines/${mag.id}`}
                      interactive={true}
                      className={cn(
                        "relative mb-8 bg-white",
                        "border-b-sumo-brand",
                        "md:border-b-gray-200 md:hover:border-b-sumo-brand",
                      )}
                    >
                      <div className="p-3">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-inner bg-gray-100">
                          <Image
                            src={mag.coverImage}
                            alt={mag.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </div>
                    </Ceramic>
                    <div className="text-center px-2 flex-grow flex flex-col items-center">
                      <div className="text-xs font-mono text-gray-400 mb-2">
                        {mag.publishDate}
                      </div>
                      <Link href={`/magazines/${mag.id}`} className="block">
                        <h3 className="text-2xl font-serif font-black text-gray-900 mb-2 leading-tight group-hover:text-sumo-brand transition-colors">
                          {mag.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed max-w-xs">
                        {mag.subTitle}
                      </p>
                      <div className="mt-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-sumo-brand flex items-center gap-1 uppercase">
                          View Details <ArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Search size={24} />
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-700 mb-2">
                  No Magazines Found
                </h3>
                <p className="text-gray-400 text-sm">
                  条件に一致する冊子が見つかりませんでした。
                  <br />
                  別のキーワードや地域で検索してみてください。
                </p>
                <button
                  onClick={() => {
                    setActiveRegion("All");
                    setSearchQuery("");
                  }}
                  className="mt-6 text-sm font-bold text-sumo-brand border-b border-sumo-brand/30 hover:border-sumo-brand pb-0.5 transition-colors"
                >
                  フィルターをリセット
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MagazinesPage;
