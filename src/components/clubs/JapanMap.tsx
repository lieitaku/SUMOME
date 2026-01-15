"use client";

import React from "react";
import Link from "next/link";
import Ceramic from "@/components/ui/Ceramic";
import { cn } from "@/lib/utils";

// --- Types ---
type PrefData = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

// --- Data Constants ---
const PREF_DATA: PrefData[] = [
  { id: "hokkaido", label: "北海道", x: 14, y: 0, w: 3, h: 2 },
  { id: "aomori", label: "青森", x: 14, y: 2, w: 2, h: 1 },
  { id: "akita", label: "秋田", x: 14, y: 3, w: 1, h: 1 },
  { id: "iwate", label: "岩手", x: 15, y: 3, w: 1, h: 1 },
  { id: "yamagata", label: "山形", x: 14, y: 4, w: 1, h: 1 },
  { id: "miyagi", label: "宮城", x: 15, y: 4, w: 1, h: 1 },
  { id: "fukushima", label: "福島", x: 15, y: 5, w: 1, h: 1 },
  { id: "gunma", label: "群馬", x: 13, y: 6, w: 1, h: 1 },
  { id: "tochigi", label: "栃木", x: 14, y: 6, w: 1, h: 1 },
  { id: "ibaraki", label: "茨城", x: 15, y: 6, w: 1, h: 2 },
  { id: "saitama", label: "埼玉", x: 13, y: 7, w: 2, h: 1 },
  { id: "tokyo", label: "東京", x: 13, y: 8, w: 2, h: 1 },
  { id: "chiba", label: "千葉", x: 15, y: 8, w: 1, h: 2 },
  { id: "kanagawa", label: "神奈川", x: 13, y: 9, w: 2, h: 1 },
  { id: "niigata", label: "新潟", x: 13, y: 5, w: 2, h: 1 },
  { id: "toyama", label: "富山", x: 12, y: 5, w: 1, h: 1 },
  { id: "ishikawa", label: "石川", x: 11, y: 5, w: 1, h: 1 },
  { id: "fukui", label: "福井", x: 10, y: 5, w: 1, h: 1 },
  { id: "nagano", label: "長野", x: 12, y: 6, w: 1, h: 2 },
  { id: "gifu", label: "岐阜", x: 11, y: 6, w: 1, h: 2 },
  { id: "yamanashi", label: "山梨", x: 12, y: 8, w: 1, h: 1 },
  { id: "aichi", label: "愛知", x: 11, y: 8, w: 1, h: 1 },
  { id: "shizuoka", label: "静岡", x: 12, y: 9, w: 1, h: 1 },
  { id: "shiga", label: "滋賀", x: 10, y: 6, w: 1, h: 1 },
  { id: "kyoto", label: "京都", x: 9, y: 5, w: 1, h: 2 },
  { id: "mie", label: "三重", x: 10, y: 7, w: 1, h: 2 },
  { id: "nara", label: "奈良", x: 9, y: 7, w: 1, h: 2 },
  { id: "osaka", label: "大阪", x: 8, y: 7, w: 1, h: 2 },
  { id: "wakayama", label: "和歌山", x: 8, y: 9, w: 2, h: 1 },
  { id: "hyogo", label: "兵庫", x: 7, y: 5, w: 1, h: 2 },
  { id: "tottori", label: "鳥取", x: 6, y: 5, w: 1, h: 1 },
  { id: "okayama", label: "岡山", x: 6, y: 6, w: 1, h: 1 },
  { id: "shimane", label: "島根", x: 5, y: 5, w: 1, h: 1 },
  { id: "hiroshima", label: "広島", x: 5, y: 6, w: 1, h: 1 },
  { id: "yamaguchi", label: "山口", x: 4, y: 5, w: 1, h: 2 },
  { id: "kagawa", label: "香川", x: 6, y: 8, w: 1, h: 1 },
  { id: "ehime", label: "愛媛", x: 5, y: 8, w: 1, h: 1 },
  { id: "tokushima", label: "徳島", x: 6, y: 9, w: 1, h: 1 },
  { id: "kochi", label: "高知", x: 5, y: 9, w: 1, h: 1 },
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

// --- Config: Glaze Colors (Pure Hex) ---
type ThemeColor = {
  bg: string;
  text: string;
  shadow: string;
  dot: string;
};

const REGION_THEMES: Record<string, ThemeColor> = {
  "北海道・東北": {
    bg: "#dbe9f0",
    text: "#4a708b",
    shadow: "#a8c2d1",
    dot: "#a8c2d1",
  },
  関東: {
    bg: "#e5dde6",
    text: "#8a6a8a",
    shadow: "#cbbccb",
    dot: "#cbbccb",
  },
  中部: {
    bg: "#dcede4",
    text: "#5c8a70",
    shadow: "#b8d6c5",
    dot: "#b8d6c5",
  },
  近畿: {
    bg: "#f2ece1",
    text: "#8f7e5e",
    shadow: "#d9cfbc",
    dot: "#d9cfbc",
  },
  中国: {
    bg: "#f7f1d5",
    text: "#9c8c54",
    shadow: "#e0d6a8",
    dot: "#e0d6a8",
  },
  四国: {
    bg: "#f7f1d5",
    text: "#9c8c54",
    shadow: "#e0d6a8",
    dot: "#e0d6a8",
  },
  "九州・沖縄": {
    bg: "#d6eeef",
    text: "#4b8f94",
    shadow: "#b0d8db",
    dot: "#b0d8db",
  },
};

const JapanMap = () => {
  const getStyle = (x: number, y: number, w: number, h: number) => {
    const unitX = 100 / 17;
    const unitY = 100 / 10;
    const gap = 0.3;
    return {
      left: `${x * unitX + gap / 2}%`,
      top: `${y * unitY + gap / 2}%`,
      width: `${w * unitX - gap}%`,
      height: `${h * unitY - gap}%`,
    };
  };

  const getLabel = (id: string) =>
    PREF_DATA.find((p) => p.id === id)?.label || id;

  /**
   * 核心修复：将所有厚度相关的 4px 改为 2px
   */
  const getRegionProps = (id: string, isMobile: boolean) => {
    const group = MOBILE_GROUPS.find((g) => g.ids.includes(id));
    if (!group) return { style: {}, className: "" };

    const theme = REGION_THEMES[group.region];

    // 1. 定义 CSS 变量
    const customStyle = {
      "--r-bg": theme.bg,
      "--r-text": theme.text,
      "--r-shadow": theme.shadow,
    } as React.CSSProperties;

    // 2. 基础类名
    const baseClasses =
      "bg-[var(--r-bg)] shadow-none border-0 ring-0 transition-all duration-300";

    let stateClasses = "";

    if (isMobile) {
      // === Mobile Mode (常驻阴影) ===
      // 修改点：将 4px 改为 2px，border-b-4 改为 border-b-2
      stateClasses = cn(
        "text-[var(--r-text)]",
        "shadow-[0_2px_0_var(--r-shadow)]", // 4px -> 2px
        "border-b-2 border-[var(--r-shadow)]", // b-4 -> b-2
        // 按下效果：位移也同步改为 2px
        "active:translate-y-[2px] active:shadow-none active:border-b-0",
      );
    } else {
      // === Desktop Mode (Hover 阴影) ===
      // 修改点：同上，将 4px 改为 2px，border-b-4 改为 border-b-2
      stateClasses = cn(
        "text-gray-500 hover:text-[var(--r-text)]",
        "border-b-2 border-transparent hover:border-[var(--r-shadow)]", // b-4 -> b-2
        "hover:shadow-[0_2px_0_var(--r-shadow)]", // 4px -> 2px
        "hover:-translate-y-0.5",
      );
    }

    return {
      style: customStyle,
      className: cn(baseClasses, stateClasses),
    };
  };

  return (
    <div className="w-full">
      {/* === A. 手机端视图 (Mobile) === */}
      <div className="md:hidden flex flex-col gap-10">
        {MOBILE_GROUPS.map((group) => {
          const theme = REGION_THEMES[group.region];
          return (
            <div key={group.region}>
              <h3 className="flex items-center gap-2 mb-4 pl-1">
                <div
                  className="w-2 h-2 rounded-full shadow-sm"
                  style={{ backgroundColor: theme.dot }}
                ></div>
                <span className="text-sumo-dark font-serif font-bold tracking-widest text-sm">
                  {group.region}
                </span>
              </h3>

              <div className="grid grid-cols-4 gap-2">
                {group.ids.map((id) => {
                  const { style, className } = getRegionProps(id, true);
                  return (
                    <Ceramic
                      key={id}
                      as={Link}
                      href={`/clubs/${id}`}
                      style={style}
                      className={cn(
                        "flex items-center justify-center py-3 text-xs font-bold rounded-xl",
                        className,
                      )}
                    >
                      {getLabel(id)}
                    </Ceramic>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* === B. 电脑端视图 (Desktop) === */}
      <div className="hidden md:block relative w-full max-w-[900px] aspect-[17/10] mx-auto select-none">
        {PREF_DATA.map((pref) => {
          const { style: regionStyle, className } = getRegionProps(
            pref.id,
            false,
          );
          const positionStyle = getStyle(pref.x, pref.y, pref.w, pref.h);

          return (
            <Ceramic
              key={pref.id}
              as={Link}
              href={`/clubs/${pref.id}`}
              style={{ ...positionStyle, ...regionStyle }}
              className={cn(
                "absolute flex items-center justify-center text-sm font-bold tracking-widest",
                "rounded-md hover:z-10",
                className,
              )}
            >
              {pref.label}
            </Ceramic>
          );
        })}

        {/* 装饰图例 */}
        <div className="absolute -bottom-8 right-0 flex flex-col items-end opacity-40 pointer-events-none">
          <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-sumo-dark flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sumo-brand"></span>
            JPN / MAP
          </span>
        </div>
      </div>
    </div>
  );
};

export default JapanMap;
