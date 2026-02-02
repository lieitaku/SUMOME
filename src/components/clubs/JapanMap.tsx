"use client";

import React, { useMemo } from "react";
// 确保 TransitionLink 的引入路径正确，且该组件支持 className/style 透传
import Link from "@/components/ui/TransitionLink";
import Ceramic from "@/components/ui/Ceramic";
import { cn } from "@/lib/utils";

/**
 * ==============================================================================
 * 🗺️ JapanMap Component (Interactive)
 * ------------------------------------------------------------------------------
 * 一个响应式的日本地图导航组件。
 * * Design Philosophy:
 * - Desktop: 采用 "Tile Grid" (瓦片网格) 设计，模拟像素风地图，强调地理位置关系。
 * - Mobile:  采用 "Grouped List" (分组列表) 设计，强调区域层级，便于手指点击。
 * * Features:
 * - 自动适配配色 (Theme System)
 * - 交互动效 (Hover/Active states)
 * - 类型安全 (TypeScript)
 * ==============================================================================
 */

// --- 1. Type Definitions (类型定义) ---

/**
 * 都道府县数据结构
 */
type PrefData = {
  id: string;    // 唯一标识符 (如 'tokyo')
  label: string; // 显示名称 (如 '東京')
  x: number;     // 网格横坐标 (0-base)
  y: number;     // 网格纵坐标 (0-base)
  w: number;     // 宽度 (Grid Units)
  h: number;     // 高度 (Grid Units)
};

/**
 * 区域分组结构 (Mobile端使用)
 */
type RegionGroup = {
  region: string; // 区域名 (如 '関東')
  ids: string[];  // 包含的都道府县 ID 列表
};

/**
 * 主题配色结构
 */
type ThemeColor = {
  bg: string;     // 背景色
  text: string;   // 文本色
  shadow: string; // 阴影/边框色
  dot: string;    // 装饰点颜色
};

// --- 2. Constants & Configuration (常量配置) ---

// 47都道府县坐标配置 (基于 17x10 网格)
const PREF_DATA: PrefData[] = [
  { id: "hokkaido", label: "北海道", x: 13, y: 0, w: 3, h: 2 },
  { id: "aomori", label: "青森", x: 13, y: 2, w: 2, h: 1 },
  { id: "akita", label: "秋田", x: 13, y: 3, w: 1, h: 1 },
  { id: "iwate", label: "岩手", x: 14, y: 3, w: 1, h: 1 },
  { id: "yamagata", label: "山形", x: 13, y: 4, w: 1, h: 1 },
  { id: "miyagi", label: "宮城", x: 14, y: 4, w: 1, h: 1 },
  { id: "fukushima", label: "福島", x: 14, y: 5, w: 1, h: 1 },
  { id: "gunma", label: "群馬", x: 12, y: 6, w: 1, h: 1 },
  { id: "tochigi", label: "栃木", x: 13, y: 6, w: 1, h: 1 },
  { id: "ibaraki", label: "茨城", x: 14, y: 6, w: 1, h: 2 },
  { id: "saitama", label: "埼玉", x: 12, y: 7, w: 2, h: 1 },
  { id: "tokyo", label: "東京", x: 12, y: 8, w: 2, h: 1 },
  { id: "chiba", label: "千葉", x: 14, y: 8, w: 1, h: 2 },
  { id: "kanagawa", label: "神奈川", x: 12, y: 9, w: 2, h: 1 },
  { id: "niigata", label: "新潟", x: 12, y: 5, w: 2, h: 1 },
  { id: "toyama", label: "富山", x: 11, y: 5, w: 1, h: 1 },
  { id: "ishikawa", label: "石川", x: 10, y: 5, w: 1, h: 1 },
  { id: "fukui", label: "福井", x: 9, y: 5, w: 1, h: 1 },
  { id: "nagano", label: "長野", x: 11, y: 6, w: 1, h: 2 },
  { id: "gifu", label: "岐阜", x: 10, y: 6, w: 1, h: 2 },
  { id: "yamanashi", label: "山梨", x: 11, y: 8, w: 1, h: 1 },
  { id: "aichi", label: "愛知", x: 10, y: 8, w: 1, h: 1 },
  { id: "shizuoka", label: "静岡", x: 11, y: 9, w: 1, h: 1 },
  { id: "shiga", label: "滋賀", x: 9, y: 6, w: 1, h: 1 },
  { id: "kyoto", label: "京都", x: 8, y: 5, w: 1, h: 2 },
  { id: "mie", label: "三重", x: 9, y: 7, w: 1, h: 2 },
  { id: "nara", label: "奈良", x: 8, y: 7, w: 1, h: 2 },
  { id: "osaka", label: "大阪", x: 7, y: 7, w: 1, h: 2 },
  { id: "wakayama", label: "和歌山", x: 7, y: 9, w: 2, h: 1 },
  { id: "hyogo", label: "兵庫", x: 7, y: 5, w: 1, h: 2 },
  { id: "tottori", label: "鳥取", x: 6, y: 5, w: 1, h: 1 },
  { id: "okayama", label: "岡山", x: 6, y: 6, w: 1, h: 1 },
  { id: "shimane", label: "島根", x: 5, y: 5, w: 1, h: 1 },
  { id: "hiroshima", label: "広島", x: 5, y: 6, w: 1, h: 1 },
  { id: "yamaguchi", label: "山口", x: 4, y: 5, w: 1, h: 2 },
  { id: "kagawa", label: "香川", x: 5, y: 8, w: 1, h: 1 },
  { id: "ehime", label: "愛媛", x: 4, y: 8, w: 1, h: 1 },
  { id: "tokushima", label: "徳島", x: 5, y: 9, w: 1, h: 1 },
  { id: "kochi", label: "高知", x: 4, y: 9, w: 1, h: 1 },
  { id: "fukuoka", label: "福岡", x: 2, y: 5, w: 1, h: 1 },
  { id: "saga", label: "佐賀", x: 1, y: 5, w: 1, h: 1 },
  { id: "nagasaki", label: "長崎", x: 0, y: 5, w: 1, h: 1 },
  { id: "oita", label: "大分", x: 2, y: 6, w: 1, h: 1 },
  { id: "kumamoto", label: "熊本", x: 1, y: 6, w: 1, h: 2 },
  { id: "miyazaki", label: "宮崎", x: 2, y: 7, w: 1, h: 1 },
  { id: "kagoshima", label: "鹿児島", x: 1, y: 8, w: 2, h: 1 },
  { id: "okinawa", label: "沖縄", x: 0, y: 9, w: 1, h: 1 },
];

