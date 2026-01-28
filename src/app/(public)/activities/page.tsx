import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { prisma } from "@/lib/db";
import Ceramic from "@/components/ui/Ceramic";
import { cn } from "@/lib/utils";

// 每页显示数量
const ITEMS_PER_PAGE = 6;

// ✨ Server Component 接收 searchParams 来处理分页
export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;

  // 1. 并发获取数据：活动列表和总数
  const [activities, totalItems] = await Promise.all([
    prisma.activity.findMany({
      where: { published: true },
      include: { club: { select: { name: true } } },
      orderBy: { date: "desc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.activity.count({ where: { published: true } }),
  ]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* ==================== 1. Hero Section (保持你的精致设计) ==================== */}
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
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
              <Calendar size={12} className="text-white" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">
                Activity Report
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight mb-6 text-white drop-shadow-sm">
              活動記録
            </h1>
            <p className="text-white/80 font-medium tracking-wide max-w-xl mx-auto leading-relaxed">
              SUMOMEが主催・参加したイベントの様子をお届けします。
            </p>
          </div>
        </section>

        {/* ==================== 2. Activity Grid ==================== */}
        <section className="relative py-24 px-6 z-20" id="activity-list-top">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {activities.map((act) => {
                const date = new Date(act.date);
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const year = date.getFullYear();

                return (
                  <div key={act.id} className="h-full">
                    <Ceramic
                      as={Link}
                      href={`/activities/${act.id}`}
                      interactive={true}
                      className="flex flex-col h-full overflow-hidden p-0 bg-white border-b-sumo-brand md:border-b-gray-200 md:hover:border-b-sumo-brand"
                    >
                      <div className="relative aspect-[3/4] bg-gray-100 group">
                        <Image
                          src={act.mainImage || "/images/placeholder.jpg"}
                          alt={act.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        {/* 日期贴片 */}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 text-center shadow-lg rounded-sm border-t-2 border-sumo-brand z-10">
                          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                            {month}月
                          </span>
                          <span className="block text-xl font-serif font-black text-sumo-dark leading-none">
                            {day}
                          </span>
                        </div>
                        <div className="absolute bottom-0 right-0 bg-sumo-dark text-white text-[10px] font-bold px-3 py-1.5 tracking-widest uppercase">
                          {act.category}
                        </div>
                      </div>

                      <div className="flex flex-col flex-grow p-6 group">
                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 leading-relaxed group-hover:text-sumo-brand transition-colors line-clamp-2">
                          {act.title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-6 mt-auto">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-sumo-brand" />
                            <span className="line-clamp-1">
                              {act.location || act.club?.name}
                            </span>
                          </div>
                          <span className="text-gray-300">|</span>
                          <span>{year}.{month < 10 ? `0${month}` : month}.{day < 10 ? `0${day}` : day}</span>
                        </div>
                        <div className="w-full h-px bg-gray-100 mb-4"></div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold tracking-[0.1em] text-gray-400 group-hover:text-sumo-brand transition-colors uppercase">
                            View Details
                          </span>
                          <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-sumo-brand group-hover:bg-sumo-brand transition-all duration-300">
                            <ArrowRight size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Ceramic>
                  </div>
                );
              })}
            </div>

            {/* ==================== 3. Server-side Pagination ==================== */}
            {totalPages > 1 && (
              <div className="mt-24 flex justify-center items-center gap-3">
                {/* Prev */}
                <Link
                  href={`/activities?page=${currentPage - 1}`}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full transition-all",
                    currentPage === 1 ? "pointer-events-none opacity-20" : "hover:bg-white hover:shadow-md text-gray-500"
                  )}
                >
                  <ChevronLeft size={16} />
                </Link>

                {/* Pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Link
                    key={page}
                    href={`/activities?page=${page}`}
                    className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold font-serif transition-all",
                      currentPage === page ? "bg-sumo-dark text-white shadow-lg scale-110" : "text-gray-500 hover:bg-white"
                    )}
                  >
                    {page}
                  </Link>
                ))}

                {/* Next */}
                <Link
                  href={`/activities?page=${currentPage + 1}`}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-full transition-all",
                    currentPage === totalPages ? "pointer-events-none opacity-20" : "hover:bg-white hover:shadow-md text-gray-500"
                  )}
                >
                  <ChevronRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}