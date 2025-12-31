"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import WaveDivider from "@/components/home/WaveDivider";
import Button from "@/components/ui/Button"; // 使用我们封装的按钮

/**
 * 内部组件: BenefitCard
 * ------------------------------------------------------------------
 * 封装右侧的"三大优势"卡片，避免重复代码。
 */
const BenefitCard = ({
  number,
  title,
  desc,
  delay,
}: {
  number: string;
  title: string;
  desc: string;
  delay: string;
}) => (
  <div
    className={`
      group relative border border-sumo-gold/10 bg-white/5 p-8 md:p-10 
      transition-all duration-500 reveal-up ${delay} 
      border-l-4 border-l-sumo-gold/30 
      hover:border-l-sumo-red hover:bg-sumo-red/5 hover:-translate-y-2 
      hover:shadow-[0_20px_40px_-15px_rgba(168,36,41,0.2)]
    `}
  >
    {/* 背景大数字 */}
    <div className="absolute top-4 right-6 text-6xl md:text-8xl font-serif font-bold text-sumo-gold opacity-20 transition-all duration-700 ease-out select-none group-hover:text-sumo-red group-hover:opacity-80 group-hover:scale-110 group-hover:rotate-12">
      {number}
    </div>

    {/* 标题 */}
    <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-4">
      <span className="text-sumo-gold group-hover:text-sumo-red transition-colors duration-300">
        ●
      </span>
      <span className="group-hover:text-white transition-colors duration-300">
        {title}
      </span>
    </h3>

    {/* 描述文字 */}
    <p className="text-gray-400 leading-loose text-sm md:text-base relative z-10 group-hover:text-gray-300 transition-colors duration-300">
      {desc}
    </p>
  </div>
);

const ManagerInfo = () => {
  return (
    <section className="py-30 bg-sumo-dark text-white relative overflow-hidden">
      {/* 顶部波浪 */}
      <WaveDivider fill="fill-sumo-bg" isRotated={false} />

      {/* 背景纹理 */}
      <div className="absolute inset-0 pointer-events-none opacity-80 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/washi.png')]"></div>

      {/* 氛围光效 */}
      <div className="absolute right-[-10%] top-[20%] w-[600px] h-[600px] bg-sumo-gold rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
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
              <span className="text-white border-b border-sumo-gold mx-1">
                無料
              </span>
              。<br />
              簡単な登録で、あなたのクラブの魅力を
              <br />
              世界中に発信しませんか？
            </p>

            {/* CTA 按钮 */}
            <Button
              href="/manager"
              variant="primary" // ✨ 使用刚刚定义的高级实心变体
              className="px-10 py-5 shadow-lg hover:shadow-xl hover:-translate-y-1" // 只保留布局和阴影样式
            >
              掲載を申し込む
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-300 ml-2"
              />
            </Button>
          </div>

          {/* --- 右侧：三大优势 (使用子组件) --- */}
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
