"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Medal } from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import { cn } from "@/lib/utils";

// ==============================================================================
// 1. 类型定义 (Type Definitions)
// ==============================================================================

export type Rikishi = {
  name: string; // 四股名
  stable: string; // 所属部屋
  rank: string; // 最高位
  start: string; // 初土俵时间
  end?: string; // 引退时间 (可选)
  active: boolean; // 是否现役
};

type RikishiTableProps = {
  rikishiList: Rikishi[]; // 力士数据列表
  prefectureName: string; // 县名 (用于表头显示)
  accentColor?: string; // ✨ 主题色 (用于动态配色)
};

// ==============================================================================
// 2. 组件实现 (Component Implementation)
// ==============================================================================

const RikishiTable = ({
  rikishiList,
  prefectureName,
  accentColor = "#2454a4", // 默认值：相扑蓝
}: RikishiTableProps) => {
  // --- 状态管理 ---
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_COUNT = 10; // 默认显示前 10 条

  // 计算当前显示的列表数据
  const visibleList = isExpanded
    ? rikishiList
    : rikishiList.slice(0, INITIAL_COUNT);

  // 是否显示“展开更多”按钮
  const showExpandButton = rikishiList.length > INITIAL_COUNT;

  return (
    <div className="w-full bg-white">
      {/* ==================== 1. 表头区域 (Header) ==================== */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-20">
        {/* ✨ 标题部分：颜色跟随主题 */}
        <h3
          className="font-serif font-bold text-lg flex items-center gap-3"
          style={{ color: accentColor }} // 应用主题色到文字
        >
          {/* 左侧装饰条 */}
          <div
            className="w-1.5 h-6 rounded-full"
            style={{ backgroundColor: accentColor }}
          ></div>
          {/* 标题文本 */}
          <span>【{prefectureName}】出身力士一覧</span>
        </h3>

        {/* ✨ 计数徽章：背景色淡化，边框和文字用实色 */}
        <span
          className="px-3 py-1 text-xs font-bold rounded-full border"
          style={{
            backgroundColor: `${accentColor}0D`, // 5% opacity
            color: accentColor,
            borderColor: `${accentColor}1A`, // 10% opacity
          }}
        >
          {rikishiList.length}名
        </span>
      </div>

      {/* ==================== 2. 数据展示区域 ==================== */}
      {rikishiList.length > 0 ? (
        <div className="p-0">
          {/* === A. 电脑端表格 (Desktop View) === */}
          <table className="hidden md:table w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50/95 sticky top-[60px] z-10 backdrop-blur-md">
              <tr>
                {/* ✨ 表头列名：应用主题色 */}
                <th
                  className="px-6 py-4 font-bold tracking-widest border-b border-gray-200"
                  style={{ color: accentColor }}
                >
                  四股名
                </th>
                <th className="px-6 py-4 font-bold tracking-widest border-b border-gray-200">
                  部屋
                </th>
                <th
                  className="px-6 py-4 font-bold tracking-widest border-b border-gray-200"
                  style={{ color: accentColor }}
                >
                  最高位
                </th>
                <th className="px-6 py-4 font-bold tracking-widest border-b border-gray-200">
                  初土俵
                </th>
                <th className="px-6 py-4 font-bold tracking-widest border-b border-gray-200">
                  引退
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleList.map((rikishi, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    "group transition-colors duration-200",
                    // 只有非现役行才显示分割线，现役行有特殊背景
                    "border-b border-gray-100 last:border-0",
                    rikishi.active ? "bg-green-50/20" : "",
                  )}
                  // ✨ 动态 CSS 变量：Hover 时的背景色
                  style={
                    {
                      "--hover-bg": `${accentColor}08`, // 3% opacity
                    } as React.CSSProperties
                  }
                >
                  {/* 四股名列 */}
                  <td className="px-6 py-4 font-serif font-bold text-gray-800 text-base transition-colors flex items-center gap-3 group-hover:bg-[var(--hover-bg)]">
                    <span
                      className="group-hover:text-[var(--hover-text)] transition-colors"
                      style={
                        {
                          "--hover-text": accentColor,
                        } as React.CSSProperties
                      }
                    >
                      {rikishi.name}
                    </span>
                    {/* 现役绿点标识 */}
                    {rikishi.active && (
                      <span
                        className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                        title="現役"
                      ></span>
                    )}
                  </td>

                  {/* 部屋列 */}
                  <td className="px-6 py-4 text-gray-500 font-medium group-hover:bg-[var(--hover-bg)]">
                    {rikishi.stable}
                  </td>

                  {/* 最高位列：应用主题色 */}
                  <td
                    className="px-6 py-4 font-bold flex items-center gap-2 group-hover:bg-[var(--hover-bg)]"
                    style={{ color: accentColor }}
                  >
                    <Medal size={14} className="opacity-20" />
                    {rikishi.rank}
                  </td>

                  {/* 初土俵列 */}
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs tracking-wide group-hover:bg-[var(--hover-bg)]">
                    {rikishi.start}
                  </td>

                  {/* 引退/现役列 */}
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs tracking-wide group-hover:bg-[var(--hover-bg)]">
                    {rikishi.end || (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-green-100 text-green-700 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* === B. 手机端列表 (Mobile View) === */}
          <div className="block md:hidden flex flex-col gap-3 p-4 bg-gray-50/50">
            {visibleList.map((rikishi, idx) => (
              <Ceramic
                key={idx}
                interactive={true}
                className={cn(
                  "p-5",
                  rikishi.active
                    ? "border-l-4 border-l-green-500 border-b-green-500"
                    : "border-l border-l-transparent",
                )}
              >
                {/* 上半部分：名字与排名 */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="text-lg font-serif font-black text-gray-800 flex items-center gap-2">
                      {rikishi.name}
                      {rikishi.active && (
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      )}
                    </span>
                    <span className="text-xs text-gray-400 mt-1 font-medium tracking-wide">
                      {rikishi.stable}部屋
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] text-gray-300 font-bold tracking-widest uppercase mb-0.5">
                      Highest Rank
                    </span>
                    {/* ✨ 排名标签：手机端也要跟随主题色 */}
                    <span
                      className="text-sm font-black px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${accentColor}0D`,
                        color: accentColor,
                      }}
                    >
                      {rikishi.rank}
                    </span>
                  </div>
                </div>

                {/* 分割线 */}
                <div className="w-full h-px bg-gray-100 mb-3 border-t border-dashed border-gray-200"></div>

                {/* 下半部分：时间数据 */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                      Debut
                    </span>
                    <span className="font-mono text-gray-600 font-medium">
                      {rikishi.start}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                      Retire
                    </span>
                    <span
                      className={cn(
                        "font-mono font-medium",
                        rikishi.active ? "text-green-600" : "text-gray-600",
                      )}
                    >
                      {rikishi.end || "ACTIVE"}
                    </span>
                  </div>
                </div>
              </Ceramic>
            ))}
          </div>

          {/* === C. 底部展开按钮 (Footer) === */}
          {showExpandButton && (
            <div
              className={cn(
                "relative z-20 p-6 bg-white text-center",
                "border-t border-gray-100",
              )}
            >
              {/* 收起时的渐变遮罩 */}
              {!isExpanded && (
                <div className="absolute -top-24 left-0 w-full h-24 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none"></div>
              )}

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  "group inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold tracking-widest",
                  // ✨ 优化点 1: 更高级的过渡设定
                  // duration-200 更轻快，ease-out 让结束时更顺滑
                  "transition-all duration-200 ease-out",

                  // 默认状态：浅灰背景，灰色文字
                  "bg-gray-100 text-gray-500",

                  // Hover状态 (保持不变)：背景变白，文字变主题色，上浮，加阴影
                  "hover:bg-white hover:text-[var(--hover-text)] hover:shadow-md hover:-translate-y-0.5",

                  // ✨ 优化点 2: 新的 Active (点击) 状态
                  // - 移除之前的 scale-95
                  // - translate-y-0 & shadow-none: 按下时复位，取消悬浮感
                  // - bg-[var(--active-bg)]: 按下时背景变成极淡的主题色色调
                  "active:translate-y-0 active:shadow-none active:bg-[var(--active-bg)]",
                )}
                // 使用 CSS 变量注入颜色
                style={
                  {
                    "--hover-text": accentColor,
                    // ✨ 优化点 3: 计算点击时的背景色
                    // 使用 color-mix 将主题色与大量白色混合，生成极淡的色调 (8% 主题色 + 92% 白色)
                    "--active-bg": `color-mix(in srgb, ${accentColor} 8%, white 92%)`,
                  } as React.CSSProperties
                }
              >
                {isExpanded ? (
                  <>
                    <ChevronUp size={14} /> CLOSE LIST
                  </>
                ) : (
                  <>
                    <ChevronDown
                      size={14}
                      // Hover 时箭头的小动画也可以保留
                      className="transition-transform group-hover:translate-y-0.5"
                    />
                    VIEW ALL ({rikishiList.length})
                  </>
                )}
              </button>
            </div>
          )}

          {/* 数据来源注脚 */}
          <div className="bg-gray-50 px-6 py-3 text-right text-[10px] text-gray-400 border-t border-gray-200">
            Source: Sumo Reference
          </div>
        </div>
      ) : (
        // 空状态提示
        <div className="p-12 text-center text-gray-400 text-sm font-medium">
          No data available.
        </div>
      )}
    </div>
  );
};

export default RikishiTable;
