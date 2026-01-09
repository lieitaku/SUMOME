"use client";

import React from "react";
import { cn } from "@/lib/utils";

type BenefitCardProps = {
  number: string;
  title: string;
  desc: string;
  delay?: string;
  className?: string;
};

const BenefitCard = ({
  number,
  title,
  desc,
  delay,
  className,
}: BenefitCardProps) => {
  return (
    <div
      className={cn(
        // === 基础容器样式 ===
        "group relative p-8 md:p-12 bg-white transition-all duration-500 reveal-up",

        // ✨ Mobile (手机端优化):
        // 1. border: 四周有极淡的边框，强调独立感
        // 2. rounded-sm: 小圆角，像个卡片
        // 3. shadow-sm: 极淡的阴影，增加层次
        "border border-gray-100 rounded-sm shadow-sm",

        // ✨ Desktop (电脑端样式):
        // 1. md:border-0: 去掉四周边框
        // 2. md:border-b: 只保留底边框 (列表风)
        // 3. md:rounded-none: 直角
        // 4. md:shadow-none: 去掉阴影
        // 5. md:hover:bg-gray-50: 悬停变灰
        "md:border-0 md:border-b md:border-gray-200 md:rounded-none md:shadow-none md:hover:bg-gray-50",

        delay,
        className,
      )}
    >
      <div className="flex flex-col md:flex-row gap-5 md:gap-10 items-start">
        {/* 数字 */}
        <div className="text-4xl md:text-5xl font-serif font-black text-sumo-brand/40 md:text-gray-200 md:group-hover:text-sumo-brand transition-colors duration-300 select-none flex-shrink-0">
          {number}
        </div>

        <div className="flex-grow">
          {/* 标题 */}
          <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-sumo-brand md:text-sumo-text md:group-hover:text-sumo-brand transition-colors duration-300">
            {title}
          </h3>

          {/* 描述 */}
          <p className="text-gray-500 leading-loose text-sm md:text-base font-medium transition-colors duration-300">
            {desc}
          </p>
        </div>
      </div>

      {/* === 装饰线优化 === */}
      <div
        className={cn(
          "absolute left-0 w-[4px] bg-sumo-brand transition-transform duration-300 origin-top",

          // ✨ Mobile:
          // 1. top-4 bottom-4: 上下各留 16px 空白，不连在一起，有呼吸感
          // 2. rounded-r: 红线本身加个小圆角
          // 3. scale-y-100: 默认一直显示
          "top-4 bottom-4 rounded-r scale-y-100",

          // ✨ Desktop:
          // 1. md:top-0 md:bottom-0: 顶天立地，变成连贯的线条
          // 2. md:rounded-none: 直角
          // 3. md:scale-y-0: 默认隐藏，hover时显示
          "md:top-0 md:bottom-0 md:rounded-none md:scale-y-0 md:group-hover:scale-y-100",
        )}
      ></div>
    </div>
  );
};

export default BenefitCard;
