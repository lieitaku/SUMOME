"use client";

import React from "react";
import Link from "@/components/ui/TransitionLink";
import Ceramic from "@/components/ui/Ceramic";
import { ArrowRight, Sparkles, Target, Users, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const AboutPage = () => {
  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col selection:bg-sumo-brand selection:text-white">
      <main className="flex-grow">
        {/* ==================== 1. Header (统一碧空风格) ==================== */}
        <section className="relative bg-sumo-brand text-white pt-32 pb-48 overflow-hidden shadow-xl">
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
            {/* 顶部胶囊 */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 reveal-up">
              <Sparkles size={12} className="text-white" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">
                Our Mission
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-6 text-white drop-shadow-sm reveal-up delay-100">
              SUMOMEについて
            </h1>

            <p className="text-white/80 font-medium tracking-wide max-w-xl mx-auto leading-relaxed reveal-up delay-200">
              相撲の未来を、ここから紡ぐ。
              <br className="hidden md:inline" />
              伝統と革新が交差する、新しいプラットフォーム。
            </p>
          </div>
        </section>

        {/* ==================== 2. Main Content (左灰右白·陶瓷布局) ==================== */}
        <section className="relative px-4 md:px-6 z-20 -mt-24 pb-32">
          <div className="container mx-auto max-w-6xl">
            <Ceramic
              interactive={false}
              className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden p-0"
            >
              <div className="flex flex-col lg:flex-row min-h-[800px]">
                {/* --- A. Left Side: Visual Anchor (淡雅灰白) --- */}
                <div className="lg:w-5/12 bg-[#FAFAFA] border-r border-gray-100 p-10 md:p-16 relative overflow-hidden">
                  {/* 纹理 */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: "url('/images/bg/noise.png')" }}
                  ></div>

                  <div className="relative z-10 sticky top-12 h-full flex flex-col">
                    {/* 核心标语 */}
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-sumo-dark leading-[1.4] tracking-wide mb-12">
                      探す。
                      <br />
                      繋がる。
                      <br />
                      <span className="text-sumo-red relative inline-block">
                        応援する。
                      </span>
                    </h2>

                    <div className="w-12 h-1 bg-gray-200 mb-12"></div>

                    {/* 竖排装饰文字 (Japanese Soul) */}
                    <div className="flex-grow relative">
                      <div className="writing-vertical text-gray-200 font-serif font-bold text-6xl select-none absolute top-0 left-0 tracking-widest opacity-50">
                        相撲道
                      </div>
                    </div>

                    {/* 底部英文装饰 */}
                    <div className="mt-auto">
                      <p className="text-[10px] text-gray-400 font-bold tracking-[0.3em] uppercase">
                        Tradition & Innovation
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
                      UMOMEは、全国の相撲クラブを簡単に検索できる専門サイトです。
                      自宅や職場の近くで活動しているクラブを見つけたい方など、どなたでも目的に合ったクラブを探すことができます。
                    </p>
                    <p>
                      自分に合う場所を見つけ、力士としての第一歩を踏み出したり、推しクラブを見つけて応援することも可能です。
                      私たちは、相撲という伝統文化を通じて、人々の新たな繋がりを創造します。
                    </p>
                  </div>

                  {/* --- Call to Action Card (For Owners) --- */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-sumo-brand to-sumo-dark rounded-xl opacity-10 group-hover:opacity-20 transition duration-500 blur-sm"></div>
                    <div className="relative bg-[#F8F9FA] rounded-xl border border-gray-200 p-8 md:p-10 transition-all duration-300 hover:bg-white hover:shadow-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-sumo-dark text-white text-[10px] font-bold tracking-widest uppercase rounded-sm mb-6">
                        For Club Owners
                      </div>

                      <h3 className="text-xl font-serif font-bold text-sumo-dark mb-4 flex items-center gap-3">
                        道場・クラブ運営者様へ
                      </h3>

                      <p className="text-sm text-gray-500 leading-loose mb-8">
                        登録クラブはPRとしてチームの魅力を外部に発信し、ファンやスポンサーの獲得に繋げます。さらに、毎月無料でフォトブック情報誌
                        <strong className="text-sumo-brand border-b border-sumo-brand/20 mx-1 font-bold">
                          「MEMORYスポーツ」
                        </strong>
                        をプレゼント。
                      </p>

                      <Link href="/contact" className="inline-flex">
                        <button className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-300 rounded-lg text-xs font-bold uppercase tracking-widest text-sumo-dark hover:bg-sumo-brand hover:text-white hover:border-sumo-brand transition-all duration-300 shadow-sm hover:-translate-y-1">
                          <span>お問い合わせ・登録</span>
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
