"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { magazinesData } from "@/data/magazines";
import { ArrowLeft, BookOpen, Share2, Download } from "lucide-react";
import Button from "@/components/ui/Button";

const MagazineDetailPage = () => {
  const params = useParams();
  const id = params.id as string;

  // 查找对应 ID 的杂志数据
  const magazine = magazinesData.find((item) => item.id === id);

  // 如果找不到，返回 404
  if (!magazine) {
    return notFound();
  }

  return (
    <div className="bg-sumo-bg min-h-screen">
      {/* 1. 顶部导航栏占位 (防止内容被 Header 遮挡) */}
      <div className="h-24 bg-sumo-dark"></div>

      {/* 2. 面包屑与返回 */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <Link
            href="/magazines"
            className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-sumo-red transition-colors tracking-widest"
          >
            <ArrowLeft size={14} className="mr-2" />
            一覧に戻る
          </Link>
        </div>
      </div>

      {/* 3. 主要内容区 (双栏布局) */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* --- 左侧：超大封面图 --- */}
          <div className="lg:col-span-5 relative lg:sticky lg:top-32 reveal-up">
            <div className="relative w-full aspect-[3/4] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-sm">
              <Image
                src={magazine.coverImage}
                alt={magazine.title}
                fill
                className="object-cover rounded-sm"
                priority // 详情页首屏大图，优先加载
              />
              {/* 纹理遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-white/10 pointer-events-none rounded-sm"></div>
              {/* 左侧书脊 */}
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-r from-black/40 to-transparent pointer-events-none rounded-l-sm"></div>
            </div>

            {/* 手机端显示的次要操作栏 */}
            <div className="flex gap-4 mt-8 lg:hidden justify-center">
              <button className="flex items-center gap-2 text-gray-500 hover:text-sumo-dark text-sm font-bold transition-colors">
                <Share2 size={16} /> シェア
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-sumo-dark text-sm font-bold transition-colors">
                <Download size={16} /> 保存
              </button>
            </div>
          </div>

          {/* --- 右侧：详细信息 --- */}
          <div className="lg:col-span-7 flex flex-col h-full reveal-up delay-100">
            {/* 头部信息 */}
            <div className="mb-8 border-b border-gray-200 pb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-sumo-gold text-white text-[10px] font-bold px-3 py-1 tracking-widest rounded-sm">
                  OFFICIAL MAGAZINE
                </span>
                <span className="text-sm text-gray-500 font-serif">
                  {magazine.publishDate} 発行
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-sumo-dark mb-4 leading-tight">
                {magazine.title}
              </h1>
              <p className="text-xl text-sumo-gold font-medium tracking-wide">
                {magazine.subTitle}
              </p>
            </div>

            {/* 简介 */}
            <div className="mb-10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                Introduction
              </h3>
              <p className="text-gray-700 leading-loose text-justify font-medium">
                {magazine.description}
              </p>
            </div>

            {/* 目录 (Table of Contents) */}
            <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm mb-12">
              <h3 className="text-lg font-serif font-bold text-sumo-dark mb-6 flex items-center gap-2">
                <BookOpen size={20} className="text-sumo-red" />
                目次・コンテンツ
              </h3>
              <ul className="space-y-4">
                {magazine.toc.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <span className="text-sumo-gold font-serif font-bold text-lg opacity-50">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="text-gray-700 font-medium pt-1">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 底部操作区 */}
            {/* 加深了背景色，使用了更密集的纹理，参考 Image 3 */}
            <div className="mt-auto p-10 md:p-12 bg-[#221a29] text-white rounded-sm text-center relative overflow-hidden group shadow-xl">
              {/* 使用更深、更密集的纹理背景 */}
              <div
                className="absolute inset-0 opacity-[0.15] bg-repeat"
                style={{
                  backgroundImage: `url("https://www.transparenttextures.com/patterns/asfalt-dark.png")`,
                }}
              ></div>

              <h3 className="relative z-10 text-2xl font-serif font-bold mb-3">
                この冊子を読む
              </h3>
              <p className="relative z-10 text-gray-400 text-base mb-8">
                Webビューアで中身をプレビューできます（サンプル）
              </p>

              <div className="relative z-10 flex justify-center">
                <Button
                  href="#"
                  variant="primary"
                  // w-full md:w-auto md:min-w-[300px]: 手机通栏，电脑端至少300宽
                  // py-4 px-8 text-lg: 增加内边距和字号
                  className="w-full md:w-auto md:min-w-[300px] py-4 px-8 text-lg font-bold shadow-lg hover:shadow-sumo-red/30 tracking-widest"
                >
                  無料で読む
                  <BookOpen size={24} className="ml-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MagazineDetailPage;
