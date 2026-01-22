"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    Clock,
    Phone,
    Mail,
    Users,
    ChevronLeft,
    Trophy,
    Calendar,
    ExternalLink,
    Star,
    ArrowRight
} from "lucide-react";

import Ceramic from "@/components/ui/Ceramic";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// 模拟获取单个俱乐部数据的函数
// 实际项目中请替换为真实的 API 调用或数据查找
const getClubData = (id: string) => {
    return {
        id: id,
        name: "東京相撲クラブ",
        enName: "TOKYO SUMO CLUB",
        area: "東京都",
        // 假设每个俱乐部都有一个主色调，如果没有则用默认蓝
        themeColor: "#6D28D9",
        heroImage: "https://images.unsplash.com/photo-1599587427679-04473335029e?q=80&w=2000&auto=format&fit=crop", // 
        description:
            "創立50年を迎える伝統ある相撲クラブです。礼儀作法から本格的な技術指導まで、一人ひとりのレベルに合わせて丁寧に指導します。国技館の近くで、相撲の魂を感じながら稽古に励みませんか？",
        address: "東京都墨田区両国 1-2-3",
        schedule: "毎週 土・日 9:00 - 12:00",
        contact: "03-1234-5678",
        email: "contact@tokyosumo.jp",
        features: [
            { label: "初心者歓迎", icon: Star },
            { label: "全国大会出場", icon: Trophy },
            { label: "体験無料", icon: Users },
        ],
        gallery: [
            "https://images.unsplash.com/photo-1626683933478-433436d40085?q=80&w=800&auto=format&fit=crop", // 
            "https://images.unsplash.com/photo-1583995803273-199f36bc8ba5?q=80&w=800&auto=format&fit=crop", // 
            "https://images.unsplash.com/photo-1517923769976-59930cb9977f?q=80&w=800&auto=format&fit=crop", // 
        ],
    };
};

const ClubDetailPage = () => {
    const params = useParams();
    const id = params.id as string;
    const club = getClubData(id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#F4F5F7] min-h-screen font-sans selection:text-white"
            style={{ "--selection-bg": club.themeColor } as React.CSSProperties}>
            <style jsx global>{`
        ::selection {
          background-color: var(--selection-bg);
        }
      `}</style>

            {/* ==================== 1. Cinematic Hero ==================== */}
            <div className="relative h-[60vh] min-h-[500px] bg-gray-900 overflow-hidden">
                <Image
                    src={club.heroImage}
                    alt={club.name}
                    fill
                    className="object-cover opacity-70"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F4F5F7] via-transparent to-black/40"></div>

                {/* Navigation */}
                <div className="absolute top-8 left-6 z-20">
                    <Link
                        href="/clubs"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
                            <ChevronLeft size={16} />
                        </div>
                        <span className="text-xs font-bold tracking-widest uppercase">Back to List</span>
                    </Link>
                </div>

                {/* Title Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 pb-12 z-10">
                    <div className="container mx-auto max-w-6xl">
                        <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                            <div className="animate-fade-in-up">
                                <div
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-white mb-4 border border-white/20 backdrop-blur-md"
                                    style={{ backgroundColor: `${club.themeColor}99` }}
                                >
                                    <MapPin size={12} />
                                    {club.area}
                                </div>
                                <h1 className="text-4xl md:text-6xl font-serif font-black text-gray-900 mb-2 drop-shadow-sm leading-tight">
                                    {club.name}
                                </h1>
                                <p className="text-sm md:text-base font-bold text-gray-500 tracking-[0.2em] uppercase">
                                    {club.enName}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== 2. Content Grid ==================== */}
            <div className="container mx-auto max-w-6xl px-6 pb-24 -mt-8 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* --- Left Column: Story & Gallery --- */}
                    <div className="lg:col-span-8 flex flex-col gap-8">

                        {/* Description Card */}
                        <Ceramic
                            interactive={false}
                            className="p-8 md:p-10 bg-white border border-gray-100 border-b-[6px]"
                            style={{ borderBottomColor: club.themeColor }}
                        >
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 rounded-full" style={{ backgroundColor: club.themeColor }}></span>
                                クラブについて
                            </h2>
                            <p className="text-gray-600 leading-loose text-justify font-medium">
                                {club.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-3 mt-8">
                                {club.features.map((feature, idx) => (
                                    <div key={idx} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600">
                                        <feature.icon size={14} style={{ color: club.themeColor }} />
                                        {feature.label}
                                    </div>
                                ))}
                            </div>
                        </Ceramic>

                        {/* Gallery Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {club.gallery.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "relative rounded-2xl overflow-hidden shadow-md group aspect-square",
                                        idx === 0 ? "col-span-2 aspect-[2/1]" : ""
                                    )}
                                >
                                    <Image
                                        src={img}
                                        alt={`Gallery ${idx}`}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- Right Column: Sticky Info Card --- */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-6">
                        <Ceramic
                            interactive={false}
                            className="p-0 bg-white border border-gray-100 overflow-hidden shadow-xl"
                        >
                            <div className="bg-gray-900 p-6 text-white relative overflow-hidden">
                                <div
                                    className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"
                                ></div>
                                <h3 className="text-lg font-bold tracking-wide relative z-10">Information</h3>
                            </div>

                            <div className="p-6 flex flex-col gap-6">
                                <div className="flex gap-4">
                                    <div className="mt-1 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                                        <MapPin size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Address</p>
                                        <p className="text-sm font-medium text-gray-900">{club.address}</p>
                                        <a href="#" className="text-xs text-blue-500 font-bold mt-1 inline-flex items-center gap-1 hover:underline">
                                            Google Maps <ExternalLink size={10} />
                                        </a>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Schedule</p>
                                        <p className="text-sm font-medium text-gray-900">{club.schedule}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 my-2"></div>

                                <div className="flex gap-4">
                                    <div className="mt-1 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                                        <Phone size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Contact</p>
                                        <p className="text-sm font-medium text-gray-900">{club.contact}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Call to Action Button */}
                            <div className="p-6 bg-gray-50 border-t border-gray-100">
                                <Button
                                    href={`/clubs/detail/${club.id}/recruit`} // ✨ 链接到募集页面
                                    className="w-full py-4 text-white shadow-lg group"
                                    style={{ backgroundColor: club.themeColor }}
                                >
                                    <span className="flex items-center gap-2">
                                        <Users size={16} />
                                        体験・入会を申し込む
                                    </span>
                                    <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                                </Button>
                                <p className="text-[10px] text-gray-400 text-center mt-3">
                                    ※ 見学は無料です。お気軽にお越しください。
                                </p>
                            </div>
                        </Ceramic>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ClubDetailPage;