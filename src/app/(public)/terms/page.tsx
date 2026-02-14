"use client";

import React, { useEffect } from "react";
import Button from "@/components/ui/Button";
import Ceramic from "@/components/ui/Ceramic";
import {
  Gavel,
  AlertTriangle,
  ShieldAlert,
  ChevronLeft,
  Scale,
} from "lucide-react";
import ScrollToTop from "@/components/common/ScrollToTop";

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans flex flex-col selection:bg-sumo-brand selection:text-white">
      {/* ==================== 1. Header (权威碧空) ==================== */}
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

        {/* 背景大字水印 */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 text-[15vw] font-black text-white opacity-[0.03] select-none pointer-events-none leading-none mix-blend-overlay tracking-tighter font-sans">
          TERMS
        </div>

        <div className="container mx-auto max-w-4xl relative z-10 px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 reveal-up mt-8 md:mt-0">
            <Scale size={12} className="text-white" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">
              Terms of Service
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-4 text-white drop-shadow-sm reveal-up delay-100">
            利用規約
          </h1>

          <p className="text-white/60 font-medium tracking-widest text-xs md:text-sm reveal-up delay-200">
            制定日：2024年4月1日
          </p>
        </div>
      </header>

      {/* ==================== 2. Document Body (白瓷契约) ==================== */}
      <section className="relative px-4 md:px-6 z-20 -mt-24 pb-32">
        <div className="container mx-auto max-w-4xl">
          <Ceramic
            interactive={false}
            className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden p-5 sm:p-10 md:p-16 lg:p-20 text-sumo-dark"
          >
            {/* 前言 */}
            <div className="mb-12 md:mb-16 leading-loose text-gray-700 font-medium text-justify text-sm sm:text-base">
              <p>
                この利用規約（以下，「本規約」といいます。）は，SUMOME事務局（以下，「当方」といいます。）がこのウェブサイト上で提供するサービス（以下，「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下，「ユーザー」といいます。）には，本規約に従って，本サービスをご利用いただきます。
              </p>
            </div>

            {/* 条款内容 */}
            <div className="space-y-12 md:space-y-16">
              {/* 第1条 */}
              <section>
                <h3 className="text-lg sm:text-xl font-serif font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-sumo-gold opacity-60 text-xs sm:text-sm font-sans">
                    01.
                  </span>
                  第1条（適用）
                </h3>
                <div className="pl-4 sm:pl-8 border-l-2 border-gray-100">
                  <ol className="list-decimal list-outside ml-3 sm:ml-4 space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-justify text-sm sm:text-base">
                    <li>
                      本規約は，ユーザーと当方との間の本サービスの利用に関わる一切の関係に適用されるものとします。
                    </li>
                    <li>
                      当方は本サービスに関し，本規約のほか，ご利用にあたってのルール等，各種の定め（以下，「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず，本規約の一部を構成するものとします。
                    </li>
                  </ol>
                </div>
              </section>

              {/* 第2条 */}
              <section>
                <h3 className="text-lg sm:text-xl font-serif font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-sumo-gold opacity-60 text-xs sm:text-sm font-sans">
                    02.
                  </span>
                  第2条（利用登録）
                </h3>
                <div className="pl-4 sm:pl-8 border-l-2 border-gray-100">
                  <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-justify text-sm sm:text-base">
                    本サービスにおいては，登録希望者が本規約に同意の上，当方の定める方法によって利用登録を申請し，当方がこれを承認することによって，利用登録が完了するものとします。
                    <br />
                    <br />
                    当方は，利用登録の申請者に以下の事由があると判断した場合，利用登録の申請を承認しないことがあり，その理由については一切の開示義務を負わないものとします。
                  </p>
                  <ul className="space-y-2 sm:space-y-3 text-gray-600 bg-gray-50/50 p-4 sm:p-6 rounded-sm border border-gray-100/50 text-sm sm:text-base">
                    {[
                      "利用登録の申請に際して虚偽の事項を届け出た場合",
                      "本規約に違反したことがある者からの申請である場合",
                      "その他，当方が利用登録を相当でないと判断した場合",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 leading-relaxed text-justify"
                      >
                        <AlertTriangle
                          size={16}
                          className="text-sumo-gold mt-1 flex-shrink-0 opacity-70"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* 第3条 (禁止事项 - Grid Card) */}
              <section>
                <h3 className="text-lg sm:text-xl font-serif font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-sumo-gold opacity-60 text-xs sm:text-sm font-sans">
                    03.
                  </span>
                  第3条（禁止事項）
                </h3>
                <div className="pl-4 sm:pl-8 border-l-2 border-gray-100">
                  <p className="text-gray-600 mb-4 sm:mb-6 text-justify text-sm sm:text-base">
                    ユーザーは，本サービスの利用にあたり，以下の行為をしてはなりません。
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "法令または公序良俗に違反する行為",
                      "犯罪行為に関連する行為",
                      "著作権，商標権ほか知的財産権を侵害する行為",
                      "サーバーまたはネットワークの機能を破壊したり，妨害したりする行為",
                      "本サービスによって得られた情報を商業的に利用する行為",
                      "不正な目的を持って本サービスを利用する行為",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 p-3 sm:p-4 rounded-sm border border-gray-100 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed hover:border-sumo-gold/30 transition-colors"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 第4条 */}
              <section>
                <h3 className="text-lg sm:text-xl font-serif font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-sumo-gold opacity-60 text-xs sm:text-sm font-sans">
                    04.
                  </span>
                  第4条（免責事項）
                </h3>
                <div className="pl-4 sm:pl-8 border-l-2 border-gray-100">
                  <div className="bg-red-50/50 p-4 sm:p-6 rounded-sm border border-red-100 text-gray-600 space-y-3 sm:space-y-4 text-sm sm:text-base">
                    <div className="flex items-center gap-2 text-sumo-red font-bold text-xs sm:text-sm uppercase tracking-wider mb-2">
                      <ShieldAlert size={14} /> ご注意
                    </div>
                    <p className="leading-relaxed text-justify">
                      当方の債務不履行責任は，当方の故意または重過失によらない場合には免責されるものとします。
                    </p>
                    <p className="leading-relaxed text-justify">
                      当方は，本サービスに関して，ユーザーと他のユーザーまたは第三者との間において生じた取引，連絡または紛争等について一切責任を負いません。
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer Action */}
            <div className="mt-12 sm:mt-20 pt-8 sm:pt-10 border-t border-gray-100 text-center">
              <Button
                href="/"
                variant="primary"
                showArrow={false}
                className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm rounded-full shadow-md transition-all duration-300 ease-out hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
              >
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                トップページへ戻る
              </Button>
            </div>
          </Ceramic>
        </div>
      </section>
      <ScrollToTop />
    </div>
  );
};

export default TermsPage;
