"use client";

import React from "react";
import Section from "@/components/ui/Section";
import Introduction from "./Introduction";
import ServiceCard from "./ServiceCard";

const SERVICE_DATA = [
  {
    id: "01",
    kanji: "探",
    title: "SEARCH",
    desc: "全国のクラブを\n地域・条件から検索",
    img: "https://cdn.pixabay.com/photo/2017/05/08/16/49/tokyo-tower-2295850_1280.jpg",
    delay: "",
    href: "/clubs",
  },
  {
    id: "02",
    kanji: "結",
    title: "CONNECT",
    desc: "見学・体験申し込みで\n新しい一歩を",
    img: "https://cdn.pixabay.com/photo/2019/09/20/10/45/write-4491459_1280.jpg",
    delay: "delay-100",
    href: "/manager/entry",
  },
  {
    id: "03",
    kanji: "録",
    title: "ARCHIVE",
    desc: "活動の記録を\n美しいフォトブックに",
    img: "https://cdn.pixabay.com/photo/2014/08/22/18/46/photographer-424620_1280.jpg",
    delay: "delay-200",
    href: "/magazines",
  },
];

const AboutService = () => {
  return (
    // 1. 使用 Section 组件，背景设为 white (纯白)
    <Section background="white" id="service">
      {/* 2. 第一部分：Introduction (上层理念) */}
      <div className="mb-32">
        <Introduction />
      </div>

      {/* 3. 第二部分：三本柱 (下层功能) */}
      <div className="relative z-10">
        {/* 标题区：瑞士风格排版 - 左对齐或严格居中 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 reveal-up border-b border-gray-200 pb-8">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-stretch">
          {SERVICE_DATA.map((item, idx) => (
            <ServiceCard
              key={item.id}
              {...item}
              delayClass={item.delay}
              // 瑞士风格通常喜欢整齐的Grid，不需要交错(staggered)，
              // 但如果你喜欢韵律感，可以保留，或者改为 false 让它整齐划一
              isStaggered={idx === 1}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default AboutService;
