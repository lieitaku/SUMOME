// src/components/activities/articles/Activity_04.tsx
import React from "react";
import { MessageSquareQuote, Sparkles } from "lucide-react";
import type { CustomActivityProps } from "@/lib/article-registry";

// 自定义文章组件 - 内容为精心设计的硬编码排版
const Activity_04 = ({ activity }: CustomActivityProps) => {
  return (
    <div className="max-w-3xl mx-auto space-y-20">
      {/* --- 1. Header (纯净标题) --- */}
      <section className="relative">
        {/* 装饰性日期章 */}
        <div className="absolute top-0 right-0 hidden md:block">
          <div className="border border-sumo-gold/30 p-2 text-center">
            <span className="block text-[10px] text-gray-400 uppercase tracking-widest">
              Sep
            </span>
            <span className="block text-xl font-serif font-bold text-sumo-dark">
              27-28
            </span>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-sumo-gold rounded-full"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
              Event Report
            </span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-sumo-dark font-bold leading-tight mb-8">
            MEMORYへのご来場、
            <br />
            誠にありがとうございました
          </h2>

          <p className="text-gray-600 leading-[2.4] text-justify font-light text-lg">
            去る9月27日(土)、28日(日)の2日間にわたり開催されました本イベントにおきまして、弊社フォトブック「MEMORY」の無料体験ブースへ多数のご来場をいただき、誠にありがとうございました。
            おかげさまで、両日ともに天候にも恵まれ、会場はアクションスポーツならではの熱気とご来場者様の笑顔に満ちた、素晴らしい空間となりました。
          </p>
        </div>
      </section>

      {/* --- 2. Feedback Section (带装饰的引用块) --- */}
      <section>
        <div className="bg-[#FAFAFA] border-l-4 border-sumo-brand p-8 md:p-12 relative rounded-r-sm group hover:bg-[#F5F7FA] transition-colors duration-500">
          <MessageSquareQuote className="absolute top-6 right-6 text-gray-200 w-12 h-12 group-hover:text-sumo-brand/10 transition-colors" />

          <h3 className="font-serif text-xl font-bold text-sumo-dark mb-6 relative z-10">
            予想を遥かに超える反響
          </h3>

          <div className="space-y-6 relative z-10">
            <p className="text-gray-600 leading-[2.2] text-justify">
              当日は、BMXやパルクールなどのパフォーマンスに沸く会場の中で、予想を遥かに超える多くのお客様に弊社ブースへ足をお運びいただきました。
            </p>
            <p className="text-gray-600 leading-[2.2] text-justify">
              スタッフの想定を上回る盛況ぶりに、嬉しい悲鳴をあげると同時に、皆様の「思い出を残したい」という熱い想いに触れ、スタッフ一同、深く感銘を受けました。
            </p>
          </div>
        </div>
      </section>

      {/* --- 3. Concept Section (极简排版) --- */}
      <section>
        <div className="flex items-start gap-4 mb-6">
          <Sparkles className="text-sumo-gold mt-1 flex-shrink-0" size={20} />
          <h3 className="font-serif text-xl font-bold text-sumo-dark">
            「躍動する一瞬」を
            <br className="md:hidden" />
            「情報誌」という形に
          </h3>
        </div>

        <div className="pl-0 md:pl-9 border-l-0 md:border-l border-gray-100 md:ml-2.5">
          <p className="text-gray-600 leading-[2.2] mb-8 text-justify">
            アクションスポーツという、まさに「一瞬の輝き」が魅力のイベントにおいて、その瞬間をフォトブックという形あるものに残すことの意義を、多くの皆様と共有できたことを大変光栄に存じます。
          </p>
          <p className="text-gray-600 leading-[2.2] text-justify">
            楽しかったイベントの記憶を、その日のニュースや空気感とともにパッケージした
            <span className="font-bold text-sumo-dark bg-sumo-gold/20 px-2 py-0.5 mx-1 rounded-sm">
              「MEMORY」
            </span>
            が、皆様のご家庭で大切な「記録」として愛され続けることを願っております。
          </p>
        </div>
      </section>

      {/* --- 4. Closing (居中结语) --- */}
      <section className="border-t border-gray-100 pt-16 text-center">
        <div className="inline-block mb-6">
          <span className="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase border-b border-gray-200 pb-1">
            Message from Team
          </span>
        </div>

        <p className="text-gray-600 leading-[2.4] mb-10 font-medium">
          皆様のあたたかい笑顔と熱気のおかげをもちまして、
          <br className="hidden md:inline" />
          今回の出展は大成功のうちに幕を閉じることができました。
          <br />
          今後も弊社は、皆様に新しい価値をお届けできるよう邁進してまいります。
        </p>

        <p className="font-serif font-bold text-sumo-dark text-lg md:text-xl">
          引き続き、変わらぬご愛顧を
          <br className="md:hidden" />
          賜りますようお願い申し上げます。
        </p>
      </section>
    </div>
  );
};

export default Activity_04;
