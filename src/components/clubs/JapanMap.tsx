"use client";
import React from "react";
import Link from "next/link";

type PrefData = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

const PREF_DATA: PrefData[] = [
  // 北海道・東北
  { id: "hokkaido", label: "北海道", x: 14, y: 0, w: 3, h: 2 },
  { id: "aomori", label: "青森", x: 14, y: 2, w: 2, h: 1 },
  { id: "akita", label: "秋田", x: 14, y: 3, w: 1, h: 1 },
  { id: "iwate", label: "岩手", x: 15, y: 3, w: 1, h: 1 },
  { id: "yamagata", label: "山形", x: 14, y: 4, w: 1, h: 1 },
  { id: "miyagi", label: "宮城", x: 15, y: 4, w: 1, h: 1 },
  { id: "fukushima", label: "福島", x: 15, y: 5, w: 1, h: 1 },
  // 関東
  { id: "gunma", label: "群馬", x: 13, y: 6, w: 1, h: 1 },
  { id: "tochigi", label: "栃木", x: 14, y: 6, w: 1, h: 1 },
  { id: "ibaraki", label: "茨城", x: 15, y: 6, w: 1, h: 2 },
  { id: "saitama", label: "埼玉", x: 13, y: 7, w: 2, h: 1 },
  { id: "tokyo", label: "東京", x: 13, y: 8, w: 2, h: 1 },
  { id: "chiba", label: "千葉", x: 15, y: 8, w: 1, h: 2 },
  { id: "kanagawa", label: "神奈川", x: 13, y: 9, w: 2, h: 1 },
  // 中部
  { id: "niigata", label: "新潟", x: 13, y: 5, w: 2, h: 1 },
  { id: "toyama", label: "富山", x: 12, y: 5, w: 1, h: 1 },
  { id: "ishikawa", label: "石川", x: 11, y: 5, w: 1, h: 1 },
  { id: "fukui", label: "福井", x: 10, y: 5, w: 1, h: 1 },
  { id: "nagano", label: "長野", x: 12, y: 6, w: 1, h: 2 },
  { id: "gifu", label: "岐阜", x: 11, y: 6, w: 1, h: 2 },
  { id: "yamanashi", label: "山梨", x: 12, y: 8, w: 1, h: 1 },
  { id: "aichi", label: "愛知", x: 11, y: 8, w: 1, h: 1 },
  { id: "shizuoka", label: "静岡", x: 12, y: 9, w: 1, h: 1 },
  // 近畿
  { id: "shiga", label: "滋賀", x: 10, y: 6, w: 1, h: 1 },
  { id: "kyoto", label: "京都", x: 9, y: 5, w: 1, h: 2 },
  { id: "mie", label: "三重", x: 10, y: 7, w: 1, h: 2 },
  { id: "nara", label: "奈良", x: 9, y: 7, w: 1, h: 2 },
  { id: "osaka", label: "大阪", x: 8, y: 7, w: 1, h: 2 },
  { id: "wakayama", label: "和歌山", x: 8, y: 9, w: 2, h: 1 },
  { id: "hyogo", label: "兵庫", x: 7, y: 5, w: 1, h: 2 },
  // 中国
  { id: "tottori", label: "鳥取", x: 6, y: 5, w: 1, h: 1 },
  { id: "okayama", label: "岡山", x: 6, y: 6, w: 1, h: 1 },
  { id: "shimane", label: "島根", x: 5, y: 5, w: 1, h: 1 },
  { id: "hiroshima", label: "広島", x: 5, y: 6, w: 1, h: 1 },
  { id: "yamaguchi", label: "山口", x: 4, y: 5, w: 1, h: 2 },
  // 四国
  { id: "kagawa", label: "香川", x: 6, y: 8, w: 1, h: 1 },
  { id: "ehime", label: "愛媛", x: 5, y: 8, w: 1, h: 1 },
  { id: "tokushima", label: "徳島", x: 6, y: 9, w: 1, h: 1 },
  { id: "kochi", label: "高知", x: 5, y: 9, w: 1, h: 1 },
  // 九州・沖縄
  { id: "fukuoka", label: "福岡", x: 2, y: 5, w: 1, h: 1 },
  { id: "saga", label: "佐賀", x: 1, y: 5, w: 1, h: 1 },
  { id: "nagasaki", label: "長崎", x: 0, y: 5, w: 1, h: 1 },
  { id: "oita", label: "大分", x: 2, y: 6, w: 1, h: 1 },
  { id: "kumamoto", label: "熊本", x: 1, y: 6, w: 1, h: 2 },
  { id: "miyazaki", label: "宮崎", x: 2, y: 7, w: 1, h: 1 },
  { id: "kagoshima", label: "鹿児島", x: 1, y: 8, w: 2, h: 1 },
  { id: "okinawa", label: "沖縄", x: 0, y: 9, w: 1, h: 1 },
];

