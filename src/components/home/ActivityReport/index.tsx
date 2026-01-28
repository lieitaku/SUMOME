"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import styles from "./styles.module.css";
import ActivityCard from "./ActivityCard";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

// 定义从 Prisma 传过来的数据类型
type ActivityWithClub = {
  id: string;
  title: string;
  date: Date; // 数据库里是 Date 对象
  location: string | null;
  mainImage: string | null;
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

  // 这里的 loopData 逻辑保持原样，实现你追求的无限滚动感
  const loopData = [...activities, ...activities];

  return (
    <section
      className="py-32 bg-sumo-dark text-white relative overflow-hidden"
      id="activity-report"
    >
      {/* 背景大水印 */}
      <div className="absolute top-4 md:top-10 left-[-5%] md:left-[-2%] text-[5rem] md:text-[12rem] font-serif font-bold text-white opacity-[0.03] pointer-events-none select-none whitespace-nowrap leading-none">
        Activity
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-0">
        {/* --- 标题区域 --- */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 border-b border-white/10 pb-8">
          <div>
            <span className="text-white/50 text-xs font-bold tracking-[0.2em] mb-4 block uppercase font-sans">
              Activity Report
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-black text-white">
              普及・広報活動
            </h2>
          </div>

          <div className="hidden md:block text-white/60 text-sm font-medium tracking-wide font-sans">
            The latest movements of SUMOME.
          </div>
        </div>

        {/* Swiper 区域 */}
        <div>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            loop={true}
            speed={1000}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              el: `.${styles.customPagination}`,
              clickable: true,
              type: "bullets",
            }}
            breakpoints={{
              0: { slidesPerView: 1.2, spaceBetween: 16 },
              768: { slidesPerView: 2.2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 36 },
            }}
            className="!pb-12"
          >
            {loopData.map((activity, index) => (
              <SwiperSlide key={`${activity.id}-${index}`} className="h-auto">
                <ActivityCard
                  id={activity.id}
                  // 如果没有封面图，给一个兜底图，保证 UI 不崩
                  img={activity.mainImage || "/images/placeholder-activity.jpg"}
                  title={activity.title}
                  // 优先显示具体地点，没有则显示俱乐部/总部名字
                  location={activity.location || activity.club?.name || "SUMOME"}
                  // 统一格式化日期为 YYYY.MM.DD
                  date={new Date(activity.date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  }).replace(/\//g, '.')}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.customPagination}></div>
        </div>
      </div>
    </section>
  );
};

export default ActivityReport;