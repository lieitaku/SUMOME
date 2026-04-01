"use client";



import React from "react";

import Link from "@/components/ui/TransitionLink";

import Ceramic from "@/components/ui/Ceramic";

import { cn } from "@/lib/utils";



/**

 * ==============================================================================

 * 🗺️ JapanMap Component

 * ------------------------------------------------------------------------------

 * 一个交互式的日本地图组件，支持响应式布局。

 * - Mobile: 按照区域分组显示的列表网格。

 * - Desktop: 基于 17x10 网格系统的像素风地图。

 * ==============================================================================

 */



// --- 1. 类型定义 ---

type PrefData = {

  id: string;

  label: string;

  x: number; // 网格横坐标 (0-16)

  y: number; // 网格纵坐标 (0-9)

  w: number; // 宽度 (单位格子数)

  h: number; // 高度 (单位格子数)

};



// --- 2. 数据源：47都道府县坐标配置 ---

// ✨ 修改说明：所有 x 坐标在您提供的基础上 -1

const PREF_DATA: PrefData[] = [

  { id: "hokkaido", label: "北海道", x: 13, y: 0, w: 3, h: 2 }, // 14 -> 13

  { id: "aomori", label: "青森", x: 13, y: 2, w: 2, h: 1 }, // 14 -> 13

  { id: "akita", label: "秋田", x: 13, y: 3, w: 1, h: 1 }, // 14 -> 13

  { id: "iwate", label: "岩手", x: 14, y: 3, w: 1, h: 1 }, // 15 -> 14

  { id: "yamagata", label: "山形", x: 13, y: 4, w: 1, h: 1 }, // 14 -> 13

  { id: "miyagi", label: "宮城", x: 14, y: 4, w: 1, h: 1 }, // 15 -> 14

  { id: "fukushima", label: "福島", x: 14, y: 5, w: 1, h: 1 }, // 15 -> 14

  { id: "gunma", label: "群馬", x: 12, y: 6, w: 1, h: 1 }, // 13 -> 12

  { id: "tochigi", label: "栃木", x: 13, y: 6, w: 1, h: 1 }, // 14 -> 13

  { id: "ibaraki", label: "茨城", x: 14, y: 6, w: 1, h: 2 }, // 15 -> 14

  { id: "saitama", label: "埼玉", x: 12, y: 7, w: 2, h: 1 }, // 13 -> 12

  { id: "tokyo", label: "東京", x: 12, y: 8, w: 2, h: 1 }, // 13 -> 12

  { id: "chiba", label: "千葉", x: 14, y: 8, w: 1, h: 2 }, // 15 -> 14

  { id: "kanagawa", label: "神奈川", x: 12, y: 9, w: 2, h: 1 }, // 13 -> 12

  { id: "niigata", label: "新潟", x: 12, y: 5, w: 2, h: 1 }, // 13 -> 12

  { id: "toyama", label: "富山", x: 11, y: 5, w: 1, h: 1 }, // 12 -> 11

  { id: "ishikawa", label: "石川", x: 10, y: 5, w: 1, h: 1 }, // 11 -> 10

  { id: "fukui", label: "福井", x: 9, y: 5, w: 1, h: 1 }, // 10 -> 9

  { id: "nagano", label: "長野", x: 11, y: 6, w: 1, h: 2 }, // 12 -> 11

  { id: "gifu", label: "岐阜", x: 10, y: 6, w: 1, h: 2 }, // 11 -> 10

  { id: "yamanashi", label: "山梨", x: 11, y: 8, w: 1, h: 1 }, // 12 -> 11

  { id: "aichi", label: "愛知", x: 10, y: 8, w: 1, h: 1 }, // 11 -> 10

  { id: "shizuoka", label: "静岡", x: 11, y: 9, w: 1, h: 1 }, // 12 -> 11

  { id: "shiga", label: "滋賀", x: 9, y: 6, w: 1, h: 1 }, // 10 -> 9

  { id: "kyoto", label: "京都", x: 8, y: 5, w: 1, h: 2 }, // 9 -> 8

  { id: "mie", label: "三重", x: 9, y: 7, w: 1, h: 2 }, // 10 -> 9

  { id: "nara", label: "奈良", x: 8, y: 7, w: 1, h: 2 }, // 9 -> 8

  { id: "osaka", label: "大阪", x: 7, y: 7, w: 1, h: 2 }, // 8 -> 7

  { id: "wakayama", label: "和歌山", x: 7, y: 9, w: 2, h: 1 }, // 8 -> 7

  { id: "hyogo", label: "兵庫", x: 7, y: 5, w: 1, h: 2 }, // 8 -> 7

  { id: "tottori", label: "鳥取", x: 6, y: 5, w: 1, h: 1 }, // 7 -> 6

  { id: "okayama", label: "岡山", x: 6, y: 6, w: 1, h: 1 }, // 7 -> 6

  { id: "shimane", label: "島根", x: 5, y: 5, w: 1, h: 1 }, // 6 -> 5

  { id: "hiroshima", label: "広島", x: 5, y: 6, w: 1, h: 1 }, // 6 -> 5

  { id: "yamaguchi", label: "山口", x: 4, y: 5, w: 1, h: 2 }, // 5 -> 4

  { id: "kagawa", label: "香川", x: 5, y: 8, w: 1, h: 1 }, // 6 -> 5

  { id: "ehime", label: "愛媛", x: 4, y: 8, w: 1, h: 1 }, // 5 -> 4

  { id: "tokushima", label: "徳島", x: 5, y: 9, w: 1, h: 1 }, // 6 -> 5

  { id: "kochi", label: "高知", x: 4, y: 9, w: 1, h: 1 }, // 5 -> 4

  { id: "fukuoka", label: "福岡", x: 2, y: 5, w: 1, h: 1 }, // 3 -> 2

  { id: "saga", label: "佐賀", x: 1, y: 5, w: 1, h: 1 }, // 2 -> 1

  { id: "nagasaki", label: "長崎", x: 0, y: 5, w: 1, h: 1 }, // 1 -> 0

  { id: "oita", label: "大分", x: 2, y: 6, w: 1, h: 1 }, // 3 -> 2

  { id: "kumamoto", label: "熊本", x: 1, y: 6, w: 1, h: 2 }, // 2 -> 1

  { id: "miyazaki", label: "宮崎", x: 2, y: 7, w: 1, h: 1 }, // 3 -> 2

  { id: "kagoshima", label: "鹿児島", x: 1, y: 8, w: 2, h: 1 }, // 2 -> 1

  { id: "okinawa", label: "沖縄", x: 0, y: 9, w: 1, h: 1 }, // 1 -> 0

];



