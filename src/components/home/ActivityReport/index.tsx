"use client";

import React from "react";
import WaveDivider from "@/components/home/WaveDivider";
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
  // 取前3条数据并复制一份，确保 Swiper loop 模式在数据量少时也能正常工作
  // 如果真实数据 > 5条，其实就不需要手动 [...data, ...data] 了
  const originalData = activitiesData.slice(0, 3);
  const loopData = [...originalData, ...originalData];

  return (
    <section className="py-32 bg-sumo-bg relative overflow-hidden">
      {/* 这里的 withTexture 确保波浪风格统一 */}
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
              pauseOnMouseEnter: true, // 鼠标悬停暂停，提升用户体验
            }}
            pagination={{
              el: `.${styles.customPagination}`, // 引用 CSS Module 类名
              clickable: true,
              type: "bullets",
            }}
            breakpoints={{
              0: { slidesPerView: 1.2, spaceBetween: 16 }, // 手机端露出一点下一张，提示可滑动
              768: { slidesPerView: 2.2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 36 },
            }}
            className="!pb-4"
          >
            {loopData.map((activity, index) => (
              // key 必须唯一，加上 index 防止 loop 数据重复 id 报错
              <SwiperSlide
                key={`${activity.id}-${index}`}
                className="h-auto py-4" // py-4 是为了给 hover 浮起的阴影留出空间，防止被 overflow 切掉
              >
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
