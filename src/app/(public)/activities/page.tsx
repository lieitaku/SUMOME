import React from "react";
import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import ActivitiesListClient from "@/components/activities/ActivitiesListClient";
import { getCachedActivitiesPage } from "@/lib/cached-queries";

export const metadata: Metadata = {
  title: "活動記録・イベント情報",
  description:
    "SUMOMEが主催・参加した相撲イベント・大会の活動記録。アマチュア相撲の大会情報やイベントレポートをご覧いただけます。",
  alternates: { canonical: "https://www.memory-sumo.com/activities" },
};

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const pageParam = searchParams?.page;
  const initialPage = Math.max(1, Number(pageParam) || 1);
  const initialData = await getCachedActivitiesPage(initialPage);

  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* ==================== 1. Hero Section ==================== */}
        <section className="relative pt-40 pb-20 md:pb-32 overflow-hidden bg-sumo-brand text-white shadow-xl">
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
            <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight mb-6 text-white drop-shadow-sm">
              活動記録
            </h1>
            <p className="text-white/80 font-medium tracking-wide max-w-xl mx-auto leading-relaxed">
              SUMOMEが主催・参加したイベントの様子をお届けします。
            </p>
          </div>
        </section>

        {/* ==================== 2. Activity Grid (client, from API) ==================== */}
        <ActivitiesListClient 
          initialPage={initialPage} 
          initialData={{
            ...initialData,
            activities: initialData.activities.map(act => ({
              ...act,
              date: act.date instanceof Date ? act.date.toISOString() : act.date,
            })),
          }} 
        />
      </main>
    </div>
  );
}
