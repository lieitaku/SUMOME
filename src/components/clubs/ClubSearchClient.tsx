"use client";

import React, { useState, useMemo } from "react";
import {
    Search,
    X,
    Filter,
    ChevronDown,
    SlidersHorizontal,
    MapPin,
} from "lucide-react";
import { type Club } from "@prisma/client";
import ClubCard from "@/components/clubs/ClubCard";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

// ==============================================================================
// 1. 类型定义与常量配置
// ==============================================================================

/** 地区键值类型定义 */
type RegionKey =
    | "hokkaido_tohoku"
    | "kanto"
    | "chubu"
    | "kansai"
    | "chugoku"
    | "shikoku"
    | "kyushu_okinawa";

/**
 * 地区与县的映射数据
 * 用于前端筛选器的 Tab 渲染
 */
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
        prefectures: [
            "愛知",
            "静岡",
            "岐阜",
            "三重",
            "山梨",
            "長野",
            "新潟",
            "富山",
            "石川",
            "福井",
        ],
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
        prefectures: [
            "福岡",
            "佐賀",
            "長崎",
            "熊本",
            "大分",
            "宮崎",
            "鹿児島",
            "沖縄",
        ],
    },
];

// ==============================================================================
// 2. 组件定义
// ==============================================================================

interface ClubSearchClientProps {
    /** 从服务端传入的初始俱乐部列表数据 */
    initialClubs: Club[];
}

