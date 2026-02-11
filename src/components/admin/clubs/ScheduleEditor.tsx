"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Plus, X, Clock } from "lucide-react";

/**
 * 定义日程项的数据结构
 */
type ScheduleItem = {
    day: string;  // 星期几 (例: "月曜日")
    time: string; // 时间段 (例: "18:00 - 20:00")
};

// 预设的星期选项（按顺序）
const DAYS = [
    "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日", "祝日", "不定期"
];

// 星期排序优先级
const DAY_ORDER: Record<string, number> = {
    "月曜日": 0, "火曜日": 1, "水曜日": 2, "木曜日": 3,
    "金曜日": 4, "土曜日": 5, "日曜日": 6, "祝日": 7, "不定期": 8
};

/**
 * 从时间字符串中提取开始时间用于排序
 * 例如 "18:00 - 20:00" -> 1800, "9:30-11:00" -> 930
 */
function extractStartTime(timeStr: string): number {
    // 匹配开头的时间格式 (支持 HH:MM 或 H:MM)
    const match = timeStr.match(/^(\d{1,2}):(\d{2})/);
    if (match) {
        return parseInt(match[1]) * 100 + parseInt(match[2]);
    }
    return 9999; // 无法解析时排到最后
}

/**
 * 排序函数：按周一到周日顺序，同一天按时间从早到晚
 */
function sortScheduleItems(items: ScheduleItem[]): ScheduleItem[] {
    return [...items].sort((a, b) => {
        const dayOrderA = DAY_ORDER[a.day] ?? 99;
        const dayOrderB = DAY_ORDER[b.day] ?? 99;

        if (dayOrderA !== dayOrderB) {
            return dayOrderA - dayOrderB;
        }

        // 同一天，按时间排序
        return extractStartTime(a.time) - extractStartTime(b.time);
    });
}

/**
 * Props 定义
 * value: 也就是数据库里存的 JSON 字符串
 * onChange: 当数据变化时，回调给父组件（React Hook Form）
 */
interface ScheduleEditorProps {
    value: string;
    onChange: (val: string) => void;
}

export default function ScheduleEditor({ value, onChange }: ScheduleEditorProps) {
    // 使用 ref 存储 onChange 防止无限循环
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // 1. 初始化状态：尝试解析传入的 JSON 字符串
    const [items, setItems] = useState<ScheduleItem[]>(() => {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? sortScheduleItems(parsed) : [];
        } catch {
            return [];
        }
    });

    // 临时输入状态（新增用）
    const [currentDay, setCurrentDay] = useState(DAYS[0]);
    const [currentTime, setCurrentTime] = useState("");

    // 更新 items 并自动排序
    const updateItems = useCallback((newItems: ScheduleItem[]) => {
        const sorted = sortScheduleItems(newItems);
        setItems(sorted);
        onChangeRef.current(JSON.stringify(sorted));
    }, []);

    // 同步外部 value 变化（首次加载时）
    useEffect(() => {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                const sorted = sortScheduleItems(parsed);
                const currentJson = JSON.stringify(items);
                const newJson = JSON.stringify(sorted);
                if (currentJson !== newJson) {
                    setItems(sorted);
                }
            }
        } catch {
            // 忽略解析错误
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 添加条目
    const addItem = () => {
        if (!currentTime.trim()) return;
        updateItems([...items, { day: currentDay, time: currentTime }]);
        setCurrentTime("");
    };

    // 删除条目
    const removeItem = (index: number) => {
        updateItems(items.filter((_, i) => i !== index));
    };

    // 编辑条目的星期
    const updateItemDay = (index: number, newDay: string) => {
        const newItems = items.map((item, i) =>
            i === index ? { ...item, day: newDay } : item
        );
        updateItems(newItems);
    };

    // 编辑条目的时间
    const updateItemTime = (index: number, newTime: string) => {
        const newItems = items.map((item, i) =>
            i === index ? { ...item, time: newTime } : item
        );
        updateItems(newItems);
    };

    return (
        <div className="space-y-3">
            {/* --- A. 输入区域（新增用） --- */}
            <div className="flex gap-2 items-center">
                {/* 星期选择 */}
                <div className="relative">
                    <select
                        className="appearance-none px-3 py-2.5 pr-8 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-sumo-brand outline-none bg-white cursor-pointer font-bold text-gray-700"
                        value={currentDay}
                        onChange={(e) => setCurrentDay(e.target.value)}
                    >
                        {DAYS.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>

                {/* 时间输入 */}
                <div className="relative flex-grow">
                    <input
                        type="text"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-sumo-brand outline-none transition-all placeholder:text-gray-300"
                        placeholder="例: 18:00 - 20:00"
                        value={currentTime}
                        onChange={(e) => setCurrentTime(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addItem();
                            }
                        }}
                    />
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                {/* 添加按钮 */}
                <button
                    type="button"
                    onClick={addItem}
                    disabled={!currentTime.trim()}
                    className="bg-gray-900 text-white p-2.5 rounded-xl hover:bg-sumo-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    title="追加"
                >
                    <Plus size={18} />
                </button>
            </div>

            {/* --- B. 列表展示区域（可编辑） --- */}
            <div className="space-y-2">
                {items.length === 0 && (
                    <p className="text-xs text-gray-400 py-2 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50">
                        スケジュールが登録されていません。
                    </p>
                )}

                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-100 text-sm shadow-sm group hover:border-gray-300 transition-colors"
                    >
                        {/* 星期选择（可编辑） */}
                        <select
                            value={item.day}
                            onChange={(e) => updateItemDay(idx, e.target.value)}
                            className="appearance-none px-2 py-1.5 pr-6 rounded-lg border border-gray-200 text-xs font-bold bg-gray-50 cursor-pointer focus:ring-2 focus:ring-sumo-brand outline-none min-w-[80px]"
                        >
                            {DAYS.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>

                        {/* 时间输入（可编辑） */}
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                value={item.time}
                                onChange={(e) => updateItemTime(idx, e.target.value)}
                                className="w-full pl-7 pr-2 py-1.5 rounded-lg border border-gray-200 text-sm font-mono font-bold text-gray-700 focus:ring-2 focus:ring-sumo-brand outline-none bg-gray-50"
                            />
                            <Clock size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        {/* 删除按钮 */}
                        <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-gray-300 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-all shrink-0"
                            title="削除"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {/* 提示文字 */}
            {items.length > 0 && (
                <p className="text-[10px] text-gray-400 text-left whitespace-pre-line">
                    {`※ 自動で曜日順・時間順に並び替えられます
                    ※ 開始時間しかない場合は「HH:MM」の形式で入力してください。
                    ※ 例: 18:00 - 20:00 or 18:00`}
                </p>
            )}
        </div>
    );
}