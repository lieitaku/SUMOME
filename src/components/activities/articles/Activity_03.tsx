// src/components/activities/articles/Activity_03.tsx
import React from "react";
import { Ticket, Calendar, MapPin, ArrowUpRight, Info } from "lucide-react";
import type { CustomActivityProps } from "@/lib/article-registry";

// 自定义文章组件 - 内容为精心设计的硬编码排版
const Activity_03 = ({ activity }: CustomActivityProps) => {
  return (
    <div className="space-y-16">
      {/* --- 1. Lead Section: Press Release Header --- */}
      <section className="border-b border-gray-100 pb-12">
        <div className="flex items-center gap-4 mb-8">
          <span className="bg-sumo-dark text-white text-[10px] font-bold px-3 py-1 tracking-widest uppercase rounded-sm shadow-sm">
            Press Release
          </span>
          <div className="h-4 w-px bg-gray-200"></div>
          <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">
            2025.11.15 - 16
          </span>
        </div>

        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-sumo-dark font-bold leading-tight mb-8">
          フォトブック「MEMORY」
          <br className="md:hidden" />
          無料体験ブースを出展
        </h2>

        <p className="text-gray-600 leading-[2.2] text-lg font-light text-justify">
          この度、株式会社MEMORY（以下、弊社）は、横浜赤レンガ倉庫にて開催されるアーバンスポーツの祭典「YOKOHAMA
          URBAN SPORTS FESTIVAL ’25」に出展いたします。
          当日は会場内に特設ブースを設け、弊社の新感覚フォトブック「MEMORY」をその場で作成・発行できる
          <span className="font-bold text-sumo-dark border-b-2 border-sumo-gold/50 mx-1 px-1 hover:bg-sumo-gold/10 transition-colors">
            「無料体験会」
          </span>
          を実施いたします。
        </p>
      </section>

      {/* --- 2. Concept Section: Centered Editorial Style (中心聚焦式排版) --- */}
      <section>
        {/* 装饰背景框：增加版面的"厚度" */}
        <div className="bg-[#FAFAFA] border border-gray-100 rounded-sm p-8 md:p-20 relative overflow-hidden group">
          {/* 背景装饰字，增加纹理感 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[12rem] font-serif font-bold text-gray-200/40 select-none pointer-events-none leading-none -mt-8 font-italic">
            &
          </div>

          {/* 1. 核心标题 (Slogan) - 居中展示，气场全开 */}
          <div className="text-center mb-16 relative z-10">
            <h3 className="text-2xl md:text-4xl font-serif font-bold text-sumo-dark leading-snug tracking-wide">
              フェスティバルの熱気を、
              <br />
              その場で「一冊」に。
            </h3>
            {/* 金色装饰线 */}
            <div className="w-16 h-[3px] bg-sumo-gold mx-auto mt-8 rounded-full"></div>
          </div>

          {/* 2. 正文 (Body) - 限制宽度以提升阅读体验 */}
          <div className="max-w-2xl mx-auto relative z-10 space-y-10">
            <p className="text-gray-600 leading-[2.2] text-justify md:text-center font-light">
              スケートボードやブレイキンなど、世界基準のアーバンスポーツが横浜に集結するこの2日間。会場で撮影したお気に入りの写真や、友人・家族との笑顔の瞬間を、その場で「MEMORY」にしてみませんか？
            </p>

            {/* 3. 卖点卡片 (Feature Box) - 像一张精致的便签 */}
            <div className="bg-white p-8 md:p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border-t-4 border-sumo-dark relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-100/50 backdrop-blur-sm -z-10 transform skew-x-12"></div>

              <h4 className="font-serif text-sumo-dark font-bold text-lg mb-4 flex items-center justify-center gap-3">
                <span className="w-2 h-2 bg-sumo-gold rounded-full"></span>
                「情報誌」スタイルのフォトブック
              </h4>
              <p className="text-gray-500 text-sm leading-loose text-justify">
                「MEMORY」は、単に写真をまとめるだけではなく、その日のニュースや出来事も共に掲載されます。楽しかったイベントの記憶を、その時代の空気感とともに「タイムカプセル」のように閉じ込めてお持ち帰りいただけます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. Invitation Ticket Section (虚拟入场券设计) --- */}
      {/* 这是一个高视觉权重的区块，模拟“票券”的感觉 */}
      <section className="relative group perspective-1000">
        {/* 背景投影 */}
        <div className="absolute inset-0 bg-sumo-gold/5 transform rotate-1 rounded-sm transition-transform duration-500 group-hover:rotate-0"></div>

        {/* 票券主体 */}
        <div className="relative bg-white border border-sumo-gold border-dashed rounded-sm p-8 md:p-12 shadow-sm transition-transform duration-500 group-hover:-translate-y-1">
          {/* 左侧切口模拟 */}
          <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#ffffff] rounded-full transform -translate-y-1/2 border-r border-sumo-gold border-dashed hidden md:block"></div>
          <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#ffffff] rounded-full transform -translate-y-1/2 border-l border-sumo-gold border-dashed hidden md:block"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-100 pb-8 border-dashed">
            <div className="flex items-center gap-3 text-sumo-gold mb-2 md:mb-0">
              <Ticket size={24} />
              <span className="text-xs font-bold tracking-[0.3em] uppercase">
                Invitation
              </span>
            </div>
            <div className="text-sumo-dark font-serif font-bold text-xl md:text-3xl tracking-tight">
              どなたでも無料で体験可能
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
            <div>
              <p className="text-gray-600 text-sm leading-loose mb-6 text-justify">
                今回のブースでは、実際にスマートフォンなどの写真データを使って、ご自身だけのオリジナルフォトブック作成を無料で体験いただけます。
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: "📱", text: "Smartphone OK" },
                  { icon: "👨‍👩‍👧", text: "Family Welcome" },
                  { icon: "✨", text: "Free Charge" },
                ].map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-50 text-gray-500 border border-gray-200 px-3 py-1.5 text-[10px] font-bold tracking-wider rounded-sm uppercase flex items-center gap-2"
                  >
                    <span>{tag.icon}</span> {tag.text}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-end">
              {/* 价格展示 */}
              <div className="text-center group-hover:scale-110 transition-transform duration-500">
                <p className="text-[10px] text-gray-400 mb-1 font-bold tracking-widest uppercase">
                  Visit Our Booth
                </p>
                <p className="text-sumo-dark font-serif font-bold text-5xl">
                  ¥0
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. Event Outline (规格表) --- */}
      <section>
        <div className="border-t-2 border-sumo-dark mb-2"></div>
        <div className="border-t border-gray-200">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200 py-6 gap-4 hover:bg-gray-50 transition-colors px-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest md:col-span-1 py-1 flex items-center gap-2">
              <Info size={12} /> Event Name
            </div>
            <div className="text-sm font-bold text-sumo-dark md:col-span-3 font-serif tracking-wide">
              YOKOHAMA URBAN SPORTS FESTIVAL ’25 <br />
              <span className="text-xs text-gray-400 font-sans font-normal mt-1 block">
                （横浜アーバンスポーツフェスティバル2025）
              </span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200 py-6 gap-4 hover:bg-gray-50 transition-colors px-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest md:col-span-1 py-1 flex items-center gap-2">
              <Calendar size={12} /> Date
            </div>
            <div className="text-sm font-medium text-gray-700 md:col-span-3">
              2025年11月15日(土)・16日(日)
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200 py-6 gap-4 hover:bg-gray-50 transition-colors px-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest md:col-span-1 py-1 flex items-center gap-2">
              <MapPin size={12} /> Venue
            </div>
            <div className="text-sm font-medium text-gray-700 md:col-span-3">
              横浜赤レンガ倉庫 イベント広場・赤レンガパーク
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200 py-6 gap-4 hover:bg-gray-50 transition-colors px-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest md:col-span-1 py-1 flex items-center gap-2">
              <Ticket size={12} /> Exhibition
            </div>
            <div className="text-sm font-medium text-gray-700 md:col-span-3">
              フォトブック「MEMORY」の展示および無料作成体験
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. Closing --- */}
      <section className="flex flex-col md:flex-row justify-between items-end pt-8 bg-gray-50 p-8 rounded-sm">
        <p className="text-gray-600 leading-loose text-sm font-medium mb-6 md:mb-0">
          横浜赤レンガ倉庫にて、
          <br className="md:hidden" />
          皆様の思い出づくりをお手伝いできることを楽しみにしております。
          <br />
          ぜひお気軽に弊社ブースへお立ち寄りください。
        </p>
        <button className="flex items-center gap-2 text-sumo-dark text-xs font-bold tracking-widest uppercase cursor-pointer hover:text-sumo-gold transition-colors border-b border-sumo-dark pb-1 hover:border-sumo-gold group">
          Official Site{" "}
          <ArrowUpRight
            size={14}
            className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </section>
    </div>
  );
};

export default Activity_03;