const ClubSearchClient = ({ initialClubs }: ClubSearchClientProps) => {
    // --- 状态管理 (State Management) ---
    const [activeRegion, setActiveRegion] = useState<RegionKey | "all">("all"); // 当前选中的大区
    const [activePref, setActivePref] = useState<string | "all">("all");        // 当前选中的县
    const [searchQuery, setSearchQuery] = useState("");                         // 文本搜索关键词
    const [isFilterExpanded, setIsFilterExpanded] = useState(true);             // 筛选面板展开状态

    // --- 派生状态 (Derived State) ---

    /**
     * 根据当前选中的大区，动态计算需要显示的县列表
     * 使用 useMemo 避免不必要的重计算
     */
    const currentPrefectures = useMemo(() => {
        if (activeRegion === "all") return [];
        return REGIONS.find((r) => r.id === activeRegion)?.prefectures || [];
    }, [activeRegion]);

    /**
     * 核心筛选逻辑 (Core Filtering Logic)
     * 包含：文本模糊搜索 + 地区精确/前缀匹配
     */
    const filteredClubs = useMemo(() => {
        return initialClubs.filter((club) => {
            // 1. 文本搜索逻辑 (不区分大小写)
            // 匹配范围：俱乐部名称 或 地区字段
            const matchQuery =
                searchQuery === "" ||
                club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                club.area.includes(searchQuery);

            // 2. 地区筛选逻辑
            let matchLocation = true;
            if (activeRegion !== "all") {
                if (activePref !== "all") {
                    // [重要优化] 使用 startsWith 而非 includes
                    // 原因：避免 "東京都" 被错误匹配到 "京都" 的搜索条件中
                    // 数据库存的是 "東京都"，筛选条件是 "京都"，startsWith 返回 false (正确)
                    matchLocation = club.area.startsWith(activePref);
                } else {
                    // 如果只选了大区没选县，匹配该大区下的任意一个县
                    const regionPrefs =
                        REGIONS.find((r) => r.id === activeRegion)?.prefectures || [];
                    matchLocation = regionPrefs.some((pref) => club.area.startsWith(pref));
                }
            }

            // 两个条件必须同时满足
            return matchQuery && matchLocation;
        });
    }, [searchQuery, activeRegion, activePref, initialClubs]);

    // 重置所有筛选条件
    const handleReset = () => {
        setActiveRegion("all");
        setActivePref("all");
        setSearchQuery("");
    };

    return (
        <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
            {/* 全局样式：列表卡片的入场动画 
        注意：在生产环境中建议移动到 global.css 或 module.css 中
      */}
            <style jsx global>{`
        @keyframes fadeInUpPhysical {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          60% {
            opacity: 1;
            transform: translateY(-2px) scale(1.005);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .card-enter-active {
          animation: fadeInUpPhysical 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            forwards;
        }
      `}</style>

            <main className="flex-grow pt-32 pb-20">
                {/* 背景网格装饰 (Visual Decoration) */}
                <div
                    className="absolute inset-0 pointer-events-none z-0 fixed"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(36, 84, 164, 0.03) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(36, 84, 164, 0.03) 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                        height: "100vh",
                    }}
                />

                <div className="container mx-auto px-6 relative z-10">

                    {/* ==================== 区域 1: 搜索控制中心 ==================== */}
                    <div className="max-w-5xl mx-auto mb-16">
                        {/* 顶部标签 */}
                        <div className="flex justify-center mb-8 reveal-up">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border border-gray-100">
                                <SlidersHorizontal size={12} className="text-sumo-brand" />
                                <span className="text-[10px] font-bold tracking-widest text-sumo-brand uppercase">
                                    Club Finder
                                </span>
                            </div>
                        </div>

                        <h1 className="text-center text-4xl md:text-5xl font-serif font-black text-gray-900 mb-10 tracking-tight reveal-up delay-100">
                            相撲クラブを検索
                        </h1>

                        {/* 搜索框组件 */}
                        <div className="relative group max-w-2xl mx-auto reveal-up delay-200">
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
                                    placeholder="クラブ名、地域名で検索..."
                                    className="w-full h-full px-4 md:px-6 bg-transparent text-lg md:text-xl font-bold text-gray-800 placeholder-gray-300 focus:outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {/* 清除按钮：仅在有输入时显示 */}
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="mr-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ==================== 区域 2: 筛选仪表盘 (折叠面板) ==================== */}
                    <div className="max-w-6xl mx-auto mb-16 reveal-up delay-300">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* 筛选器头部 (点击切换折叠) */}
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

                            {/* 筛选器内容区 (动画容器) */}
                            <div
                                className={cn(
                                    "transition-all duration-500 ease-in-out overflow-hidden",
                                    isFilterExpanded
                                        ? "max-h-[600px] opacity-100"
                                        : "max-h-0 opacity-0"
                                )}
                            >
                                <div className="p-6 md:p-10">
                                    {/* 第一级：大区选择 (Region Tabs) */}
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

                                    {/* 第二级：县选择 (Prefecture List) - 仅在选中大区时显示 */}
                                    {activeRegion !== "all" && (
                                        <div className="relative pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
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
                    </div>

                    {/* ==================== 区域 3: 搜索结果展示 ==================== */}
                    <div className="max-w-6xl mx-auto">
                        {/* 结果统计与标签 */}
                        <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-200">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-serif font-black text-sumo-brand">
                                    {filteredClubs.length}
                                </span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                    Results Found
                                </span>
                            </div>

                            {/* 激活状态展示 (Breadcrumbs style) */}
                            <div className="hidden md:flex gap-2">
                                {searchQuery && (
                                    <span className="pl-3 pr-2 py-1 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-full flex items-center gap-1 shadow-sm">
                                        {searchQuery}
                                        <button
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

                        {/* 结果列表 (Grid Layout) */}
                        {filteredClubs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredClubs.map((club, index) => (
                                    <div
                                        key={club.id}
                                        className="opacity-0 card-enter-active"
                                        // 交错动画延迟
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <ClubCard club={club} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* 空状态展示 (Empty State) */
                            <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <Search size={40} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                                    No Clubs Found
                                </h3>
                                <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
                                    条件に一致するクラブが見つかりませんでした。
                                </p>
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-3 bg-sumo-dark text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors shadow-lg hover:-translate-y-1"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClubSearchClient;