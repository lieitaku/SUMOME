import React from "react";
import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import { Toaster } from "sonner";
import { getCurrentUser } from "@/lib/auth-utils";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

/**
 * 后台管理布局组件
 * 作用：包含侧边栏、全局通知容器；按 DB 中的 user.role 区分管理员(ADMIN)与代表者(OWNER)
 * 性能：getTranslations 与 getCurrentUser 并行；邮箱以 session 为准（middleware 已拦未登录）
 */
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [t, user] = await Promise.all([getTranslations("Admin"), getCurrentUser()]);
    const userEmail = user?.email ?? "";
    const role = user?.role ?? "OWNER";

    return (
        <div className="min-h-screen bg-[#F4F5F7] font-sans text-gray-900">

            {/* --- 🚀 全局通知容器 (Sonner) --- */}
            <Toaster
                richColors
                position="top-center"
                expand={false}
                duration={3000}
                closeButton
            />

            {/* --- 侧边栏 (固定在左侧) --- */}
            <AdminSidebar role={role} email={userEmail} />

            {/* --- 右侧主内容区域 --- */}
            <div className="flex flex-col min-h-screen transition-all duration-300 md:pl-64">

                {/* 页面内容填充区：OWNER は管理者専用ルートにアクセスすると /admin へリダイレクト */}
                <main className="flex-1 px-6 py-8 pt-24 md:p-12 md:pt-8 w-full max-w-full">
                    <AdminRouteGuard role={role}>
                        {children}
                    </AdminRouteGuard>
                </main>

                {/* 底部版权栏 */}
                <footer className="py-6 px-4 md:px-12 border-t border-gray-200 text-center md:text-left bg-[#F4F5F7]">
                    <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                        {t("footer")}
                    </p>
                </footer>
            </div>
        </div>
    );
}