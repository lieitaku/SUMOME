// src/components/activities/articles/Activity_01.tsx
import React from "react";
import { Quote, Info, Newspaper, Award, Gift } from "lucide-react";
import type { CustomActivityProps } from "@/lib/article-registry";

// 自定义文章组件 - 内容为精心设计的硬编码排版
const Activity_01 = ({ activity }: CustomActivityProps) => {
  return (
    <div className="space-y-16">
      {/* --- 1. 导语区 (Lead Section) --- */}
      <section>
        {/* 首段：强调声明 */}
        <p className="font-serif text-lg md:text-xl text-sumo-dark leading-[2.0] tracking-wide mb-8">
          この度、株式会社MEMORY（以下、弊社）は、12月20日(土)に開催されるサッカーイベント
          <span className="font-bold border-b-2 border-sumo-gold/40 mx-2 hover:bg-sumo-gold/10 transition-colors px-1 cursor-default">
            「TUNAGU MEMORY KIDS FOOTBALL in Sendai」
          </span>
          に協賛いたします。
        </p>

        <p className="text-gray-600 leading-loose text-justify mb-8">
          本イベントは、仙台市内の子供たちにサッカーを通じた交流の場と、スポーツの楽しさを提供することを目的としています。
        </p>

        {/* Note Box (精致的提示框) */}
        <div className="relative bg-gray-50 border border-gray-200 p-6 md:p-8 rounded-sm my-10 overflow-hidden">
          {/* 装饰图标 */}
          <div className="absolute -top-4 -right-4 text-gray-100 transform rotate-12">
            <Info size={100} />
          </div>

          <div className="relative z-10 flex gap-4">
            <div className="w-1 h-auto bg-sumo-gold self-stretch rounded-full"></div>
            <div>
              <span className="block text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-3">
                Important Note
              </span>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed font-medium">
                なお、本大会の企画・運営は、相撲エンターテインメント部門SUMOMEではなく、弊社のスポーツイベント事業部である
                <span className="inline-block font-bold text-white bg-sumo-red px-2 py-0.5 mx-1.5 rounded text-xs align-middle tracking-wider shadow-sm">
                  SPME
                </span>
                が担当しております。スポーツの力で地域と子供たちを繋ぐ、SPMEならではのイベントとなります。
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-600 leading-loose text-justify">
          また、当日は会場にて、弊社の主力サービスであるフォトブック「MEMORY」の無料体験ブースを出展いたします。
        </p>
      </section>

      {/* --- 分割线 --- */}
      <div className="w-20 h-1 bg-gray-100 mx-auto rounded-full"></div>

      {/* --- 2. 核心板块：产品介绍 --- */}
      <section>
        {/* 标题 */}
        <div className="mb-10 text-center md:text-left">
          <span className="inline-block py-1 px-3 border border-sumo-gold/30 text-sumo-gold text-[10px] font-bold tracking-[0.2em] uppercase rounded-full mb-4">
            About Service
          </span>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-sumo-dark">
            新感覚フォトブック「MEMORY」について
          </h3>
        </div>

        {/* 引用块 (Blockquote) */}
        <div className="relative my-12 px-8 md:px-16 py-10 bg-[#FAFAFA] rounded-sm">
          <Quote className="absolute top-4 left-4 text-gray-200 w-8 h-8 md:w-12 md:h-12 rotate-180" />
          <Quote className="absolute bottom-4 right-4 text-gray-200 w-8 h-8 md:w-12 md:h-12" />

          <p className="text-center text-lg md:text-xl font-medium text-gray-700 leading-[2.2] font-serif">
            当日ブースにて体験いただける「MEMORY」は、単に思い出を一冊にまとめるだけの「フォトブック」ではありません。
            <br className="hidden md:inline" />
            その時代のニュースや出来事を共に掲載する、
            <span className="block mt-4 text-2xl md:text-3xl font-bold text-sumo-dark bg-gradient-to-r from-sumo-gold/0 via-sumo-gold/20 to-sumo-gold/0 py-2">
              世界に一つの「情報誌」
            </span>
            です。
          </p>
        </div>
      </section>

      {/* --- 3. 特性列表 (Features Grid) --- */}
      <section>
        <h4 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-8 border-b border-gray-100 pb-2">
          Features of MEMORY
        </h4>

        <div className="grid gap-6">
          {/* Feature 01 */}
          <div className="group bg-white border border-gray-100 p-8 hover:border-sumo-brand/20 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 rounded-sm relative">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-sumo-brand rounded-full flex items-center justify-center">
                <Newspaper size={24} />
              </div>
              <div>
                <h5 className="font-serif font-bold text-lg text-sumo-dark mb-3">
                  「思い出」×「記事」×「ニュース」
                </h5>
                <p className="text-gray-500 text-sm leading-loose text-justify">
                  他の写真集と大きく異なるのは、「思い出の写真」に加え、「それに関する記事」と「その年のニュース」が一冊にまとまっている点です。ページをめくるたびに当時の空気感までが鮮やかに蘇り、まるでタイムカプセルを開くような体験をお届けします。
                </p>
              </div>
            </div>
          </div>

          {/* Feature 02 */}
          <div className="group bg-white border border-gray-100 p-8 hover:border-sumo-brand/20 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 rounded-sm relative">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <h5 className="font-serif font-bold text-lg text-sumo-dark mb-3">
                  人生の節目を可視化する「記録」
                </h5>
                <p className="text-gray-500 text-sm leading-loose text-justify">
                  旅行の記録、友人との大切な時間、出産や記念日など。表紙にはお気に入りの一枚を使用し、最終ページにはその年の主要ニュースを掲載します。これらを積み重ねていくことで、家族の歴史や人生の歩みを「記録」として美しく残すことができます。
                </p>
              </div>
            </div>
          </div>

          {/* Feature 03 */}
          <div className="group bg-white border border-gray-100 p-8 hover:border-sumo-brand/20 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 rounded-sm relative">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                <Gift size={24} />
              </div>
              <div>
                <h5 className="font-serif font-bold text-lg text-sumo-dark mb-3">
                  「おめでとう」を込めて、無料で
                </h5>
                <p className="text-gray-500 text-sm leading-loose text-justify">
                  MEMORYは、一般の方からの応募で製作される完全オリジナルのフリーペーパーです。協賛企業からの「おめでとうございます」という応援の想いを載せることで、お客様には無料でお届けしているのも大きな特徴です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. 结语 (Closing) --- */}
      <section className="bg-sumo-dark text-white p-10 md:p-14 rounded-sm text-center relative overflow-hidden group">
        {/* 背景光晕 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10">
          <p className="font-serif text-xl md:text-2xl font-bold leading-relaxed mb-6">
            フォトブックであり、情報誌であり、
            <br />
            応援のメッセージでもある。
          </p>
          <div className="w-12 h-1 bg-sumo-gold mx-auto mb-6"></div>
          <p className="text-white/70 text-sm md:text-base leading-loose mb-2">
            それが「MEMORY」です。
          </p>
          <p className="text-white/60 text-sm leading-loose font-light">
            イベント当日は、この「MEMORY」の魅力を実際に体験いただけるブースをご用意して、
            <br className="hidden md:inline" />
            皆様のご来場を心よりお待ちしております。
          </p>
        </div>
      </section>
    </div>
  );
};

export default Activity_01;
