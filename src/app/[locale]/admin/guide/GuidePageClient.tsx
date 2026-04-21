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
    /** カード用アイコン容器の柔らかな単色背景（Tailwind v4 でも確実に描画される純色） */
    iconBg: string;
    /** アイコン自体の文字色 */
    iconText: string;
    /** ホバー時に浮かぶ柔らかなグローシャドウ */
    glow: string;
    /** ステップ番号バッジの背景 */
    stepBg: string;
    /** ステップ番号バッジの文字色 */
    stepText: string;
    /** ステップを繋ぐ縦線の色 */
    line: string;
    /** 詳細ヘッダーのソフト背景（from 色→白のグラデーション） */
    softBg: string;
    /** サブセクションの "STEP n" ピル背景（確実に描画される単色） */
    pillBg: string;
}

const ACCENT_MAP: Record<GuideAccent, AccentClasses> = {
    blue: {
        iconBg: "bg-blue-100",
        iconText: "text-blue-600",
        glow: "group-hover:shadow-blue-200/50",
        stepBg: "bg-blue-100",
        stepText: "text-blue-700",
        line: "bg-blue-200",
        softBg: "from-blue-50 to-white",
        pillBg: "bg-blue-600",
    },
    indigo: {
        iconBg: "bg-indigo-100",
        iconText: "text-indigo-600",
        glow: "group-hover:shadow-indigo-200/50",
        stepBg: "bg-indigo-100",
        stepText: "text-indigo-700",
        line: "bg-indigo-200",
        softBg: "from-indigo-50 to-white",
        pillBg: "bg-indigo-600",
    },
    violet: {
        iconBg: "bg-violet-100",
        iconText: "text-violet-600",
        glow: "group-hover:shadow-violet-200/50",
        stepBg: "bg-violet-100",
        stepText: "text-violet-700",
        line: "bg-violet-200",
        softBg: "from-violet-50 to-white",
        pillBg: "bg-violet-600",
    },
    amber: {
        iconBg: "bg-amber-100",
        iconText: "text-amber-700",
        glow: "group-hover:shadow-amber-200/50",
        stepBg: "bg-amber-100",
        stepText: "text-amber-700",
        line: "bg-amber-200",
        softBg: "from-amber-50 to-white",
        pillBg: "bg-amber-600",
    },
    rose: {
        iconBg: "bg-rose-100",
        iconText: "text-rose-600",
        glow: "group-hover:shadow-rose-200/50",
        stepBg: "bg-rose-100",
        stepText: "text-rose-700",
        line: "bg-rose-200",
        softBg: "from-rose-50 to-white",
        pillBg: "bg-rose-600",
    },
    emerald: {
        iconBg: "bg-emerald-100",
        iconText: "text-emerald-600",
        glow: "group-hover:shadow-emerald-200/50",
        stepBg: "bg-emerald-100",
        stepText: "text-emerald-700",
        line: "bg-emerald-200",
        softBg: "from-emerald-50 to-white",
        pillBg: "bg-emerald-600",
    },
    orange: {
        iconBg: "bg-orange-100",
        iconText: "text-orange-600",
        glow: "group-hover:shadow-orange-200/50",
        stepBg: "bg-orange-100",
        stepText: "text-orange-700",
        line: "bg-orange-200",
        softBg: "from-orange-50 to-white",
        pillBg: "bg-orange-600",
    },
    teal: {
        iconBg: "bg-teal-100",
        iconText: "text-teal-600",
        glow: "group-hover:shadow-teal-200/50",
        stepBg: "bg-teal-100",
        stepText: "text-teal-700",
        line: "bg-teal-200",
        softBg: "from-teal-50 to-white",
        pillBg: "bg-teal-600",
    },
    cyan: {
        iconBg: "bg-cyan-100",
        iconText: "text-cyan-600",
        glow: "group-hover:shadow-cyan-200/50",
        stepBg: "bg-cyan-100",
        stepText: "text-cyan-700",
        line: "bg-cyan-200",
        softBg: "from-cyan-50 to-white",
        pillBg: "bg-cyan-600",
    },
    purple: {
        iconBg: "bg-purple-100",
        iconText: "text-purple-600",
        glow: "group-hover:shadow-purple-200/50",
        stepBg: "bg-purple-100",
        stepText: "text-purple-700",
        line: "bg-purple-200",
        softBg: "from-purple-50 to-white",
        pillBg: "bg-purple-600",
    },
    pink: {
        iconBg: "bg-pink-100",
        iconText: "text-pink-600",
        glow: "group-hover:shadow-pink-200/50",
        stepBg: "bg-pink-100",
        stepText: "text-pink-700",
        line: "bg-pink-200",
        softBg: "from-pink-50 to-white",
        pillBg: "bg-pink-600",
    },
    slate: {
        iconBg: "bg-slate-100",
        iconText: "text-slate-600",
        glow: "group-hover:shadow-slate-200/50",
        stepBg: "bg-slate-100",
        stepText: "text-slate-700",
        line: "bg-slate-200",
        softBg: "from-slate-50 to-white",
        pillBg: "bg-slate-600",
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
                    className="bg-white rounded-xl shadow-sm p-1.5 flex gap-1.5 self-start"
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
            style={{ WebkitTapHighlightColor: "transparent" }}
            className={[
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold whitespace-nowrap appearance-none border-0",
                "transition-all duration-200 ease-in-out active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-sumo-brand/40",
                active
                    ? "bg-sumo-brand text-white shadow-sm hover:brightness-110"
                    : "bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700",
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <motion.div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
                hover: { y: -4 },
            }}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ WebkitTapHighlightColor: "transparent" }}
            className={[
                "group relative cursor-pointer select-none text-left bg-white rounded-xl p-6",
                "shadow-sm hover:shadow-xl",
                accent.glow,
                "transition-shadow duration-200 ease-in-out",
                "outline-none focus-visible:ring-2 focus-visible:ring-sumo-brand/40",
                "flex flex-col gap-4 min-h-[176px]",
            ].join(" ")}
        >
            <div className="flex items-start justify-between gap-4">
                <motion.div
                    variants={{
                        hover: {
                            scale: 1.1,
                            rotate: -6,
                            transition: {
                                type: "spring",
                                stiffness: 400,
                                damping: 12,
                            },
                        },
                    }}
                    className={[
                        "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                        accent.iconBg,
                        accent.iconText,
                        "shadow-sm",
                    ].join(" ")}
                    aria-hidden
                >
                    <Icon size={26} strokeWidth={2} />
                </motion.div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[11px] font-black tracking-wider">
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
                <motion.span
                    variants={{
                        hover: { x: 4 },
                    }}
                    className="inline-flex"
                    aria-hidden
                >
                    <ArrowRight size={14} />
                </motion.span>
            </div>
        </motion.div>
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
                style={{ WebkitTapHighlightColor: "transparent" }}
                className={[
                    "self-start inline-flex items-center gap-2 px-3 py-2 rounded-lg appearance-none border-0 bg-transparent",
                    "text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                    "transition-all duration-200 ease-in-out active:scale-[0.98]",
                    "outline-none focus-visible:ring-2 focus-visible:ring-sumo-brand/40",
                ].join(" ")}
            >
                <ArrowLeft size={16} />
                目次に戻る
            </button>

            {/* セクションヘッダー */}
            <section
                className={[
                    "rounded-xl shadow-sm overflow-hidden",
                    "bg-gradient-to-br",
                    accent.softBg,
                ].join(" ")}
            >
                <div className="p-6 md:p-8 flex items-start gap-4">
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 16,
                            delay: 0.05,
                        }}
                        whileHover={{
                            rotate: [0, -8, 8, -4, 0],
                            transition: { duration: 0.6, ease: "easeInOut" },
                        }}
                        className={[
                            "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 cursor-pointer",
                            accent.iconBg,
                            accent.iconText,
                            "shadow-md",
                        ].join(" ")}
                        aria-hidden
                    >
                        <Icon size={28} strokeWidth={2} />
                    </motion.div>
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
                        className="bg-white rounded-xl shadow-sm p-6 md:p-8 flex flex-col gap-6"
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className={[
                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
                                    accent.pillBg,
                                    "text-white text-[11px] font-black tracking-widest shadow-sm",
                                ].join(" ")}
                            >
                                STEP {idx + 1}
                            </span>
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
                    style={{ WebkitTapHighlightColor: "transparent" }}
                    className={[
                        "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold appearance-none border-0",
                        "bg-white text-gray-700 shadow-sm hover:shadow-md hover:text-sumo-brand",
                        "transition-all duration-200 ease-in-out active:scale-[0.98]",
                        "outline-none focus-visible:ring-2 focus-visible:ring-sumo-brand/40",
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
