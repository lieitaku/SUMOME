"use client";

import React from "react";
import Link from "@/components/ui/TransitionLink";
import { ArrowRight, Search, Plus } from "lucide-react";
import Section from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const CTA = () => {
  return (
    <Section background="white" className="!py-24 md:!py-40" id="cta">
      <div className="max-w-5xl mx-auto reveal-up">
        {/* --- 顶部文案区 --- */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-sumo-brand font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-6 block font-sans">
            Join The Community
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-sumo-text font-serif leading-tight">
            未来の横綱を、
            <br className="md:hidden" />
            <span className="text-sumo-brand inline-block border-b-4 border-sumo-brand pb-2 mx-2">
              ここ
            </span>
            から。
          </h2>
        </div>

        {/* --- 双子星行动条 (Dual Action Bar) --- */}
        <div className="flex flex-col md:flex-row w-full gap-6 md:gap-0">
          {/* === 左侧：寻找道场 (Search) === */}
          <Link
            href="/clubs/map"
            className="group relative flex-1 h-[280px] md:h-[380px] flex flex-col items-center justify-center p-8 transition-all duration-500
            
            /* Mobile Style: 独立白卡片 */
            bg-white border border-gray-100 rounded-sm shadow-sm
            
            /* Desktop Style: 
               1. bg-white: 电脑端也是纯白
               2. border-r-0: 去掉右边框，为了和右边的卡片无缝拼接
            */
            md:bg-white md:rounded-none md:shadow-none md:border-y md:border-l md:border-r-0 md:border-gray-100

            /* Desktop Hover Interaction: 背景变红 */
            hover:bg-sumo-red hover:border-sumo-red
            "
          >
            {/* 1. 核心内容 */}
            <div className="flex flex-col items-center z-10">
              <div className="mb-5 text-sumo-red opacity-100 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                <Search size={48} strokeWidth={1.5} />
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-sumo-text group-hover:text-white tracking-tight mb-2 transition-colors duration-300">
                近くの道場を探す
              </h3>

              <p className="text-xs font-bold tracking-[0.2em] text-gray-400 group-hover:text-white/80 uppercase transition-colors duration-300">
                Find A Club
              </p>
            </div>

            {/* 2. 视觉锚点 (Magic Button) */}
            <div
              className="mt-8 md:mt-12 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500
              border border-sumo-red text-sumo-red
              group-hover:bg-white group-hover:border-white group-hover:scale-110 group-hover:shadow-lg
            "
            >
              <ArrowRight size={24} />
            </div>

            {/* 左侧色条 (Mobile Only) */}
            <div className="md:hidden absolute left-0 top-4 bottom-4 w-[4px] bg-sumo-red rounded-r"></div>
          </Link>

          {/* === 右侧：管理者入口 (Manager) === */}
          <Link
            href="/manager/entry"
            className="group relative flex-1 h-[280px] md:h-[380px] flex flex-col items-center justify-center p-8 transition-all duration-500
            
            /* Mobile Style */
            bg-white border border-gray-100 rounded-sm shadow-sm
            
            /* Desktop Style: 
               1. md:bg-white: 这里改成了纯白！和左边统一
               2. md:border: 四周有边框 (左边框会自动补上左卡片缺的那一块)
            */
            md:bg-white md:rounded-none md:shadow-none md:border md:border-gray-100
            
            /* Desktop Hover Interaction: 背景变蓝 */
            hover:bg-sumo-brand hover:border-sumo-brand
            "
          >
            <div className="flex flex-col items-center z-10">
              <div className="mb-5 text-sumo-brand opacity-100 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                <Plus size={48} strokeWidth={1.5} />
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-sumo-text group-hover:text-white tracking-tight mb-2 transition-colors duration-300">
                クラブを掲載する
              </h3>

              <p className="text-xs font-bold tracking-[0.2em] text-gray-400 group-hover:text-white/80 uppercase transition-colors duration-300">
                For Managers
              </p>
            </div>

            {/* 视觉锚点 (Magic Button) */}
            <div
              className="mt-8 md:mt-12 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500
              border border-sumo-brand text-sumo-brand
              group-hover:bg-white group-hover:border-white group-hover:scale-110 group-hover:shadow-lg
            "
            >
              <ArrowRight size={24} />
            </div>

            {/* 左侧色条 (Mobile Only) */}
            <div className="md:hidden absolute left-0 top-4 bottom-4 w-[4px] bg-sumo-brand rounded-r"></div>
          </Link>
        </div>

        {/* 底部补充文案 */}
        <p className="mt-12 text-xs text-gray-400 font-medium tracking-wider">
          ※ 登録・利用は完全無料です
        </p>
      </div>
    </Section>
  );
};

export default CTA;
