"use client";

import React from "react";
import MagazineCarousel from "@/components/about/MagazineCarousel";
import WaveDivider from "@/components/home/WaveDivider"; // 复用首页的波浪组件，保持统一

const AboutPage = () => {
  return (
    <div className="antialiased bg-sumo-bg min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* ==================== 1. Page Hero (氛围头部) ==================== */}
        <section className="relative bg-sumo-dark text-white pt-40 pb-32 px-6 overflow-hidden">
          {/* 背景纹理 */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: `url("'/images/bg/washi.png'")`,
            }}
          ></div>

          {/* 装饰：金色光晕 */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sumo-gold rounded-full blur-[150px] opacity-20 pointer-events-none"></div>

          {/* 装饰：巨大的背景文字 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif font-bold text-white opacity-[0.03] select-none whitespace-nowrap pointer-events-none">
            SUMOME
          </div>

          <div className="container mx-auto text-center relative z-10 reveal-up">
            <p className="text-sumo-gold text-xs font-bold tracking-[0.3em] mb-6 uppercase flex items-center justify-center gap-4">
              <span className="w-8 h-[1px] bg-sumo-gold"></span>
              About Us
              <span className="w-8 h-[1px] bg-sumo-gold"></span>
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-wide">
              SUMOMEについて
            </h1>
            <p className="mt-6 text-gray-400 font-serif tracking-widest text-sm">
              相撲の未来を、ここから紡ぐ。
            </p>
          </div>

          {/* 底部波浪：使用浅色波浪衔接下面的悬浮卡片区域 */}
          <div className="absolute bottom-0 left-0 w-full z-20">
            {/* 如果你想让波浪在这里分割，可以使用 WaveDivider，或者直接留白给悬浮卡片 */}
          </div>
        </section>

        {/* ==================== 2. 正文内容区 (悬浮卡片) ==================== */}
        <section className="relative px-6 pb-24 z-10">
          {/* 这里的 -mt-20 是核心，让白色卡片向上“浮”到深色背景上 */}
          <div className="container mx-auto max-w-5xl bg-white relative z-20 -mt-20 shadow-2xl rounded-sm overflow-hidden reveal-up delay-100">
            {/* 卡片顶部的金色装饰条 */}
            <div className="h-2 w-full bg-gradient-to-r from-sumo-dark via-sumo-gold to-sumo-dark"></div>

            <div className="p-10 md:p-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* 左侧：标题与视觉重心 (占4份) */}
              <div className="lg:col-span-4 flex flex-col justify-start border-b lg:border-b-0 lg:border-r border-gray-100 pb-10 lg:pb-0 lg:pr-10">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-sumo-dark leading-snug mb-8">
                  探す・
                  <br />
                  繋がる・
                  <br />
                  <span className="text-sumo-red">応援する。</span>
                </h2>

                {/* 装饰性的竖排文字 */}
                <div className="hidden lg:block writing-vertical text-gray-300 font-serif text-sm tracking-[0.5em] h-40 border-l border-gray-100 pl-4 ml-2">
                  伝統文化継承
                </div>
              </div>

              {/* 右侧：详细正文 (占8份) */}
              <div className="lg:col-span-8 flex flex-col justify-center">
                <p className="text-gray-600 leading-loose mb-8 font-medium text-justify">
                  <span className="text-2xl float-left mr-1 text-sumo-gold font-serif font-bold">
                    S
                  </span>
                  UMOMEは、全国の相撲クラブを簡単に検索できる専門サイトです。
                  自宅や職場の近くで活動しているクラブを見つけたい方など、どなたでも目的に合ったクラブを探すことができます。
                </p>

                <p className="text-gray-600 leading-loose mb-8 font-medium text-justify">
                  自分に合う場所を見つけ、力士としての第一歩を踏み出したり、推しクラブを見つけて応援することも可能です。
                  私たちは、相撲という伝統文化を通じて、人々の新たな繋がりを創造します。
                </p>

                <div className="bg-sumo-bg p-8 rounded-sm border border-sumo-dark/5">
                  <h3 className="text-sumo-dark font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-sumo-red rounded-full"></span>
                    クラブ運営者様へ
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    登録クラブはPRとしてチームの魅力を外部に発信し、ファンやスポンサーの獲得に繋げます。さらに、毎月無料でフォトブック情報誌
                    <span className="font-bold text-sumo-dark">
                      「MEMORYスポーツ」
                    </span>
                    をプレゼント！素晴らしい仲間との時間を、美しいカタチとして残せます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 3. 杂志轮播板块 ==================== */}
        {/* 加上波浪分割线，保持节奏感 */}
        <div className="relative">
          <WaveDivider
            fill="fill-sumo-bg"
            isRotated={false}
            withTexture={false}
          />
          <div className="bg-sumo-dark ">
            <MagazineCarousel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
