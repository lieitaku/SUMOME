"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { activitiesData } from "@/data/mockData";
import { ArrowLeft, MapPin, Calendar, Share2, Clock } from "lucide-react";
import WaveDivider from "@/components/home/WaveDivider";
import Button from "@/components/ui/Button";

const ActivityDetailPage = () => {
  const params = useParams();
  const id = Number(params.id);
  const currentIndex = activitiesData.findIndex((item) => item.id === id);
  const activity = activitiesData[currentIndex];

  if (!activity) {
    return notFound();
  }

  // 如果当前是最后一篇 (index + 1 === length)，取模运算 % 会让它变回 0 (第一篇)
  // 这样用户可以一直点“下一篇”浏览完所有内容
  const nextIndex = (currentIndex + 1) % activitiesData.length;
  const nextActivity = activitiesData[nextIndex];
  return (
    <div className="bg-sumo-bg min-h-screen font-sans">
      {/* ==================== 1. Immersive Hero Section (去色高级感处理) ==================== */}
      {/* 设计逻辑：
         1. 背景设为深紫黑 (bg-sumo-dark)。
         2. 图片设为黑白 (grayscale) 并降低透明度，让底色透出来，形成“双色调”效果。
         3. 这种处理完美掩盖低分辨率，且文字对比度极高。
      */}
      <section className="relative h-[60vh] md:h-[70vh] min-h-[500px] w-full overflow-hidden bg-sumo-dark">
        {/* A. 背景图片 (低画质优化版) */}
        <div className="absolute inset-0 opacity-60 mix-blend-overlay">
          <Image
            src={activity.img}
            alt={activity.title}
            fill
            priority
            // grayscale: 去色
            // object-cover: 填满
            // scale-105: 微微放大防止边缘露白
            className="object-cover grayscale scale-105"
          />
        </div>

        {/* B. 颜色滤镜层 (Color Wash) */}
        {/* 使用 sum-brand 再次叠加，统一色调倾向 */}
        <div className="absolute inset-0 bg-sumo-brand/30 mix-blend-multiply"></div>

        {/* C. 深度渐变遮罩 (Deep Gradient) */}
        {/* 从底部向上变黑，保证文字绝对清晰，同时营造深邃感 */}
        <div className="absolute inset-0 bg-gradient-to-t from-sumo-dark via-sumo-dark/90 to-transparent"></div>

        {/* D. 纹理叠加 (Texture) */}
        {/* 和纸纹理增加纸质触感 */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: "url('/images/bg/washi.png')",
            backgroundRepeat: "repeat",
          }}
        ></div>

        {/* Hero 内容 */}
        <div className="absolute bottom-0 w-full pb-12 md:pb-20 pt-20 px-6 z-10">
          <div className="container mx-auto max-w-4xl text-white reveal-up">
            {/* 标签栏 */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-sumo-red text-white text-xs font-bold px-3 py-1 tracking-widest uppercase rounded-sm shadow-lg">
                EVENT REPORT
              </span>
              <span className="flex items-center gap-2 text-sm font-bold text-sumo-gold border border-sumo-gold/30 px-3 py-1 rounded-sm bg-black/20 backdrop-blur-sm">
                <Calendar size={16} />
                {activity.date}
              </span>
            </div>

            {/* 标题 */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6 drop-shadow-md text-white/95">
              {activity.title}
            </h1>

            {/* 地点 */}
            <div className="flex items-center gap-2 text-gray-300 font-medium text-sm md:text-base">
              <MapPin size={18} className="text-sumo-gold" />
              <span>{activity.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. Article Body ==================== */}
      <section className="relative py-20 px-6">
        {/* 顶部波浪 */}
        <div className="absolute top-0 w-full left-0">
          <WaveDivider
            fill="fill-sumo-dark"
            isRotated={false}
            withTexture={true}
          />
        </div>

        <div className="container mx-auto pt-20 max-w-4xl relative z-10 -mt-10">
          <div className="bg-white p-8 md:p-16 rounded-sm shadow-2xl relative">
            {/* 装饰：顶部金色横条 */}
            <div className="absolute top-0 left-0 w-full h-2 bg-sumo-gold/20"></div>
            <div className="absolute top-0 left-0 w-32 h-2 bg-sumo-gold"></div>

            {/* 文章内容 */}
            <div className="prose prose-lg max-w-none text-gray-700 font-medium leading-loose">
              <h3 className="text-2xl font-serif font-bold text-sumo-dark mb-6 border-l-4 border-sumo-gold pl-4">
                イベントのハイライト
              </h3>
              <p className="mb-8">
                {activity.date}に{activity.location}で開催された「
                {activity.title}」は、
                多くの参加者と熱気に包まれ、大盛況のうちに幕を閉じました。
                会場には子供たちの元気な声が響き渡り、相撲を通じて心身を鍛える
                素晴らしい機会となりました。
              </p>

              <p className="mb-8">
                当日は、基本的な四股（しこ）やすり足の稽古から始まり、
                実際に土俵に上がっての取組体験も行われました。
                初めてまわしを締める子供たちも多く、最初は緊張した面持ちでしたが、
                すぐに笑顔で相撲を楽しんでいました。
              </p>

              {/* 模拟相册：这里也可以应用黑白+Hover彩色的效果，保持风格一致 */}
              <div className="grid grid-cols-2 gap-4 my-10 not-prose">
                <div className="aspect-video relative rounded-sm overflow-hidden bg-gray-100 group">
                  <Image
                    src={activity.img}
                    alt="Scene 1"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  {/* Hover 提示 */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none"></div>
                </div>
                <div className="aspect-video relative rounded-sm overflow-hidden bg-gray-100 group">
                  <Image
                    src={activity.img}
                    alt="Scene 2"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none"></div>
                </div>
              </div>

              <h3 className="text-2xl font-serif font-bold text-sumo-dark mb-6 border-l-4 border-sumo-gold pl-4">
                次回の開催に向けて
              </h3>
              <p>
                今回のイベントを通じて、改めて「礼に始まり礼に終わる」相撲の精神の素晴らしさを
                実感しました。次回はさらに規模を拡大し、より多くの方々に
                相撲の魅力を伝えていきたいと考えています。
              </p>
            </div>

            {/* 分享与标签 */}
            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex gap-2">
                <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full hover:bg-sumo-gold hover:text-white transition-colors cursor-pointer">
                  #相撲教室
                </span>
                <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full hover:bg-sumo-gold hover:text-white transition-colors cursor-pointer">
                  #子供向け
                </span>
              </div>

              <button className="flex items-center gap-2 text-sumo-gold font-bold hover:text-sumo-red transition-colors text-sm tracking-widest group">
                <Share2
                  size={16}
                  className="group-hover:scale-110 transition-transform"
                />
                SHARE THIS POST
              </button>
            </div>
          </div>

          {/* 3. 底部导航 */}
          <div className="flex justify-between mt-12 px-4">
            <Link
              href="/activities"
              className="group flex items-center gap-3 text-gray-500 hover:text-sumo-dark transition-colors"
            >
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-sumo-gold group-hover:bg-sumo-gold group-hover:text-white transition-all">
                <ArrowLeft size={16} />
              </div>
              <span className="text-sm font-bold tracking-widest">
                一覧に戻る
              </span>
            </Link>

            <Link
              href={`/activities/${nextActivity.id}`}
              className="group flex items-center gap-3 text-gray-500 hover:text-sumo-dark transition-colors text-right"
            >
              <span className="text-sm font-bold tracking-widest">
                次の記事
              </span>
              <span className="text-xs text-gray-400 line-clamp-1 max-w-[150px] group-hover:text-sumo-gold transition-colors">
                {nextActivity.title}
              </span>
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-sumo-gold group-hover:bg-sumo-gold group-hover:text-white transition-all transform rotate-180">
                <ArrowLeft size={16} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CTA Section */}
      <section className="bg-sumo-dark py-20 mt-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: "url('/images/bg/washi.png')",
            backgroundRepeat: "repeat",
          }}
        ></div>
        <div className="container mx-auto text-center relative z-10 px-6">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-6">
            あなたも相撲を始めませんか？
          </h2>
          <p className="text-gray-400 mb-8">
            お近くの相撲クラブを探して、見学・体験に行ってみましょう。
          </p>
          <Button
            href="/clubs"
            variant="primary"
            className="shadow-xl py-4 px-10 text-lg font-bold"
          >
            クラブを探す
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ActivityDetailPage;
