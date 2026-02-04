// src/components/activities/articles/Activity_02.tsx
import React from "react";
import Image from "next/image";
import { Calendar, MapPin, CloudSun, Quote } from "lucide-react";
import type { CustomActivityProps } from "@/lib/article-registry";

// 自定义文章组件 - 内容为精心设计的硬编码排版
const Activity_02 = ({ activity }: CustomActivityProps) => {
  // ✅ 应用你指定的真实图片路径
  const galleryImages = [
    "/images/activities/activity-2/act02-yokohama-scene-01.jpg",
    "/images/activities/activity-2/act02-yokohama-scene-02.jpg",
    "/images/activities/activity-2/act02-yokohama-scene-03.jpg",
    "/images/activities/activity-2/act02-yokohama-scene-04.jpg",
    "/images/activities/activity-2/act02-yokohama-scene-05.jpg",
  ];

  return (
    <div className="space-y-24">
      {/* --- 1. Event Data Header (仪式感数据头) --- */}
      <section className="relative">
        <div className="flex flex-wrap gap-y-4 gap-x-8 border-b border-gray-100 pb-8 mb-12">
          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-sumo-gold group-hover:bg-sumo-gold group-hover:text-white transition-colors">
              <Calendar size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                Date
              </span>
              <span className="text-xs font-bold text-sumo-dark tracking-wide">
                2025.11.15 - 16
              </span>
            </div>
          </div>

          <div className="w-px h-8 bg-gray-100 hidden sm:block"></div>

          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-sumo-gold group-hover:bg-sumo-gold group-hover:text-white transition-colors">
              <MapPin size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                Location
              </span>
              <span className="text-xs font-bold text-sumo-dark tracking-wide">
                Yokohama Red Brick
              </span>
            </div>
          </div>

          <div className="w-px h-8 bg-gray-100 hidden sm:block"></div>

          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-sumo-gold group-hover:bg-sumo-gold group-hover:text-white transition-colors">
              <CloudSun size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                Weather
              </span>
              <span className="text-xs font-bold text-sumo-dark tracking-wide">
                Sunny
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. 导语 --- */}
      <section className="max-w-3xl">
        <p className="font-serif text-2xl md:text-3xl text-sumo-dark leading-[1.6] font-bold mb-10">
          「YOKOHAMA URBAN SPORTS FESTIVAL ’25」
          <br />
          MEMORYブースへのご来場、
          <br className="md:hidden" />
          誠にありがとうございました。
        </p>
        <div className="pl-6 border-l-2 border-sumo-gold/30">
          <p className="text-gray-600 leading-[2.2] text-justify">
            去る11月15日(土)、16日(日)の2日間にわたり開催されました「YOKOHAMA
            URBAN SPORTS FESTIVAL
            ’25」におきまして、弊社フォトブック「MEMORY」の無料体験ブースへ多数のご来場をいただき、誠にありがとうございました。
          </p>
        </div>
      </section>

      {/* --- 📸 Visual Block 1: The Scene (错位双图) --- */}
      <section className="grid grid-cols-2 gap-4 md:gap-16 items-start">
        {/* Img 01: 左上 */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-gray-100 group shadow-lg">
          <Image
            src={galleryImages[0]}
            alt="Event Scene Left"
            fill
            className="object-cover transition-transform duration-[1.5s] group-hover:scale-110 grayscale-[0.1] group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
        </div>

        {/* Img 02: 右下 (mt-24 下沉效果) */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-gray-100 group mt-24 md:mt-32 shadow-lg">
          <Image
            src={galleryImages[1]}
            alt="Event Scene Right"
            fill
            className="object-cover transition-transform duration-[1.5s] group-hover:scale-110 grayscale-[0.1] group-hover:grayscale-0"
          />
          {/* 装饰性数字 */}
          <div className="absolute -top-16 -right-6 text-[120px] font-serif font-bold text-gray-100 -z-10 select-none opacity-50">
            01
          </div>
        </div>
      </section>

      {/* --- 3. Section: 反响 --- */}
      <section>
        <div className="flex flex-col mb-12">
          <span className="text-[10px] font-bold tracking-[0.2em] text-sumo-gold uppercase mb-3 flex items-center gap-2">
            <div className="w-6 h-px bg-sumo-gold"></div>
            Feedback
          </span>
          <h3 className="text-3xl font-serif font-bold text-sumo-dark">
            予想を上回る反響と、
            <br className="md:hidden" />
            笑顔の連鎖
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-gray-600 leading-[2.2] mb-10 text-justify">
              当日は、アーバンスポーツの活気あふれる雰囲気の中、予想を大きく上回る数のお客様に弊社ブースへお立ち寄りいただきました。
            </p>

            {/* 引用块 */}
            <div className="bg-[#FAFAFA] border border-gray-100 p-8 relative rounded-sm group hover:border-sumo-gold/30 transition-colors">
              <Quote
                className="absolute top-6 right-6 text-gray-200 group-hover:text-sumo-gold/20 transition-colors"
                size={40}
              />
              <p className="font-bold text-sumo-dark text-lg mb-6 relative z-10 font-serif">
                「思い出がその場で一冊の本になる感動」
              </p>
              <div className="w-8 h-1 bg-sumo-gold mb-4"></div>
              <p className="text-gray-500 text-xs leading-relaxed font-medium">
                実際に体験されたお客様からは、
                <br />
                多くの驚きと喜びの声を頂戴いたしました。
              </p>
            </div>
          </div>

          {/* --- 📸 Visual Block 2: The Focus (单张主角) --- */}
          <div className="relative group perspective-1000">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm shadow-2xl transform rotate-2 group-hover:rotate-0 transition-all duration-700 bg-white p-2">
              <div className="relative w-full h-full overflow-hidden rounded-sm">
                <Image
                  src={galleryImages[2]}
                  alt="Focus Moment"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            {/* 胶带效果 */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-md rotate-[-3deg] shadow-sm z-20"></div>
          </div>
        </div>
      </section>

      {/* --- 4. Section: 价值 (Callout) --- */}
      <section className="bg-sumo-dark text-white p-12 md:p-20 rounded-sm relative overflow-hidden text-center">
        {/* 背景纹理 */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "url('/images/bg/noise.png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-serif font-bold mb-8">
            「思い出」を「情報誌」として残す価値
          </h3>
          <p className="text-white/80 leading-[2.2] mb-8 text-justify">
            今回のイベントを通じ、単なる写真集ではなく、その時代の空気感までをもパッケージする「情報誌としてのフォトブック」というMEMORYのコンセプトを、多くの方に体感いただけたことを大変嬉しく思います。
          </p>
          <p className="text-white/80 leading-[2.2] text-justify">
            ご作成いただいた一冊が、ご家族やご友人との大切な時間を彩る
            <span className="font-bold text-white mx-1 border-b border-sumo-gold pb-1">
              「タイムカプセル」
            </span>
            として、末永く皆様のお手元に残ることを願っております。
          </p>
        </div>
      </section>

      {/* --- 📸 Visual Block 3: The Smiles (拼接双图) --- */}
      <section className="relative py-12">
        {/* 背景装饰块 */}
        <div className="absolute top-0 left-4 right-4 bottom-0 border border-dashed border-gray-200 -z-10 rounded-sm"></div>

        <div className="grid grid-cols-2 gap-6 md:gap-12 px-6 md:px-20">
          {/* Img 04 */}
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm shadow-md group">
            <Image
              src={galleryImages[3]}
              alt="Smile 01"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          {/* Img 05 */}
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm shadow-md mt-12 md:mt-24 group">
            <Image
              src={galleryImages[4]}
              alt="Smile 02"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-3 text-[9px] font-bold tracking-[0.3em] text-gray-300 uppercase">
            <div className="w-8 h-px bg-gray-200"></div>
            Smiles & Memories
            <div className="w-8 h-px bg-gray-200"></div>
          </div>
        </div>
      </section>

      {/* --- 5. 展望 & 结语 --- */}
      <section className="pt-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 leading-[2.4] mb-12 font-medium">
            今回のイベントが大成功を収めることができましたのも、
            <br className="hidden md:inline" />
            ひとえにご来場いただいた皆様、そして関係者の皆様のご支援のおかげです。
            <br />
            <br />
            今後も弊社は、皆様の大切な思い出を「記録」として美しく、
            <br className="hidden md:inline" />
            そして鮮やかに形に残せるよう、サービスの向上に努めてまいります。
          </p>

          {/* 签名档 */}
          <div className="flex flex-col items-center">
            <p className="font-serif font-bold text-sumo-dark text-lg tracking-wide">
              Memory Team
            </p>
            <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mt-2">
              2025.11.20
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Activity_02;
