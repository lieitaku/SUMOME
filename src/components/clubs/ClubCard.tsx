"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
// 引入新的 Club 类型定义，获得更好的代码提示
import { type Club } from "@/data/clubs";
import Ceramic from "@/components/ui/Ceramic";

type ClubCardProps = {
  club: Club; // 直接使用 Club 类型
  className?: string;
};

const ClubCard = ({ club, className }: ClubCardProps) => {
  return (
    <Ceramic className={cn("flex flex-col h-full", className)}>
      {/* --- 图片区域 --- */}
      <Link
        href={`/clubs/${club.id}`}
        className="relative aspect-[4/3] block overflow-hidden"
      >
        <Image
          src={club.mainImage}
          alt={club.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* 遮罩 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-sumo-brand/10 transition-colors duration-300"></div>

        {/* 地区标签 */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-sumo-brand px-3 py-1 rounded-full text-[10px] font-bold tracking-widest shadow-sm flex items-center gap-1 border border-white/50">
          <MapPin size={10} />
          {club.area}
        </div>
      </Link>

      {/* --- 内容区域 --- */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <Link href={`/clubs/${club.id}`}>
            <h3 className="text-lg font-serif font-bold text-gray-800 leading-snug group-hover:text-sumo-brand transition-colors line-clamp-1">
              {club.name}
            </h3>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {club.tags &&
            club.tags.length > 0 &&
            // 只显示前两个标签，避免撑破布局
            club.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 text-gray-500 text-[10px] font-bold tracking-wider border border-gray-100"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
        </div>

        <div className="mt-auto">
          <Link
            href={`/clubs/${club.id}`}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300",
              "text-xs font-bold tracking-widest",
              "bg-gray-50 border border-gray-100 text-gray-500",
              "group-hover:bg-sumo-brand group-hover:border-sumo-brand group-hover:text-white group-hover:shadow-md",
              "md:bg-white",
            )}
          >
            <span>詳細を見る</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </Ceramic>
  );
};

export default ClubCard;
