import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin, Users, ChevronLeft, Sparkles, CheckCircle2,
    CalendarDays, Target, ExternalLink, Mail, Instagram, Twitter, Globe, Navigation
} from "lucide-react";
import { prisma } from "@/lib/db";
import Ceramic from "@/components/ui/Ceramic";
import Button from "@/components/ui/Button";

// 定义品牌色常量
const BRAND_BLUE = "#2454a4";

// 页面参数定义 (Next.js 15+)
interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ClubDetailPage({ params }: PageProps) {
    // 1. 获取动态路由参数
    const { slug } = await params;

    // 2. 物理隔离官方账号 (防止通过 URL 直接访问 HQ 数据)
    if (slug === "official-hq") return notFound();

    // 3. 从数据库查询俱乐部信息
    const club = await prisma.club.findUnique({ where: { slug: slug } });

    // 如果找不到记录，返回 404 页面
    if (!club) return notFound();

    // --- 数据预处理逻辑 ---

    // 标签生成：组合区域、城市和募集对象
    const displayTags = [
        club.area,
        club.city,
        club.target ? club.target : "全年齢対象",
    ].filter(Boolean);

    // 画廊逻辑：优先显示主图，其次是副图 (subImages)
    // 如果没有任何图片，则显示默认占位符
    const galleryImages = [
        club.mainImage,
        ...(club.subImages || []),
    ].filter((img): img is string => !!img);

    if (galleryImages.length === 0) {
        galleryImages.push("/images/placeholder.jpg");
    }

    // 日程解析逻辑：尝试解析 JSON 字符串，兼容旧数据格式
    let parsedSchedule: { day: string; time: string }[] = [];
    try {
        if (club.schedule) {
            const parsed = JSON.parse(club.schedule);
            if (Array.isArray(parsed)) {
                parsedSchedule = parsed;
            } else {
                // 如果不是数组（可能是旧数据的纯文本），作为单行信息处理
                parsedSchedule = [{ day: "Info", time: club.schedule }];
            }
        }
    } catch (e) {
        // 解析失败时的容错处理
        if (club.schedule) parsedSchedule = [{ day: "Info", time: club.schedule }];
    }

    // --- 辅助函数：用于日程表美化 ---

    // 将日文星期转换为英文缩写 (用于装饰背景)
    const getDayEnglish = (dayStr: string) => {
        const map: Record<string, string> = {
            "月": "MON", "火": "TUE", "水": "WED", "木": "THU", "金": "FRI", "土": "SAT", "日": "SUN",
            "月曜日": "MON", "火曜日": "TUE", "水曜日": "WED", "木曜日": "THU", "金曜日": "FRI", "土曜日": "SAT", "日曜日": "SUN",
            "祝": "HOL", "祝日": "HOLIDAY", "不定期": "VARIES"
        };
        const key = dayStr.charAt(0);
        return map[dayStr] || map[key] || "DAY";
    };

    // 智能拆分时间段 (例如 "18:00-20:00" -> start: "18:00", end: "20:00")
    const formatTimeDisplay = (timeStr: string) => {
        const parts = timeStr.split(/[-〜~]/);
        if (parts.length >= 2) {
            return { start: parts[0].trim(), end: parts[1].trim(), isRange: true };
        }
        return { start: timeStr, end: "", isRange: false };
    };

    return (
        <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col selection:bg-sumo-brand selection:text-white">
            <main className="flex-grow">

                {/* --- Header Section (品牌视觉区) --- */}
                <section className="relative bg-sumo-brand text-white pt-32 pb-48 overflow-hidden shadow-xl">
                    {/* 背景渐变 */}
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${BRAND_BLUE}, #1a3a7a)` }}></div>
                    {/* 背景网格装饰 */}
                    <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
                    {/* 巨大水印 */}
                    <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 text-[15vw] font-black text-white opacity-[0.03] select-none pointer-events-none tracking-tighter mix-blend-overlay">DOJO</div>

                    <div className="container mx-auto max-w-6xl relative z-10 px-6 text-center">
                        {/* 返回按钮 */}
                        <div className="flex justify-center mb-8">
                            <Link href="/clubs" className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all text-white group">
                                <ChevronLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Back to List</span>
                            </Link>
                        </div>

                        {/* 俱乐部名称 */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight mb-6 text-white leading-tight">
                            {club.name}
                        </h1>

                        {/* 顶部简要信息 */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-white/80 font-medium">
                            <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded text-[10px] uppercase tracking-widest border border-white/10">
                                <MapPin size={12} /> {club.area} {club.city && `· ${club.city}`}
                            </span>
                            <span className="hidden md:inline w-px h-4 bg-white/20"></span>
                            <span className="text-[10px] uppercase tracking-[0.2em] opacity-80">ESTABLISHED DOJO</span>
                        </div>
                    </div>
                </section>

                {/* --- Main Content Section (卡片容器) --- */}
                <section className="relative px-4 md:px-6 z-20 -mt-24 pb-32">
                    <div className="container mx-auto max-w-6xl">
                        <Ceramic interactive={false} className="bg-white border-b-[6px] shadow-[0_30px_60px_-15px_rgba(36,84,164,0.15)] overflow-hidden p-0 border-b-sumo-brand">
                            <div className="flex flex-col lg:flex-row min-h-[800px]">

                                {/* --- 左侧：视觉画廊 (Visual Identity) --- */}
                                <div className="lg:w-5/12 bg-[#FAFAFA] border-r border-gray-100 p-8 md:p-12 flex flex-col gap-10">

                                    {/* 主图展示 */}
                                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-white/50 bg-gray-200">
                                        <Image src={galleryImages[0]} alt={club.name} fill className="object-cover hover:scale-105 transition-transform duration-700" priority />
                                    </div>

                                    {/* 副图画廊 (仅当有副图时显示) */}
                                    {galleryImages.length > 1 && (
                                        <div>
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <Sparkles size={12} /> Dojo Scenery
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {/* 切片：跳过第一张主图，显示剩下的副图 */}
                                                {galleryImages.slice(1, 5).map((img, idx) => (
                                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200 group bg-white">
                                                        <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 底部：官方链接 (SNS) */}
                                    <div className="mt-auto pt-8 border-t border-gray-200/50">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Official Links</h3>
                                        <div className="flex gap-4">
                                            {/* Instagram */}
                                            {club.instagram && (
                                                <a href={`https://instagram.com/${club.instagram}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full text-pink-600 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-pink-100">
                                                    <Instagram size={20} />
                                                </a>
                                            )}
                                            {/* Twitter/X */}
                                            {club.twitter && (
                                                <a href={`https://twitter.com/${club.twitter}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full text-black shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-gray-200">
                                                    <Twitter size={20} />
                                                </a>
                                            )}
                                            {/* 官方网站 */}
                                            {club.website && (
                                                <a href={club.website} target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full text-blue-600 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-blue-100">
                                                    <Globe size={20} />
                                                </a>
                                            )}
                                            {/* 邮箱 */}
                                            {club.email && (
                                                <a href={`mailto:${club.email}`} className="p-3 bg-white rounded-full text-emerald-600 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-gray-200">
                                                    <Mail size={20} />
                                                </a>
                                            )}
                                        </div>
                                        {(!club.instagram && !club.twitter && !club.website && !club.email) && (
                                            <p className="text-xs text-gray-400">SNS情報は登録されていません。</p>
                                        )}
                                    </div>
                                </div>

                                {/* --- 右侧：详细情报 (Dojo Intelligence) --- */}
                                <div className="lg:w-7/12 bg-white p-10 md:p-16 lg:p-20">

                                    {/* 介绍文区域 */}
                                    <div className="mb-12">
                                        <h3 className="text-2xl font-serif font-black text-gray-900 mb-6 flex items-center gap-3">
                                            <span className="w-1.5 h-8 rounded-full bg-sumo-brand"></span> 道場紹介
                                        </h3>
                                        <div className="text-gray-600 leading-[2.0] text-justify font-medium text-[15px] whitespace-pre-wrap">
                                            {club.description || "道場の詳細は現在準備中です。"}
                                        </div>
                                        {/* 标签列表 */}
                                        <div className="flex flex-wrap gap-2 mt-8">
                                            {displayTags.map((tag, idx) => (
                                                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-50/50 text-blue-700 text-[10px] font-black tracking-widest border border-blue-100 uppercase">
                                                    <CheckCircle2 size={12} className="opacity-50" /> {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 my-10"></div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 mb-12">

                                        {/* 1. 稽古日程表 (设计感排版) */}
                                        <div className="col-span-1 md:col-span-2">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                <CalendarDays size={14} className="text-sumo-brand" /> Practice Schedule
                                            </h4>

                                            <div className="flex flex-col gap-3">
                                                {parsedSchedule.length > 0 ? (
                                                    parsedSchedule.map((sch, idx) => {
                                                        const { start, end, isRange } = formatTimeDisplay(sch.time);
                                                        const enDay = getDayEnglish(sch.day);

                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="group relative bg-white border border-gray-100 rounded-xl p-5 flex items-center justify-between overflow-hidden shadow-sm hover:shadow-md hover:border-sumo-brand/30 transition-all duration-300"
                                                            >
                                                                {/* 背景水印装饰 (英文星期) */}
                                                                <div className="absolute -left-2 -bottom-4 text-[60px] font-black text-gray-50/80 pointer-events-none select-none italic font-sans tracking-tighter z-0 group-hover:text-blue-50/80 transition-colors">
                                                                    {enDay}
                                                                </div>

                                                                {/* 左侧：日期显示 */}
                                                                <div className="relative z-10 flex flex-col justify-center pl-2">
                                                                    <span className="text-[10px] font-bold text-sumo-brand tracking-[0.2em] uppercase mb-0.5">
                                                                        {enDay}
                                                                    </span>
                                                                    <span className="text-lg font-black text-gray-900 leading-none">
                                                                        {sch.day}
                                                                    </span>
                                                                </div>

                                                                {/* 中间：分割线 (仅在大屏显示) */}
                                                                <div className="hidden sm:block w-px h-8 bg-gray-100 mx-6 rotate-12 group-hover:bg-sumo-brand/20 transition-colors"></div>

                                                                {/* 右侧：时间显示 (强调开始时间) */}
                                                                <div className="relative z-10 flex items-baseline gap-2 text-right ml-auto">
                                                                    {isRange ? (
                                                                        <>
                                                                            <span className="text-3xl md:text-4xl font-black text-gray-900 tabular-nums tracking-tighter leading-none group-hover:text-sumo-brand transition-colors">
                                                                                {start}
                                                                            </span>
                                                                            <div className="flex flex-col items-start text-xs font-bold text-gray-400 mt-1">
                                                                                <span className="mb-0.5">TO</span>
                                                                                <span className="text-sm text-gray-600 tabular-nums">
                                                                                    {end}
                                                                                </span>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <span className="text-xl font-bold text-gray-700">
                                                                            {start}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* 右边缘装饰条 */}
                                                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-sumo-brand opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                                                        <p className="text-xs font-bold text-gray-400">スケジュール情報は未登録です。</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 2. 地址与地图 (名片风格) */}
                                        <div className="col-span-1 md:col-span-2">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <MapPin size={14} className="text-sumo-brand" /> Access
                                            </h4>
                                            <div className="relative group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-xs font-mono font-bold text-sumo-brand mb-2 flex items-center gap-2">
                                                            〒{club.zipCode || "000-0000"}
                                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                            {club.area} {club.city}
                                                        </p>
                                                        {/* 地址文字优化 (Palt 字体特性) */}
                                                        <p className="text-lg font-bold text-gray-900 leading-tight tracking-tight" style={{ fontFeatureSettings: '"palt"' }}>
                                                            {club.address}
                                                        </p>
                                                    </div>
                                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-sumo-brand transition-colors">
                                                        <Navigation size={20} />
                                                    </div>
                                                </div>

                                                {/* Google Maps 跳转按钮 */}
                                                {club.mapUrl && (
                                                    <div className="mt-6 pt-4 border-t border-gray-100">
                                                        <a href={club.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full gap-2 py-2.5 bg-gray-900 text-white rounded-lg text-xs font-bold tracking-wide hover:bg-sumo-brand transition-colors">
                                                            Google Maps で見る <ExternalLink size={12} />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 3. 募集对象信息 */}
                                        <div className="col-span-1 md:col-span-2">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                                                <Target size={14} className="text-sumo-brand" /> Target
                                            </h4>
                                            <div className="bg-sumo-brand/5 p-5 rounded-xl border border-sumo-brand/10 flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-black text-sumo-brand">
                                                        {club.target || "全年齢対象"}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 mt-1 font-bold opacity-80">
                                                        ※ 初心者・見学大歓迎
                                                    </p>
                                                </div>
                                                <Users size={20} className="text-sumo-brand opacity-20" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- 底部行为召唤 (CTA) --- */}
                                    <div className="mt-auto">
                                        <Button href={`/clubs/${club.slug}/recruit`} className="w-full py-6 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all rounded-2xl" style={{ backgroundColor: BRAND_BLUE }}>
                                            <span className="flex items-center gap-3 text-lg font-black uppercase tracking-tighter">
                                                <Users size={20} /> 体験・入会を申し込む
                                            </span>
                                        </Button>
                                        <p className="text-[9px] text-center text-gray-400 mt-4 font-black uppercase tracking-[0.2em]">Feel free to visit us anytime.</p>
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