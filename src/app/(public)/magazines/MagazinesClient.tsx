"use client";

import React, { useState, useMemo } from "react";
import Link from "@/components/ui/TransitionLink";
import Image from "next/image";
import { ArrowRight, BookOpen, Search, X, Filter, ChevronDown, MapPin } from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Magazine } from "@prisma/client";

// ==============================================================================
// 1. 地区数据结构 (与 /clubs 页面保持一致)
// ==============================================================================

type RegionKey =
    | "hokkaido_tohoku"
    | "kanto"
    | "chubu"
    | "kansai"
    | "chugoku"
    | "shikoku"
    | "kyushu_okinawa";

const REGIONS: { id: RegionKey; label: string; prefectures: string[] }[] = [
    {
        id: "hokkaido_tohoku",
        label: "北海道・東北",
        prefectures: ["北海道", "青森", "秋田", "岩手", "山形", "宮城", "福島"],
    },
    {
        id: "kanto",
        label: "関東",
        prefectures: ["東京", "神奈川", "千葉", "埼玉", "茨城", "栃木", "群馬"],
    },
    {
        id: "chubu",
        label: "中部",
        prefectures: ["愛知", "静岡", "岐阜", "三重", "山梨", "長野", "新潟", "富山", "石川", "福井"],
    },
    {
        id: "kansai",
        label: "関西",
        prefectures: ["大阪", "兵庫", "京都", "滋賀", "奈良", "和歌山"],
    },
    {
        id: "chugoku",
        label: "中国",
        prefectures: ["鳥取", "島根", "岡山", "広島", "山口"],
    },
    {
        id: "shikoku",
        label: "四国",
        prefectures: ["徳島", "香川", "愛媛", "高知"],
    },
    {
        id: "kyushu_okinawa",
        label: "九州・沖縄",
        prefectures: ["福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島", "沖縄"],
    },
];

// ==============================================================================
// 2. 组件定义
// ==============================================================================

interface MagazinesClientProps {
    initialMagazines: Magazine[];
    regions: string[]; // 保留这个 prop 以备后用
}

