import React from "react";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "sonner";

/**
 * 后台管理布局组件
 * 作用：包含侧边栏、全局通知容器以及权限上下文
 * 性能：优先从 middleware 注入的 x-user-email 读取，避免同一次请求内重复调用 Supabase（正式环境 RTT 高）
 */
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. 优先使用 middleware 已注入的邮箱（同请求内 middleware 已调过 getUser，避免再调一次 Supabase）
    const headersList = await headers();
    const emailFromHeader = headersList.get("x-user-email");
    let userEmail = emailFromHeader ?? null;
    if (userEmail === null) {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        userEmail = authUser?.email ?? "guest@sumo.com";
    }

    // 2. 模拟角色（后续可根据数据库 user.role 扩展）
    const role = "ADMIN" as "ADMIN" | "OWNER";

    return (
        <div className="min-h-screen bg-[#F4F5F7] font-sans text-gray-900 overflow-x-hidden">

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

                {/* 页面内容填充区 */}
                <main className="flex-1 px-6 py-8 pt-24 md:p-12 md:pt-8 w-full max-w-full">
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