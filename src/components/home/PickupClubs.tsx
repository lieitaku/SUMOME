"use client";

import React, { useMemo } from "react";
import Link from "@/components/ui/TransitionLink";
import { ArrowRight } from "lucide-react";
import { type Club } from "@prisma/client";

import ClubCard from "@/components/clubs/ClubCard";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

interface PickupClubsProps {
  clubs: Club[];
}

const PickupClubs = ({ clubs }: PickupClubsProps) => {
  // --- ✨ 核心逻辑：过滤掉官方总部账号 ---
  // 使用 useMemo 确保过滤逻辑只在 clubs 变化时运行，提高性能
  const displayClubs = useMemo(() => {
    return clubs.filter(club => club.slug !== "official-hq");
  }, [clubs]);

  return (
    <Section background="gray" id="pickup-clubs">
      {/* 头部标题区 */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 border-b border-gray-200 pb-8 reveal-up">
        <div>
          <span className="text-sumo-brand text-xs font-bold tracking-[0.3em] mb-3 block uppercase font-sans">
            Pick Up Clubs
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-serif text-sumo-text">
            注目の相撲クラブ
          </h2>
        </div>

        <Link
          href="/clubs"
          className="hidden md:flex items-center gap-2 text-sm font-bold text-sumo-brand hover:text-sumo-red transition-colors group tracking-widest"
        >
          クラブ一覧を見る
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* 卡片网格：使用过滤后的 displayClubs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayClubs.map((club, idx) => (
          <div
            key={club.id}
            className={`reveal-up ${idx === 1 ? "delay-100" : idx === 2 ? "delay-200" : ""
              }`}
          >
            {/* ClubCard 内部也已经有了 slug 判定，这里是双重保险 */}
            <ClubCard club={club} />
          </div>
        ))}
      </div>

      {/* 移动端按钮 */}
      <div className="mt-12 text-center md:hidden reveal-up delay-100">
        <Button
          href="/clubs"
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