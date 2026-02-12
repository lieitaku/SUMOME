import React from "react";
import { Calendar } from "lucide-react";
import ActivitiesListClient from "@/components/activities/ActivitiesListClient";

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const initialPage = Math.max(1, Number(pageParam) || 1);

  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* ==================== 1. Hero Section ==================== */}
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

        {/* ==================== 2. Activity Grid (client, from API) ==================== */}
        <ActivitiesListClient initialPage={initialPage} />
      </main>
    </div>
  );
}
