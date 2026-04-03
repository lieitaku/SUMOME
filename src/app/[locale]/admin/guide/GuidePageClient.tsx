"use client";

import React, { useState, useMemo } from "react";
import { BookOpen, Shield, Store, List } from "lucide-react";
import type { GuideSection } from "./guideContent";
import { getSectionsForRole } from "./guideContent";

type Role = "ADMIN" | "OWNER";

interface GuidePageClientProps {
    /** 当前登录用户的角色，用于默认选中对应 Tab */
    userRole: Role;
}

export default function GuidePageClient({ userRole }: GuidePageClientProps) {
    const [viewRole, setViewRole] = useState<Role>(userRole);
    const canSwitchRole = userRole === "ADMIN";
    const effectiveRole = canSwitchRole ? viewRole : "OWNER";
    const sections = useMemo(() => getSectionsForRole(effectiveRole), [effectiveRole]);

    const scrollToId = (id: string) => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20 font-sans">
            <div>
                <h1 className="text-3xl font-serif font-black text-gray-900">操作ガイド</h1>
                <p className="text-sm text-gray-500 mt-2">
                    管理画面の使い方を、役割別にまとめています。目次から該当項目を選んで確認してください。
                </p>
            </div>

            {canSwitchRole && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-2 flex gap-1">
                    <button
                        type="button"
                        onClick={() => setViewRole("ADMIN")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                            viewRole === "ADMIN"
                                ? "bg-sumo-brand text-white shadow-sm"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        }`}
                    >
                        <Shield size={18} />
                        管理者向け
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewRole("OWNER")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                            viewRole === "OWNER"
                                ? "bg-sumo-brand text-white shadow-sm"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        }`}
                    >
                        <Store size={18} />
                        クラブ代表向け
                    </button>
                </div>
            )}

            {/* 目次在文档流内，左侧固定宽度；sticky 吸顶，正文始终在右侧不会被挡 */}
            <div className="flex flex-col lg:flex-row gap-8 overflow-visible">
                <aside
                    className="lg:w-56 shrink-0 lg:self-start lg:sticky lg:top-12"
                    aria-label="目次"
                >
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                            <List size={18} className="text-sumo-brand" />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">目次</span>
                        </div>
                        <nav className="space-y-0.5">
                            {sections.map((section) => (
                                <div key={section.id}>
                                    <button
                                        type="button"
                                        onClick={() => scrollToId(section.id)}
                                        className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-sumo-brand/10 hover:text-sumo-brand transition-colors"
                                    >
                                        {section.title}
                                    </button>
                                    {section.subsections.length > 0 && (
                                        <div className="ml-3 pl-2 border-l border-gray-100 space-y-0.5">
                                            {section.subsections.map((sub) => (
                                                <button
                                                    key={sub.id}
                                                    type="button"
                                                    onClick={() => scrollToId(sub.id)}
                                                    className="w-full text-left py-1.5 px-2 rounded text-xs text-gray-500 hover:text-sumo-brand hover:bg-sumo-brand/5 transition-colors"
                                                >
                                                    {sub.title}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>
                </aside>

                <div className="flex-1 min-w-0 space-y-8">
                    {sections.map((section) => (
                        <SectionBlock key={section.id} section={section} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function SectionBlock({ section }: { section: GuideSection }) {
    return (
        <section
            id={section.id}
            className="scroll-mt-24 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
            <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-sumo-brand/10 text-sumo-brand rounded-xl">
                        <BookOpen size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {section.title}
                    </h2>
                </div>
            </div>
            <div className="p-6 md:p-8 space-y-8">
                {section.subsections.map((sub) => (
                    <div key={sub.id} id={sub.id} className="scroll-mt-24">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">
                            {sub.title}
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                            {sub.steps.map((step, i) => (
                                <li key={i} className="pl-1">
                                    {step}
                                </li>
                            ))}
                        </ol>
                    </div>
                ))}
            </div>
        </section>
    );
}
