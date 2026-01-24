"use client";

import React, { useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    Clock,
    Users,
    ChevronLeft,
    ArrowRight,
    Sparkles,
    Quote,
    CheckCircle2,
    CalendarDays,
    Target,
    ExternalLink,
} from "lucide-react";

import Ceramic from "@/components/ui/Ceramic";
import Button from "@/components/ui/Button";
import { clubsData } from "@/data/clubs";
import { cn } from "@/lib/utils";

// 品牌主色调 (Sumo Blue)
const BRAND_BLUE = "#2454a4";

const ClubDetailPage = () => {
    const params = useParams();
    const id = params.id as string;

    // 1. 获取真实数据
    const club = clubsData.find((c) => c.id === id);

    // 2. 滚动恢复
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!club) return notFound();

    return (
        <div
            className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col selection:text-white"
            style={{ "--selection-bg": BRAND_BLUE } as React.CSSProperties}
        >
            <style jsx global>{`
        ::selection {
          background-color: var(--selection-bg);
        }
      `}</style>

            <main className="flex-grow">
                {/* ==================== 1. Header (纯色/网格背景风格) ==================== */}
                {/* 不再使用照片背景，改用 CSS 渐变和 SVG 纹理，提升加载速度和高级感 */}
                <section className="relative bg-sumo-brand text-white pt-32 pb-48 overflow-hidden shadow-xl">
                    {/* 背景：深邃蓝天渐变 */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(to bottom, ${BRAND_BLUE}, #1a3a7a)`,
                        }}
                    ></div>

                    {/* 纹理：科技感网格 */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                            backgroundSize: "40px 40px",
                        }}
                    />

                    {/* 装饰：超大水印文字 */}
                    <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 text-[15vw] font-black text-white opacity-[0.03] select-none pointer-events-none leading-none mix-blend-overlay tracking-tighter font-sans">
                        CLUB
                    </div>

                    <div className="container mx-auto max-w-6xl relative z-10 px-6 text-center">
                        {/* 顶部胶囊标签 */}
                        <div className="flex justify-center mb-8 reveal-up">
                            <Link
                                href="/clubs"
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-colors text-white group"
                            >
                                <ChevronLeft
                                    size={12}
                                    className="group-hover:-translate-x-0.5 transition-transform"
                                />
                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                                    Back to List
                                </span>
                            </Link>
                        </div>

                        {/* 俱乐部名称 */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight mb-6 text-white drop-shadow-sm reveal-up delay-100 leading-tight">
                            {club.name}
                        </h1>

                        {/* 地区与英文名 */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-white/80 font-medium tracking-wide reveal-up delay-200">
                            <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded text-xs uppercase tracking-widest border border-white/10">
                                <MapPin size={12} />
                                {club.area} · {club.city}
                            </span>
                            <span className="hidden md:inline w-px h-4 bg-white/20"></span>
                            <span className="text-xs uppercase tracking-[0.2em] opacity-80">
                                {club.slug.replace(/-/g, " ")}
                            </span>
                        </div>
                    </div>
                </section>

                {/* ==================== 2. Main Content (陶瓷卡片布局) ==================== */}
                <section className="relative px-4 md:px-6 z-20 -mt-24 pb-32">
                    <div className="container mx-auto max-w-6xl">
                        <Ceramic
                            interactive={false}
                            className="bg-white border-b-[6px] shadow-[0_30px_60px_-15px_rgba(36,84,164,0.15)] overflow-hidden p-0"
                            style={{ borderBottomColor: BRAND_BLUE }}
                        >
                            <div className="flex flex-col lg:flex-row min-h-[800px]">
                                {/* --- A. 左侧: 视觉展示 (Visual Anchor) --- */}
                                {/* 使用淡灰色背景 + 噪点纹理，放置图片和画廊 */}
                                <div className="lg:w-5/12 bg-[#FAFAFA] border-r border-gray-100 p-8 md:p-12 relative overflow-hidden flex flex-col gap-8">
                                    {/* 噪点纹理 */}
                                    <div
                                        className="absolute inset-0 opacity-[0.03]"
                                        style={{
                                            backgroundImage: "url('/images/bg/noise.png')",
                                        }}
                                    ></div>

                                    {/* 主图 */}
                                    <div className="relative z-10 w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md border border-white/50">
                                        <Image
                                            src={club.mainImage}
                                            alt={club.name}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* 画廊 (网格布局) */}
                                    <div className="relative z-10">
                                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Sparkles size={12} /> Gallery
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {club.galleryImages.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative aspect-square rounded-lg overflow-hidden shadow-sm border border-gray-200 group"
                                                >
                                                    <Image
                                                        src={img}
                                                        alt={`Gallery ${idx}`}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 装饰性文字 (底部) */}
                                    <div className="mt-auto pt-8 relative z-10 hidden lg:block">
                                        <div className="w-12 h-1 bg-gray-200 mb-6"></div>
                                        <h2 className="text-3xl font-serif font-bold text-gray-200 leading-snug select-none">
                                            心・技・体
                                            <br />
                                            極める道。
                                        </h2>
                                    </div>
                                </div>

                                {/* --- B. 右侧: 详细内容 (Information) --- */}
                                {/* 纯白背景，用于放置大量文字和信息 */}
                                <div className="lg:w-7/12 bg-white p-10 md:p-16 relative">
                                    {/* 1. 介绍文本 */}
                                    <div className="mb-12">
                                        <h3 className="text-2xl font-serif font-bold text-sumo-dark mb-6 flex items-center gap-3">
                                            <span
                                                className="w-1.5 h-8 rounded-full"
                                                style={{ backgroundColor: BRAND_BLUE }}
                                            ></span>
                                            クラブ紹介
                                        </h3>
                                        <div className="text-gray-600 leading-loose text-justify font-medium text-[15px] whitespace-pre-wrap">
                                            {club.content}
                                        </div>

                                        {/* 标签 */}
                                        <div className="flex flex-wrap gap-2 mt-8">
                                            {club.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100"
                                                >
                                                    <CheckCircle2 size={12} />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 分割线 */}
                                    <div className="border-t border-gray-100 my-10"></div>

                                    {/* 2. 信息网格 (Schedule & Info) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 mb-12">
                                        {/* 时间表 */}
                                        <div className="col-span-1 md:col-span-2">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <CalendarDays size={14} /> Schedule
                                            </h4>
                                            <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 space-y-3">
                                                {club.schedule.map((sch, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex justify-between items-center text-sm border-b border-gray-200/50 pb-2 last:border-0 last:pb-0"
                                                    >
                                                        <span className="font-bold text-gray-700 flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                                            {sch.day}
                                                        </span>
                                                        <span className="font-mono text-gray-500 font-medium">
                                                            {sch.time}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 地址 */}
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <MapPin size={14} /> Address
                                            </h4>
                                            <p className="text-sm font-bold text-gray-800 leading-relaxed mb-2">
                                                {club.address}
                                            </p>
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(club.address)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                                            >
                                                Google Maps <ExternalLink size={10} />
                                            </a>
                                        </div>

                                        {/* 对象年龄 */}
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Target size={14} /> Target Age
                                            </h4>
                                            <p className="text-sm font-bold text-gray-800 leading-relaxed">
                                                {club.targetAge}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                ※ 初心者の方も大歓迎です
                                            </p>
                                        </div>
                                    </div>
                                    {/* 3. 募集 CTA */}
                                    <div className="mt-auto pt-2">
                                        <Button
                                            href={`/clubs/detail/${club.id}/recruit`}
                                            className="w-full py-5 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                            style={{
                                                backgroundColor: BRAND_BLUE,
                                            }}
                                        >
                                            <span className="flex items-center gap-3 text-base">
                                                <Users size={18} />
                                                体験・入会を申し込む
                                            </span>
                                        </Button>
                                        <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">
                                            まずは見学からでもOK！お気軽にお問い合わせください。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Ceramic>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ClubDetailPage;