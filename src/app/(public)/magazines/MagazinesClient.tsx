"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "@/components/ui/TransitionLink";
import Image from "next/image";
import { ArrowRight, BookOpen, Search, X, Filter, ChevronDown, MapPin, LayoutGrid, LayoutList } from "lucide-react";
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
// 1.5 都道府県の北→南 順序マップ（地域順ソートに使用）
// ==============================================================================

const PREFECTURE_ORDER: Record<string, number> = {
    "北海道": 1,
    "青森": 2, "岩手": 3, "秋田": 4, "宮城": 5, "山形": 6, "福島": 7,
    "茨城": 8, "栃木": 9, "群馬": 10, "埼玉": 11, "千葉": 12, "東京": 13, "神奈川": 14,
    "新潟": 15, "富山": 16, "石川": 17, "福井": 18, "山梨": 19, "長野": 20, "岐阜": 21, "静岡": 22, "愛知": 23,
    "三重": 24, "滋賀": 25, "京都": 26, "大阪": 27, "兵庫": 28, "奈良": 29, "和歌山": 30,
    "鳥取": 31, "島根": 32, "岡山": 33, "広島": 34, "山口": 35,
    "徳島": 36, "香川": 37, "愛媛": 38, "高知": 39,
    "福岡": 40, "佐賀": 41, "長崎": 42, "熊本": 43, "大分": 44, "宮崎": 45, "鹿児島": 46, "沖縄": 47,
};

function getPrefectureOrder(region: string): number {
    for (const [pref, order] of Object.entries(PREFECTURE_ORDER)) {
        if (region.startsWith(pref)) return order;
    }
    return 999;
}

// ==============================================================================
// 2. 组件定义
// ==============================================================================

interface MagazinesClientProps {
    initialMagazines?: Magazine[] | null;
    regions?: string[];
}

