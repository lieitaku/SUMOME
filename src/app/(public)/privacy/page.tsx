"use client";

import React, { useEffect } from "react";
import Button from "@/components/ui/Button";
import Ceramic from "@/components/ui/Ceramic";
import {
  Scroll,
  ShieldCheck,
  ChevronLeft,
  Mail,
  Building2,
} from "lucide-react";
import ScrollToTop from "@/components/common/ScrollToTop";

const PrivacyPage = () => {
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
          PRIVACY
        </div>

        <div className="container mx-auto max-w-4xl relative z-10 px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 reveal-up mt-8 md:mt-0">
            <ShieldCheck size={12} className="text-white" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">
              Legal Document
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-4 text-white drop-shadow-sm reveal-up delay-100">
            プライバシーポリシー
          </h1>

          <p className="text-white/60 font-medium tracking-widest text-xs md:text-sm reveal-up delay-200">
            最終改定日：2024年4月1日
          </p>
        </div>
      </header>

      {/* ==================== 2. Document Body (白瓷卷宗) ==================== */}
      <section className="relative px-4 md:px-6 z-20 -mt-24 pb-32">
        <div className="container mx-auto max-w-4xl">
          <Ceramic
            interactive={false}
            className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden p-5 sm:p-10 md:p-16 lg:p-20 text-sumo-dark"
          >
            {/* 前言 */}
            <div className="mb-12 md:mb-16 leading-loose text-gray-700 font-medium text-justify text-sm sm:text-base">
              <p>
                SUMOME事務局（以下，「当方」といいます。）は，本ウェブサイト上で提供するサービス（以下，「本サービス」といいます。）における，ユーザーの個人情報の取扱いについて，以下のとおりプライバシーポリシー（以下，「本ポリシー」といいます。）を定めます。
              </p>
            </div>

            {/* 章节内容 */}
            <div className="space-y-12 md:space-y-16">
              {/* 第1条 */}
              <section>
                <h3 className="text-lg sm:text-xl font-serif font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-sumo-gold opacity-60 text-xs sm:text-sm font-sans">
                    01.
                  </span>
                  第1条（個人情報）
                </h3>
                <div className="pl-4 sm:pl-8 border-l-2 border-gray-100">
                  <p className="text-gray-600 leading-relaxed text-justify text-sm sm:text-base">
                    「個人情報」とは，個人情報保護法にいう「個人情報」を指すものとし，生存する個人に関する情報であって，当該情報に含まれる氏名，生年月日，住所，電話番号，連絡先その他の記述等により特定の個人を識別できる情報（個人識別情報）を指します。
                  </p>
                </div>
              </section>

              {/* 第2条 */}
              <section>
                <h3 className="text-lg sm:text-xl font-serif font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-sumo-gold opacity-60 text-xs sm:text-sm font-sans">
                    02.
                  </span>
                  第2条（個人情報の収集方法）
                </h3>
                <div className="pl-4 sm:pl-8 border-l-2 border-gray-100">
                  <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-justify text-sm sm:text-base">
                    当方は，ユーザーが利用登録をする際に以下の情報を収集することがあります。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "氏名",
                      "生年月日",
                      "住所",
                      "電話番号",
                      "メールアドレス",
                      "クラブ所属情報",
                    ].map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 sm:px-3 py-1 bg-gray-50 text-gray-600 text-xs sm:text-sm font-bold border border-gray-200 rounded-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* 第3条 */}
              <section>
                <h3 className="text-lg sm:text-xl font-serif font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-sumo-gold opacity-60 text-xs sm:text-sm font-sans">
                    03.
                  </span>
                  第3条（個人情報を収集・利用する目的）
                </h3>
                <div className="pl-4 sm:pl-8 border-l-2 border-gray-100">
                  <p className="text-gray-600 mb-4 sm:mb-6 text-justify text-sm sm:text-base">
                    当方が個人情報を収集・利用する目的は，以下のとおりです。
                  </p>
                  <ul className="space-y-2 sm:space-y-4 text-gray-600 bg-gray-50/50 p-4 sm:p-6 rounded-sm border border-gray-100/50 text-sm sm:text-base">
                    {[
                      "本サービスの提供・運営のため",
                      "ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）",
                      "メンテナンス，重要なお知らせなど必要に応じたご連絡のため",
                      "利用規約に違反したユーザーや，不正・不当な目的でサービスを利用しようとするユーザーの特定をし，ご利用をお断りするため",
                      "上記の利用目的に付随する目的",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 sm:gap-3 leading-relaxed text-justify"
                      >
                        <Scroll
                          size={14}
                          className="text-sumo-brand mt-0.5 sm:mt-1 flex-shrink-0 opacity-70"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* ... (第4条等，省略以保持精简，格式同上) ... */}
              {/* 第4条 */}
              <section>
                <h3 className="text-lg sm:text-xl font-serif font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-sumo-gold opacity-60 text-xs sm:text-sm font-sans">
                    04.
                  </span>
                  第4条（個人情報の第三者提供）
                </h3>
                <div className="pl-4 sm:pl-8 border-l-2 border-gray-100">
                  <p className="text-gray-600 leading-relaxed text-justify text-sm sm:text-base">
                    当方は，次に掲げる場合を除いて，あらかじめユーザーの同意を得ることなく，第三者に個人情報を提供することはありません。ただし，個人情報保護法その他の法令で認められる場合を除きます。
                  </p>
                </div>
              </section>

              {/* 第5条（联系方式 - 特殊设计） */}
              <section>
                <h3 className="text-lg sm:text-xl font-serif font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-sumo-gold opacity-60 text-xs sm:text-sm font-sans">
                    05.
                  </span>
                  第5条（お問い合わせ窓口）
                </h3>
                <div className="pl-4 sm:pl-8 border-l-2 border-gray-100">
                  <p className="text-gray-600 mb-4 sm:mb-6 text-justify text-sm sm:text-base">
                    本ポリシーに関するお問い合わせは，下記の窓口までお願いいたします。
                  </p>

                  {/* Contact Card - 移动端纵向紧凑，桌面端左右分栏、邮箱区标签与地址分行 */}
                  <div className="bg-[#FAFAFA] border border-gray-200 p-4 sm:p-6 md:p-8 rounded-sm relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
                      {/* 左侧：事务局信息 */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <Building2 size={14} className="text-sumo-brand shrink-0" />
                          <h4 className="font-serif font-bold text-base sm:text-lg text-sumo-dark">
                            SUMOME事務局
                          </h4>
                        </div>
                        <p className="text-gray-500 text-xs sm:text-sm font-medium pl-0 md:pl-6">
                          担当：個人情報保護管理責任者
                        </p>
                      </div>
                      {/* 右侧：邮箱（标签与地址始终上下排列，桌面端不挤压） */}
                      <div className="flex items-center gap-2 sm:gap-3 bg-white px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 rounded-sm border border-gray-100 shadow-sm group-hover:border-sumo-brand transition-colors shrink-0 md:min-w-[200px]">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 aspect-square rounded-full bg-sumo-brand/10 flex items-center justify-center text-sumo-brand shrink-0 overflow-hidden">
                          <Mail size={12} className="shrink-0" />
                        </div>
                        <div className="min-w-0 flex flex-col gap-0.5">
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                            Contact Email
                          </span>
                          <a
                            href="mailto:privacy@sumome.jp"
                            className="text-xs sm:text-sm font-bold text-sumo-dark hover:text-sumo-brand transition-colors font-mono break-all md:break-normal md:whitespace-nowrap"
                          >
                            privacy@sumome.jp
                          </a>
                        </div>
                      </div>
                    </div>
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

export default PrivacyPage;
