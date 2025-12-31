"use client";
import React from "react";
import WaveDivider from "@/components/home/WaveDivider"; // 确保路径正确
import { activitiesData } from "@/data/mockData";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// 引入样式和子组件
import styles from "./styles.module.css";
import ActivityCard from "./ActivityCard";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

const ActivityReport = () => {
  const originalData = activitiesData.slice(0, 3);
  const loopData = [...originalData, ...originalData];

  return (
    <section className="py-32 bg-sumo-bg relative overflow-hidden">
      <WaveDivider fill="fill-sumo-dark" isRotated={false} withTexture={true} />

      <div className="container mx-auto px-6 relative z-10 pt-12">
        {/* 标题区域 */}
        <div className="text-center mb-12 reveal-up">
          <span className="text-sumo-gold text-xs font-bold tracking-[0.2em] mb-4 block uppercase">
            ACTIVITY REPORT
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-sumo-dark">
            普及・広報活動
          </h2>
          <div className="w-12 h-[2px] bg-sumo-gold mx-auto mt-6"></div>
        </div>

        {/* Swiper 区域 */}
        <div className="reveal-up delay-100 md:px-8 lg:px-16">
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
              el: `.${styles.customPagination}`, // 引用 CSS Module 类名
              clickable: true,
              type: "bullets",
            }}
            breakpoints={{
              0: { slidesPerView: 1.2, spaceBetween: 16 },
              768: { slidesPerView: 2.2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 36 },
            }}
            className="!pb-4"
          >
            {loopData.map((activity, index) => (
              <SwiperSlide
                key={`${activity.id}-${index}`}
                className="h-auto py-4"
              >
                {/* 使用封装好的卡片组件 */}
                <ActivityCard
                  img={activity.img}
                  title={activity.title}
                  location={activity.location}
                  date={activity.date}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 分页器容器 */}
          <div className={styles.customPagination}></div>
        </div>
      </div>
    </section>
  );
};

export default ActivityReport;
