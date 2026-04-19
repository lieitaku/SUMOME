"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "@/components/ui/TransitionLink";
import Image from "next/image";
import { ArrowRight, Search, X, Filter, ChevronDown, MapPin, LayoutGrid, LayoutList } from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Magazine } from "@prisma/client";
import { useLocale, useTranslations } from "next-intl";
import { magazineDisplayDescription, magazineDisplayTitle } from "@/lib/i18n-db";
import { allTranslationValues } from "@/lib/document-translations";
import { regionDisplayForLocale } from "@/lib/prefecture-en";

type RegionKey =
    | "hokkaido_tohoku"
    | "kanto"
    | "chubu"
    | "kansai"
    | "chugoku"
    | "shikoku"
    | "kyushu_okinawa";

const REGION_BLOCKS: { id: RegionKey; prefectures: string[] }[] = [
    {
        id: "hokkaido_tohoku",
        prefectures: ["北海道", "青森", "秋田", "岩手", "山形", "宮城", "福島"],
    },
    {
        id: "kanto",
        prefectures: ["東京", "神奈川", "千葉", "埼玉", "茨城", "栃木", "群馬"],
    },
    {
        id: "chubu",
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
        prefectures: ["大阪", "兵庫", "京都", "滋賀", "奈良", "和歌山"],
    },
    {
        id: "chugoku",
        prefectures: ["鳥取", "島根", "岡山", "広島", "山口"],
    },
    {
        id: "shikoku",
        prefectures: ["徳島", "香川", "愛媛", "高知"],
    },
    {
        id: "kyushu_okinawa",
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

function getRegionFilterIndex(region: string): number {
    let index = 0;
    for (const r of REGION_BLOCKS) {
        for (const pref of r.prefectures) {
            if (region.startsWith(pref)) return index;
            index++;
        }
    }
    return 999;
}

interface MagazinesClientProps {
    /** サーバー（getCachedAllMagazines）で取得済みの一覧。クライアントで /api を再取得しない（SSR と二重取得による失敗表示の食い違いを防ぐ）。 */
    initialMagazines?: Magazine[] | null;
}

export default function MagazinesClient({ initialMagazines: initialMagazinesProp }: MagazinesClientProps = {}) {
    const locale = useLocale();
    const t = useTranslations("MagazinesPage");
    const tClub = useTranslations("ClubSearch");
    const initialMagazines = initialMagazinesProp ?? [];

    const [activeRegion, setActiveRegion] = useState<RegionKey | "all">("all");
    const [activePref, setActivePref] = useState<string | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterExpanded, setIsFilterExpanded] = useState(true);
    const [sortOrder, setSortOrder] = useState<"region" | "newest">("region");
    const [mobileLayout, setMobileLayout] = useState<"single" | "double">("double");

    const currentPrefectures = useMemo(() => {
        if (activeRegion === "all") return [];
        return REGION_BLOCKS.find((r) => r.id === activeRegion)?.prefectures || [];
    }, [activeRegion]);

    const filteredMagazines = useMemo(() => {
        const filtered = initialMagazines.filter((mag) => {
            const query = searchQuery.toLowerCase();
            const titleHay = [
                mag.title,
                ...allTranslationValues(mag.translations, "title"),
            ]
                .join(" ")
                .toLowerCase();
            const descHay = [
                mag.description ?? "",
                ...allTranslationValues(mag.translations, "description"),
            ]
                .join(" ")
                .toLowerCase();
            const matchSearch =
                searchQuery === "" ||
                titleHay.includes(query) ||
                descHay.includes(query);

            let matchLocation = true;
            if (activeRegion !== "all") {
                if (activePref !== "all") {
                    matchLocation = mag.region.startsWith(activePref);
                } else {
                    const regionPrefs = REGION_BLOCKS.find((r) => r.id === activeRegion)?.prefectures || [];
                    matchLocation = regionPrefs.some((pref) => mag.region.startsWith(pref));
                }
            }

            return matchSearch && matchLocation;
        });

        return filtered.sort((a, b) => {
            if (sortOrder === "region") {
                const orderDiff = getRegionFilterIndex(a.region) - getRegionFilterIndex(b.region);
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

    const dateLocale = locale === "en" ? "en-US" : "ja-JP";

    return (
        <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
            <main className="grow">
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
                            {t("heroTitle")}
                        </h1>
                        <p className="text-white/80 font-medium tracking-wide max-w-xl mx-auto leading-relaxed whitespace-pre-line">
                            {t("heroLead")}
                        </p>
                    </div>
                </section>

                <section className="relative px-4 md:px-6 z-30 -mt-10 md:-mt-16 mb-12">
                    <div className="container mx-auto max-w-6xl">
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
                                    placeholder={t("searchPlaceholder")}
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
                                    {t("searchButton")}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div
                                className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                            >
                                <div className="flex items-center gap-3">
                                    <Filter size={16} className="text-sumo-brand" />
                                    <span className="text-sm font-bold text-gray-700 tracking-wide">
                                        {t("areaFilter")}
                                    </span>
                                    {activeRegion !== "all" && (
                                        <span className="ml-2 px-2 py-0.5 bg-sumo-brand/10 text-sumo-brand text-[10px] font-bold rounded-full">
                                            {t("activeFilter")}
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

                            <div
                                className={cn(
                                    "transition-all duration-500 ease-in-out overflow-hidden",
                                    isFilterExpanded
                                        ? "max-h-[600px] opacity-100"
                                        : "max-h-0 opacity-0"
                                )}
                            >
                                <div className="p-6 md:p-10">
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
                                            {t("allJapan")}
                                        </Button>

                                        {REGION_BLOCKS.map((region) => (
                                            <Button
                                                key={region.id}
                                                variant="ceramic"
                                                isActive={activeRegion === region.id}
                                                onClick={() => {
                                                    setActiveRegion(region.id);
                                                    setActivePref("all");
                                                }}
                                            >
                                                {tClub(`regions.${region.id}`)}
                                            </Button>
                                        ))}
                                    </div>

                                    {activeRegion !== "all" && (
                                        <div className="relative pt-8 border-t border-gray-100">
                                            <div className="absolute -top-3 left-6 px-3 bg-white text-[10px] font-bold text-gray-400 tracking-widest uppercase border border-gray-100 rounded-full">
                                                {t("prefPickerLabel")}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    variant="ceramic"
                                                    isActive={activePref === "all"}
                                                    onClick={() => setActivePref("all")}
                                                    className="px-4 py-2 text-xs rounded-lg border-b-[3px]"
                                                >
                                                    {t("prefAll")}
                                                </Button>

                                                {currentPrefectures.map((pref) => (
                                                    <Button
                                                        key={pref}
                                                        variant="ceramic"
                                                        isActive={activePref === pref}
                                                        onClick={() => setActivePref(pref)}
                                                        className="px-4 py-2 text-xs rounded-lg border-b-[3px]"
                                                    >
                                                        {regionDisplayForLocale(pref, locale)}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-8 mb-4 pb-4 border-b border-gray-200">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-serif font-black text-sumo-brand">
                                    {filteredMagazines.length}
                                </span>
                                <span className="text-xs font-bold text-gray-400 tracking-widest mb-1">
                                    {t("resultsLine", { count: filteredMagazines.length })}
                                </span>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                                <div className="inline-flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                                        {t("sortLabel")}
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
                                            {t("sortRegion")}
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
                                            {t("sortNewest")}
                                        </button>
                                    </div>
                                </div>

                                <div className="md:hidden inline-flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                                        {t("displayLabel")}
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
                                            aria-label={t("ariaLayoutDouble")}
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
                                            aria-label={t("ariaLayoutSingle")}
                                        >
                                            <LayoutList size={18} />
                                        </button>
                                    </div>
                                </div>

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
                                            {tClub(`regions.${activeRegion}`)}
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

                <section ref={resultsSectionRef} className="relative pb-16 md:pb-32 px-6 z-20">
                    <div className="container mx-auto max-w-6xl">
                        {filteredMagazines.length > 0 ? (
                            <div
                                className={cn(
                                    "grid",
                                    mobileLayout === "double"
                                        ? "grid-cols-2 gap-x-4 gap-y-8"
                                        : "grid-cols-1 gap-y-10",
                                    "md:grid-cols-2 md:gap-x-12 md:gap-y-20 lg:grid-cols-3"
                                )}
                            >
                                {filteredMagazines.map((mag) => {
                                    const titleShown = magazineDisplayTitle(mag, locale);
                                    const descShown = magazineDisplayDescription(mag, locale);
                                    return (
                                    <div
                                        key={mag.id}
                                        className={cn(
                                            "group relative flex flex-col h-full",
                                            mobileLayout === "double" && "md:max-w-none"
                                        )}
                                    >
                                        <Ceramic
                                            as={Link}
                                            href={`/magazines/${mag.slug}`}
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
                                                            alt={titleShown}
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
                                                    {new Date(mag.issueDate).toLocaleDateString(dateLocale)}
                                                </div>
                                                <h3
                                                    className={cn(
                                                        "font-serif font-black text-gray-900 mb-1 leading-tight group-hover:text-sumo-brand transition-colors",
                                                        "text-sm md:text-xl",
                                                        mobileLayout === "single" && "text-base md:text-2xl"
                                                    )}
                                                >
                                                    {titleShown}
                                                </h3>
                                                {mobileLayout === "single" && descShown && (
                                                    <p className="text-xs md:text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed max-w-xs">
                                                        {descShown}
                                                    </p>
                                                )}
                                                <div className="mt-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden md:block">
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.2em] text-sumo-brand">
                                                        {t("readMore")} <ArrowRight size={10} />
                                                    </span>
                                                </div>
                                            </div>
                                        </Ceramic>
                                    </div>
                                );
                                })}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <Search size={24} />
                                </div>
                                <h3 className="text-lg font-serif font-bold text-gray-700 mb-2">
                                    {t("emptyTitle")}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveRegion("all");
                                        setSearchQuery("");
                                    }}
                                    className="mt-6 text-sm font-bold text-sumo-brand border-b border-sumo-brand/30 hover:border-sumo-brand pb-0.5 transition-colors"
                                >
                                    {t("resetFilters")}
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
