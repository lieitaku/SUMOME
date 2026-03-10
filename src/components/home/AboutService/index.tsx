"use client";

import React from "react";
import Section from "@/components/ui/Section";
import Introduction from "./Introduction";
import ServiceCard from "./ServiceCard";

// 定义服务数据的类型
type ServiceItem = {
  id: string;
  kanji: string;
  title: string;
  desc: string;
  img: string;
  delay: string;
  href: string;
  themeGradient: string; // 背景渐变
  shadowColor: string; // 投影颜色
};

const SERVICE_DATA: ServiceItem[] = [
  {
    id: "01",
    kanji: "探",
    title: "SEARCH",
    desc: "全国のクラブを\n地域から検索",
    img: "/images/about/search.webp",
    delay: "",
    href: "/clubs/map",
    // 🟢 优雅绿渐变: 从富有生机的翠绿到深邃的森林绿，清新且高雅
    themeGradient: "bg-gradient-to-br from-[#2a9d6c] to-[#175036]",
    // 使用深绿色系的阴影，保持整体感
    shadowColor: "shadow-green-900/30",
  },
  {
    id: "02",
    kanji: "結",
    title: "CONNECT",
    desc: "見学・体験申し込みで\n新しい一歩を",
    img: "https://cdn.pixabay.com/photo/2019/09/20/10/45/write-4491459_1280.jpg",
    delay: "delay-100",
    href: "/partners",
    // 🔴 热情红渐变: 从品牌红到深红，非常吸睛
    themeGradient: "bg-gradient-to-br from-[#df282f] to-[#b01c22]",
    shadowColor: "shadow-red-900/30",
  },
  {
    id: "03",
    kanji: "録",
    title: "ARCHIVE",
    desc: "活動の記録を\n美しいフォトブックに",
    img: "https://cdn.pixabay.com/photo/2014/08/22/18/46/photographer-424620_1280.jpg",
    delay: "delay-200",
    href: "/magazines",
    // 🟡 辉煌金渐变: 这种颜色很难调，这里用一种偏橙的金，避免像土黄
    themeGradient: "bg-gradient-to-br from-[#E6B422] to-[#B8860B]",
    shadowColor: "shadow-yellow-900/30",
  },
];

const AboutService = () => {
  return (
    <Section background="white" className="pt-2! pb-10! md:py-28!" id="service">
      {/* 1. Introduction (保持不变) */}
      <div className="mb-10 md:mb-32">
        <Introduction />
      </div>

      {/* 2. 三本柱 (下层功能) */}
      <div className="relative z-10">
        {/* 标题区 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-16 reveal-up border-b border-gray-200 pb-4 md:pb-8">
          <div>
            <p className="text-sumo-brand font-bold text-xs tracking-[0.3em] mb-2 uppercase font-sans">
              Our Core Services
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-sumo-text font-serif">
              SUMOMEの<span className="text-sumo-red">三</span>本柱
            </h2>
          </div>
          <p className="hidden md:block text-gray-400 text-sm font-medium tracking-wider text-right">
            Providing value through <br /> Search, Connection, and Archive.
          </p>
        </div>

        {/* 卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 items-stretch">
          {SERVICE_DATA.map((item, idx) => (
            <ServiceCard
              key={item.id}
              {...item}
              delayClass={item.delay}
              isStaggered={idx === 1}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default AboutService;
