"use client";

import React from "react";
import Link from "@/components/ui/TransitionLink";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import Section from "@/components/ui/Section";
import Ceramic from "@/components/ui/Ceramic";
import Button from "@/components/ui/Button";

// 定义从 Prisma 传过来的数据类型
type ActivityWithClub = {
  id: string;
  title: string;
  date: Date;
  location: string | null;
  mainImage: string | null;
  category?: string | null;
  club: {
    name: string;
  } | null;
};

interface ActivityReportProps {
  activities: ActivityWithClub[];
}

const ActivityReport = ({ activities }: ActivityReportProps) => {
  // 健壮性检查：如果没有活动，就先不渲染这个区域
  if (!activities || activities.length === 0) return null;

  // 只展示最新的3个活动
  const displayActivities = activities.slice(0, 3);

  return (
    <Section background="gray" id="activity-report">
      {/* 头部标题区 - 与 PickupClubs 保持一致 */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 border-b border-gray-200 pb-8 reveal-up">
        <div>
          <span className="text-sumo-brand text-xs font-bold tracking-[0.3em] mb-3 block uppercase font-sans">
            Activity Report
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-serif text-sumo-text">
            普及・広報活動
          </h2>
        </div>

        <Link
          href="/activities"
          className="hidden md:flex items-center gap-2 text-sm font-bold text-sumo-brand hover:text-sumo-red transition-colors group tracking-widest"
        >
          すべての活動を見る
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* 卡片网格 - 采用 /activities 页面的精致卡片设计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {displayActivities.map((activity, idx) => {
          const date = new Date(activity.date);
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const year = date.getFullYear();

          return (
            <div
              key={activity.id}
              className={`reveal-up ${
                idx === 1 ? "delay-100" : idx === 2 ? "delay-200" : ""
              }`}
            >
              <Ceramic
                as={Link}
                href={`/activities/${activity.id}`}
                interactive={true}
                className="flex flex-col h-full overflow-hidden p-0 bg-white"
              >
                {/* 图片区域 - 竖向比例，更有杂志感 */}
                <div className="relative aspect-3/4 bg-gray-100 group overflow-hidden">
                  <Image
                    src={activity.mainImage || "/images/placeholder-activity.jpg"}
                    alt={activity.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  
                  {/* 日期贴片 - 左上角精致设计 */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 text-center shadow-lg rounded-sm border-t-2 border-sumo-brand z-10">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      {month}月
                    </span>
                    <span className="block text-xl font-serif font-black text-sumo-dark leading-none">
                      {day}
                    </span>
                  </div>

                  {/* 分类标签 - 右下角 */}
                  {activity.category && (
                    <div className="absolute bottom-0 right-0 bg-sumo-dark text-white text-[10px] font-bold px-3 py-1.5 tracking-widest uppercase">
                      {activity.category}
                    </div>
                  )}
                </div>

                {/* 内容区域 */}
                <div className="flex flex-col grow p-6 group">
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 leading-relaxed group-hover:text-sumo-brand transition-colors line-clamp-2">
                    {activity.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-6 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-sumo-brand" />
                      <span className="line-clamp-1">
                        {activity.location || activity.club?.name || "SUMOME"}
                      </span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span>
                      {year}.{month < 10 ? `0${month}` : month}.
                      {day < 10 ? `0${day}` : day}
                    </span>
                  </div>

                  <div className="w-full h-px bg-gray-100 mb-4"></div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 group-hover:text-sumo-brand transition-colors uppercase">
                      View Details
                    </span>
                    <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-sumo-brand group-hover:bg-sumo-brand transition-all duration-300">
                      <ArrowRight
                        size={14}
                        className="text-gray-400 group-hover:text-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </Ceramic>
            </div>
          );
        })}
      </div>

      {/* 移动端按钮 */}
      <div className="mt-12 text-center md:hidden reveal-up delay-100">
        <Button href="/activities" variant="outline" className="w-full md:w-auto">
          すべての活動を見る
        </Button>
      </div>
    </Section>
  );
};

export default ActivityReport;