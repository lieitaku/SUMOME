"use client";

import React from "react";
import Link from "@/components/ui/TransitionLink";
import Ceramic from "@/components/ui/Ceramic";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import MobileBackToHomeInHero from "@/components/layout/MobileBackToHomeInHero";

const AboutPage = () => {
  const t = useTranslations("AboutPage");
  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col selection:bg-sumo-brand selection:text-white">
      <main className="flex-grow">
        {/* ==================== 1. Header (统一碧空风格) ==================== */}
        <section className="relative bg-sumo-brand text-white pt-0 pb-20 md:pb-48 overflow-hidden shadow-xl lg:pt-32">
          {/* 背景：深邃蓝天 */}
          <div className="absolute inset-0 bg-gradient-to-b from-sumo-brand to-[#2454a4]"></div>

          {/* 纹理：网格 */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* 大字水印 */}
          <div className="absolute top-1/2 right-10 -translate-y-1/2 text-[15vw] font-black text-white opacity-[0.03] select-none pointer-events-none leading-none mix-blend-overlay tracking-tighter font-sans">
            ABOUT
          </div>

          <div className="container mx-auto max-w-6xl relative z-10 px-6 text-center">
            <MobileBackToHomeInHero />
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-6 text-white drop-shadow-sm reveal-up delay-100">
              {t("heroTitle")}
            </h1>

            <p className="text-white/80 font-medium tracking-wide max-w-xl mx-auto leading-relaxed reveal-up delay-200">
              {t("heroSubtitleLine1")}
              <br className="hidden md:inline" />
              {t("heroSubtitleLine2")}
            </p>
          </div>
        </section>

        {/* ==================== 2. Main Content (左灰右白·陶瓷布局) ==================== */}
        <section className="relative px-4 md:px-6 z-20 -mt-10 md:-mt-24 pb-12 md:pb-32">
          <div className="container mx-auto max-w-6xl">
            <Ceramic
              interactive={false}
              className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden p-0"
            >
              <div className="flex flex-col lg:flex-row min-h-[800px]">
                {/* --- A. Left Side: Visual Anchor (淡雅灰白) --- */}
                <div className="lg:w-5/12 bg-[#FAFAFA] border-r border-gray-100 p-10 md:p-16 relative overflow-hidden">

                  <div className="relative z-10 sticky top-12 h-full flex flex-col">
                    {/* 核心标语 */}
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-sumo-dark leading-[1.4] tracking-wide mb-12">
                      {t("sloganLine1")}
                      <br />
                      {t("sloganLine2")}
                      <br />
                      <span className="text-sumo-red relative inline-block">
                        {t("sloganLine3")}
                      </span>
                    </h2>

                    <div className="w-12 h-1 bg-gray-200 mb-12"></div>

                    {/* 竖排装饰文字 (Japanese Soul) */}
                    <div className="flex-grow relative">
                      <div className="writing-vertical text-gray-200 font-serif font-bold text-6xl select-none absolute top-0 left-0 tracking-widest opacity-50">
                        {t("verticalAside")}
                      </div>
                    </div>

                    {/* 底部装饰テキスト */}
                    <div className="mt-auto">
                      <p className="text-[10px] text-gray-400 font-bold tracking-[0.3em] uppercase">
                        {t("traditionInnovation")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* --- B. Right Side: Story & CTA (纯白阅读区) --- */}
                <div className="lg:w-7/12 bg-white p-10 md:p-16 lg:p-20 flex flex-col justify-center">
                  {/* 正文段落 */}
                  <div className="space-y-10 text-gray-600 leading-[2.4] font-medium text-justify text-base md:text-lg mb-16">
                    <p>
                      <span className="text-5xl float-left mr-4 mt-[-8px] text-sumo-brand font-serif font-black">
                        S
                      </span>
                      {t("storyP1")}
                    </p>
                    <p>{t("storyP2")}</p>
                  </div>

                  {/* --- Call to Action Card (For Owners) --- */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-sumo-brand to-sumo-dark rounded-xl opacity-10 group-hover:opacity-20 transition duration-500 blur-sm"></div>
                    <div className="relative bg-[#F8F9FA] rounded-xl border border-gray-200 p-8 md:p-10 transition-all duration-300 hover:bg-white hover:shadow-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-sumo-dark text-white text-[10px] font-bold tracking-widest uppercase rounded-sm mb-6">
                        {t("badgeForOwners")}
                      </div>

                      <h3 className="text-xl font-serif font-bold text-sumo-dark mb-4 flex items-center gap-3">
                        {t("ctaHeading")}
                      </h3>

                      <p className="text-sm text-gray-500 leading-loose mb-8">
                        {t("ctaBody")}
                      </p>

                      <Link href="/partners" className="inline-flex">
                        <button className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-300 rounded-lg text-xs font-bold uppercase tracking-widest text-sumo-dark hover:bg-sumo-brand hover:text-white hover:border-sumo-brand transition-all duration-300 shadow-sm hover:-translate-y-1">
                          <span>{t("ctaButton")}</span>
                          <ArrowRight size={14} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Ceramic>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