export default function MagazinesClient({ initialMagazines: initialMagazinesProp, regions: regionsProp }: MagazinesClientProps = {}) {
    const [magazinesFromApi, setMagazinesFromApi] = useState<Magazine[] | null>(null);
    const [magazinesLoading, setMagazinesLoading] = useState(typeof initialMagazinesProp === "undefined");
    const [magazinesError, setMagazinesError] = useState<string | null>(null);
    const initialMagazines = initialMagazinesProp ?? magazinesFromApi ?? [];

    const regions = useMemo(() => {
        if (regionsProp && regionsProp.length > 0) return regionsProp;
        return Array.from(new Set(initialMagazines.map((m) => m.region)));
    }, [regionsProp, initialMagazines]);

    useEffect(() => {
        if (typeof initialMagazinesProp !== "undefined") return;
        setMagazinesLoading(true);
        setMagazinesError(null);
        fetch("/api/magazines")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load");
                return res.json();
            })
            .then((data: Magazine[]) => setMagazinesFromApi(data))
            .catch(() => setMagazinesError("読み込みに失敗しました。"))
            .finally(() => setMagazinesLoading(false));
    }, [initialMagazinesProp]);

    const [activeRegion, setActiveRegion] = useState<RegionKey | "all">("all");
    const [activePref, setActivePref] = useState<string | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterExpanded, setIsFilterExpanded] = useState(true);
    const [sortOrder, setSortOrder] = useState<"region" | "newest">("region");
    const [mobileLayout, setMobileLayout] = useState<"single" | "double">("double");

    const isFilterActive = activeRegion !== "all" || searchQuery.length > 0 || sortOrder !== "region";

    // 根据当前选中的大区，动态计算需要显示的县列表
    const currentPrefectures = useMemo(() => {
        if (activeRegion === "all") return [];
        return REGIONS.find((r) => r.id === activeRegion)?.prefectures || [];
    }, [activeRegion]);

    // 核心筛选逻辑
    const filteredMagazines = useMemo(() => {
        const filtered = initialMagazines.filter((mag) => {
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

        return filtered.sort((a, b) => {
            if (sortOrder === "region") {
                const orderDiff = getPrefectureOrder(a.region) - getPrefectureOrder(b.region);
                if (orderDiff !== 0) return orderDiff;
                return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
            }
            return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
        });
    }, [activeRegion, activePref, searchQuery, initialMagazines, sortOrder]);

    const resultsSectionRef = useRef<HTMLDivElement>(null);
    const handleSearchClick = () => {
        resultsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
            <main className="grow">
                {/* ==================== 1. Hero Section (100% 复刻) ==================== */}
                <section className="relative pt-40 pb-20 md:pb-48 overflow-hidden bg-sumo-brand text-white shadow-xl">
                    <div className="absolute inset-0 bg-linear-to-b from-sumo-brand to-[#2454a4]"></div>
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
                <section className="relative px-4 md:px-6 z-30 -mt-10 md:-mt-16 mb-12">
                    <div className="container mx-auto max-w-6xl">
                        {/* 搜索框 - 与 /clubs 页面一致的设计（含検索按钮） */}
                        <div className="relative group max-w-2xl mx-auto mb-8">
                            <div
                                className={cn(
                                    "relative flex items-center w-full h-16 md:h-20 rounded-2xl overflow-hidden",
                                    "bg-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                                    "border-b-4 border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)]",
                                    "group-focus-within:border-b-sumo-brand group-focus-within:shadow-[0_20px_40px_rgba(36,84,164,0.15)] group-focus-within:-translate-y-1"
                                )}
                            >
                                <div className="pl-6 md:pl-8 text-gray-400 group-focus-within:text-sumo-brand transition-colors shrink-0">
                                    <Search size={24} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="タイトル、キーワードで検索..."
                                    className="flex-1 min-w-0 h-full px-4 md:px-6 bg-transparent text-sm md:text-lg font-bold text-gray-800 placeholder-gray-300 focus:outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors shrink-0"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleSearchClick}
                                    className="mr-4 ml-1 px-5 py-2.5 rounded-xl bg-sumo-brand text-white text-sm font-bold tracking-wide hover:bg-sumo-brand/90 active:scale-[0.98] transition-all shadow-sm shrink-0"
                                >
                                    検索
                                </button>
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
                                                都道府県を選択
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

                        {/* 结果统计 + 新着順 / 古い順 切り替え + 激活标签 */}
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-8 mb-4 pb-4 border-b border-gray-200">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-serif font-black text-sumo-brand">
                                    {filteredMagazines.length}
                                </span>
                                <span className="text-xs font-bold text-gray-400 tracking-widest mb-1">
                                    件の冊子が見つかりました
                                </span>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                                {/* 排序：PC + SP 共通 UI */}
                                <div className="inline-flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                                        並び替え
                                    </span>
                                    <div className="inline-flex rounded-full bg-gray-100 p-1">
                                        <button
                                            type="button"
                                            onClick={() => setSortOrder("region")}
                                            className={cn(
                                                "px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-colors",
                                                sortOrder === "region"
                                                    ? "bg-sumo-brand text-white"
                                                    : "text-gray-500"
                                            )}
                                        >
                                            地域順
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSortOrder("newest")}
                                            className={cn(
                                                "px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-colors",
                                                sortOrder === "newest"
                                                    ? "bg-sumo-brand text-white"
                                                    : "text-gray-500"
                                            )}
                                        >
                                            新着順
                                        </button>
                                    </div>
                                </div>

                                {/* 手机端布局切换（单列 / 双列） */}
                                <div className="md:hidden inline-flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                                        表示
                                    </span>
                                    <div className="inline-flex items-center rounded-full bg-gray-100 p-1">
                                        <button
                                            type="button"
                                            onClick={() => setMobileLayout("double")}
                                            className={cn(
                                                "p-2 rounded-full transition-colors",
                                                mobileLayout === "double"
                                                    ? "bg-sumo-brand text-white"
                                                    : "text-gray-500"
                                            )}
                                            aria-label="双列表示"
                                        >
                                            <LayoutGrid size={18} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMobileLayout("single")}
                                            className={cn(
                                                "p-2 rounded-full transition-colors",
                                                mobileLayout === "single"
                                                    ? "bg-sumo-brand text-white"
                                                    : "text-gray-500"
                                            )}
                                            aria-label="単列表示"
                                        >
                                            <LayoutList size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* 激活状态展示（移动端也显示） */}
                                <div className="flex flex-wrap gap-2">
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
                    </div>
                </section>

                {/* ==================== 3. Magazine Grid ==================== */}
                <section ref={resultsSectionRef} className="relative pb-32 px-6 z-20">
                    <div className="container mx-auto max-w-6xl">
                        {magazinesError ? (
                            <div className="py-24 text-center text-gray-500 text-sm">{magazinesError}</div>
                        ) : magazinesLoading && initialMagazines.length === 0 ? (
                            <div className="flex justify-center py-24">
                                <span className="inline-block w-10 h-10 border-2 border-sumo-brand/30 border-t-sumo-brand rounded-full animate-spin" />
                            </div>
                        ) : filteredMagazines.length > 0 ? (
                            <div
                                className={cn(
                                    "grid",
                                    mobileLayout === "double"
                                        ? "grid-cols-2 gap-x-4 gap-y-8"
                                        : "grid-cols-1 gap-y-10",
                                    "md:grid-cols-2 md:gap-x-12 md:gap-y-20 lg:grid-cols-3"
                                )}
                            >
                                {filteredMagazines.map((mag) => (
                                    <div
                                        key={mag.id}
                                        className={cn(
                                            "group relative flex flex-col h-full",
                                            mobileLayout === "double" && "md:max-w-none"
                                        )}
                                    >
                                        <Ceramic
                                            as={Link}
                                            href={`/magazines/${mag.slug}`} // ✨ 链接改用数据库的 slug
                                            interactive={true}
                                            className={cn(
                                                "relative bg-white flex flex-col h-full",
                                                "border-b-sumo-brand",
                                                "md:border-b-gray-200 md:hover:border-b-sumo-brand",
                                            )}
                                        >
                                            <div className={cn("p-3", mobileLayout === "double" && "p-2")}>
                                                <div className="relative aspect-3/4 overflow-hidden rounded-lg shadow-inner bg-gray-100">
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
                                            <div className="flex-1 px-3 pb-2 md:pb-4 pt-2 text-center flex flex-col items-center">
                                                <div className="text-xs font-mono text-gray-400 mb-2">
                                                    {/* ✨ 格式化数据库日期 */}
                                                    {new Date(mag.issueDate).toLocaleDateString("ja-JP").replace(/\//g, ".")}
                                                </div>
                                                <h3
                                                    className={cn(
                                                        "font-serif font-black text-gray-900 mb-1 leading-tight group-hover:text-sumo-brand transition-colors",
                                                        // 手机端整体减小字号，根据单列/双列微调
                                                        "text-sm md:text-xl",
                                                        mobileLayout === "single" && "text-base md:text-2xl"
                                                    )}
                                                >
                                                    {mag.title}
                                                </h3>
                                                {mobileLayout === "single" && (
                                                    <p className="text-xs md:text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed max-w-xs">
                                                        {mag.description}
                                                    </p>
                                                )}
                                                <div className="mt-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden md:block">
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.2em] text-sumo-brand">
                                                        詳細を見る <ArrowRight size={10} />
                                                    </span>
                                                </div>
                                            </div>
                                        </Ceramic>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <Search size={24} />
                                </div>
                                <h3 className="text-lg font-serif font-bold text-gray-700 mb-2">
                                    該当する冊子は見つかりませんでした
                                </h3>
                                <button
                                    onClick={() => {
                                        setActiveRegion("all");
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