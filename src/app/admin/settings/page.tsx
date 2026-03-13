import React from "react";
import { UserPlus, Shield, Lock, User, Zap, Trash2 } from "lucide-react";
import { createStaffAccount, updateMyProfile, updatePassword } from "@/lib/actions/users";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

import { ProfileForm, PasswordForm, CreateStaffForm, DeleteAccountForm } from "./components";

// ==============================================================================
// 🟢 Server Component: 页面入口
// ==============================================================================
export default async function SettingsPage() {
    // 1. 获取当前登录用户和数据库里的角色信息 (并行执行)
    const supabase = await createClient();
    
    // 我们先获取 session，然后并行请求 user详情
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) redirect("/login");

    const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, email: true, name: true }
    });

    if (!dbUser) redirect("/login");

    const isAdmin = dbUser.role === "ADMIN";

    let deleteCanDelete = true;
    let deleteBlockReason: string | undefined;
    if (dbUser.role === "ADMIN") {
        const [adminCount, activityCount] = await Promise.all([
            prisma.user.count({ where: { role: "ADMIN" } }),
            prisma.activity.count({ where: { authorId: session.user.id } }),
        ]);
        if (adminCount <= 1) {
            deleteCanDelete = false;
            deleteBlockReason = "最後の管理者のため削除できません。";
        } else if (activityCount > 0) {
            deleteCanDelete = false;
            deleteBlockReason =
                "投稿した活動・ニュースがあるため削除できません。別の管理者に譲渡するか、該当コンテンツを削除してください。";
        }
    }

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

                    {/* 3. アカウント削除（全员） */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                <Trash2 size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">アカウント削除</h2>
                                <p className="text-xs text-gray-400">
                                    {isAdmin
                                        ? "管理者アカウントを削除します。最後の管理者の場合は削除できません。"
                                        : "クラブとアカウントを削除し、登録を解除します。削除後は同じメールで再登録可能です。"}
                                </p>
                            </div>
                        </div>
                        <DeleteAccountForm
                            role={dbUser.role}
                            canDelete={deleteCanDelete}
                            blockReason={deleteBlockReason}
                        />
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
                    ) : null}
                </div>
            </div>
        </div>
    );
}