// 移动端分组数据
const MOBILE_GROUPS: RegionGroup[] = [
  { region: "北海道・東北", ids: ["hokkaido", "aomori", "akita", "iwate", "yamagata", "miyagi", "fukushima"] },
  { region: "関東", ids: ["tokyo", "kanagawa", "chiba", "saitama", "ibaraki", "tochigi", "gunma"] },
  { region: "中部", ids: ["aichi", "shizuoka", "gifu", "mie", "yamanashi", "nagano", "niigata", "toyama", "ishikawa", "fukui"] },
  { region: "近畿", ids: ["osaka", "hyogo", "kyoto", "shiga", "nara", "wakayama"] },
  { region: "中国", ids: ["tottori", "shimane", "okayama", "hiroshima", "yamaguchi"] },
  { region: "四国", ids: ["tokushima", "kagawa", "ehime", "kochi"] },
  { region: "九州・沖縄", ids: ["fukuoka", "saga", "nagasaki", "kumamoto", "oita", "miyazaki", "kagoshima", "okinawa"] },
];

// 区域主题配色 (Tone-on-Tone Style)
const REGION_THEMES: Record<string, ThemeColor> = {
  "北海道・東北": { bg: "#89C3EB", text: "#1D4E72", shadow: "#5B92B6", dot: "#5B92B6" },
  "関東": { bg: "#D4A3CF", text: "#5D2A5D", shadow: "#A67CA1", dot: "#A67CA1" },
  "中部": { bg: "#93CA76", text: "#2B5219", shadow: "#6A9C50", dot: "#6A9C50" },
  "近畿": { bg: "#F0CFA0", text: "#754C24", shadow: "#C2A176", dot: "#C2A176" },
  "中国": { bg: "#F4D565", text: "#6B591B", shadow: "#C4A84D", dot: "#C4A84D" },
  "四国": { bg: "#FFB35C", text: "#664200", shadow: "#CC8F4A", dot: "#CC8F4A" },
  "九州・沖縄": { bg: "#75CCD1", text: "#1D666A", shadow: "#4DA1A6", dot: "#4DA1A6" },
};

// --- 3. Helper Functions (工具函数) ---

/**
 * 计算 Desktop 布局的百分比位置
 */
const getGridPositionStyle = (x: number, y: number, w: number, h: number): React.CSSProperties => {
  const GRID_COLS = 17;
  const GRID_ROWS = 10;
  const GAP_PERCENT = 0.3; // 积木间隙 %

  const unitX = 100 / GRID_COLS;
  const unitY = 100 / GRID_ROWS;

  return {
    left: `${x * unitX + GAP_PERCENT / 2}%`,
    top: `${y * unitY + GAP_PERCENT / 2}%`,
    width: `${w * unitX - GAP_PERCENT}%`,
    height: `${h * unitY - GAP_PERCENT}%`,
  };
};