const MOBILE_GROUPS = [
  {
    region: "北海道・東北",
    ids: [
      "hokkaido",
      "aomori",
      "akita",
      "iwate",
      "yamagata",
      "miyagi",
      "fukushima",
    ],
  },
  {
    region: "関東",
    ids: [
      "tokyo",
      "kanagawa",
      "chiba",
      "saitama",
      "ibaraki",
      "tochigi",
      "gunma",
    ],
  },
  {
    region: "中部",
    ids: [
      "aichi",
      "shizuoka",
      "gifu",
      "mie",
      "yamanashi",
      "nagano",
      "niigata",
      "toyama",
      "ishikawa",
      "fukui",
    ],
  },
  {
    region: "近畿",
    ids: ["osaka", "hyogo", "kyoto", "shiga", "nara", "wakayama"],
  },
  {
    region: "中国",
    ids: ["tottori", "shimane", "okayama", "hiroshima", "yamaguchi"],
  },
  { region: "四国", ids: ["tokushima", "kagawa", "ehime", "kochi"] },
  {
    region: "九州・沖縄",
    ids: [
      "fukuoka",
      "saga",
      "nagasaki",
      "kumamoto",
      "oita",
      "miyazaki",
      "kagoshima",
      "okinawa",
    ],
  },
];

const JapanMap = () => {
  const getStyle = (x: number, y: number, w: number, h: number) => {
    const unitX = 100 / 17;
    const unitY = 100 / 10;
    const gap = 0.4;
    return {
      left: `${x * unitX + gap / 2}%`,
      top: `${y * unitY + gap / 2}%`,
      width: `${w * unitX - gap}%`,
      height: `${h * unitY - gap}%`,
    };
  };

  const getLabel = (id: string) =>
    PREF_DATA.find((p) => p.id === id)?.label || id;

  return (
    <div className="w-full">
      {/* A. 手机端视图 (Mobile: Block Layout) */}
      <div className="md:hidden flex flex-col gap-8">
        {MOBILE_GROUPS.map((group) => (
          <div key={group.region}>
            <h3 className="text-sumo-gold text-sm font-bold tracking-widest mb-3 border-l-2 border-sumo-gold pl-3">
              {group.region}
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {group.ids.map((id) => (
                <Link
                  key={id}
                  href={`/clubs/${id}`}
                  className="flex items-center justify-center py-3
                             bg-white/5 border border-white/10 rounded-sm
                             text-white text-xs font-bold
                             hover:bg-sumo-red hover:border-sumo-red transition-colors"
                >
                  {getLabel(id)}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* B. 电脑端视图 (Desktop: Grid Map) */}
      {/* ✨ 修复点：max-w 改回 900px，让地图不那么巨大 */}
      <div className="hidden md:block relative w-full max-w-[900px] aspect-[17/10] mx-auto select-none">
        {/* 背景层已移除，完全无框 */}

        {PREF_DATA.map((pref) => (
          <Link
            key={pref.id}
            href={`/clubs/${pref.id}`}
            style={getStyle(pref.x, pref.y, pref.w, pref.h)}
            className="absolute flex items-center justify-center
                       border border-white/20 bg-white/5 
                       backdrop-blur-[4px] rounded-[3px] shadow-sm
                       text-white/90 font-serif text-sm font-bold tracking-widest
                       transition-all duration-300 ease-out
                       hover:bg-sumo-red hover:border-sumo-red hover:text-white 
                       hover:z-50 hover:scale-110 hover:shadow-[0_0_20px_rgba(211,50,62,0.6)]"
          >
            {pref.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JapanMap;
