"use client";

import React from "react";
import WaveDivider from "@/components/home/WaveDivider";
import { useParams } from "next/navigation";
import { clubsData } from "@/data/mockData"; // 俱乐部列表数据
import { PREFECTURE_DATABASE } from "@/data/prefectures";
import { MapPin, ArrowRight, Camera, User } from "lucide-react"; // 引入 Camera 图标
import Link from "next/link";
import ScrollToTop from "@/components/common/ScrollToTop";
import MiniSponsorBanner from "@/components/common/MiniSponsorBanner";

const PrefecturePage = () => {
  const params = useParams();
  const prefSlug = params.pref as string;

  // 1. 从我们的“数据库”中查找当前县的数据
  const prefData = PREFECTURE_DATABASE[prefSlug];

  // 如果数据库里没有这个县的数据（比如还没有填），给一个默认值防止报错
  const displayData = prefData || {
    name: prefSlug.toUpperCase(), // 默认显示 slug
    introTitle: `${prefSlug}の相撲事情`,
    introText: "現在、この地域の詳細情報は準備中です。",
    bannerImg: "", // 空图片
    rikishiList: [],
  };

  // 2. 筛选俱乐部 (逻辑不变)
  const filteredClubs = clubsData.filter((club) =>
    club.area.includes(displayData.name),
  );

  return (
    <div className="antialiased bg-sumo-bg min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* ==================== 1. Hero Area ==================== */}
        <section className="relative bg-sumo-dark text-white pt-40 pb-24 px-6 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
            style={{
              backgroundImage: `url("https://www.transparenttextures.com/patterns/washi.png")`,
            }}
          ></div>

          <div className="container mx-auto text-center relative z-10">
            <Link
              href="/clubs"
              className="inline-block mb-6 text-gray-400 hover:text-white text-xs tracking-widest border-b border-gray-600 pb-1 transition-colors"
            >
              ← 地図検索に戻る
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-wider">
              {displayData.name}
            </h1>
            <p className="text-sumo-gold text-xs font-bold tracking-[0.3em] uppercase">
              Area Information
            </p>
          </div>

          <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 text-[15vw] font-serif font-bold text-white opacity-[0.02] select-none whitespace-nowrap pointer-events-none">
            {prefSlug.toUpperCase()}
          </div>
        </section>

        {/* ==================== 2. Main Content ==================== */}
        <section className="relative py-40 px-6">
          <WaveDivider fill="fill-sumo-dark" isRotated={false} />

          <div className="container mx-auto max-w-6xl relative z-10 -mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* --- Left Column: Info (Sticky) --- */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 flex flex-col gap-8">
                  {/* 介绍卡片 (数据来自 Database) */}
                  <div className="bg-white p-8 rounded-sm shadow-lg border-t-4 border-sumo-gold">
                    <h3 className="text-lg font-bold text-sumo-dark mb-4 pb-4 border-b border-gray-100 flex items-center gap-2">
                      <MapPin size={18} className="text-sumo-gold" />
                      {displayData.introTitle}
                    </h3>
                    <p className="text-sm text-gray-600 leading-loose text-justify font-medium">
                      {displayData.introText}
                    </p>
                  </div>

                  {/* ✨ 2. 修改赞助商 Banner 区域 */}
                  {/* 移除了 bg-gray-100 和 p-4，让 Banner 填满宽度，视觉更高级 */}
                  <div className="bg-white rounded-sm text-center shadow-md overflow-hidden border border-gray-100">
                    <p className="text-[10px] text-gray-400 py-2 tracking-widest bg-gray-50 border-b border-gray-100">
                      OFFICIAL SPONSORS
                    </p>
                    {/* 插入迷你跑马灯 */}
                    <div className="bg-gray-100/50 pt-2 pb-4">
                      <MiniSponsorBanner />
                    </div>
                    {/* 底部招商链接 (可选，增加交互性) */}
                    <div className="py-2 bg-white border-t border-gray-100">
                      <Link
                        href="/contact"
                        className="text-[10px] text-sumo-gold hover:text-sumo-red transition-colors"
                      >
                        スポンサー募集について →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Right Column --- */}
              <div className="lg:col-span-8">
                {/* ✨ 新增区域：当地照片横幅 (只在有图片时显示) */}
                {displayData.bannerImg && (
                  <div className="mb-12 group relative overflow-hidden rounded-sm shadow-md aspect-[3/1]">
                    <img
                      src={displayData.bannerImg}
                      alt={`${displayData.name}の風景`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* 遮罩和文字 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                      <div className="text-white">
                        <p className="text-[10px] font-bold tracking-widest mb-1 flex items-center gap-2 opacity-80">
                          <Camera size={14} />
                          LOCAL SCENE
                        </p>
                        <p className="font-serif font-bold text-lg tracking-wide">
                          {displayData.name}の相撲風景
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1. 俱乐部列表 */}
                <div className="mb-20">
                  <h2 className="text-2xl font-serif font-bold text-sumo-dark mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-sumo-red"></span>
                    クラブ一覧
                    <span className="text-sm font-normal text-gray-400 ml-2">
                      ({filteredClubs.length}件)
                    </span>
                  </h2>

                  {filteredClubs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredClubs.map((club) => (
                        <div
                          key={club.id}
                          className="group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                        >
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={club.img}
                              alt={club.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute top-2 left-2 bg-sumo-dark text-white text-[10px] px-2 py-1 font-bold tracking-widest">
                              {club.area}
                            </span>
                          </div>
                          <div className="p-5 flex flex-col flex-grow">
                            <h3 className="font-bold text-lg text-sumo-dark mb-2 group-hover:text-sumo-red transition-colors">
                              {club.name}
                            </h3>
                            <div className="text-xs text-gray-500 flex items-center gap-2 mb-4">
                              <MapPin size={12} className="text-sumo-gold" />{" "}
                              {club.area}
                            </div>
                            <button className="mt-auto w-full py-2.5 border border-gray-200 text-xs font-bold text-gray-600 tracking-widest group-hover:bg-sumo-dark group-hover:text-white group-hover:border-sumo-dark transition-all flex items-center justify-center gap-2">
                              詳細を見る <ArrowRight size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-12 text-center rounded-sm border border-dashed border-gray-300">
                      <p className="text-gray-400 font-medium">
                        現在、掲載されているクラブはありません。
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. 出身力士一覧 (Table) - 数据来自 Database */}
                <div>
                  <h2 className="text-2xl font-serif font-bold text-sumo-dark mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-sumo-red"></span>
                    {displayData.name}出身力士一覧
                  </h2>
                  {/* --- 力士数据展示区域 --- */}
                  {displayData.rikishiList.length > 0 ? (
                    <div className="bg-transparent md:bg-white md:rounded-sm md:shadow-sm md:border md:border-gray-200 overflow-hidden">
                      {/* =========================================================
        A. 电脑端视图 (Desktop): 传统的高级表格
        hidden md:table -> 手机隐藏，中屏以上显示为表格
    ========================================================= */}
                      <table className="hidden md:table w-full text-sm text-left whitespace-nowrap">
                        <thead className="text-xs text-white uppercase bg-sumo-red">
                          <tr>
                            <th className="px-6 py-4 font-bold tracking-wider">
                              四股名
                            </th>
                            <th className="px-6 py-4 font-bold tracking-wider">
                              部屋
                            </th>
                            <th className="px-6 py-4 font-bold tracking-wider">
                              最高位
                            </th>
                            <th className="px-6 py-4 font-bold tracking-wider">
                              初土俵
                            </th>
                            <th className="px-6 py-4 font-bold tracking-wider">
                              引退
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {displayData.rikishiList.map((rikishi, idx) => (
                            <tr
                              key={idx}
                              className={`hover:bg-gray-50 transition-colors ${rikishi.active ? "bg-red-50/30" : ""}`}
                            >
                              <td className="px-6 py-4 font-bold text-sumo-dark flex items-center gap-2">
                                {rikishi.name}
                                {rikishi.active && (
                                  <span
                                    className="w-2 h-2 rounded-full bg-green-500"
                                    title="現役"
                                  ></span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {rikishi.stable}
                              </td>
                              <td className="px-6 py-4 font-medium text-sumo-dark">
                                {rikishi.rank}
                              </td>
                              <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                {rikishi.start}
                              </td>
                              <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                {rikishi.end || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* =========================================================
        B. 手机端视图 (Mobile): 卡片式列表
        block md:hidden -> 手机显示，中屏以上隐藏
    ========================================================= */}
                      <div className="block md:hidden flex flex-col gap-4">
                        {displayData.rikishiList.map((rikishi, idx) => (
                          <div
                            key={idx}
                            className={`
            relative p-5 rounded-sm border 
            ${
              rikishi.active
                ? "bg-white border-sumo-red/30 shadow-[0_2px_8px_rgba(211,50,62,0.08)]"
                : "bg-white border-gray-200 shadow-sm"
            }
          `}
                          >
                            {/* 1. 顶部：名字与现役状态 */}
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex flex-col">
                                <span className="text-lg font-serif font-bold text-sumo-dark flex items-center gap-2">
                                  {rikishi.name}
                                  {rikishi.active && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">
                                      現役
                                    </span>
                                  )}
                                </span>
                                <span className="text-xs text-gray-500 mt-0.5">
                                  {rikishi.stable}部屋
                                </span>
                              </div>
                              {/* 最高位放在右上角，醒目 */}
                              <div className="text-right">
                                <span className="block text-[10px] text-gray-400 tracking-wider">
                                  最高位
                                </span>
                                <span className="text-sm font-bold text-sumo-red">
                                  {rikishi.rank}
                                </span>
                              </div>
                            </div>

                            {/* 分割线 */}
                            <div className="h-px w-full bg-gray-100 mb-3"></div>

                            {/* 2. 底部：时间数据 */}
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="block text-gray-400 mb-1 text-[10px]">
                                  初土俵
                                </span>
                                <span className="font-mono text-gray-700">
                                  {rikishi.start}
                                </span>
                              </div>
                              <div>
                                <span className="block text-gray-400 mb-1 text-[10px]">
                                  引退
                                </span>
                                <span className="font-mono text-gray-700">
                                  {rikishi.end || "現役中"}
                                </span>
                              </div>
                            </div>

                            {/* 装饰：如果是现役，右下角加个淡水印 */}
                            {rikishi.active && (
                              <div className="absolute -bottom-2 -right-2 text-sumo-red opacity-5">
                                <User size={64} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* 底部版权信息 (共用) */}
                      <div className="hidden md:block bg-gray-50 px-6 py-3 text-right text-[10px] text-gray-400 border-t border-gray-100">
                        出典：相撲レファレンス
                      </div>
                      {/* 手机端的版权信息单独显示 */}
                      <div className="md:hidden mt-4 text-center text-[10px] text-gray-400">
                        出典：相撲レファレンス
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-8 text-center rounded-sm border border-dashed border-gray-300">
                      <p className="text-gray-400 text-sm">
                        力士データは現在登録されていません。
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ScrollToTop />
    </div>
  );
};

export default PrefecturePage;
