import React from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth-utils";
import { getTranslations } from "next-intl/server";
import {
    DashboardStatCards,
    DashboardQuickActions,
    type StatCardData,
} from "@/components/admin/dashboard/DashboardClient";

async function getDashboardStatsUncached() {
    return Promise.all([
        prisma.club.count(),
        prisma.activity.count(),
        prisma.magazine.count(),
        prisma.banner.count(),
        prisma.application.count(),
        prisma.application.count({ where: { status: "pending" } }),
        prisma.inquiry.count(),
        prisma.inquiry.count({ where: { status: "unread" } }),
    ]);
}

const getCachedDashboardStats = () =>
    unstable_cache(getDashboardStatsUncached, ["admin-dashboard-stats"], {
        revalidate: 60,
        tags: ["admin-stats"],
    })();

export default async function AdminDashboardPage() {
    const user = await getCurrentUser();
    const isAdmin = user?.role === "ADMIN";

    if (isAdmin) {
        return <AdminDashboard />;
    }
    return <OwnerDashboard />;
}

async function AdminDashboard() {
    const t = await getTranslations("Admin");
    const [
        clubsCount,
        activitiesCount,
        magazinesCount,
        bannersCount,
        appsCount,
        pendingAppsCount,
        inquiriesCount,
        unreadInquiriesCount,
    ] = await getCachedDashboardStats();

    const stats: StatCardData[] = [
        {
            label: t("dashboard.statClubs"),
            value: Math.max(0, clubsCount - 1),
            icon: "Users",
            accent: "violet",
            href: "/admin/clubs",
        },
        {
            label: t("dashboard.statActivities"),
            value: activitiesCount,
            icon: "Newspaper",
            accent: "rose",
            href: "/admin/activities",
        },
        {
            label: t("dashboard.statMagazines"),
            value: magazinesCount,
            icon: "BookText",
            accent: "emerald",
            href: "/admin/magazines",
        },
        {
            label: t("dashboard.statBanners"),
            value: bannersCount,
            icon: "Flag",
            accent: "orange",
            href: "/admin/banners",
        },
        {
            label: t("dashboard.statApplications"),
            value: appsCount,
            icon: "Inbox",
            accent: "cyan",
            href: "/admin/applications",
            pending: pendingAppsCount,
        },
        {
            label: t("dashboard.statInquiries"),
            value: inquiriesCount,
            icon: "MessageCircle",
            accent: "purple",
            href: "/admin/inquiries",
            pending: unreadInquiriesCount,
        },
    ];

    const totalPending = pendingAppsCount + unreadInquiriesCount;

    return (
        <div className="max-w-6xl mx-auto font-sans flex flex-col gap-8 pb-20">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-900">
                    {t("dashboard.title")}
                </h1>
                <p className="text-gray-500">{t("dashboard.welcomeAdmin")}</p>
            </header>

            {totalPending > 0 && (
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-amber-900">
                                    {t("dashboard.pendingTasks")}
                                </h3>
                                <p className="text-sm text-amber-700">
                                    {pendingAppsCount > 0 && (
                                        <span>
                                            {t("dashboard.pendingApps", {
                                                count: pendingAppsCount,
                                            })}
                                        </span>
                                    )}
                                    {pendingAppsCount > 0 && unreadInquiriesCount > 0 && " / "}
                                    {unreadInquiriesCount > 0 && (
                                        <span>
                                            {t("dashboard.pendingInquiries", {
                                                count: unreadInquiriesCount,
                                            })}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            {pendingAppsCount > 0 && (
                                <Link
                                    href="/admin/applications"
                                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                                >
                                    {t("dashboard.checkApps")}
                                    <ArrowRight size={12} />
                                </Link>
                            )}
                            {unreadInquiriesCount > 0 && (
                                <Link
                                    href="/admin/inquiries"
                                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                                >
                                    {t("dashboard.checkInquiries")}
                                    <ArrowRight size={12} />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <DashboardStatCards stats={stats} />

            <DashboardQuickActions variant="admin" />
        </div>
    );
}

async function OwnerDashboard() {
    const t = await getTranslations("Admin");
    const user = await getCurrentUser();
    if (!user) return null;

    const myClubs = await prisma.club.findMany({
        where: { ownerId: user.id },
        select: { id: true, name: true },
    });
    const clubIds = myClubs.map((c) => c.id);

    const [appsCount, pendingAppsCount] = await Promise.all([
        prisma.application.count({ where: { clubId: { in: clubIds } } }),
        prisma.application.count({
            where: { clubId: { in: clubIds }, status: "pending" },
        }),
    ]);

    const stats: StatCardData[] = [
        {
            label: t("dashboard.statClubInfo"),
            value: myClubs.length,
            icon: "Building2",
            accent: "pink",
            href: "/admin/my-club",
        },
        {
            label: t("dashboard.statApplications"),
            value: appsCount,
            icon: "Inbox",
            accent: "cyan",
            href: "/admin/applications",
            pending: pendingAppsCount,
        },
    ];

    return (
        <div className="max-w-6xl mx-auto font-sans flex flex-col gap-8 pb-20">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-900">
                    {t("dashboard.title")}
                </h1>
                <p className="text-gray-500">{t("dashboard.welcomeOwner")}</p>
            </header>

            {pendingAppsCount > 0 && (
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-amber-900">
                                    {t("dashboard.pendingAppsOwner")}
                                </h3>
                                <p className="text-sm text-amber-700 font-black">
                                    {t("dashboard.pendingAppsOwnerLine", {
                                        count: pendingAppsCount,
                                    })}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/admin/applications"
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                        >
                            {t("dashboard.checkApps")}
                            <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            )}

            <DashboardStatCards stats={stats} />

            <DashboardQuickActions variant="owner" pendingApps={pendingAppsCount} />
        </div>
    );
}
