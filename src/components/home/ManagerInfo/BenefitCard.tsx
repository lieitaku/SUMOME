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
        "group relative border border-sumo-gold/10 bg-white/5 p-8 md:p-10",
        "transition-all duration-500 reveal-up",
        "border-l-4 border-l-sumo-gold/30",
        // Hover 状态优化：红色左边框、淡红背景、上浮、投影
        "hover:border-l-sumo-red hover:bg-sumo-red/5 hover:-translate-y-1",
        "hover:shadow-[0_10px_30px_-10px_rgba(211,50,62,0.15)]",
        delay,
        className,
      )}
    >
      {/* 背景大数字 */}
      <div className="absolute top-4 right-6 text-6xl md:text-8xl font-serif font-bold text-sumo-gold opacity-10 transition-all duration-700 ease-out select-none group-hover:text-sumo-red group-hover:opacity-20 group-hover:scale-110 group-hover:rotate-12">
        {number}
      </div>

      {/* 标题 */}
      <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-4 relative z-10">
        <span className="text-sumo-gold group-hover:text-sumo-red transition-colors duration-300 text-xs">
          ●
        </span>
        <span className="group-hover:text-sumo-gold transition-colors duration-300">
          {title}
        </span>
      </h3>

      {/* 描述文字 */}
      <p className="text-gray-400 leading-loose text-sm md:text-base relative z-10 group-hover:text-gray-300 transition-colors duration-300 font-medium">
        {desc}
      </p>
    </div>
  );
};

export default BenefitCard;