export default function MagazinesClient({ initialMagazines }: MagazinesClientProps) {
    const [activeRegion, setActiveRegion] = useState<RegionKey | "all">("all");
    const [activePref, setActivePref] = useState<string | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterExpanded, setIsFilterExpanded] = useState(true);

    const isFilterActive = activeRegion !== "all" || searchQuery.length > 0;

    // 根据当前选中的大区，动态计算需要显示的县列表
    const currentPrefectures = useMemo(() => {
        if (activeRegion === "all") return [];
        return REGIONS.find((r) => r.id === activeRegion)?.prefectures || [];
    }, [activeRegion]);

    // 核心筛选逻辑
    const filteredMagazines = useMemo(() => {
        return initialMagazines.filter((mag) => {
            // 1. 文本搜索
            const query = searchQuery.toLowerCase();
            const matchSearch =
                searchQuery === "" ||
                mag.title.toLowerCase().includes(query) ||
                (mag.description?.toLowerCase().includes(query) ?? false);

            // 2. 地区筛选
            let matchLocation = true;
            if (activeRegion !== "all") {
                if (activePref !== "all") {
                    // 选了具体县：匹配 region 字段是否以该县名开头
                    matchLocation = mag.region.startsWith(activePref);
                } else {
                    // 只选了大区：匹配该大区下的任意县
                    const regionPrefs = REGIONS.find((r) => r.id === activeRegion)?.prefectures || [];
                    matchLocation = regionPrefs.some((pref) => mag.region.startsWith(pref));
                }
            }

            return matchSearch && matchLocation;
        });
    }, [activeRegion, activePref, searchQuery, initialMagazines]);

    return (
        <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
            <main className="flex-grow">
                {/* ==================== 1. Hero Section (100% 复刻) ==================== */}
                <section className="relative pt-40 pb-48 overflow-hidden bg-sumo-brand text-white shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-sumo-brand to-[#2454a4]"></div>
                    <div
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                            backgroundSize: "40px 40px",
                        }}
                    />
                    <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 text-[20vw] font-black text-white opacity-[0.04] select-none pointer-events-none leading-none z-0 mix-blend-overlay tracking-tighter font-sans">
                        LIBRARY
                    </div>

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
                            <BookOpen size={12} className="text-white" />
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">
                                Official Publications
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight mb-6 text-white drop-shadow-sm">
                            冊子一覧
                        </h1>
                        <p className="text-white/80 font-medium tracking-wide max-w-xl mx-auto leading-relaxed">
                            SUMOMEが発行する公式情報誌のバックナンバー。
                            <br className="hidden md:inline" />
                            相撲の魅力を、美しいビジュアルと言葉で。
                        </p>
                    </div>
                </section>

                {/* ==================== 2. 搜索与筛选区域 (复用 /clubs 设计) ==================== */}
                <section className="relative px-4 md:px-6 z-30 -mt-16 mb-12">
                    <div className="container mx-auto max-w-6xl">
                        {/* 搜索框 - 与 /clubs 页面一致的设计 */}
                        <div className="relative group max-w-2xl mx-auto mb-8">
                            <div
                                className={cn(
                                    "relative flex items-center w-full h-16 md:h-20 rounded-2xl overflow-hidden",
                                    "bg-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                                    "border-b-4 border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)]",
                                    "group-focus-within:border-b-sumo-brand group-focus-within:shadow-[0_20px_40px_rgba(36,84,164,0.15)] group-focus-within:-translate-y-1"
                                )}
                            >
                                <div className="pl-6 md:pl-8 text-gray-400 group-focus-within:text-sumo-brand transition-colors">
                                    <Search size={24} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="タイトル、キーワードで検索..."
                                    className="w-full h-full px-4 md:px-6 bg-transparent text-lg md:text-xl font-bold text-gray-800 placeholder-gray-300 focus:outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="mr-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 筛选仪表盘 - 与 /clubs 页面完全一致的两级折叠面板设计 */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* 筛选器头部 */}
                            <div
                                className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                            >
                                <div className="flex items-center gap-3">
                                    <Filter size={16} className="text-sumo-brand" />
                                    <span className="text-sm font-bold text-gray-700 tracking-wide">
                                        エリアフィルター
                                    </span>
                                    {activeRegion !== "all" && (
                                        <span className="ml-2 px-2 py-0.5 bg-sumo-brand/10 text-sumo-brand text-[10px] font-bold rounded-full">
                                            Active
                                        </span>
                                    )}
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={cn(
                                        "text-gray-400 transition-transform duration-300",
                                        isFilterExpanded ? "rotate-180" : ""
                                    )}
                                />
                            </div>

                            {/* 筛选器内容区 */}
                            <div
                                className={cn(
                                    "transition-all duration-500 ease-in-out overflow-hidden",
                                    isFilterExpanded
                                        ? "max-h-[600px] opacity-100"
                                        : "max-h-0 opacity-0"
                                )}
                            >
                                <div className="p-6 md:p-10">
                                    {/* 第一级：大区选择 */}
                                    <div className={cn(
                                        "flex flex-wrap gap-3 md:gap-4",
                                        activeRegion !== "all" ? "mb-10" : "mb-0"
                                    )}>
                                        <Button
                                            variant="ceramic"
                                            isActive={activeRegion === "all"}
                                            onClick={() => {
                                                setActiveRegion("all");
                                                setActivePref("all");
                                            }}
                                        >
                                            全国
                                        </Button>

                                        {REGIONS.map((region) => (
                                            <Button
                                                key={region.id}
                                                variant="ceramic"
                                                isActive={activeRegion === region.id}
                                                onClick={() => {
                                                    setActiveRegion(region.id);
                                                    setActivePref("all");
                                                }}
                                            >
                                                {region.label}
                                            </Button>
                                        ))}
                                    </div>

                                    {/* 第二级：县选择 - 仅在选中大区时显示 */}
                                    {activeRegion !== "all" && (
                                        <div className="relative pt-8 border-t border-gray-100">
                                            <div className="absolute -top-3 left-6 px-3 bg-white text-[10px] font-bold text-gray-400 tracking-widest uppercase border border-gray-100 rounded-full">
                                                Select Prefecture
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    variant="ceramic"
                                                    isActive={activePref === "all"}
                                                    onClick={() => setActivePref("all")}
                                                    className="px-4 py-2 text-xs rounded-lg border-b-[3px]"
                                                >
                                                    全て
                                                </Button>

                                                {currentPrefectures.map((pref) => (
                                                    <Button
                                                        key={pref}
                                                        variant="ceramic"
                                                        isActive={activePref === pref}
                                                        onClick={() => setActivePref(pref)}
                                                        className="px-4 py-2 text-xs rounded-lg border-b-[3px]"
                                                    >
                                                        {pref}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 结果统计与标签 - 与 /clubs 页面一致 */}
                        <div className="flex items-end justify-between mt-8 mb-4 pb-4 border-b border-gray-200">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-serif font-black text-sumo-brand">
                                    {filteredMagazines.length}
                                </span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                    Issues Found
                                </span>
                            </div>

                            {/* 激活状态展示 */}
                            <div className="hidden md:flex gap-2">
                                {searchQuery && (
                                    <span className="pl-3 pr-2 py-1 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-full flex items-center gap-1 shadow-sm">
                                        {searchQuery}
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery("")}
                                            className="hover:text-sumo-red"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                                {activeRegion !== "all" && (
                                    <span className="pl-3 pr-2 py-1 bg-sumo-brand text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-sm shadow-sumo-brand/20">
                                        <MapPin size={10} />
                                        {REGIONS.find((r) => r.id === activeRegion)?.label}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActiveRegion("all");
                                                setActivePref("all");
                                            }}
                                            className="hover:text-white/70 ml-1"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ==================== 3. Magazine Grid (100% 复刻) ==================== */}
                <section className="relative pb-32 px-6 z-20">
                    <div className="container mx-auto max-w-6xl">
                        {filteredMagazines.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                                {filteredMagazines.map((mag) => (
                                    <div key={mag.id} className="group block relative flex flex-col">
                                        <Ceramic
                                            as={Link}
                                            href={`/magazines/${mag.slug}`} // ✨ 链接改用数据库的 slug
                                            interactive={true}
                                            className={cn(
                                                "relative mb-8 bg-white",
                                                "border-b-sumo-brand",
                                                "md:border-b-gray-200 md:hover:border-b-sumo-brand",
                                            )}
                                        >
                                            <div className="p-3">
                                                <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-inner bg-gray-100">
                                                    {mag.coverImage && (
                                                        <Image
                                                            src={mag.coverImage}
                                                            alt={mag.title}
                                                            fill
                                                            className="object-cover"
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        />
                                                    )}
                                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                                                </div>
                                            </div>
                                        </Ceramic>
                                        <div className="text-center px-2 flex-grow flex flex-col items-center">
                                            <div className="text-xs font-mono text-gray-400 mb-2">
                                                {/* ✨ 格式化数据库日期 */}
                                                {new Date(mag.issueDate).toLocaleDateString('ja-JP').replace(/\//g, '.')}
                                            </div>
                                            <Link href={`/magazines/${mag.slug}`} className="block">
                                                <h3 className="text-2xl font-serif font-black text-gray-900 mb-2 leading-tight group-hover:text-sumo-brand transition-colors">
                                                    {mag.title}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed max-w-xs">
                                                {mag.description}
                                            </p>
                                            <div className="mt-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                                <span className="text-[10px] font-bold tracking-[0.2em] text-sumo-brand flex items-center gap-1 uppercase">
                                                    View Details <ArrowRight size={10} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <Search size={24} />
                                </div>
                                <h3 className="text-lg font-serif font-bold text-gray-700 mb-2">No Magazines Found</h3>
                                <button
                                    onClick={() => {
                                        setActiveRegion("All");
                                        setSearchQuery("");
                                    }}
                                    className="mt-6 text-sm font-bold text-sumo-brand border-b border-sumo-brand/30 hover:border-sumo-brand pb-0.5 transition-colors"
                                >
                                    フィルターをリセット
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}