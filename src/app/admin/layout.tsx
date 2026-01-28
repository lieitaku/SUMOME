import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "sonner";

/**
 * 后台管理布局组件
 * 作用：包含侧边栏、顶部导航、全局通知容器以及权限上下文
 */
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. 获取 Supabase 用户信息
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    // 2. 模拟角色（后续可根据数据库 user.role 扩展）
    const role = "ADMIN" as "ADMIN" | "OWNER";
    const userEmail = authUser?.email || "guest@sumo.com";

    return (
        <div className="min-h-screen bg-[#F4F5F7] font-sans text-gray-900 overflow-x-hidden">

            {/* --- 🚀 全局通知容器 (Sonner) --- */}
            {/* richColors: 开启鲜艳颜色模式（成功绿、错误红）
                position: 建议居中靠上，最符合操作习惯
                expand: 多个通知时自动展开
                duration: 提示停留时间 (3000ms)
                closeButton: 允许手动关闭
            */}
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

                {/* 桌面端顶部标题栏 */}
                <header className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-8 sticky top-0 z-40 shadow-sm/50">
                    <div className="text-xs text-gray-400 font-medium">
                        管理画面 / コンテンツ管理
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            target="_blank"
                            className="text-xs font-bold text-[#2454a4] hover:underline flex items-center gap-1"
                        >
                            View Live Site <ExternalLink size={12} />
                        </Link>
                    </div>
                </header>

                {/* 页面内容填充区 */}
                <main className="flex-1 px-6 py-8 pt-24 md:p-12 md:pt-12 w-full max-w-full">
                    {children}
                </main>

                {/* 底部版权栏 */}
                <footer className="py-6 px-4 md:px-12 border-t border-gray-200 text-center md:text-left bg-[#F4F5F7]">
                    <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                        © 2026 Sumo Club Management System. Powered by Next.js & Prisma.
                    </p>
                </footer>
            </div>
        </div>
    );
}