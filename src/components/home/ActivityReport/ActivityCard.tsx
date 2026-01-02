"use client";

import React from "react";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image"; // 引入 Next.js 图像优化

// 定义 props 类型
type ActivityCardProps = {
  img: string;
  title: string;
  location: string;
  date: string;
};

const ActivityCard = ({ img, title, location, date }: ActivityCardProps) => {
  return (
    <article className="group cursor-pointer flex flex-col h-full bg-white border border-gray-100 rounded-sm overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
      {/* 图片区域 */}
      <div className="overflow-hidden relative aspect-[4/5] bg-gray-100">
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] transform group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 响应式尺寸建议
        />
        <div className="absolute top-0 left-0 bg-sumo-gold text-white text-[10px] font-bold px-3 py-2 tracking-widest z-10 shadow-sm">
          {location}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 font-serif">
          <Calendar size={12} />
          <span>{date}</span>
        </div>

        <h3 className="text-base font-bold text-sumo-dark leading-relaxed mb-4 group-hover:text-sumo-brand transition-colors line-clamp-2 h-[3.25rem]">
          {title}
        </h3>

        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-xs font-bold tracking-widest text-sumo-gold group-hover:text-sumo-red transition-colors">
          <span>READ MORE</span>
          <ArrowRight
            size={14}
            className="group-hover:translate-x-2 transition-transform duration-300"
          />
        </div>
      </div>
    </article>
  );
};

export default ActivityCard;
