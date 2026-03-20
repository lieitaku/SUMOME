"use client";

import React from "react";
import Ceramic from "@/components/ui/Ceramic";
import { Building2, Users, MapPin, Info, Target, Lightbulb, CheckCircle2 } from "lucide-react";

const CompanyPage = () => {
  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col selection:bg-sumo-brand selection:text-white">
      <main className="flex-grow">
        {/* ==================== 1. Header ==================== */}
        <section className="relative bg-sumo-brand text-white pt-24 pb-12 md:pt-32 md:pb-48 overflow-hidden shadow-xl">
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
            COMPANY
          </div>

          <div className="container mx-auto max-w-6xl relative z-10 px-6 text-center">
            <h1 className="text-[clamp(1.25rem,5.2vw+0.45rem,1.875rem)] md:text-6xl font-serif font-bold tracking-tight mb-4 md:mb-6 text-white drop-shadow-sm reveal-up delay-100">
              会社概要
            </h1>

            <p className="text-white/80 text-[clamp(0.65rem,1.65vw+0.42rem,0.875rem)] md:text-base font-medium tracking-wide max-w-xl mx-auto leading-relaxed reveal-up delay-200">
              memory株式会社について
            </p>
          </div>
        </section>

        {/* ==================== 2. Main Content ==================== */}
        <section className="relative px-4 md:px-6 z-20 -mt-8 md:-mt-24 pb-10 md:pb-32">
          <div className="container mx-auto max-w-4xl">
            <Ceramic
              interactive={false}
              className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden p-5 md:p-16"
            >
              {/* --- A. 会社基本情報 --- */}
              <div className="mb-12 md:mb-20">
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10 border-b border-gray-100 pb-4 md:pb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-sumo-brand/10 flex items-center justify-center text-sumo-brand shrink-0">
                    <Building2 className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h2 className="text-[clamp(1.0625rem,3.4vw+0.5rem,1.5rem)] md:text-3xl font-serif font-bold text-sumo-dark tracking-wide">
                    基本情報
                  </h2>
                </div>

                <div className="space-y-3 md:space-y-6">
                  {/* 会社名 */}
                  <div className="flex flex-col md:flex-row md:items-center py-3 md:py-4 border-b border-gray-50">
                    <div className="w-full md:w-48 text-gray-500 font-bold mb-1 md:mb-0 flex items-center gap-2 text-[clamp(0.6875rem,1.5vw+0.42rem,0.875rem)] md:text-base">
                      <Info size={16} /> 会社名
                    </div>
                    <div className="flex-1 text-gray-800 font-medium text-[clamp(0.8125rem,1.8vw+0.45rem,1rem)] md:text-lg">
                      memory株式会社
                    </div>
                  </div>

                  {/* 代表者 */}
                  <div className="flex flex-col md:flex-row py-3 md:py-4 border-b border-gray-50">
                    <div className="w-full md:w-48 text-gray-500 font-bold mb-1 md:mb-0 flex items-center gap-2 mt-1 text-[clamp(0.6875rem,1.5vw+0.42rem,0.875rem)] md:text-base">
                      <Users size={16} /> 代表者
                    </div>
                    <div className="flex-1 text-gray-800 font-medium space-y-1 md:space-y-2 text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">
                      {/* 统一的 2列 grid：同一份列宽 => 三行“氏名”起点严格对齐 */}
                      <div className="grid grid-cols-[auto_1fr] gap-x-6 items-baseline">
                        <span className="whitespace-nowrap">取締役会長:</span>
                        <span>工藤 勇一</span>

                        <span className="whitespace-nowrap">代表取締役:</span>
                        <span>石巻 涼</span>
                      </div>
                    </div>
                  </div>

                  {/* 設立 */}
                  <div className="flex flex-col md:flex-row md:items-center py-3 md:py-4 border-b border-gray-50">
                    <div className="w-full md:w-48 text-gray-500 font-bold mb-1 md:mb-0 flex items-center gap-2 text-[clamp(0.6875rem,1.5vw+0.42rem,0.875rem)] md:text-base">
                      <Target size={16} /> 設立
                    </div>
                    <div className="flex-1 text-gray-800 font-medium text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">
                      2013年（平成25年）3月27日
                    </div>
                  </div>

                  {/* 資本金 */}
                  <div className="flex flex-col md:flex-row md:items-center py-3 md:py-4 border-b border-gray-50">
                    <div className="w-full md:w-48 text-gray-500 font-bold mb-1 md:mb-0 flex items-center gap-2 text-[clamp(0.6875rem,1.5vw+0.42rem,0.875rem)] md:text-base">
                      <Building2 size={16} /> 資本金
                    </div>
                    <div className="flex-1 text-gray-800 font-medium text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">
                      9500万円
                    </div>
                  </div>

                  {/* 本社 */}
                  <div className="flex flex-col md:flex-row py-3 md:py-4 border-b border-gray-50">
                    <div className="w-full md:w-48 text-gray-500 font-bold mb-1 md:mb-0 flex items-center gap-2 mt-1 text-[clamp(0.6875rem,1.5vw+0.42rem,0.875rem)] md:text-base">
                      <MapPin size={16} /> 本社
                    </div>
                    <div className="flex-1 text-gray-800 font-medium leading-relaxed text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">
                      〒103-0016<br />
                      東京都中央区日本橋小網町4番9号 恵和ビル3階<br />
                      <span className="text-gray-500 text-[clamp(0.625rem,1.35vw+0.38rem,0.75rem)] md:text-sm mt-1 inline-block">TEL：03-5244-9802 / FAX：035-244-9803</span>
                    </div>
                  </div>

                  {/* 名古屋営業所 */}
                  <div className="flex flex-col md:flex-row py-3 md:py-4 border-b border-gray-50">
                    <div className="w-full md:w-48 text-gray-500 font-bold mb-1 md:mb-0 flex items-center gap-2 mt-1 text-[clamp(0.6875rem,1.5vw+0.42rem,0.875rem)] md:text-base">
                      <MapPin size={16} /> 名古屋営業所
                    </div>
                    <div className="flex-1 text-gray-800 font-medium leading-relaxed text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">
                      〒451-0042<br />
                      名古屋市西区那古野2丁目12-21-1スクエアオフィス名駅北５階<br />
                      <span className="text-gray-500 text-[clamp(0.625rem,1.35vw+0.38rem,0.75rem)] md:text-sm mt-1 inline-block">TEL：052-526-3377 / FAX：052-526-3378</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- B. MEMORY 連携企画概要 --- */}
              <div>
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10 border-b border-gray-100 pb-4 md:pb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-sumo-brand/10 flex items-center justify-center text-sumo-brand shrink-0">
                    <Target className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h2 className="text-[clamp(1rem,2.8vw+0.48rem,1.375rem)] md:text-3xl font-serif font-bold text-sumo-dark tracking-wide leading-snug">
                    MEMORY 連携企画概要
                  </h2>
                </div>

                <div className="space-y-8 md:space-y-12">
                  {/* 1. 概要（見出し・体裁を 2 / 3 と統一） */}
                  <div>
                    <h3 className="text-[clamp(0.9375rem,2.4vw+0.48rem,1.125rem)] md:text-xl font-serif font-bold text-sumo-dark mb-4 md:mb-6 flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[clamp(0.625rem,1.5vw+0.35rem,0.75rem)] md:text-sm shrink-0">
                        1
                      </span>
                      概要
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-5 md:p-8 border border-gray-100">
                      <div className="space-y-4 text-gray-700 font-medium leading-relaxed md:leading-loose text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base text-justify">
                        <p>
                          当社が独自に開発したビジネスモデル「フォトブック情報誌」を活用し、スポンサーの企業価値向上、営業力強化等に貢献するとともに、写真に掲載される方々(以後 被写体)の思い出の記録としても、形として残り続けるものになる。
                        </p>
                        <p>
                          被写体の属する幼稚園・福祉施設他様々な事業者の事業案内・認知度向上を図り、関係者全員が各々メリットがある仕組みを構築した。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. 提案に至る経緯 */}
                  <div>
                    <h3 className="text-[clamp(0.9375rem,2.4vw+0.48rem,1.125rem)] md:text-xl font-serif font-bold text-sumo-dark mb-4 md:mb-6 flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[clamp(0.625rem,1.5vw+0.35rem,0.75rem)] md:text-sm shrink-0">2</span>
                      提案に至る経緯
                    </h3>
                    
                    <div className="grid gap-4 md:gap-6">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-[clamp(0.8125rem,2vw+0.45rem,1rem)] md:text-lg text-sumo-dark mb-2 md:mb-3 flex items-start md:items-center gap-2">
                          <Lightbulb className="text-yellow-500 shrink-0 mt-0.5 md:mt-0" size={18} />
                          <span>スポンサーのメリット…営業サポートや福利厚生面での効果期待</span>
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-[clamp(0.625rem,1.45vw+0.38rem,0.75rem)] md:text-sm">
                          スポンサー候補の事業者は、様々な広告宣伝活動を展開しているが、従来の手法のみでは、期待する営業活動支援や認知度向上に限界がある。<br />
                          特に、新規開拓の営業担当者にとって、新規アプローチの際、先方担当者のガードが固く、面談に至るまで壁が厚く、何とか突破口となるツールの提供が強く望まれている。<br />
                          さらに自社の社員・家族等も被写体として、運動会・家族団らん・旅行他様々な祝事で活用も考えられ。福利厚生の一つとしての活用も期待できる。
                        </p>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-[clamp(0.8125rem,2vw+0.45rem,1rem)] md:text-lg text-sumo-dark mb-2 md:mb-3 flex items-start md:items-center gap-2">
                          <Building2 className="text-blue-500 shrink-0 mt-0.5 md:mt-0" size={18} />
                          <span>被写体の属する組織のイメージアップの効果期待</span>
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-[clamp(0.625rem,1.45vw+0.38rem,0.75rem)] md:text-sm">
                          被写体の属する事業者(例えば幼稚園や福祉施設等)では、常に保母・保父、介護士等の人材不足に悩まされており、人材確保に有効なツール開発への期待が大きい。
                        </p>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-[clamp(0.8125rem,2vw+0.45rem,1rem)] md:text-lg text-sumo-dark mb-2 md:mb-3 flex items-start md:items-center gap-2">
                          <Users className="text-pink-500 shrink-0 mt-0.5 md:mt-0" size={18} />
                          <span>被写体のより良い思い出作りに貢献</span>
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-[clamp(0.625rem,1.45vw+0.38rem,0.75rem)] md:text-sm">
                          被写体となる個人や親子・家族、親密グループ構成員等、自前のカメラで撮影した写真も使用することができることから、「簡単に記録として残せる思い出」として相応しいシステムがあると、より楽しく、安易な記録方法として効果的。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3. 具体的なスキーム */}
                  <div>
                    <h3 className="text-[clamp(0.9375rem,2.4vw+0.48rem,1.125rem)] md:text-xl font-serif font-bold text-sumo-dark mb-4 md:mb-6 flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[clamp(0.625rem,1.5vw+0.35rem,0.75rem)] md:text-sm shrink-0">3</span>
                      具体的なスキーム
                    </h3>
                    
                    <div className="relative border-l-2 border-sumo-brand/30 ml-2 md:ml-3 space-y-5 md:space-y-8 py-2">
                      <div className="relative pl-6 md:pl-8">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-sumo-brand border-4 border-white"></div>
                        <p className="text-gray-700 font-medium text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">当社が独自に開発したフォトプログラムを活用</p>
                      </div>
                      
                      <div className="relative pl-6 md:pl-8">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-sumo-brand border-4 border-white"></div>
                        <p className="text-gray-700 font-medium text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">スポンサーと広告掲載(有料)を契約する</p>
                      </div>
                      
                      <div className="relative pl-6 md:pl-8">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-sumo-brand border-4 border-white"></div>
                        <p className="text-gray-700 font-medium leading-relaxed text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">
                          被写体となる個人・家族・団体等との連携(無料)により、被写体への仕組み(無料でフォトブック提供）の説明を行い、写真掲載の同意を行う。
                        </p>
                      </div>
                      
                      <div className="relative pl-6 md:pl-8">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-sumo-brand border-4 border-white"></div>
                        <p className="text-gray-700 font-medium leading-relaxed text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">
                          フォトブック完成後、被写体にフォトブック 1 冊を無料で提供する。
                        </p>
                        <div className="mt-3 md:mt-4 bg-sumo-brand/5 rounded-lg p-3 md:p-4 border border-sumo-brand/10 flex gap-2 md:gap-3">
                          <CheckCircle2 className="text-sumo-brand shrink-0 mt-0.5" size={16} />
                          <p className="text-[clamp(0.625rem,1.45vw+0.38rem,0.75rem)] md:text-sm text-gray-600 leading-relaxed">
                            無料で提供する際、スポンサーの営業担当者が持参する等で直接お客様と関与することで、被写体はもちろん、その被写体の属する事業者との接点開拓が期待できる。
                          </p>
                        </div>
                      </div>
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

export default CompanyPage;
