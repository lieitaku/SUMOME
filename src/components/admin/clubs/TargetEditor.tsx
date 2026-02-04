"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";

// 最大标签数量
const MAX_TARGETS = 4;

// 预设选项
const PRESET_TARGETS = [
    "園児",
    "小学生",
    "中学生",
    "高校生",
    "大学生",
    "社会人",
    "シニア",
    "女性",
    "初心者歓迎",
    "経験者優遇",
];

interface TargetEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function TargetEditor({ value, onChange }: TargetEditorProps) {
    // 将逗号分隔的字符串转为数组
    const parseTargets = (str: string): string[] => {
        if (!str || str.trim() === "") return [];
        return str.split(",").map((t) => t.trim()).filter(Boolean);
    };

    const [targets, setTargets] = useState<string[]>(() => parseTargets(value));
    const [customInput, setCustomInput] = useState("");
    const [showPresets, setShowPresets] = useState(false);

    // 使用 ref 来存储 onChange，避免依赖变化导致无限循环
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // 更新 targets 并同步到父组件
    const updateTargets = (newTargets: string[]) => {
        setTargets(newTargets);
        onChangeRef.current(newTargets.join(", "));
    };

    // 当外部 value 变化时同步（仅在初始化或外部重置时）
    const prevValueRef = useRef(value);
    useEffect(() => {
        if (prevValueRef.current !== value) {
            prevValueRef.current = value;
            setTargets(parseTargets(value));
        }
    }, [value]);

    // 添加 target
    const addTarget = (tag: string) => {
        if (targets.length >= MAX_TARGETS) return;
        if (targets.includes(tag)) return;
        updateTargets([...targets, tag]);
        setShowPresets(false);
    };

    // 删除 target
    const removeTarget = (index: number) => {
        updateTargets(targets.filter((_, i) => i !== index));
    };

    // 添加自定义
    const addCustomTarget = () => {
        const trimmed = customInput.trim();
        if (!trimmed) return;
        if (targets.length >= MAX_TARGETS) return;
        if (targets.includes(trimmed)) return;
        updateTargets([...targets, trimmed]);
        setCustomInput("");
    };

    // 过滤已选择的预设
    const availablePresets = PRESET_TARGETS.filter((p) => !targets.includes(p));

    return (
        <div className="space-y-3">
            {/* 已选择的 Tags */}
            <div className="flex flex-wrap gap-2 min-h-[36px]">
                {targets.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sumo-brand/10 text-sumo-brand rounded-full text-sm font-bold"
                    >
                        <Users size={12} />
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTarget(index)}
                            className="ml-1 hover:bg-sumo-brand/20 rounded-full p-0.5 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}

                {/* 添加按钮 (未满时显示) */}
                {targets.length < MAX_TARGETS && (
                    <button
                        type="button"
                        onClick={() => setShowPresets(!showPresets)}
                        className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-dashed rounded-full text-sm font-bold transition-colors",
                            showPresets
                                ? "border-sumo-brand text-sumo-brand bg-blue-50"
                                : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500"
                        )}
                    >
                        <Plus size={14} />
                        追加 ({targets.length}/{MAX_TARGETS})
                    </button>
                )}
            </div>

            {/* 预设选项 + 自定义输入 */}
            {showPresets && targets.length < MAX_TARGETS && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* 预设选项 */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                            プリセットから選択
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availablePresets.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => addTarget(preset)}
                                    className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:border-sumo-brand hover:text-sumo-brand transition-colors"
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 自定义输入 */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                            またはカスタム入力
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addCustomTarget();
                                    }
                                }}
                                placeholder="例: 親子参加OK"
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-sumo-brand focus:border-transparent outline-none"
                            />
                            <button
                                type="button"
                                onClick={addCustomTarget}
                                disabled={!customInput.trim()}
                                className="px-4 py-2 bg-sumo-brand text-white rounded-lg text-xs font-bold hover:bg-sumo-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                追加
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 提示 */}
            <p className="text-[10px] text-gray-400">
                募集対象を最大{MAX_TARGETS}つまで設定できます。クラブカードにタグとして表示されます。
            </p>
        </div>
    );
}
