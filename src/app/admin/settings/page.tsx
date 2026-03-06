import React from "react";
import { UserPlus, Shield, Lock, User, Save, Store, HelpCircle, Mail, Zap } from "lucide-react";
import { toast } from "sonner"; // 假设你是用 Sonner，如果是客户端组件里用
import { createStaffAccount, updateMyProfile, updatePassword } from "@/lib/actions/users";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

// 这里引入客户端组件 (Form 需要是 'use client')
import { ProfileForm, PasswordForm, CreateStaffForm } from "./components"; // 下面我会把组件代码给你，建议拆分，或者像之前一样放在同一个文件底部

// ==============================================================================
// 🟢 Server Component: 页面入口
// ==============================================================================
export default async function SettingsPage() {
    // 1. 获取当前登录用户
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) redirect("/login");

    // 2. 获取数据库里的角色信息
    const dbUser = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: { role: true, email: true, name: true }
    });

    if (!dbUser) redirect("/login");

    const isAdmin = dbUser.role === "ADMIN";

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">

            {/* 页面标题区 */}
            <div>
                <h1 className="text-3xl font-serif font-black text-gray-900">
                    {isAdmin ? "システム設定" : "アカウント設定"}
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                    {isAdmin
                        ? "管理者アカウントとシステム全体の設定を管理します。"
                        : "あなたのアカウント情報とセキュリティ設定を管理します。"
                    }
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* --- 左侧：通用设置 (Profile & Security) --- */}
                {/* 无论是 Admin 还是 Owner 都要用 */}
                <div className="space-y-8">
                    {/* 1. 个人资料卡片 */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <User size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">マイプロフィール</h2>
                                <p className="text-xs text-gray-400">表示名と基本情報</p>
                            </div>
                        </div>
                        {/* 传入当前数据作为默认值 */}
                        <ProfileForm initialName={dbUser.name || ""} />
                    </div>

                    {/* 2. 安全设置卡片 */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">セキュリティ</h2>
                                <p className="text-xs text-gray-400">パスワードの変更</p>
                            </div>
                        </div>
                        <PasswordForm />
                    </div>
                </div>

                {/* --- 右侧：根据角色不同显示不同内容 --- */}
                <div className="space-y-8">

                    {isAdmin ? (
                        <div className="space-y-8">
                            {/* ================== ADMIN 专属视图 ================== */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                    <div className="p-2 bg-sumo-brand/10 text-sumo-brand rounded-lg">
                                        <UserPlus size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">チームメンバー追加</h2>
                                        <p className="text-xs text-gray-400">新しい管理者を招待・作成します</p>
                                    </div>
                                </div>

                                <div className="bg-sumo-brand/5 p-4 rounded-xl flex items-start gap-3 border border-sumo-brand/10 mb-6">
                                    <Shield size={16} className="text-sumo-brand mt-0.5 shrink-0" />
                                    <p className="text-[11px] text-sumo-brand leading-relaxed font-bold">
                                        作成されたアカウントは「特権管理者」権限を持ちます。<br />
                                        慎重に操作してください。
                                    </p>
                                </div>

                                <CreateStaffForm />
                            </div>

                            {/* 3. 系统性能优化 (Admin 专属) */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">システムパフォーマンス</h2>
                                    <p className="text-xs text-gray-400">画像の最適化とメンテナンス</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                                過去にアップロードされた古い形式の画像（JPG/PNG）を、読み込みの速い WebP 形式に一括変換します。
                            </p>
                                <Link
                                    href="/admin/settings/migration"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-gray-800 transition-colors"
                                >
                                    画像フォーマット遷移ツール
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* ================== OWNER 专属视图 ================== */
                        /* Owner 不需要加人，给他们显示帮助信息或俱乐部快捷方式 */
                        <div className="space-y-8">
                            {/* 帮助卡片 */}
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-lg text-white">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-white/10 rounded-lg text-white">
                                        <HelpCircle size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold">サポートセンター</h2>
                                </div>
                                <p className="text-sm text-white/70 leading-relaxed mb-6">
                                    システムの操作方法や、掲載内容の修正依頼についてご不明な点がございましたら、本部事務局までお問い合わせください。
                                </p>
                                <a
                                    href="mailto:support@sumo-cms.com"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-white text-gray-900 rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors"
                                >
                                    <Mail size={16} /> 事務局へ問い合わせる
                                </a>
                            </div>

                            {/* 俱乐部信息提示 */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <Store size={20} className="text-sumo-brand" />
                                    <h3 className="font-bold text-gray-900">クラブ情報の編集</h3>
                                </div>
                                <p className="text-xs text-gray-500 mb-6">
                                    ご自身の道場・クラブの情報を更新する場合は、左側メニューの「My Club」から編集画面へ移動してください。
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}