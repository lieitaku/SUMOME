"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { magazinesData } from "@/data/magazines";
import {
  ArrowLeft,
  BookOpen,
  Share2,
  Download,
  Calendar,
  Tag,
  Layers,
  ArrowRight,
} from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import ScrollToTop from "@/components/common/ScrollToTop";

const MagazineDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const magazine = magazinesData.find((item) => item.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!magazine) return notFound();

  const [year, month, day] = magazine.publishDate.split(".");

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans selection:bg-sumo-brand selection:text-white flex flex-col">
      {/* ==================== 1. Header (纯文字排版) ==================== */}
      <header className="relative bg-sumo-brand text-white pt-32 pb-48 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-sumo-brand to-[#2454a4]"></div>
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute top-1/2 right-10 -translate-y-1/2 text-[12vw] font-black text-white opacity-[0.03] select-none pointer-events-none leading-none mix-blend-overlay tracking-tighter font-sans">
          ISSUE
        </div>

        <div className="container mx-auto max-w-6xl relative z-10 px-6">
          <Link
            href="/magazines"
            className="inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors group mb-12 reveal-up"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-sumo-brand transition-all">
              <ArrowLeft size={14} />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
              Back to Library
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-6 mb-8 reveal-up delay-100 opacity-90">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wide">
              <Calendar size={14} className="text-sumo-gold" />
              <span>
                {year}.{month}.{day}
              </span>
            </div>
            <div className="w-px h-3 bg-white/30"></div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide">
              <Tag size={14} className="text-sumo-gold" />
              <span>Vol. {magazine.id.replace("vol-", "")}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.2] tracking-wide mb-4 max-w-4xl drop-shadow-sm reveal-up delay-200">
            {magazine.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-medium font-serif italic reveal-up delay-300">
            {magazine.subTitle}
          </p>
        </div>
      </header>

      {/* ==================== 2. Main Content (白瓷容器) ==================== */}
      <section className="relative px-4 md:px-6 -mt-24 z-20 pb-32">
        <div className="container mx-auto max-w-6xl">
          <Ceramic
            interactive={false}
            className="bg-white border-b-[6px] border-b-sumo-brand shadow-2xl overflow-hidden p-0"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 bg-white min-h-[600px]">
              {/* --- A. Left Sidebar (Cover & Actions) --- */}
              <aside className="lg:col-span-5 border-r border-gray-100 bg-gray-50/40 p-8 md:p-12">
                <div className="lg:sticky lg:top-12 flex flex-col items-center lg:items-start gap-8">
                  {/* 封面图 (Cover Image) */}
                  <div className="relative w-[280px] md:w-[320px] aspect-[3/4] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-sm group perspective-1000">
                    {/* 书脊效果 */}
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-r from-gray-900/20 to-transparent z-20 rounded-l-sm"></div>
                    <div className="absolute inset-0 bg-white rounded-sm overflow-hidden transform transition-transform duration-500 group-hover:rotate-y-2 origin-left">
                      <Image
                        src={magazine.coverImage}
                        alt={magazine.title}
                        fill
                        className="object-cover"
                        priority
                      />
                      {/* 光泽 */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="w-full max-w-[320px] space-y-4">
                    <button className="w-full flex items-center justify-center gap-3 py-4 bg-sumo-dark text-white text-sm font-bold tracking-widest uppercase rounded shadow-lg hover:bg-sumo-brand transition-all hover:-translate-y-1">
                      <BookOpen size={18} />
                      Read For Free
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded hover:border-sumo-brand hover:text-sumo-brand transition-colors">
                        <Share2 size={14} /> Share
                      </button>
                      <button className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded hover:border-sumo-dark hover:text-sumo-dark transition-colors">
                        <Download size={14} /> PDF
                      </button>
                    </div>
                  </div>
                </div>
              </aside>

              {/* --- B. Right Content (Visual Preview) --- */}
              <article className="lg:col-span-7 p-8 md:p-16 lg:p-20">
                {/* 简介 */}
                <div className="mb-16">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <div className="w-8 h-[1px] bg-gray-300"></div>
                    Editorial Note
                  </h3>
                  <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed font-serif">
                    {magazine.description}
                  </p>
                </div>

                {/* 内页预览 (模拟画廊) */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="w-8 h-[1px] bg-gray-300"></div>
                      Inside Look
                    </h3>
                    <span className="text-xs font-bold text-sumo-brand flex items-center gap-1">
                      <Layers size={12} /> Gallery View
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="relative aspect-square bg-gray-100 rounded overflow-hidden group cursor-pointer"
                      >
                        {/* 模拟内页内容 */}
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-300 font-serif text-4xl font-bold opacity-30 group-hover:scale-110 transition-transform duration-700">
                          Page {item}
                        </div>
                        {/* 遮罩 */}
                        <div className="absolute inset-0 bg-sumo-dark/0 group-hover:bg-sumo-dark/20 transition-colors duration-300"></div>
                        {/* 放大图标 */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                            <ArrowRight size={16} className="text-sumo-dark" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mt-6 text-xs text-gray-400 text-center font-medium italic">
                    * Sample pages from the digital edition.
                  </p>
                </div>
              </article>
            </div>
          </Ceramic>

          {/* Back Button */}
          <div className="mt-16 text-center pb-20">
            <Link
              href="/magazines"
              className="group inline-flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-sumo-brand group-hover:text-sumo-brand group-hover:-translate-x-1 transition-all">
                <ArrowLeft size={16} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-sumo-brand uppercase tracking-widest transition-colors">
                Back to Library
              </span>
            </Link>
          </div>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
};

export default MagazineDetailPage;
