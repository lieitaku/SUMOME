"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    LayoutDashboard,
    Users,
    Star,
    Newspaper,
    BookText,
    Flag,
    Map,
    Inbox,
    MessageCircle,
    Building2,
    Settings,
    Shield,
    Store,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Lightbulb,
    type LucideIcon,
} from "lucide-react";
import type { GuideSection, GuideIconName, GuideAccent } from "./guideContent";
import { getSectionsForRole } from "./guideContent";

type Role = "ADMIN" | "OWNER";

interface GuidePageClientProps {
    /** 当前登录用户的角色，用于默认选中对应 Tab */
    userRole: Role;
}

// =============================================================================
// アイコン・カラーのマッピング
// =============================================================================
/**
 * lucide-react のアイコンを名前で参照できるようにマッピング。
 * guideContent.ts の GuideIconName と一致させること。
 */
const ICON_MAP: Record<GuideIconName, typeof Sparkles> = {
    Sparkles,
    LayoutDashboard,
    Users,
    Star,
    Newspaper,
    BookText,
    Flag,
    Map,
    Inbox,
    MessageCircle,
    Building2,
    Settings,
};

/**
 * カードのアクセントカラー（Tailwind の完全クラス文字列で管理）。
 * JIT が拾えるように動的補間ではなく完全文字列で書く。
 */
interface AccentClasses {
    /** アイコンのコンテナ背景 */
    iconBg: string;
    /** アイコンの文字色 */
    iconText: string;
    /** カードホバー時のリング */
    ring: string;
    /** ステップ番号バッジの背景 */
    stepBg: string;
    /** ステップ番号バッジの文字色 */
    stepText: string;
    /** ステップを繋ぐ縦線の色 */
    line: string;
    /** 詳細ヘッダーのソフト背景グラデーション */
    softBg: string;
}

const ACCENT_MAP: Record<GuideAccent, AccentClasses> = {
    blue: {
        iconBg: "bg-blue-100",
        iconText: "text-blue-600",
        ring: "group-hover:ring-blue-200",
        stepBg: "bg-blue-100",
        stepText: "text-blue-700",
        line: "bg-blue-200",
        softBg: "from-blue-50 to-white",
    },
    indigo: {
        iconBg: "bg-indigo-100",
        iconText: "text-indigo-600",
        ring: "group-hover:ring-indigo-200",
        stepBg: "bg-indigo-100",
        stepText: "text-indigo-700",
        line: "bg-indigo-200",
        softBg: "from-indigo-50 to-white",
    },
    violet: {
        iconBg: "bg-violet-100",
        iconText: "text-violet-600",
        ring: "group-hover:ring-violet-200",
        stepBg: "bg-violet-100",
        stepText: "text-violet-700",
        line: "bg-violet-200",
        softBg: "from-violet-50 to-white",
    },
    amber: {
        iconBg: "bg-amber-100",
        iconText: "text-amber-600",
        ring: "group-hover:ring-amber-200",
        stepBg: "bg-amber-100",
        stepText: "text-amber-700",
        line: "bg-amber-200",
        softBg: "from-amber-50 to-white",
    },
    rose: {
        iconBg: "bg-rose-100",
        iconText: "text-rose-600",
        ring: "group-hover:ring-rose-200",
        stepBg: "bg-rose-100",
        stepText: "text-rose-700",
        line: "bg-rose-200",
        softBg: "from-rose-50 to-white",
    },
    emerald: {
        iconBg: "bg-emerald-100",
        iconText: "text-emerald-600",
        ring: "group-hover:ring-emerald-200",
        stepBg: "bg-emerald-100",
        stepText: "text-emerald-700",
        line: "bg-emerald-200",
        softBg: "from-emerald-50 to-white",
    },
    orange: {
        iconBg: "bg-orange-100",
        iconText: "text-orange-600",
        ring: "group-hover:ring-orange-200",
        stepBg: "bg-orange-100",
        stepText: "text-orange-700",
        line: "bg-orange-200",
        softBg: "from-orange-50 to-white",
    },
    teal: {
        iconBg: "bg-teal-100",
        iconText: "text-teal-600",
        ring: "group-hover:ring-teal-200",
        stepBg: "bg-teal-100",
        stepText: "text-teal-700",
        line: "bg-teal-200",
        softBg: "from-teal-50 to-white",
    },
    cyan: {
        iconBg: "bg-cyan-100",
        iconText: "text-cyan-600",
        ring: "group-hover:ring-cyan-200",
        stepBg: "bg-cyan-100",
        stepText: "text-cyan-700",
        line: "bg-cyan-200",
        softBg: "from-cyan-50 to-white",
    },
    purple: {
        iconBg: "bg-purple-100",
        iconText: "text-purple-600",
        ring: "group-hover:ring-purple-200",
        stepBg: "bg-purple-100",
        stepText: "text-purple-700",
        line: "bg-purple-200",
        softBg: "from-purple-50 to-white",
    },
    pink: {
        iconBg: "bg-pink-100",
        iconText: "text-pink-600",
        ring: "group-hover:ring-pink-200",
        stepBg: "bg-pink-100",
        stepText: "text-pink-700",
        line: "bg-pink-200",
        softBg: "from-pink-50 to-white",
    },
    slate: {
        iconBg: "bg-slate-100",
        iconText: "text-slate-600",
        ring: "group-hover:ring-slate-200",
        stepBg: "bg-slate-100",
        stepText: "text-slate-700",
        line: "bg-slate-200",
        softBg: "from-slate-50 to-white",
    },
};

