import React from "react";
import { ArrowRight } from "lucide-react";

const Introduction = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
      {/* 竖排大标题 */}
      <div className="flex-shrink-0 writing-vertical h-[400px] flex items-center justify-center reveal-up">
        <h2 className="text-3xl md:text-5xl font-bold leading-relaxed tracking-widest text-white">
          相撲の<span className="text-sumo-red">熱</span>を、
          <br />
          世界へ<span className="text-sumo-gold">届</span>ける。
        </h2>
      </div>

      {/* 文字介绍 */}
      <div className="flex-shrink-0 max-w-md flex flex-col justify-center text-right border-r border-sumo-gold/30 pr-8 min-h-[200px] reveal-up delay-100">
        <span className="text-sumo-gold text-xs font-bold tracking-[0.2em] mb-6 block">
          ABOUT SUMOME
        </span>
        <p className="text-gray-300 leading-loose text-sm md:text-base tracking-wide font-medium">
          SUMOMEは、国技「相撲」の魅力を
          <br />
          テクノロジーの力で最大化する
          <br />
          次世代プラットフォームです
          <br />
          <br />
          地域に根付くクラブと
          <br />
          相撲を愛するすべての人を繋ぎ
          <br />
          100年後の土俵を守り抜くために
        </p>
        <a
          href="/about"
          className="group inline-flex items-center justify-end gap-3 mt-8 text-sumo-gold hover:text-white transition-colors duration-300"
        >
          <span className="relative text-xs md:text-sm font-bold tracking-[0.2em]">
            もっと詳しく見る
            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-sumo-gold transition-all duration-500 group-hover:w-full"></span>
          </span>
          <ArrowRight
            size={16}
            className="transform group-hover:translate-x-2 transition-transform duration-300"
          />
        </a>
      </div>

      {/* 图片展示 */}
      <div className="flex-shrink-0 relative reveal-up delay-200">
        <div className="relative w-[300px] h-[400px] md:w-[320px] md:h-[420px]">
          <div className="absolute top-4 right-4 w-full h-full border border-sumo-gold/50 rounded-sm z-0"></div>
          <div className="absolute inset-0 overflow-hidden shadow-2xl z-10 bg-sumo-brand">
            <img
              src="https://restless-frost-36397932.stg-s.snapup.jp/wp-content/uploads/2025/12/homepage-1-scaled.jpeg"
              alt="About Sumome"
              className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-[2s] grayscale mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sumo-dark/80 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
