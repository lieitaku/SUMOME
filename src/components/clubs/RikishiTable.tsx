"use client";

import React, { useState } from "react";
import { User, ChevronDown, ChevronUp, Medal } from "lucide-react";
import Ceramic from "@/components/ui/Ceramic"; // ✨ 引入通用陶瓷组件
import { cn } from "@/lib/utils";

// --- 类型定义 ---
export type Rikishi = {
  name: string;
  stable: string;
  rank: string;
  start: string;
  end?: string;
  active: boolean;
};

type RikishiTableProps = {
  rikishiList: Rikishi[];
  prefectureName: string;
};

const RikishiTable = ({ rikishiList, prefectureName }: RikishiTableProps) => {
  // --- 状态管理 ---
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_COUNT = 10;

  // 计算显示列表
  const visibleList = isExpanded
    ? rikishiList
    : rikishiList.slice(0, INITIAL_COUNT);
  const showExpandButton = rikishiList.length > INITIAL_COUNT;

  return (
    <div className="w-full bg-white">
      {/* ==================== 1. 表头 (Header) ==================== */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-20">
        <h3 className="font-serif font-bold text-lg text-sumo-dark flex items-center gap-3">
          <div className="w-1.5 h-6 bg-sumo-brand rounded-full"></div>
          <span>【{prefectureName}】出身力士一覧</span>
        </h3>
        <span className="px-3 py-1 bg-sumo-brand/5 text-sumo-brand text-xs font-bold rounded-full border border-sumo-brand/10">
          {rikishiList.length}名
        </span>
      </div>

      {/* ==================== 2. 内容区域 ==================== */}
      {rikishiList.length > 0 ? (
        <div className="p-0">
          {/* === A. 电脑端表格 (Desktop Table) === */}
          <table className="hidden md:table w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50/95 sticky top-[60px] z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 font-bold tracking-widest border-b border-gray-200">
                  四股名
                </th>
                <th className="px-6 py-4 font-bold tracking-widest border-b border-gray-200">
                  部屋
                </th>
                <th className="px-6 py-4 font-bold tracking-widest border-b border-gray-200 text-sumo-brand">
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
                    "group transition-colors duration-200 hover:bg-sumo-brand/[0.02]",
                    // 使用 border 控制行分割，最后一行去边框以避免与 Footer 边框重叠
                    "border-b border-gray-100 last:border-0",
                    rikishi.active ? "bg-green-50/20" : "",
                  )}
                >
                  <td className="px-6 py-4 font-serif font-bold text-gray-800 text-base group-hover:text-sumo-brand transition-colors flex items-center gap-3">
                    {rikishi.active && (
                      <span
                        className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                        title="現役"
                      ></span>
                    )}
                    {rikishi.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {rikishi.stable}
                  </td>
                  <td className="px-6 py-4 font-bold text-sumo-brand flex items-center gap-2">
                    <Medal size={14} className="opacity-20" />
                    {rikishi.rank}
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs tracking-wide">
                    {rikishi.start}
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs tracking-wide">
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

          {/* === B. 手机端列表 (Mobile List) === */}
          <div className="block md:hidden flex flex-col gap-3 p-4 bg-gray-50/50">
            {visibleList.map((rikishi, idx) => (
              // ✨ 使用 Ceramic 组件替换原生 div
              <Ceramic
                key={idx}
                interactive={true} // 开启触摸回弹效果
                className={cn(
                  "p-5", // 内部间距
                  rikishi.active
                    ? // 如果是现役：左侧绿边 (border-l-green-500) 且 底部绿边 (border-b-green-500)
                      "border-l-4 border-l-green-500 border-b-green-500"
                    : // 否则：左侧透明边，底部保持默认灰色陶瓷边
                      "border-l border-l-transparent",
                )}
              >
                {/* 卡片头部：四股名 & 排名 */}
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
                    <span className="text-sm font-black text-sumo-brand bg-sumo-brand/5 px-2 py-1 rounded">
                      {rikishi.rank}
                    </span>
                  </div>
                </div>

                {/* 分割虚线 */}
                <div className="w-full h-px bg-gray-100 mb-3 border-t border-dashed border-gray-200"></div>

                {/* 卡片底部：时间信息 */}
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
                "border-t border-gray-100", // 确保物理分割线
              )}
            >
              {/* 收起时的白色渐变遮罩 */}
              {!isExpanded && (
                <div className="absolute -top-24 left-0 w-full h-24 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none"></div>
              )}

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  "group inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold tracking-widest transition-all duration-300",
                  "bg-gray-100 text-gray-500 hover:bg-sumo-brand hover:text-white hover:shadow-lg hover:-translate-y-0.5",
                )}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp size={14} /> CLOSE LIST
                  </>
                ) : (
                  <>
                    <ChevronDown
                      size={14}
                      className="group-hover:animate-bounce"
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
        // 空状态
        <div className="p-12 text-center text-gray-400 text-sm font-medium">
          No data available.
        </div>
      )}
    </div>
  );
};

export default RikishiTable;
