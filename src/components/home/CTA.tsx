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
        <div className="text-center mb-10 md:mb-20">
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
        <div className="flex flex-col md:flex-row w-full gap-4 md:gap-6">
          {/* === 左侧：寻找道场 (Search) === */}
          <Link
            href="/clubs/map"
            className="group relative flex-1 md:h-[380px] flex flex-col items-center justify-center p-8 transition-all duration-200
            
            /* Mobile: 白卡片，左侧色条，无描边 */
            bg-white border border-gray-100 rounded-sm shadow-sm
            
            /* Desktop: 极淡红底 + 左侧色条 + 圆角阴影 */
            md:bg-sumo-red/5 md:rounded-sm md:shadow-sm md:border md:border-gray-100

            hover:bg-sumo-red hover:border-sumo-red
            active:bg-sumo-red active:border-sumo-red
            "
          >
            {/* 1. 核心内容：按下时文字/图标变白（[.group:active_&] 表示父 .group 处于 :active 时） */}
            <div className="flex flex-col items-center z-10 [.group:active_&]:text-white">
              <div className="mb-5 text-sumo-red opacity-100 group-hover:text-white [.group:active_&]:text-white group-hover:scale-110 [.group:active_&]:scale-110 transition-all duration-200">
                <Search size={48} strokeWidth={1.5} />
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-sumo-text group-hover:text-white [.group:active_&]:text-white tracking-tight transition-colors duration-200">
                近くの道場を探す
              </h3>
            </div>

            {/* 2. 视觉锚点 (Magic Button)：按下时圆圈变白 */}
            <div
              className="mt-4 md:mt-12 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200
              border border-sumo-red text-sumo-red
              group-hover:bg-white group-hover:border-white [.group:active_&]:bg-white [.group:active_&]:border-white group-hover:scale-110 [.group:active_&]:scale-110 group-hover:shadow-lg
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
            
            /* Mobile: 白卡片，左侧色条，无描边 */
            bg-white border border-gray-100 rounded-sm shadow-sm
            
            /* Desktop: 极淡蓝底 + 左侧色条 + 圆角阴影 */
            md:bg-sumo-brand/5 md:rounded-sm md:shadow-sm md:border md:border-gray-100

            hover:bg-sumo-brand hover:border-sumo-brand
            active:bg-sumo-brand active:border-sumo-brand
            "
          >
            <div className="flex flex-col items-center z-10 [.group:active_&]:text-white">
              <div className="mb-5 text-sumo-brand opacity-100 group-hover:text-white [.group:active_&]:text-white group-hover:scale-110 [.group:active_&]:scale-110 transition-all duration-200">
                <Plus size={48} strokeWidth={1.5} />
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-sumo-text group-hover:text-white [.group:active_&]:text-white tracking-tight transition-colors duration-200">
                クラブを掲載する
              </h3>
            </div>

            {/* 视觉锚点 (Magic Button)：按下时圆圈变白 */}
            <div
              className="mt-4 md:mt-12 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200
              border border-sumo-brand text-sumo-brand
              group-hover:bg-white group-hover:border-white [.group:active_&]:bg-white [.group:active_&]:border-white group-hover:scale-110 [.group:active_&]:scale-110 group-hover:shadow-lg
            "
            >
              <ArrowRight size={24} />
            </div>

            {/* 左侧色条：移动端 + 桌面端均显示 */}
            <div className="absolute left-0 top-4 bottom-4 w-[4px] bg-sumo-brand rounded-r"></div>
          </Link>
        </div>
        {/* 底部补充文案 */}
        <p className="mt-8 text-xs text-gray-400 font-medium tracking-wider">
          ※ 登録・利用は完全無料です
        </p>

      </div>
    </Section>
  );
};

export default CTA;
