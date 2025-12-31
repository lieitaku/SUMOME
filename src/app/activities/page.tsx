"use client";

import React from "react";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { activitiesData } from "@/data/mockData";

const ActivitiesPage = () => {
  return (
    <div className="antialiased bg-[#FCFAF7] min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* 1. Page Header */}
        <section className="bg-[#1B1C37] text-white pt-32 pb-20 px-6">
          <div className="container mx-auto text-center">
            <p className="text-[#C39B4F] text-xs font-bold tracking-[0.2em] mb-4 uppercase">
              Activity Report
            </p>
            <h1 className="text-3xl md:text-5xl font-serif font-bold">
              活動一覧
            </h1>
          </div>
        </section>

        {/* 2. 列表内容区 */}
        <section className="py-20 px-6">
          <div className="container mx-auto">
            {/* 网格布局 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {/* 为了演示效果，这里稍微复制了几份数据，实际开发中直接用 activitiesData.map 即可 */}
              {[...activitiesData].map((act, index) => (
                <div
                  key={index}
                  className="group bg-white flex flex-col h-full shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-b-4 border-transparent hover:border-[#B7282E]"
                >
                  {/* 图片区域 */}
                  {/* 🔴 修改1：比例改为 2/3 (aspect-[2/3]) */}
                  <div className="relative overflow-hidden aspect-[2/3] w-full cursor-pointer">
                    <img
                      src={act.img}
                      alt={act.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* 遮罩层：Hover时变亮 */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                  </div>

                  {/* 内容区域 */}
                  <div className="p-8 flex flex-col flex-grow">
                    {/* 日期 */}
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-serif mb-4">
                      <Calendar size={14} />
                      <span className="tracking-widest">{act.date}</span>
                    </div>

                    {/* 标题 */}
                    <h3 className="text-xl font-bold text-[#1B1C37] leading-relaxed mb-4 group-hover:text-[#B7282E] transition-colors line-clamp-2">
                      {act.title}
                    </h3>

                    {/* 地点 & Read More */}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {/* 🔴 修改3：使用动态变量 act.location */}
                        <span>{act.location}</span>
                      </div>

                      {/* Read More 箭头 */}
                      <span className="flex items-center gap-1 text-[#B7282E] font-bold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        READ MORE <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 分页按钮 */}
            <div className="mt-20 flex justify-center gap-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  className={`w-12 h-12 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    num === 1
                      ? "bg-[#1B1C37] text-white"
                      : "bg-white text-[#1B1C37] hover:bg-gray-100"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ActivitiesPage;