// =============================================================================
// メインコンポーネント
// =============================================================================
export default function GuidePageClient({ userRole }: GuidePageClientProps) {
    const [viewRole, setViewRole] = useState<Role>(userRole);
    const canSwitchRole = userRole === "ADMIN";
    const effectiveRole = canSwitchRole ? viewRole : "OWNER";
    const sections = useMemo(() => getSectionsForRole(effectiveRole), [effectiveRole]);

    /** 詳細表示中のセクション ID。null の場合はカードグリッド表示 */
    const [activeId, setActiveId] = useState<string | null>(null);
    const activeSection = useMemo(
        () => sections.find((s) => s.id === activeId) ?? null,
        [sections, activeId]
    );

    /** ロール切替時は詳細表示をリセット */
    const handleRoleChange = (next: Role) => {
        setActiveId(null);
        setViewRole(next);
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 font-sans flex flex-col gap-8">
            {/* ============== ヘッダー ============== */}
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-serif font-black text-gray-900 leading-tight">
                    操作ガイド
                </h1>
                <p className="text-sm text-gray-500 leading-relaxed">
                    管理画面の使い方を、役割別にまとめています。気になる項目のカードをクリックすると、ステップ手順が表示されます。
                </p>
            </header>

            {/* ============== ロール切替（管理者のみ） ============== */}
            {canSwitchRole && (
                <div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex gap-2"
                    role="tablist"
                    aria-label="役割の切り替え"
                >
                    <RoleTab
                        active={viewRole === "ADMIN"}
                        onClick={() => handleRoleChange("ADMIN")}
                        icon={Shield}
                        label="管理者向け"
                    />
                    <RoleTab
                        active={viewRole === "OWNER"}
                        onClick={() => handleRoleChange("OWNER")}
                        icon={Store}
                        label="クラブ代表向け"
                    />
                </div>
            )}

            {/* ============== グリッド / 詳細ビュー切替 ============== */}
            <AnimatePresence mode="wait" initial={false}>
                {activeSection ? (
                    <motion.div
                        key={`detail-${activeSection.id}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <DetailView
                            section={activeSection}
                            onBack={() => setActiveId(null)}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key={`grid-${effectiveRole}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <CardGrid sections={sections} onSelect={setActiveId} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// =============================================================================
// ロール切替タブ
// =============================================================================
function RoleTab({
    active,
    onClick,
    icon: Icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: LucideIcon;
    label: string;
}) {
    return (
        <button
            type="button"
            role="tab"
            aria-selected={active}
            onClick={onClick}
            className={[
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold",
                "transition-all duration-200 ease-in-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sumo-brand/40",
                active
                    ? "bg-sumo-brand text-white shadow-sm hover:brightness-110"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
            ].join(" ")}
        >
            <Icon size={18} />
            {label}
        </button>
    );
}

// =============================================================================
// カードグリッド
// =============================================================================
function CardGrid({
    sections,
    onSelect,
}: {
    sections: GuideSection[];
    onSelect: (id: string) => void;
}) {
    return (
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: { staggerChildren: 0.04 },
                },
            }}
        >
            {sections.map((section) => (
                <GuideCard key={section.id} section={section} onClick={() => onSelect(section.id)} />
            ))}
        </motion.div>
    );
}

function GuideCard({
    section,
    onClick,
}: {
    section: GuideSection;
    onClick: () => void;
}) {
    const Icon = ICON_MAP[section.icon];
    const accent = ACCENT_MAP[section.accent];
    const stepCount = section.subsections.reduce((sum, s) => sum + s.steps.length, 0);

    return (
        <motion.button
            type="button"
            onClick={onClick}
            variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={[
                "group text-left bg-white rounded-2xl border border-gray-100 p-6",
                "shadow-sm hover:shadow-md ring-1 ring-transparent",
                accent.ring,
                "transition-shadow duration-200 ease-in-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sumo-brand/40",
                "flex flex-col gap-4 min-h-[176px]",
            ].join(" ")}
        >
            <div className="flex items-start justify-between gap-4">
                <div
                    className={[
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                        accent.iconBg,
                        accent.iconText,
                        "transition-transform duration-200 ease-in-out group-hover:scale-110 group-hover:rotate-3",
                    ].join(" ")}
                    aria-hidden
                >
                    <Icon size={22} strokeWidth={2} />
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 text-gray-500 text-xs font-bold">
                    {stepCount} STEPS
                </span>
            </div>

            <div className="flex flex-col gap-1 grow">
                <h3 className="text-base font-bold text-gray-900 leading-snug">
                    {section.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    {section.description}
                </p>
            </div>

            <div className="flex items-center justify-end gap-1 text-xs font-bold text-gray-400 group-hover:text-sumo-brand transition-colors duration-200">
                <span>詳しく見る</span>
                <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                />
            </div>
        </motion.button>
    );
}

// =============================================================================
// 詳細ビュー
// =============================================================================
function DetailView({
    section,
    onBack,
}: {
    section: GuideSection;
    onBack: () => void;
}) {
    const Icon = ICON_MAP[section.icon];
    const accent = ACCENT_MAP[section.accent];

    return (
        <div className="flex flex-col gap-6">
            {/* 戻るボタン */}
            <button
                type="button"
                onClick={onBack}
                className={[
                    "self-start inline-flex items-center gap-2 px-3 py-2 rounded-lg",
                    "text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                    "transition-all duration-200 ease-in-out active:scale-[0.98]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sumo-brand/40",
                ].join(" ")}
            >
                <ArrowLeft size={16} />
                目次に戻る
            </button>

            {/* セクションヘッダー */}
            <section
                className={[
                    "rounded-2xl border border-gray-100 shadow-sm overflow-hidden",
                    "bg-gradient-to-br",
                    accent.softBg,
                ].join(" ")}
            >
                <div className="p-6 md:p-8 flex items-start gap-4">
                    <div
                        className={[
                            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                            accent.iconBg,
                            accent.iconText,
                            "shadow-sm",
                        ].join(" ")}
                        aria-hidden
                    >
                        <Icon size={28} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col gap-2 min-w-0">
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                            {section.title}
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {section.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* 各サブセクションのステップタイムライン */}
            <motion.div
                className="flex flex-col gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06 } },
                }}
            >
                {section.subsections.map((sub, idx) => (
                    <motion.div
                        key={sub.id}
                        variants={{
                            hidden: { opacity: 0, y: 12 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col gap-6"
                    >
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                            <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xs font-black">
                                {String(idx + 1).padStart(2, "0")}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 leading-snug">
                                {sub.title}
                            </h3>
                        </div>

                        <StepTimeline steps={sub.steps} accent={accent} />
                    </motion.div>
                ))}
            </motion.div>

            {/* フッター：戻るボタン（再掲） */}
            <div className="flex justify-center pt-4">
                <button
                    type="button"
                    onClick={onBack}
                    className={[
                        "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold",
                        "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
                        "transition-all duration-200 ease-in-out active:scale-[0.98]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sumo-brand/40",
                    ].join(" ")}
                >
                    <ArrowLeft size={16} />
                    他のガイドを見る
                </button>
            </div>
        </div>
    );
}

// =============================================================================
// ステップタイムライン
// =============================================================================
function StepTimeline({
    steps,
    accent,
}: {
    steps: string[];
    accent: AccentClasses;
}) {
    return (
        <ol className="flex flex-col gap-0">
            {steps.map((step, i) => {
                const isLast = i === steps.length - 1;
                const isHidden = step.startsWith("【隠れた操作】");
                const cleanStep = isHidden
                    ? step.replace("【隠れた操作】", "").trim()
                    : step;

                return (
                    <li key={i} className="flex gap-4 relative">
                        {/* 番号バッジ + 縦線 */}
                        <div className="flex flex-col items-center shrink-0">
                            <div
                                className={[
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black",
                                    accent.stepBg,
                                    accent.stepText,
                                    "ring-4 ring-white",
                                    "transition-transform duration-200 ease-in-out",
                                ].join(" ")}
                            >
                                {isLast ? (
                                    <CheckCircle2 size={16} strokeWidth={2.5} />
                                ) : (
                                    i + 1
                                )}
                            </div>
                            {!isLast && (
                                <div
                                    className={["w-0.5 grow min-h-4", accent.line].join(" ")}
                                    aria-hidden
                                />
                            )}
                        </div>

                        {/* ステップ本文 */}
                        <div className={["flex-1 min-w-0 flex flex-col gap-2", isLast ? "pb-0" : "pb-6"].join(" ")}>
                            {isHidden && (
                                <span className="inline-flex items-center gap-1 self-start px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-[11px] font-bold">
                                    <Lightbulb size={12} />
                                    隠れた操作
                                </span>
                            )}
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {cleanStep}
                            </p>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}
