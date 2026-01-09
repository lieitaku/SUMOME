"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clubsData } from "@/data/clubs";
import ClubCard from "@/components/clubs/ClubCard";
import Section from "@/components/ui/Section"; // 1. 引入通用区块
import Button from "@/components/ui/Button"; // 2. 引入通用按钮

const PickupClubs = () => {
  return (
    // 使用 gray 背景，与上一区块的白色区分开，形成节奏感
    <Section background="gray" id="pickup-clubs">
      {/* 头部标题区 */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 border-b border-gray-200 pb-8 reveal-up">
        <div>
          {/* 小标题：品牌蓝，全大写，加宽字间距 */}
          <span className="text-sumo-brand text-xs font-bold tracking-[0.3em] mb-3 block uppercase font-sans">
            Pick Up Clubs
          </span>
          {/* 大标题：墨色，衬线体 */}
          <h2 className="text-3xl md:text-5xl font-black font-serif text-sumo-text">
            注目の相撲クラブ
          </h2>
        </div>

        {/* 桌面端链接：简单的文字链 */}
        <Link
          href="/clubs/search"
          className="hidden md:flex items-center gap-2 text-sm font-bold text-sumo-brand hover:text-sumo-red transition-colors group tracking-widest"
        >
          クラブ一覧を見る
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* 卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {clubsData.map((club, idx) => (
          <div
            key={club.id}
            className={`reveal-up ${
              idx === 1 ? "delay-100" : idx === 2 ? "delay-200" : ""
            }`}
          >
            {/* 注意：如果 ClubCard 内部还有圆角(rounded-xl)或很深的阴影，
               建议稍后也进去把它改成 rounded-sm 或无阴影的线框风格。
            */}
            <ClubCard club={club} />
          </div>
        ))}
      </div>

      {/* 移动端按钮：使用新的 Button 组件 (Outline 风格) */}
      <div className="mt-12 text-center md:hidden reveal-up delay-100">
        <Button
          href="/clubs/search"
          variant="outline"
          className="w-full md:w-auto"
        >
          クラブ一覧を見る
        </Button>
      </div>
    </Section>
  );
};

export default PickupClubs;
