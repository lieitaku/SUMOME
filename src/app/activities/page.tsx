"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { activitiesData } from "@/data/activities";
import Ceramic from "@/components/ui/Ceramic";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 6; // 每页显示 6 个 (2x3布局)

const ActivitiesPage = () => {
  // --- 状态管理 ---
  const [currentPage, setCurrentPage] = useState(1);

  // --- 分页逻辑 ---
  // 1. 计算总页数
  const totalPages = Math.ceil(activitiesData.length / ITEMS_PER_PAGE);

  // 2. 切割当前页需要显示的数据
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return activitiesData.slice(start, end);
  }, [currentPage]);

  // 3. 翻页处理函数 (带平滑滚动)
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 翻页后平滑滚动到列表顶部
    const listElement = document.getElementById("activity-list-top");
    if (listElement) {
      listElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* ==================== 1. Hero Section (保持不变) ==================== */}
        <section className="relative pt-40 pb-32 overflow-hidden bg-sumo-brand text-white shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-sumo-brand to-[#2454a4]"></div>
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 text-[18vw] font-black text-white opacity-[0.04] select-none pointer-events-none leading-none z-0 mix-blend-overlay tracking-tighter font-sans">
            EVENTS
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 reveal-up">
              <Calendar size={12} className="text-white" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">
                Activity Report
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight mb-6 text-white drop-shadow-sm reveal-up delay-100">
              活動記録
            </h1>

            <p className="text-white/80 font-medium tracking-wide max-w-xl mx-auto leading-relaxed reveal-up delay-200">
              SUMOMEが主催・参加したイベントの様子をお届けします。
              <br className="hidden md:inline" />
              相撲を通じた交流と感動の瞬間をアーカイブ。
            </p>
          </div>
        </section>

        {/* ==================== 2. Activity Grid ==================== */}
        <section className="relative py-24 px-6 z-20" id="activity-list-top">
          <div className="container mx-auto max-w-6xl">
            {/* 列表渲染 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {currentData.map((act, index) => {
                const [year, month, day] = act.date.split(".");

                return (
                  <div
                    key={`${act.id}-${index}`}
                    className="reveal-up h-full"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* 整体陶瓷卡片 */}
                    <Ceramic
                      as={Link}
                      href={`/activities/${act.id}`}
                      interactive={true}
                      className={cn(
                        "flex flex-col h-full overflow-hidden p-0 bg-white",
                        "border-b-sumo-brand",
                        "md:border-b-gray-200 md:hover:border-b-sumo-brand",
                      )}
                    >
                      {/* 封面区域 (竖排比例 3:4) */}
                      <div className="relative aspect-[3/4] bg-gray-100 group">
                        <Image
                          src={act.img}
                          alt={act.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>

                        {/* 日期贴片 */}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 text-center shadow-lg rounded-sm border-t-2 border-sumo-brand z-10 group-hover:-translate-y-1 transition-transform duration-300">
                          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                            {month}月
                          </span>
                          <span className="block text-xl font-serif font-black text-sumo-dark leading-none">
                            {day}
                          </span>
                        </div>

                        {/* 状态标签 */}
                        <div className="absolute bottom-0 right-0 bg-sumo-dark text-white text-[10px] font-bold px-3 py-1.5 tracking-widest uppercase">
                          EVENT REPORT
                        </div>
                      </div>

                      {/* 信息区域 */}
                      <div className="flex flex-col flex-grow p-6 group">
                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 leading-relaxed group-hover:text-sumo-brand transition-colors line-clamp-2">
                          {act.title}
                        </h3>

                        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-6 mt-auto">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-sumo-brand" />
                            <span className="line-clamp-1 max-w-[150px]">
                              {act.location}
                            </span>
                          </div>
                          <span className="text-gray-300">|</span>
                          <span>
                            {year}.{month}.{day}
                          </span>
                        </div>

                        <div className="w-full h-px bg-gray-100 mb-4"></div>

                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold tracking-[0.1em] text-gray-400 group-hover:text-sumo-brand transition-colors uppercase">
                            View Details
                          </span>
                          <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-sumo-brand group-hover:bg-sumo-brand transition-all duration-300">
                            <ArrowRight
                              size={14}
                              className="text-gray-400 group-hover:text-white transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </Ceramic>
                  </div>
                );
              })}
            </div>

            {/* ==================== 3. Dynamic Pagination (动态分页) ==================== */}
            {/* 只有当总页数大于 1 时才显示分页栏，否则完全隐藏，保持极简 */}
            {totalPages > 1 && (
              <div className="mt-24 flex justify-center items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300",
                    currentPage === 1
                      ? "text-gray-200 cursor-not-allowed" // 禁用状态
                      : "text-gray-500 hover:bg-white hover:shadow-md hover:text-sumo-brand cursor-pointer", // 启用状态
                  )}
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold font-serif transition-all duration-300",
                        currentPage === page
                          ? "bg-sumo-dark text-white shadow-lg scale-110" // 当前页
                          : "text-gray-500 hover:bg-white hover:text-sumo-brand", // 其他页
                      )}
                    >
                      {page}
                    </button>
                  ),
                )}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300",
                    currentPage === totalPages
                      ? "text-gray-200 cursor-not-allowed"
                      : "text-gray-500 hover:bg-white hover:shadow-md hover:text-sumo-brand cursor-pointer",
                  )}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
            {/* 如果只有一页，什么都不显示，留白到底部 */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ActivitiesPage;
