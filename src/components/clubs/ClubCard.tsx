"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type clubsData } from "@/data/mockData"; // 假设你导出了类型，或者直接用 typeof

// 定义 Props 类型
type ClubCardProps = {
  club: (typeof clubsData)[0]; // 自动获取数据类型
  className?: string; // 允许外部传入样式 (比如动画延迟)
};

const ClubCard = ({ club, className }: ClubCardProps) => {
  return (
    <div
      className={cn(
        "group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100 flex flex-col h-full",
        className,
      )}
    >
      {/* 1. 图片区域 */}
      <Link
        href={`/clubs/${club.id}`}
        className="relative aspect-[4/3] overflow-hidden block"
      >
        <Image
          src={club.img}
          alt={club.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* 地区标签 */}
        <div className="absolute top-4 left-4 bg-sumo-gold text-white px-3 py-1 text-xs font-bold tracking-widest shadow-md z-10">
          {club.area}
        </div>
        {/* 暗色遮罩 (Hover时) */}
        <div className="absolute inset-0 bg-sumo-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>

      {/* 2. 内容区域 */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-3">
          <Link href={`/clubs/${club.id}`}>
            <h3 className="text-lg font-serif font-bold text-sumo-dark group-hover:text-sumo-red transition-colors line-clamp-1">
              {club.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <MapPin size={14} className="text-sumo-gold" />
          <span>{club.area}</span>
          {club.tag && (
            <>
              <span className="w-[1px] h-3 bg-gray-300 mx-1"></span>
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                {club.tag}
              </span>
            </>
          )}
        </div>

        {/* 按钮推到底部 */}
        <div className="mt-auto">
          <Link
            href={`/clubs/${club.id}`}
            className="w-full py-3 border border-gray-200 text-xs font-bold tracking-widest text-gray-600 group-hover:bg-sumo-dark group-hover:text-white group-hover:border-sumo-dark transition-all flex items-center justify-center gap-2 rounded-sm"
          >
            詳細を見る
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;
