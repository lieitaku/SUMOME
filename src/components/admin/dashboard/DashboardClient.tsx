"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Users,
    Newspaper,
    BookText,
    Flag,
    Inbox,
    MessageCircle,
    Building2,
    Star,
    Sparkles,
    ArrowRight,
    type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// =============================================================================
// アクセントカラー設計
// ガイドページ（GuidePageClient.tsx）と同じ方針で、JIT が確実に拾える
// 完全クラス文字列で管理する。
// =============================================================================
export type DashboardAccent =
    | "violet"
    | "rose"
    | "emerald"
    | "orange"
    | "cyan"
    | "purple"
    | "amber"
    | "blue"
    | "pink";

interface AccentClasses {
    /** アイコン容器の背景（淡い単色） */
    iconBg: string;
    /** アイコン自体の文字色 */
    iconText: string;
    /** ホバー時に浮かぶ柔らかなグローシャドウ */
    glow: string;
}

const ACCENT_MAP: Record<DashboardAccent, AccentClasses> = {
    violet: {
        iconBg: "bg-violet-100",
        iconText: "text-violet-600",
        glow: "group-hover:shadow-violet-200/50",
    },
    rose: {
        iconBg: "bg-rose-100",
        iconText: "text-rose-600",
        glow: "group-hover:shadow-rose-200/50",
    },
    emerald: {
        iconBg: "bg-emerald-100",
        iconText: "text-emerald-600",
        glow: "group-hover:shadow-emerald-200/50",
    },
    orange: {
        iconBg: "bg-orange-100",
        iconText: "text-orange-600",
        glow: "group-hover:shadow-orange-200/50",
    },
    cyan: {
        iconBg: "bg-cyan-100",
        iconText: "text-cyan-600",
        glow: "group-hover:shadow-cyan-200/50",
    },
    purple: {
        iconBg: "bg-purple-100",
        iconText: "text-purple-600",
        glow: "group-hover:shadow-purple-200/50",
    },
    amber: {
        iconBg: "bg-amber-100",
        iconText: "text-amber-700",
        glow: "group-hover:shadow-amber-200/50",
    },
    blue: {
        iconBg: "bg-blue-100",
        iconText: "text-blue-600",
        glow: "group-hover:shadow-blue-200/50",
    },
    pink: {
        iconBg: "bg-pink-100",
        iconText: "text-pink-600",
        glow: "group-hover:shadow-pink-200/50",
    },
};

// =============================================================================
// アイコン名マッピング
// page.tsx（サーバー側）から名前を渡し、クライアントで実体に変換する。
// =============================================================================
export type DashboardIconName =
    | "Users"
    | "Newspaper"
    | "BookText"
    | "Flag"
    | "Inbox"
    | "MessageCircle"
    | "Building2"
    | "Star"
    | "Sparkles";

const ICON_MAP: Record<DashboardIconName, LucideIcon> = {
    Users,
    Newspaper,
    BookText,
    Flag,
    Inbox,
    MessageCircle,
    Building2,
    Star,
    Sparkles,
};

// =============================================================================
// 統計カード
// ガイドページのカードと同じビジュアル言語（rounded-xl・shadow-sm→shadow-xl・
// アイコン容器・ホバー時のアクセントグロー・springアニメーション）に揃える。
// =============================================================================
export interface StatCardData {
    label: string;
    value: number;
    icon: DashboardIconName;
    accent: DashboardAccent;
    href: string;
    /** 未対応件数（右上赤バッジ） */
    pending?: number;
}

export function DashboardStatCards({ stats }: { stats: StatCardData[] }) {
    const t = useTranslations("Admin.dashboard");
    const unit = t("unitCount");

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.04 } },
            }}
        >
            {stats.map((stat, idx) => (
                <StatCard key={idx} stat={stat} unit={unit} viewLabel={t("view")} />
            ))}
        </motion.div>
    );
}

function StatCard({
    stat,
    unit,
    viewLabel,
}: {
    stat: StatCardData;
    unit: string;
    viewLabel: string;
}) {
    const Icon = ICON_MAP[stat.icon];
    const accent = ACCENT_MAP[stat.accent];

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
                hover: { y: -4 },
            }}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={[
                "group relative",
                "transition-shadow duration-200 ease-in-out",
                "rounded-xl bg-white shadow-sm hover:shadow-xl",
                accent.glow,
            ].join(" ")}
            style={{ WebkitTapHighlightColor: "transparent" }}
        >
            <Link
                href={stat.href}
                className={[
                    "relative flex flex-col gap-3 p-5 rounded-xl",
                    "outline-none focus-visible:ring-2 focus-visible:ring-sumo-brand/40",
                ].join(" ")}
            >
                {stat.pending !== undefined && stat.pending > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.15 }}
                        className="absolute -top-2 -right-2 min-w-[22px] h-[22px] flex items-center justify-center px-1.5 bg-red-500 text-white text-[10px] font-black rounded-full shadow-lg"
                        aria-hidden
                    >
                        {stat.pending}
                    </motion.span>
                )}

                <div className="flex items-center justify-between">
                    <motion.div
                        variants={{
                            hover: {
                                scale: 1.1,
                                rotate: -6,
                                transition: { type: "spring", stiffness: 400, damping: 12 },
                            },
                        }}
                        className={[
                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                            accent.iconBg,
                            accent.iconText,
                        ].join(" ")}
                        aria-hidden
                    >
                        <Icon size={22} strokeWidth={2} />
                    </motion.div>
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest group-hover:text-sumo-brand transition-colors duration-200">
                        {viewLabel}
                    </span>
                </div>

                <div className="flex flex-col gap-1">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                        {stat.label}
                    </h3>
                    <p className="text-2xl font-black text-gray-900 font-serif leading-none">
                        {stat.value}
                        {unit ? (
                            <span className="text-[10px] font-sans font-normal text-gray-300 ml-1">
                                {unit}
                            </span>
                        ) : null}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}

