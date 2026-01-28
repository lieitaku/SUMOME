import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    Users,
    ChevronLeft,
    Sparkles,
    CheckCircle2,
    CalendarDays,
    Target,
    ExternalLink,
    Tag as TagIcon
} from "lucide-react";
import { prisma } from "@/lib/db";
import Ceramic from "@/components/ui/Ceramic";
import Button from "@/components/ui/Button";

/**
 * ==============================================================================
 * 🏛️ ClubDetailPage Component (Next.js 15 Server Component)
 * ------------------------------------------------------------------------------
 * 1. 自动过滤官方账号 (official-hq)
 * 2. 动态生成标签 (解决 Tags 字段缺失报错)
 * 3. 适配 Next.js 15 异步 Params 规范
 * ==============================================================================
 */

const BRAND_BLUE = "#2454a4";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ClubDetailPage({ params }: PageProps) {
    // --- 1. 数据准备 (Data Ingestion) ---
    const { slug } = await params;

    // 物理隔离官方账号：防止通过 URL 直接访问影子实体
    if (slug === "official-hq") return notFound();

    const club = await prisma.club.findUnique({
        where: { slug: slug },
    });

    if (!club) return notFound();

    // --- 2. 逻辑预处理 (Data Sanitization) ---

    // 🏷️ 动态标签生成：解决数据库无 Tags 字段的问题
    const displayTags = [
        club.area,                 // 地区 (例: 大阪府)
        club.target || "全年齢",    // 募集对象 (例: 小学生〜大人)
        "地域密着型"                // 品牌保底标签
    ].filter(Boolean);

    // 🖼️ 画廊逻辑：使用主图作为视觉核心
    const galleryImages = [
        club.mainImage,
        "/images/placeholder.jpg",
    ].filter((img): img is string => !!img);

    // 📅 稽古计划 (未来可从数据库字段映射，目前使用行政级占位)
    const schedule = [
        { day: "火・木", time: "18:00 - 20:00" },
        { day: "土・日", time: "09:00 - 12:00" },
    ];

    return (
        <div
            className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col selection:bg-sumo-brand selection:text-white"
        >
            <main className="flex-grow">
                {/* --- Header Section (品牌视觉区) --- */}
                <section className="relative bg-sumo-brand text-white pt-32 pb-48 overflow-hidden shadow-xl">
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(to bottom, ${BRAND_BLUE}, #1a3a7a)`,
                        }}
                    ></div>

                    {/* 背景网格装饰 */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                            backgroundSize: "40px 40px",
                        }}
                    />

                    {/* 大型水印装饰 */}
                    <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 text-[15vw] font-black text-white opacity-[0.03] select-none pointer-events-none tracking-tighter mix-blend-overlay">
                        DOJO
                    </div>

                    <div className="container mx-auto max-w-6xl relative z-10 px-6 text-center">
                        <div className="flex justify-center mb-8">
                            <Link
                                href="/clubs"
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all text-white group"
                            >
                                <ChevronLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Back to List</span>
                            </Link>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight mb-6 text-white leading-tight">
                            {club.name}
                        </h1>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-white/80 font-medium">
                            <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded text-[10px] uppercase tracking-widest border border-white/10">
                                <MapPin size={12} />
                                {club.area} · {club.city}
                            </span>
                            <span className="hidden md:inline w-px h-4 bg-white/20"></span>
                            <span className="text-[10px] uppercase tracking-[0.2em] opacity-80">
                                ESTABLISHED DOJO
                            </span>
                        </div>
                    </div>
                </section>

                {/* --- Main Content Section (Ceramic 容器) --- */}
                <section className="relative px-4 md:px-6 z-20 -mt-24 pb-32">
                    <div className="container mx-auto max-w-6xl">
                        <Ceramic
                            interactive={false}
                            className="bg-white border-b-[6px] shadow-[0_30px_60px_-15px_rgba(36,84,164,0.15)] overflow-hidden p-0 border-b-sumo-brand"
                        >
                            <div className="flex flex-col lg:flex-row min-h-[800px]">

                                {/* 左侧：视觉画廊 (Visual Identity) */}
                                <div className="lg:w-5/12 bg-[#FAFAFA] border-r border-gray-100 p-8 md:p-12 flex flex-col gap-10">
                                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-white/50 bg-gray-200">
                                        <Image
                                            src={club.mainImage || "/images/placeholder.jpg"}
                                            alt={club.name}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                            priority
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Sparkles size={12} /> Dojo Scenery
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {galleryImages.map((img, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
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

                                    <div className="mt-auto pt-8 hidden lg:block border-t border-gray-200/50">
                                        <h2 className="text-3xl font-serif font-bold text-gray-200 leading-snug select-none italic">
                                            心・技・体
                                            <br />
                                            極める道。
                                        </h2>
                                    </div>
                                </div>

                                {/* 右侧：详细内容 (Dojo Intelligence) */}
                                <div className="lg:w-7/12 bg-white p-10 md:p-16 lg:p-20">
                                    <div className="mb-12">
                                        <h3 className="text-2xl font-serif font-black text-gray-900 mb-6 flex items-center gap-3">
                                            <span className="w-1.5 h-8 rounded-full bg-sumo-brand"></span>
                                            道場紹介
                                        </h3>
                                        <div className="text-gray-600 leading-[2.0] text-justify font-medium text-[15px] whitespace-pre-wrap">
                                            {club.description || "道場の詳細は現在準備中です。"}
                                        </div>

                                        {/* 修复后的标签渲染 */}
                                        <div className="flex flex-wrap gap-2 mt-8">
                                            {displayTags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-50/50 text-blue-700 text-[10px] font-black tracking-widest border border-blue-100 uppercase"
                                                >
                                                    <CheckCircle2 size={12} className="opacity-50" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 my-10"></div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 mb-12">
                                        <div className="col-span-1 md:col-span-2">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <CalendarDays size={14} className="text-sumo-brand" /> Practice Schedule
                                            </h4>
                                            <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 space-y-3">
                                                {schedule.map((sch, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-200/50 pb-3 last:border-0 last:pb-0">
                                                        <span className="font-black text-gray-700 flex items-center gap-3">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-sumo-brand"></span>
                                                            {sch.day}
                                                        </span>
                                                        <span className="font-mono text-gray-500 font-bold bg-white px-3 py-1 rounded-md shadow-sm">
                                                            {sch.time}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <MapPin size={14} className="text-sumo-brand" /> Location
                                            </h4>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 leading-relaxed mb-2">
                                                    {club.address}
                                                </p>
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(club.address)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[10px] font-black text-blue-600 hover:underline uppercase tracking-tighter"
                                                >
                                                    Open in Google Maps <ExternalLink size={10} />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <Target size={14} className="text-sumo-brand" /> Target Group
                                            </h4>
                                            <div className="bg-sumo-brand/5 p-4 rounded-xl border border-sumo-brand/10">
                                                <p className="text-sm font-black text-sumo-brand">
                                                    {club.target || "全年齢対象"}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-1 font-bold">
                                                    ※ 初心者・見学大歓迎
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- Action Area (CTA) --- */}
                                    <div className="mt-auto">
                                        <Button
                                            href={`/clubs/${club.slug}/recruit`}
                                            className="w-full py-6 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all rounded-2xl"
                                            style={{ backgroundColor: BRAND_BLUE }}
                                        >
                                            <span className="flex items-center gap-3 text-lg font-black uppercase tracking-tighter">
                                                <Users size={20} />
                                                体験・入会を申し込む
                                            </span>
                                        </Button>
                                        <p className="text-[9px] text-center text-gray-400 mt-4 font-black uppercase tracking-[0.2em]">
                                            Feel free to visit us anytime.
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
}