"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ServiceProps = {
  id: string;
  kanji: string;
  title: string;
  desc: string;
  img: string;
  delayClass?: string;
  isStaggered?: boolean; // 是否错位显示
};

const ServiceCard = ({
  kanji,
  title,
  desc,
  img,
  delayClass,
  isStaggered,
}: ServiceProps) => {
  return (
    <div
      className={cn(
        "group relative transition-all duration-500 reveal-up h-full",
        delayClass,
        isStaggered ? "mt-0 md:mt-24" : "mt-0",
      )}
    >
      {/* 边框装饰 */}
      <div className="absolute inset-0 border-2 border-sumo-gold transform translate-x-3 translate-y-3 transition-transform group-hover:translate-x-2 group-hover:translate-y-2 pointer-events-none"></div>

      {/* 卡片主体 */}
      <div className="bg-white relative p-8 flex flex-col items-center text-center shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer h-full transition-shadow duration-300">
        {/* 背景图隐现 */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
          {/* Smart Money Tip: 这里暂时用 img 标签，方便直接引用 Unsplash 外链。
            如果是本地图片，请务必换成 <Image fill /> 
          */}
          <img
            src={img}
            className="w-full h-full object-cover grayscale"
            alt={title}
          />
        </div>

        {/* 圆形汉字 */}
        <div className="w-24 h-24 rounded-full border border-sumo-dark flex items-center justify-center mb-10 group-hover:bg-sumo-dark group-hover:text-white transition-colors duration-500 relative z-10 text-sumo-dark flex-shrink-0">
          <span className="font-serif text-5xl font-bold">{kanji}</span>
        </div>

        {/* 标题 */}
        <h3 className="text-xl font-bold tracking-widest mb-4 relative z-10 text-sumo-dark">
          {title}
        </h3>

        <div className="w-[1px] h-12 bg-sumo-gold mb-6 relative z-10"></div>

        {/* 描述 */}
        <p className="text-gray-600 leading-loose whitespace-pre-line font-medium relative z-10 pb-6 flex-grow">
          {desc}
        </p>

        {/* 箭头 */}
        <div className="mt-auto relative z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          <ArrowUpRight className="text-sumo-red" size={32} />
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