// =============================================================================
// クイックアクション
// 空欄だった CTA カードを置き換える、6 枚（ADMIN）/ 3 枚（OWNER）の
// "一番よく使う操作" への直接ショートカット。
// =============================================================================
export interface QuickActionItem {
    icon: DashboardIconName;
    accent: DashboardAccent;
    title: string;
    description: string;
    href: string;
    /** 右上に表示する未対応件数バッジ */
    pending?: number;
}

export function DashboardQuickActions({
    variant,
    pendingApps,
}: {
    variant: "admin" | "owner";
    /** OWNER 側で「入会申請に対応」カードに未対応件数バッジを表示する */
    pendingApps?: number;
}) {
    const t = useTranslations("Admin.dashboard");

    const items: QuickActionItem[] = variant === "admin"
        ? [
            {
                icon: "Users",
                accent: "violet",
                title: t("actionNewClub"),
                description: t("actionNewClubDesc"),
                href: "/admin/clubs/new",
            },
            {
                icon: "Newspaper",
                accent: "rose",
                title: t("actionNewActivity"),
                description: t("actionNewActivityDesc"),
                href: "/admin/activities/new",
            },
            {
                icon: "BookText",
                accent: "emerald",
                title: t("actionNewMagazine"),
                description: t("actionNewMagazineDesc"),
                href: "/admin/magazines/new",
            },
            {
                icon: "Flag",
                accent: "orange",
                title: t("actionManageBanners"),
                description: t("actionManageBannersDesc"),
                href: "/admin/banners",
            },
            {
                icon: "Star",
                accent: "amber",
                title: t("actionPickupClubs"),
                description: t("actionPickupClubsDesc"),
                href: "/admin/pickup-clubs",
            },
            {
                icon: "Sparkles",
                accent: "blue",
                title: t("actionGuide"),
                description: t("actionGuideDesc"),
                href: "/admin/guide",
            },
        ]
        : [
            {
                icon: "Building2",
                accent: "pink",
                title: t("actionEditClub"),
                description: t("actionEditClubDesc"),
                href: "/admin/my-club",
            },
            {
                icon: "Inbox",
                accent: "cyan",
                title: t("actionCheckApps"),
                description: t("actionCheckAppsDesc"),
                href: "/admin/applications",
                pending: pendingApps,
            },
            {
                icon: "Sparkles",
                accent: "blue",
                title: t("actionGuide"),
                description: t("actionGuideDesc"),
                href: "/admin/guide",
            },
        ];

    return (
        <section
            aria-labelledby="quick-actions-title"
            className="flex flex-col gap-5"
        >
            <header className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-sumo-brand" aria-hidden />
                    <h2
                        id="quick-actions-title"
                        className="text-lg font-bold text-gray-900"
                    >
                        {t("quickActionsTitle")}
                    </h2>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                    {t("quickActionsDesc")}
                </p>
            </header>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.05 } },
                }}
            >
                {items.map((item, idx) => (
                    <QuickActionCard
                        key={idx}
                        item={item}
                        openLabel={t("actionOpen")}
                    />
                ))}
            </motion.div>
        </section>
    );
}

function QuickActionCard({
    item,
    openLabel,
}: {
    item: QuickActionItem;
    openLabel: string;
}) {
    const Icon = ICON_MAP[item.icon];
    const accent = ACCENT_MAP[item.accent];

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
                hover: { y: -3 },
            }}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={[
                "group relative rounded-xl bg-white",
                "shadow-sm hover:shadow-xl",
                accent.glow,
                "transition-shadow duration-200 ease-in-out",
            ].join(" ")}
            style={{ WebkitTapHighlightColor: "transparent" }}
        >
            <Link
                href={item.href}
                className={[
                    "relative flex items-start gap-4 p-5 rounded-xl",
                    "outline-none focus-visible:ring-2 focus-visible:ring-sumo-brand/40",
                ].join(" ")}
            >
                {item.pending !== undefined && item.pending > 0 && (
                    <span
                        className="absolute -top-2 -right-2 min-w-[22px] h-[22px] flex items-center justify-center px-1.5 bg-red-500 text-white text-[10px] font-black rounded-full shadow-lg"
                        aria-hidden
                    >
                        {item.pending}
                    </span>
                )}

                <motion.div
                    variants={{
                        hover: {
                            scale: 1.1,
                            rotate: -6,
                            transition: { type: "spring", stiffness: 400, damping: 12 },
                        },
                    }}
                    className={[
                        "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                        accent.iconBg,
                        accent.iconText,
                    ].join(" ")}
                    aria-hidden
                >
                    <Icon size={20} strokeWidth={2} />
                </motion.div>

                <div className="flex flex-col gap-1 min-w-0 grow">
                    <h3 className="text-sm font-bold text-gray-900 leading-snug">
                        {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {item.description}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-gray-400 group-hover:text-sumo-brand transition-colors duration-200">
                        <span>{openLabel}</span>
                        <motion.span
                            variants={{ hover: { x: 4 } }}
                            className="inline-flex"
                            aria-hidden
                        >
                            <ArrowRight size={12} />
                        </motion.span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
