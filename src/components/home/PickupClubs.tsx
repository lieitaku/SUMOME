"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import WaveDivider from "@/components/home/WaveDivider";
import { clubsData } from "@/data/mockData";
import ClubCard from "@/components/clubs/ClubCard";

const PickupClubs = () => {
  return (
    <section className="py-32 bg-sumo-bg relative overflow-hidden">
      <WaveDivider fill="fill-sumo-dark" isRotated={false} withTexture={true} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 border-b border-sumo-dark/10 pb-6 reveal-up">
          <div>
            <span className="text-sumo-gold text-xs font-bold tracking-[0.2em] mb-2 block uppercase">
              PICK UP CLUBS
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-sumo-dark">
              注目の相撲クラブ
            </h2>
          </div>

          <Link
            href="/clubs"
            className="hidden md:flex items-center gap-2 text-sm font-bold text-sumo-dark hover:text-sumo-red transition-colors group"
          >
            クラブ一覧を見る{" "}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* 卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {clubsData.map((club, idx) => (
            // 使用封装好的组件，并传入 reveal-up 动画类
            <div
              key={club.id}
              className={`reveal-up ${idx === 1 ? "delay-100" : idx === 2 ? "delay-200" : ""}`}
            >
              <ClubCard club={club} />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden reveal-up">
          <Link
            href="/clubs"
            className="inline-block border border-sumo-dark text-sumo-dark px-8 py-3 rounded-full text-sm font-bold hover:bg-sumo-dark hover:text-white transition-colors"
          >
            クラブ一覧を見る
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PickupClubs;
