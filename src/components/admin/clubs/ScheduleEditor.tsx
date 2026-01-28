"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, Clock } from "lucide-react";

/**
 * 定义日程项的数据结构
 */
type ScheduleItem = {
    day: string;  // 星期几 (例: "月曜日")
    time: string; // 时间段 (例: "18:00 - 20:00")
};

// 预设的星期选项
const DAYS = [
    "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日", "祝日", "不定期"
];

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
    // 1. 初始化状态：尝试解析传入的 JSON 字符串
    // 如果解析失败（比如是旧数据的纯文本），则初始化为空数组，保证不报错
    const [items, setItems] = useState<ScheduleItem[]>(() => {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });

    // 临时输入状态
    const [currentDay, setCurrentDay] = useState(DAYS[0]);
    const [currentTime, setCurrentTime] = useState("");

    // 2. 数据同步：当 items 数组变化时，序列化为 JSON 字符串并通知父组件
    useEffect(() => {
        // 只有当 items 确实变化时才调用 onChange，防止死循环
        const jsonString = JSON.stringify(items);
        // 这里做一个简单的对比，避免不必要的重渲染（可选）
        if (jsonString !== value) {
            onChange(jsonString);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    // 添加条目
    const addItem = () => {
        if (!currentTime.trim()) return; // 防止添加空时间
        setItems([...items, { day: currentDay, time: currentTime }]);
        setCurrentTime(""); // 清空输入框，方便下一次输入
    };

    // 删除条目
    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            {/* --- A. 输入区域 --- */}
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
                    {/* 自定义下拉箭头 (可选) */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>

                {/* 时间输入 */}
                <div className="relative flex-grow">
                    <input
                        type="text"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-sumo-brand outline-none transition-all placeholder:text-gray-300"
                        placeholder="例: 18:00 〜 20:00"
                        value={currentTime}
                        onChange={(e) => setCurrentTime(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault(); // 防止触发表单提交
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

            {/* --- B. 列表展示区域 --- */}
            <div className="space-y-2">
                {items.length === 0 && (
                    <p className="text-xs text-gray-400 py-2 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50">
                        スケジュールが登録されていません。
                    </p>
                )}

                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between bg-white px-3 py-2.5 rounded-lg border border-gray-100 text-sm shadow-sm group hover:border-gray-300 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            {/* 星期标签 */}
                            <span className="font-bold text-white bg-gray-400 px-2 py-0.5 rounded text-[10px] shadow-sm tracking-wide">
                                {item.day}
                            </span>
                            {/* 时间文本 */}
                            <span className="font-mono text-gray-700 font-bold tracking-tight">
                                {item.time}
                            </span>
                        </div>

                        {/* 删除按钮 */}
                        <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-gray-300 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-all"
                            title="削除"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}