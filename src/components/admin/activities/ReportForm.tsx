"use client";

import React, { useState } from "react";
import {
    Save, Plus, Trash2, Image as ImageIcon,
    Type, AlignLeft, ArrowUp, ArrowDown
} from "lucide-react";
import { createActivityAction } from "@/lib/actions/activities";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Club {
    id: string;
    name: string;
}

interface Section {
    id: number;
    image: string;
    text: string;
}

export default function ReportForm({ clubs }: { clubs: Club[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // --- 动态段落状态管理 ---
    const [sections, setSections] = useState<Section[]>([
        { id: 0, image: "", text: "" } // 默认有一段
    ]);

    // 添加新段落
    const addSection = () => {
        setSections([...sections, { id: Date.now(), image: "", text: "" }]);
    };

    // 删除段落
    const removeSection = (id: number) => {
        if (sections.length === 1) return; // 至少保留一段
        setSections(sections.filter(s => s.id !== id));
    };

    // 更新段落内容
    const updateSection = (id: number, field: 'image' | 'text', value: string) => {
        setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    // 提交处理
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        // 把动态构建的 sections 转为 JSON 字符串放入 formData
        formData.set("contentData", JSON.stringify({ sections }));
        formData.set("templateType", "report"); // 标记为 Report 模板

        try {
            await createActivityAction(formData);
            // ✨ 注意：这里不要写任何跳转，因为 redirect 会在服务端处理
        } catch (error) {
            // 只有当 error 不是重定向相关的错误时，才弹窗
            if (!(error instanceof Error && error.message === 'NEXT_REDIRECT')) {
                alert("保存に失敗しました");
                setLoading(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
            {/* --- 左侧：内容编辑区 (8 cols) --- */}
            <div className="lg:col-span-8 space-y-6">

                {/* 1. 基本信息卡片 */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">タイトル</label>
                        <input
                            name="title"
                            required
                            placeholder="例：第15回 全国学生相撲選手権大会 報告"
                            className="w-full px-0 py-2 bg-transparent border-b border-gray-200 text-xl font-bold focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">リード文 (概要)</label>
                        <textarea
                            name="content" // 这里复用 content 字段存导语
                            rows={3}
                            placeholder="活動の全体像や、最も伝えたいメッセージをここに..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-blue-500/20 outline-none"
                        ></textarea>
                    </div>
                </div>

                {/* 2. 动态段落构建器 (积木区) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">レポート詳細 (Sections)</span>
                    </div>

                    {sections.map((section, index) => (
                        <div key={section.id} className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-all relative">
                            {/* 序号标记 */}
                            <div className="absolute -left-3 top-6 w-6 h-6 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-xs font-bold border border-white">
                                {index + 1}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 图片输入 */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <ImageIcon size={12} /> 画像パス
                                    </label>
                                    <input
                                        value={section.image}
                                        onChange={(e) => updateSection(section.id, 'image', e.target.value)}
                                        placeholder="/images/..."
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs font-mono focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    />
                                    {/* 图片预览占位 */}
                                    <div className="relative aspect-video bg-slate-50 rounded border border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                                        {section.image ? (
                                            <img src={section.image} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[10px] text-gray-300">No Image</span>
                                        )}
                                    </div>
                                </div>

                                {/* 文字输入 */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <AlignLeft size={12} /> 本文・キャプション
                                    </label>
                                    <textarea
                                        value={section.text}
                                        onChange={(e) => updateSection(section.id, 'text', e.target.value)}
                                        rows={6}
                                        placeholder="この写真の説明や、当時のエピソードを..."
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm leading-relaxed focus:ring-2 focus:ring-blue-500/20 outline-none resize-none h-full"
                                    ></textarea>
                                </div>
                            </div>

                            {/* 删除按钮 (仅当多于1个时显示) */}
                            {sections.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeSection(section.id)}
                                    className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}

                    {/* 添加按钮 */}
                    <button
                        type="button"
                        onClick={addSection}
                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold text-sm hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={18} /> セクションを追加 (Add Section)
                    </button>
                </div>
            </div>

            {/* --- 右侧：设置栏 (4 cols) --- */}
            <div className="lg:col-span-4 space-y-6">
                {/* 发布操作 */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-6">
                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                            {loading ? "保存中..." : (
                                <>
                                    <Save size={18} /> 記事を公開
                                </>
                            )}
                        </button>
                        <p className="text-xs text-center text-gray-400">
                            ※公開すると即座にWebサイトに反映されます。
                        </p>
                    </div>
                </div>

                {/* 所属与日期 */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">開催日</label>
                        <input type="date" name="date" required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono outline-none" />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">カテゴリ</label>
                        {/* 隐藏字段：因为这里是 Report 专用页面，所以直接固定为 Report */}
                        <input type="hidden" name="category" value="Report" />
                        <div className="w-full px-3 py-2 bg-blue-50 border border-blue-100 rounded text-sm font-bold text-blue-600 flex items-center gap-2">
                            <Type size={14} /> Report (活動報告)
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">所属クラブ</label>
                        <select name="clubId" required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-bold outline-none">
                            <option value="official-hq">SUMOME 事務局</option>
                            {clubs.map(club => (
                                <option key={club.id} value={club.id}>{club.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 封面图 */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">メイン画像 (表紙)</label>
                    <input
                        name="mainImage"
                        placeholder="/images/..."
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs font-mono mb-2"
                    />
                    <p className="text-[10px] text-gray-400">一覧ページやカードに表示される画像です。</p>
                </div>
            </div>
        </form>
    );
}