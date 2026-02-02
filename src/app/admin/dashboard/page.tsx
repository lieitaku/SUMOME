import React from "react";
import { prisma } from "@/lib/db";
import { Users, Calendar, BookOpen, Flag, UserPlus, LayoutDashboard } from "lucide-react";
import Link from "@/components/ui/TransitionLink";

export default async function AdminDashboardPage() {
    // 1. ✨ 并行查询数据库中的数量（加入 Application 统计）
    const [clubsCount, activitiesCount, magazinesCount, bannersCount, appsCount] = await Promise.all([
        prisma.club.count(),
        prisma.activity.count(),
        prisma.magazine.count(),
        prisma.banner.count(),
        prisma.application.count(), // 获取申请总数
    ]);

    // 定义统计卡片数据
    const stats = [
        {
            label: "登録クラブ数",
            value: clubsCount - 1, // 排除官方总部
            icon: <Users className="w-6 h-6 text-blue-600" />,
            bg: "bg-blue-50",
            link: "/admin/clubs"
        },
        {
            label: "活動・ニュース",
            value: activitiesCount,
            icon: <Calendar className="w-6 h-6 text-purple-600" />,
            bg: "bg-purple-50",
            link: "/admin/activities"
        },
        {
            label: "広報誌データ",
            value: magazinesCount,
            icon: <BookOpen className="w-6 h-6 text-amber-600" />,
            bg: "bg-amber-50",
            link: "/admin/magazines"
        },
        {
            label: "バナー広告",
            value: bannersCount,
            icon: <Flag className="w-6 h-6 text-emerald-600" />,
            bg: "bg-emerald-50",
            link: "/admin/banners"
        },
        {
            label: "入会・体験申請",
            value: appsCount,
            icon: <UserPlus className="w-6 h-6 text-rose-600" />, // 使用醒目的玫瑰色
            bg: "bg-rose-50",
            link: "/admin/applications"
        },
    ];

    return (
        <div>
            {/* 欢迎语 */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
                <p className="text-gray-500 mt-2">
                    SUMOME CMSへようこそ。現在のサイト運営状況の概要です。
                </p>
            </div>

            {/* 核心指标卡片 - 使用 grid-cols-5 在大屏下展示 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
                {stats.map((stat, index) => (
                    <Link
                        key={index}
                        href={stat.link}
                        className="group block p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                {stat.icon}
                            </div>
                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest group-hover:text-sumo-brand transition-colors">
                                View
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-tight">{stat.label}</h3>
                            <p className="text-3xl font-black text-gray-900 font-serif">
                                {stat.value}
                                <span className="text-xs font-sans font-normal text-gray-300 ml-1">件</span>
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* 快速操作指引 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
                <div className="w-16 h-16 bg-blue-50 text-sumo-brand rounded-full flex items-center justify-center mx-auto mb-6">
                    <LayoutDashboard size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">管理業務を開始しましょう</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                    左側のメニューから各項目を管理できます。<br />
                    入会希望者のメッセージ確認や、最新の活動報告の投稿を行ってください。
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link
                        href="/admin/clubs/new"
                        className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl text-white bg-sumo-brand hover:bg-sumo-dark shadow-lg shadow-blue-900/10 transition-all"
                    >
                        <Users className="w-4 h-4 mr-2" />
                        新規クラブを登録
                    </Link>
                    <Link
                        href="/admin/applications"
                        className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl text-sumo-brand bg-blue-50 hover:bg-blue-100 transition-all"
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        申請メッセージを確認
                    </Link>
                </div>
            </div>
        </div>
    );
}