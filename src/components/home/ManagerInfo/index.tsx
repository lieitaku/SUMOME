"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import BenefitCard from "./BenefitCard";
import Section from "@/components/ui/Section";

const ManagerInfo = () => {
  return (
    <Section background="white" id="manager-info">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-10">
        {/* --- 左侧：固定介绍区域 (Sticky) --- */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 reveal-up">
          <span className="text-sumo-brand text-xs font-bold tracking-[0.2em] mb-6 block uppercase flex items-center gap-3 font-sans">
            <span className="w-8 h-[2px] bg-sumo-brand"></span>
            For Club Managers
          </span>

          <h2 className="text-4xl md:text-5xl font-serif font-black mb-8 leading-tight text-sumo-text">
            あなたのクラブを、
            <br />
            もっと多くの人へ。
          </h2>

          <p className="text-sumo-text/70 leading-loose mb-10 font-medium text-sm md:text-base">
            SUMOMEは、全国の相撲クラブと、
            <br />
            未来の力士たちを繋ぐ架け橋です。
            <br />
            <br />
            掲載料・利用料はすべて
            <span className="text-sumo-red border-b-2 border-sumo-red mx-2 font-black text-lg">
              無料
            </span>
            です。
            <br />
            簡単な登録で、あなたのクラブの魅力を
            <br />
            世界中に発信しませんか？
          </p>

          <Button
            href="/manager/login"
            variant="primary"
            className="px-10 py-5 shadow-sm"
          >
            掲載を申し込む
          </Button>
        </div>

        {/* --- 右侧：三大优势列表 --- */}
        {/* 1. gap-6: 手机上卡片之间拉开 24px 的距离，产生呼吸感。
           2. md:gap-0: 电脑上保持 0 间距，像表格一样整齐。
           3. md:border-t: 只有电脑上需要顶部的这根分割线。
        */}
        <div className="lg:col-span-7 flex flex-col gap-6 md:gap-0 mt-12 lg:mt-0 md:border-t md:border-gray-200">
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
            desc="サイトでクラブ見学・体験の申し込みを直接受け取れます。電話対応の手間を減らし、管理も簡単になります。"
          />
          <BenefitCard
            number="03"
            delay="delay-300"
            title="無料フォトブック"
            desc="特典として、日々の活動記録をまとめた高品質な情報誌（フォトブック）を無料でプレゼント。思い出を形に残します。"
          />
        </div>
      </div>
    </Section>
  );
};

export default ManagerInfo;