// --- 3. 移动端分组配置 ---

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



// --- 4. 视觉系统配置 (Color System) ---

type ThemeColor = {

  bg: string; // 积木背景色

  text: string; // 文字色 (深色，用于 Tone-on-Tone)

  shadow: string; // 阴影/边框色

  dot: string; // 移动端标题圆点色

};



// 🎨 Palette: 明亮且明显的配色方案 (Bright & Distinct)

const REGION_THEMES: Record<string, ThemeColor> = {

  "北海道・東北": {

    bg: "#89C3EB", // 空色 (Sky Blue)

    text: "#1D4E72", // 深蓝

    shadow: "#5B92B6",

    dot: "#5B92B6",

  },

  関東: {

    bg: "#D4A3CF", // 藤紫 (Wisteria)

    text: "#5D2A5D", // 深紫

    shadow: "#A67CA1",

    dot: "#A67CA1",

  },

  中部: {

    bg: "#93CA76", // 萌黄 (Fresh Green)

    text: "#2B5219", // 深绿

    shadow: "#6A9C50",

    dot: "#6A9C50",

  },

  近畿: {

    bg: "#F0CFA0", // 杏色 (Apricot)

    text: "#754C24", // 深褐

    shadow: "#C2A176",

    dot: "#C2A176",

  },

  中国: {

    bg: "#F4D565", // 栀子色 (Bright Gold)

    text: "#6B591B", // 深金褐

    shadow: "#C4A84D",

    dot: "#C4A84D",

  },

  // ✨✨✨ 新增四国独立配色：蜜柑橙 (Mikan Orange) ✨✨✨

  四国: {

    bg: "#FFB35C", // 蜜柑色 (Vivid Orange) - 明亮且有活力

    text: "#664200", // 深棕色 - 对比清晰

    shadow: "#CC8F4A",

    dot: "#CC8F4A",

  },

  "九州・沖縄": {

    bg: "#75CCD1", // 浅葱 (Turquoise)

    text: "#1D666A", // 深青

    shadow: "#4DA1A6",

    dot: "#4DA1A6",

  },

};



const JapanMap = () => {

  // 计算 Grid 布局的百分比位置

  const getStyle = (x: number, y: number, w: number, h: number) => {

    const unitX = 100 / 17;

    const unitY = 100 / 10;

    const gap = 0.3; // 积木间隙

    return {

      left: `${x * unitX + gap / 2}%`,

      top: `${y * unitY + gap / 2}%`,

      width: `${w * unitX - gap}%`,

      height: `${h * unitY - gap}%`,

    };

  };



  const getLabel = (id: string) =>

    PREF_DATA.find((p) => p.id === id)?.label || id;



  // 获取区域样式属性 (核心逻辑)

  const getRegionProps = (id: string, isMobile: boolean) => {

    const group = MOBILE_GROUPS.find((g) => g.ids.includes(id));

    if (!group) return { style: {}, className: "" };



    const theme = REGION_THEMES[group.region];



    // 注入 CSS 变量

    const customStyle = {

      "--r-bg": theme.bg,

      "--r-text": theme.text,

      "--r-shadow": theme.shadow,

    } as React.CSSProperties;



    // 基础类 (背景色、过渡)

    const baseClasses =

      "bg-[var(--r-bg)] shadow-none border-0 ring-0 transition-all duration-300";



    let stateClasses = "";



    if (isMobile) {

      // === Mobile Mode (手机端) ===

      stateClasses = cn(

        "text-[var(--r-text)]",

        "shadow-[0_2px_0_var(--r-shadow)]",

        "border-b-2 border-[var(--r-shadow)]",

        "active:translate-y-[2px] active:shadow-none active:border-b-0",

      );

    } else {

      // === Desktop Mode (电脑端) ===

      stateClasses = cn(

        // 1. 文字策略：Tone-on-Tone (同色系深色)

        "text-[var(--r-text)] font-bold",

        "opacity-75 hover:opacity-100",



        // 2. 边框与阴影动效

        "border-b-2 border-transparent hover:border-[var(--r-shadow)]",

        "hover:shadow-[0_2px_0_var(--r-shadow)]",

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

                <span className="text-sumo-dark font-serif font-bold tracking-widest text-base">

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

                      href={`/prefectures/${id}`}

                      style={style}

                      className={cn(

                        "flex items-center justify-center py-3 text-sm font-bold rounded-xl",

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

              href={`/prefectures/${pref.id}`}

              style={{ ...positionStyle, ...regionStyle }}

              className={cn(

                "absolute flex items-center justify-center text-sm tracking-widest",

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