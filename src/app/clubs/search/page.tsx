"use client";

import React, { useState, useMemo } from "react";
import WaveDivider from "@/components/home/WaveDivider";
import { Search, X } from "lucide-react";
import { clubsData } from "@/data/mockData";
import ClubCard from "@/components/clubs/ClubCard"; // ✨ 复用卡片
import { cn } from "@/lib/utils";

// 定义区域类型
type RegionKey =
  | "hokkaido_tohoku"
  | "kanto"
  | "chubu"
  | "kansai"
  | "chugoku"
  | "shikoku"
  | "kyushu_okinawa";

// ✨ 移到底部定义的常量数据
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

const ClubsPage = () => {
  // 状态管理
  const [activeRegion, setActiveRegion] = useState<RegionKey | "all">("all");
  const [activePref, setActivePref] = useState<string | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 获取当前选中区域下的都道府县列表
  const currentPrefectures = useMemo(() => {
    if (activeRegion === "all") return [];
    return REGIONS.find((r) => r.id === activeRegion)?.prefectures || [];
  }, [activeRegion]);

  // 筛选逻辑
  const filteredClubs = useMemo(() => {
    return clubsData.filter((club) => {
      // 1. 文本搜索
      const matchQuery =
        searchQuery === "" ||
        club.name.includes(searchQuery) ||
        club.area.includes(searchQuery);

      // 2. 区域/都道府县筛选
      let matchLocation = true;
      if (activeRegion !== "all") {
        if (activePref !== "all") {
          // 精确匹配都道府县
          matchLocation = club.area.includes(activePref);
        } else {
          // 匹配大区域
          const regionPrefs =
            REGIONS.find((r) => r.id === activeRegion)?.prefectures || [];
          matchLocation = regionPrefs.some((pref) => club.area.includes(pref));
        }
      }

      return matchQuery && matchLocation;
    });
  }, [searchQuery, activeRegion, activePref]);

  // 重置函数
  const handleReset = () => {
    setActiveRegion("all");
    setActivePref("all");
    setSearchQuery("");
  };

  return (
    <div className="antialiased bg-sumo-bg min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* ==================== 1. Hero Area ==================== */}
        <section className="relative bg-sumo-dark text-white pt-40 pb-28 px-6 overflow-hidden">
          {/* 背景纹理 (使用本地图片) */}
          <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/washi.png')]"></div>

          {/* 巨大的 CLUBS 背景字 */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[15vw] font-serif font-bold text-white opacity-[0.03] select-none whitespace-nowrap pointer-events-none">
            CLUBS
          </div>

          <div className="container mx-auto relative z-10 text-center reveal-up">
            <p className="text-sumo-gold text-xs font-bold tracking-[0.3em] mb-6 uppercase flex items-center justify-center gap-4">
              <span className="w-8 h-[1px] bg-sumo-gold"></span>
              Find Your Dojo
              <span className="w-8 h-[1px] bg-sumo-gold"></span>
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-wide mb-6">
              全国の相撲クラブ検索
            </h1>
            <p className="text-gray-400 font-medium max-w-xl mx-auto leading-loose text-sm md:text-base">
              あなたの近くの道場が、きっと見つかる。
              <br />
              見学・体験のお申し込みもこちらから。
            </p>
          </div>
        </section>

        {/* ==================== 2. Filter & Search Section ==================== */}
        <section className="relative">
          <WaveDivider fill="fill-sumo-dark" isRotated={false} />

          <div className="container mx-auto px-6 pt-16 pb-20 relative z-20">
            {/* --- 悬浮搜索框 --- */}
            <div className="bg-white p-6 rounded-sm shadow-xl -mt-24 mb-16 border-t-4 border-sumo-gold max-w-4xl mx-auto reveal-up">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="クラブ名、地域名で検索..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-sumo-gold transition-colors text-sumo-dark placeholder-gray-400 rounded-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="w-full md:w-auto bg-sumo-dark text-white px-10 py-3 font-bold tracking-wider hover:bg-sumo-red transition-colors whitespace-nowrap rounded-sm shadow-md">
                  検索
                </button>
              </div>
            </div>

            {/* --- 筛选区域 --- */}
            <div className="mb-16 reveal-up delay-100">
              {/* 1. 大区域 Tabs */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
                <button
                  onClick={() => {
                    setActiveRegion("all");
                    setActivePref("all");
                  }}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-bold tracking-wider transition-all duration-300 border",
                    activeRegion === "all"
                      ? "bg-sumo-dark text-white border-sumo-dark shadow-lg"
                      : "bg-white text-gray-500 border-gray-200 hover:border-sumo-gold hover:text-sumo-gold",
                  )}
                >
                  全国
                </button>
                {REGIONS.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => {
                      setActiveRegion(region.id);
                      setActivePref("all");
                    }}
                    className={cn(
                      "px-6 py-2 rounded-full text-sm font-bold tracking-wider transition-all duration-300 border",
                      activeRegion === region.id
                        ? "bg-sumo-dark text-white border-sumo-dark shadow-lg"
                        : "bg-white text-gray-500 border-gray-200 hover:border-sumo-gold hover:text-sumo-gold",
                    )}
                  >
                    {region.label}
                  </button>
                ))}
              </div>

              {/* 2. 都道府县 Sub-Tabs */}
              {activeRegion !== "all" && (
                <div className="bg-white/50 border border-sumo-gold/20 p-6 rounded-md max-w-4xl mx-auto animate-[fadeIn_0.3s_ease-out]">
                  <div className="text-center mb-4 text-xs font-bold text-sumo-gold tracking-widest">
                    エリアを選択してください
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => setActivePref("all")}
                      className={cn(
                        "px-4 py-1.5 text-xs font-bold transition-colors border-b-2",
                        activePref === "all"
                          ? "border-sumo-red text-sumo-red"
                          : "border-transparent text-gray-500 hover:text-sumo-dark",
                      )}
                    >
                      全て
                    </button>
                    {currentPrefectures.map((pref) => (
                      <button
                        key={pref}
                        onClick={() => setActivePref(pref)}
                        className={cn(
                          "px-4 py-1.5 text-xs font-bold transition-colors border-b-2",
                          activePref === pref
                            ? "border-sumo-red text-sumo-red"
                            : "border-transparent text-gray-500 hover:text-sumo-dark",
                        )}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* --- 结果统计 --- */}
            <div className="text-center mb-12 reveal-up delay-200">
              <div className="inline-block bg-white px-8 py-4 rounded-full shadow-sm border border-gray-100">
                <span className="text-gray-500 text-xs font-bold tracking-widest mr-4">
                  検索結果
                </span>
                <span className="text-3xl font-serif font-bold text-sumo-dark mr-1">
                  {filteredClubs.length}
                </span>
                <span className="text-xs text-gray-400">チーム</span>
              </div>
            </div>

            {/* ==================== 3. Results Grid ==================== */}
            {filteredClubs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredClubs.map((club) => (
                  // ✨ 这里复用了我们刚刚提取的组件，代码瞬间清爽！
                  <div key={club.id} className="reveal-up">
                    <ClubCard club={club} />
                  </div>
                ))}
              </div>
            ) : (
              /* 空状态 */
              <div className="text-center py-20 bg-white/50 rounded-sm border border-dashed border-gray-300 max-w-2xl mx-auto reveal-up">
                <div className="mb-4 text-gray-300">
                  <Search size={48} className="mx-auto" />
                </div>
                <p className="text-gray-500 font-serif mb-6">
                  該当するクラブが見つかりませんでした。
                </p>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-sumo-red text-sm font-bold border-b border-sumo-red pb-1 hover:opacity-70 transition-opacity"
                >
                  <X size={14} />
                  条件をクリアして全件表示
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClubsPage;
