"use client";

import React from "react";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ActivityCardProps = {
  id: string | number;
  img: string;
  title: string;
  location: string;
  date: string;
};

const ActivityCard = ({
  id,
  img,
  title,
  location,
  date,
}: ActivityCardProps) => {
  return (
    <Link href={`/activities/${id}`} className="block h-full group">
      <article
        className={cn(
          // 卡片容器：白底，圆角极小(rounded-sm)，无边框(因为背景是深色的，白卡片本身就很显眼)
          "cursor-pointer flex flex-col h-full bg-white rounded-sm overflow-hidden",
          "transition-transform duration-500 hover:-translate-y-2",
        )}
      >
        {/* 图片区域 */}
        <div className="overflow-hidden relative aspect-[4/3] bg-gray-200">
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* 标签颜色为品牌蓝 (bg-sumo-brand) */}
          <div className="absolute top-0 left-0 bg-sumo-brand text-white text-[10px] font-bold px-4 py-1.5 tracking-widest z-10">
            {location}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 font-sans font-medium">
            <Calendar size={12} className="text-sumo-brand" />
            <span className="tracking-wider">{date}</span>
          </div>

          {/* 标题：默认墨色，悬停变蓝 */}
          <h3 className="text-lg font-bold text-sumo-text leading-snug mb-4 group-hover:text-sumo-brand transition-colors line-clamp-2">
            {title}
          </h3>

          <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-xs font-bold tracking-widest text-gray-400 group-hover:text-sumo-brand transition-colors">
            <span>READ REPORT</span>
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ActivityCard;