/**
 * 获取区域的样式 Props (Style & ClassName)
 */
const getRegionStyleProps = (id: string, isMobile: boolean) => {
  // 1. 查找该县所属的区域
  const group = MOBILE_GROUPS.find((g) => g.ids.includes(id));

  // Fallback: 如果未找到配置，返回默认灰色
  if (!group) {
    return {
      style: {} as React.CSSProperties,
      className: "bg-gray-200 text-gray-400 cursor-not-allowed",
    };
  }

  const theme = REGION_THEMES[group.region];

  // 2. 注入 CSS 变量 (利用 CSS Variable 实现动态换色)
  const dynamicStyle = {
    "--r-bg": theme.bg,
    "--r-text": theme.text,
    "--r-shadow": theme.shadow,
  } as React.CSSProperties;

  // 3. 基础样式 (通用)
  const baseClassName = "transition-all duration-300 flex items-center justify-center";

  // 4. 状态样式 (区分端)
  const variantClassName = isMobile
    ? cn(
      // Mobile: 实心扁平风格，点击下沉
      "bg-[var(--r-bg)] text-[var(--r-text)]",
      "border-b-2 border-[var(--r-shadow)] shadow-[0_2px_0_var(--r-shadow)]",
      "active:translate-y-[2px] active:shadow-none active:border-b-0",
      "py-3 text-xs font-bold rounded-xl"
    )
    : cn(
      // Desktop: 半透明悬停风格，Hover 上浮
      "bg-[var(--r-bg)] text-[var(--r-text)] font-bold tracking-widest text-sm",
      "opacity-75 hover:opacity-100", // 默认半透明，Hover 高亮
      "border-b-2 border-transparent hover:border-[var(--r-shadow)]", // Hover 显示边框
      "hover:shadow-[0_2px_0_var(--r-shadow)]", // Hover 显示投影
      "hover:-translate-y-0.5", // Hover 上浮
      "rounded-md z-0 hover:z-10"
    );

  return {
    style: dynamicStyle,
    className: cn(baseClassName, variantClassName),
  };
};

// --- 4. Main Component (主组件) ---

const JapanMap = () => {
  // 使用 useMemo 缓存标签查找表，避免重复遍历 (虽然数据量小，但是好习惯)
  const labelMap = useMemo(() => {
    return PREF_DATA.reduce((acc, cur) => {
      acc[cur.id] = cur.label;
      return acc;
    }, {} as Record<string, string>);
  }, []);

  return (
    <div className="w-full">

      {/* -------------------------------------------
        Mobile View (List Layout)
        -------------------------------------------
      */}
      <div className="md:hidden flex flex-col gap-10">
        {MOBILE_GROUPS.map((group) => {
          const theme = REGION_THEMES[group.region];
          return (
            <div key={group.region}>
              {/* Region Header */}
              <h3 className="flex items-center gap-2 mb-4 pl-1">
                <div
                  className="w-2 h-2 rounded-full shadow-sm"
                  style={{ backgroundColor: theme.dot }}
                />
                <span className="text-sumo-dark font-serif font-bold tracking-widest text-sm">
                  {group.region}
                </span>
              </h3>

              {/* Prefectures Grid */}
              <div className="grid grid-cols-4 gap-2">
                {group.ids.map((id) => {
                  const { style, className } = getRegionStyleProps(id, true);

                  // 修复点: 显式使用 Link 组件包裹 Ceramic，避免 as 属性的类型推断问题
                  return (
                    <Link key={id} href={`/prefectures/${id}`} className="block">
                      <Ceramic
                        interactive={false} // 禁用 Ceramic 默认交互，完全由外层 CSS 控制
                        style={style}
                        className={className}
                      >
                        {labelMap[id] || id}
                      </Ceramic>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* -------------------------------------------
        Desktop View (Map Grid Layout)
        -------------------------------------------
      */}
      <div className="hidden md:block relative w-full max-w-[900px] aspect-[17/10] mx-auto select-none">
        {PREF_DATA.map((pref) => {
          const { style: themeStyle, className } = getRegionStyleProps(pref.id, false);
          const posStyle = getGridPositionStyle(pref.x, pref.y, pref.w, pref.h);

          return (
            <Link
              key={pref.id}
              href={`/prefectures/${pref.id}`}
              // 这里将 Link 设置为 absolute，让它直接充当定位容器
              style={posStyle}
              className="absolute block group"
            >
              <Ceramic
                interactive={false}
                style={themeStyle}
                // w-full h-full 让 Ceramic 填满 Link 容器
                className={cn("w-full h-full", className)}
              >
                {pref.label}
              </Ceramic>
            </Link>
          );
        })}

        {/* Decorative Legend (装饰性图例) */}
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