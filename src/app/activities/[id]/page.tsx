"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Share2,
  Printer,
  MapPin,
  Calendar,
  Hash,
  ImageIcon,
} from "lucide-react";
import { activitiesData } from "@/data/activities";
import { getArticleContent } from "@/components/activities/ArticleRegistry";
import ScrollToTop from "@/components/common/ScrollToTop";
import Ceramic from "@/components/ui/Ceramic";

const ActivityDetailPage = () => {
  const params = useParams();
  // 获取 URL 中的 ID (例如: "act-01")
  const id = params.id as string;

  const metaData = activitiesData.find((item) => item.id === id);

  // 获取对应的文章内容组件
  const ContentComponent = getArticleContent(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 404 处理 (或者 Loading)
  if (!metaData) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex flex-col items-center justify-center text-gray-400 font-serif gap-4">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-sumo-brand rounded-full animate-spin"></div>
        <p className="text-xs font-medium tracking-widest">LOADING...</p>
      </div>
    );
  }

  const [year, month, day] = metaData.date.split(".");

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans selection:bg-sumo-brand selection:text-white flex flex-col">
      {/* ... Header 部分 (保持不变) ... */}
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
          OFFICIAL
        </div>

        <div className="container mx-auto max-w-5xl relative z-10 px-6">
          <Link
            href="/activities"
            className="inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors group mb-12 reveal-up"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-sumo-brand transition-all">
              <ArrowLeft size={14} />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
              Back to List
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
              <MapPin size={14} className="text-sumo-gold" />
              <span>{metaData.location}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.2] tracking-wide mb-8 max-w-4xl drop-shadow-sm reveal-up delay-200">
            {metaData.title}
          </h1>
        </div>
      </header>

      {/* ... Content 部分 (保持不变) ... */}
      <section className="relative px-4 md:px-6 -mt-24 z-20 pb-32">
        <div className="container mx-auto max-w-5xl">
          <Ceramic
            interactive={false}
            className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden p-0"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 bg-white min-h-[600px]">
              {/* --- Sidebar --- */}
              <aside className="hidden lg:block lg:col-span-3 border-r border-gray-100 bg-white">
                <div className="sticky top-0 px-8 py-12 flex flex-col gap-10">
                  <div>
                    <div className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-4">
                      Actions
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="flex items-center justify-between px-3 py-2 -ml-3 rounded hover:bg-gray-50 text-xs font-bold text-gray-500 hover:text-sumo-brand transition-colors group">
                        <span className="flex items-center gap-3">
                          <Share2
                            size={14}
                            className="text-gray-400 group-hover:text-sumo-brand"
                          />
                          Share
                        </span>
                      </button>
                      <button className="flex items-center justify-between px-3 py-2 -ml-3 rounded hover:bg-gray-50 text-xs font-bold text-gray-500 hover:text-sumo-dark transition-colors group">
                        <span className="flex items-center gap-3">
                          <Printer
                            size={14}
                            className="text-gray-400 group-hover:text-sumo-dark"
                          />
                          Print
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-4">
                      Keywords
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Event", "Report", "Sumo", "Community"].map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded"
                        >
                          <Hash size={9} className="opacity-50" /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* --- Article Content --- */}
              <article className="lg:col-span-9 p-8 md:p-16 lg:p-20">
                {metaData.img && (
                  <figure className="mb-16 relative group">
                    <div className="relative aspect-video w-full overflow-hidden rounded-sm shadow-xl bg-gray-100 ring-1 ring-black/5">
                      <Image
                        src={metaData.img}
                        alt={metaData.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[0.2]"
                        priority
                      />
                      <div
                        className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay"
                        style={{
                          backgroundImage: `url('/images/bg/noise.png')`,
                        }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                    <figcaption className="mt-3 flex items-center justify-end gap-2 text-[10px] text-gray-400 font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon size={12} />
                      Event Highlight
                    </figcaption>
                  </figure>
                )}

                <div
                  className="prose prose-lg max-w-none 
                            prose-headings:font-serif prose-headings:font-bold prose-headings:text-sumo-dark prose-headings:mt-12
                            prose-p:text-gray-600 prose-p:leading-[2.2] prose-p:font-normal prose-p:text-justify prose-p:mb-8
                            prose-blockquote:border-l-2 prose-blockquote:border-sumo-brand prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-500
                            prose-strong:font-bold prose-strong:text-gray-800
                            prose-img:rounded-sm prose-img:shadow-lg prose-img:my-12
                            marker:text-sumo-brand"
                >
                  {ContentComponent ? (
                    <ContentComponent mainImage={metaData.img} />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 border border-dashed border-gray-200 rounded-sm">
                      <p className="text-gray-400 text-sm font-medium tracking-wide">
                        Content is being prepared...
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-20 pt-8 border-t border-gray-100 lg:hidden">
                  <button className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-widest hover:bg-sumo-brand hover:text-white transition-colors">
                    <Share2 size={14} /> Share Report
                  </button>
                </div>
              </article>
            </div>
          </Ceramic>

          <div className="mt-16 text-center pb-20">
            <Link
              href="/activities"
              className="group inline-flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-sumo-brand group-hover:text-sumo-brand group-hover:-translate-x-1 transition-all">
                <ArrowLeft size={16} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-sumo-brand uppercase tracking-widest transition-colors">
                Back to List
              </span>
            </Link>
          </div>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
};

export default ActivityDetailPage;
