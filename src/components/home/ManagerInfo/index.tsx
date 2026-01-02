"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import WaveDivider from "@/components/home/WaveDivider";
import Button from "@/components/ui/Button"; // 使用通用按钮
import BenefitCard from "./BenefitCard";

const ManagerInfo = () => {
  return (
    <section className="py-32 bg-sumo-dark text-white relative overflow-hidden">
      {/* 顶部波浪 (连接上一部分) */}
      <div className="absolute top-0 w-full">
        <WaveDivider fill="fill-sumo-bg" isRotated={false} />
      </div>

      {/* 背景纹理 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-80 mix-blend-overlay"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/washi.png")`,
        }}
      ></div>

      {/* 氛围光效 (更柔和的金色光晕) */}
      <div className="absolute right-[-10%] top-[20%] w-[600px] h-[600px] bg-sumo-gold rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* --- 左侧：固定介绍区域 (Sticky) --- */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 reveal-up">
            <span className="text-sumo-gold text-xs font-bold tracking-[0.2em] mb-6 block uppercase flex items-center gap-3">
              <span className="w-8 h-[1px] bg-sumo-gold"></span>
              FOR CLUB MANAGERS
            </span>

            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
              あなたのクラブを、
              <br />
              もっと多くの人へ。
            </h2>

            <p className="text-gray-400 leading-loose mb-10 font-medium text-sm md:text-base">
              SUMOMEは、全国の相撲クラブと、
              <br />
              未来の力士たちを繋ぐ架け橋です。
              <br />
              <br />
              掲載料・利用料はすべて
              <span className="text-white border-b border-sumo-gold mx-1 font-bold">
                無料
              </span>
              。<br />
              簡単な登録で、あなたのクラブの魅力を
              <br />
              世界中に発信しませんか？
            </p>

            {/* CTA 按钮 */}
            <Button
              href="/manager/login"
              variant="primary" // 实心高级按钮
              className="px-10 py-5 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              掲載を申し込む
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-300 ml-2"
              />
            </Button>
          </div>

          {/* --- 右侧：三大优势列表 --- */}
          <div className="lg:col-span-7 flex flex-col gap-6 mt-8 lg:mt-0">
            <BenefitCard
              number="01"
              delay="delay-100"
              title="クラブの魅力を発信"
              desc="専用ページで活動内容や雰囲気をアピール。写真や動画も掲載可能で、クラブの個性を存分に伝えられます。"
            />
            <BenefitCard
              number="02"
              delay="delay-200"
              title="スムーズな体験受付"
              desc="サイト内のフォームから見学・体験の申し込みを直接受け取れます。電話対応の手間を減らし、管理も簡単になります。"
            />
            <BenefitCard
              number="03"
              delay="delay-300"
              title="無料フォトブック"
              desc="特典として、日々の活動記録をまとめた高品質な情報誌（フォトブック）を無料でプレゼント。思い出を形に残します。"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagerInfo;
