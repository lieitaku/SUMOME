"use client";

import React from "react";
import Link from "@/components/ui/TransitionLink";
import { ArrowRight, Search, Plus } from "lucide-react";
import Section from "@/components/ui/Section";

const CTA = () => {
  return (
    <Section background="white" className="py-0 pt-6 md:pt-48 md:pb-40" id="cta">
      <div className="max-w-5xl mx-auto reveal-up">
        {/* --- 顶部文案区 --- */}
        <div className="text-center mb-6 md:mb-20">
          <h2 className="text-5xl md:text-7xl font-black text-sumo-text font-serif leading-tight">
            将来の横綱を、
            <br className="md:hidden" />
            <span className="text-sumo-brand inline-block border-b-4 border-sumo-brand pb-2 mx-2">
              ここ
            </span>
            から。
          </h2>
        </div>

        {/* --- 双子星行动条 (Dual Action Bar) --- */}
        <div className="flex flex-col md:flex-row w-full gap-6 md:gap-6">
          {/* === 左侧：寻找道场 (Search) === */}
          <Link
            href="/clubs/map"
            className="group relative flex-1 md:h-[380px] flex flex-col items-center justify-center p-8 transition-all duration-200
            bg-sumo-red/15 md:bg-sumo-red/20 border border-sumo-red/30 rounded-sm shadow-sm
            hover:bg-sumo-red/25 hover:border-sumo-red/50
            active:scale-[0.98] active:shadow-inner active:brightness-95
            "
          >
            <div className="flex flex-col items-center z-10 text-sumo-red">
              <div className="mb-5 opacity-100 group-hover:scale-110 transition-transform duration-200">
                <Search size={48} strokeWidth={1.5} />
              </div>

              <h3 className="text-2xl md:text-3xl font-black tracking-tight transition-colors duration-200">
                近くの道場を探す
              </h3>
            </div>

            <div
              className="mt-4 md:mt-12 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200
              border border-sumo-red text-sumo-red
              group-hover:scale-110 group-hover:shadow-lg
            "
            >
              <ArrowRight size={24} />
            </div>

            {/* 左侧色条：移动端 + 桌面端均显示 */}
            <div className="absolute left-0 top-4 bottom-4 w-[4px] bg-sumo-red rounded-r"></div>
          </Link>

          {/* === 右侧：管理者入口 (Manager) === */}
          <Link
            href="/manager/entry"
            className="group relative flex-1 md:h-[380px] flex flex-col items-center justify-center p-8 transition-all duration-200
            bg-sumo-brand/15 md:bg-sumo-brand/20 border border-sumo-brand/30 rounded-sm shadow-sm
            hover:bg-sumo-brand/25 hover:border-sumo-brand/50
            active:scale-[0.98] active:shadow-inner active:brightness-95
            "
          >
            <div className="flex flex-col items-center z-10 text-sumo-brand">
              <div className="mb-5 opacity-100 group-hover:scale-110 transition-transform duration-200">
                <Plus size={48} strokeWidth={1.5} />
              </div>

              <h3 className="text-2xl md:text-3xl font-black tracking-tight transition-colors duration-200">
                クラブを掲載する
              </h3>
            </div>

            <div
              className="mt-4 md:mt-12 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200
              border border-sumo-brand text-sumo-brand
              group-hover:scale-110 group-hover:shadow-lg
            "
            >
              <ArrowRight size={24} />
            </div>

            {/* 左侧色条：移动端 + 桌面端均显示 */}
            <div className="absolute left-0 top-4 bottom-4 w-[4px] bg-sumo-brand rounded-r"></div>
          </Link>
        </div>

      </div>
    </Section>
  );
};

export default CTA;
