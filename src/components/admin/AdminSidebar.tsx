"use client";

import React, { useState, useTransition } from "react";
import Link from "@/components/ui/TransitionLink";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Users, Calendar, BookOpen, Flag, LogOut, MapPin, Settings, Store, Menu, X, UserPlus, Loader2
} from "lucide-react";

// 引入刚才修复好的 Server Action
import { signOut } from "@/lib/actions/auth";
import { toast } from "sonner";

// ==============================================================================
// 类型定义
// ==============================================================================

interface AdminSidebarProps {
    /** 当前用户的角色权限 */
    role: "ADMIN" | "OWNER";
    /** 当前用户的邮箱地址 */
    email: string;
}

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    activePath: string;
    onClick: () => void;
}

interface SectionLabelProps {
    label: string;
}

// ==============================================================================
// 主组件：管理后台侧边栏
// ==============================================================================
export default function AdminSidebar({ role, email }: AdminSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition(); // 用于处理登出加载状态
    const pathname = usePathname();

    // 切换移动端菜单显示状态
    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    // 处理登出逻辑
    const handleSignOut = () => {
        startTransition(async () => {
            try {
                await signOut();
            } catch (error) {
                console.error("Logout failed:", error);
                toast.error("ログアウトに失敗しました"); // 可选
            }
        });
    };

    return (
        <>
            {/* -------------------------------------------------------------------------- */}
            {/* 1. 移动端头部导航栏 (Mobile Header) */}
            {/* -------------------------------------------------------------------------- */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-sumo-brand text-white z-50 flex items-center justify-between px-6 shadow-md">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-sumo-brand">
                        <MapPin size={14} />
                    </div>
                    <span className="font-serif font-bold text-lg tracking-widest">SUMO CMS</span>
                </div>
                <button onClick={toggleMenu} className="-mr-2 p-2 hover:bg-white/10 rounded-md transition-colors">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* 移动端遮罩层 (Mobile Overlay) */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={closeMenu} />
            )}

            {/* -------------------------------------------------------------------------- */}
            {/* 2. 侧边栏主容器 (Sidebar Container) */}
            {/* -------------------------------------------------------------------------- */}
            <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-sumo-brand text-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:fixed md:inset-y-0`}>

                {/* 品牌标识区域 (Logo Area) */}
                <div className="p-8 border-b border-white/10 mt-14 md:mt-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sumo-brand">
                            <MapPin size={18} />
                        </div>
                        <span className="font-serif font-black text-xl tracking-widest">SUMO CMS</span>
                    </div>
                    <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] pl-11">
                        {role === "ADMIN" ? "Official Admin" : "Club Manager"}
                    </p>
                </div>

                {/* 导航菜单列表 (Navigation List) */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">

                    {/* 通用区域 */}
                    <SectionLabel label="Overview" />
                    <NavItem href="/admin" icon={<LayoutDashboard size={18} />} label="ダッシュボード" activePath={pathname} onClick={closeMenu} />

                    {/* 管理员专属菜单 */}
                    {role === "ADMIN" && (
                        <>
                            <SectionLabel label="Content Management" />
                            <NavItem href="/admin/clubs" icon={<Users size={18} />} label="クラブ管理" activePath={pathname} onClick={closeMenu} />
                            <NavItem href="/admin/activities" icon={<Calendar size={18} />} label="活動・ニュース" activePath={pathname} onClick={closeMenu} />
                            <NavItem href="/admin/magazines" icon={<BookOpen size={18} />} label="広報誌データ" activePath={pathname} onClick={closeMenu} />
                            <NavItem href="/admin/banners" icon={<Flag size={18} />} label="バナー広告" activePath={pathname} onClick={closeMenu} />
                            <NavItem href="/admin/applications" icon={<UserPlus size={18} />} label="入会申請管理" activePath={pathname} onClick={closeMenu} />
                        </>
                    )}

                    {/* 俱乐部代表专属菜单 */}
                    {role === "OWNER" && (
                        <>
                            <SectionLabel label="My Club" />
                            <NavItem href="/admin/my-club" icon={<Store size={18} />} label="クラブ情報編集" activePath={pathname} onClick={closeMenu} />
                        </>
                    )}

                    {/* 系统设置 */}
                    {role === "ADMIN" && (
                        <>
                            <SectionLabel label="System" />
                            <NavItem href="/admin/settings" icon={<Settings size={18} />} label="設定" activePath={pathname} onClick={closeMenu} />
                        </>
                    )}
                </nav>

                {/* 底部用户信息与登出区域 (Footer User Area) */}
                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className={`w-8 h-8 rounded-full border-2 border-white/20 ${role === 'ADMIN' ? 'bg-gradient-to-tr from-yellow-400 to-orange-500' : 'bg-gradient-to-tr from-blue-400 to-cyan-500'}`}></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{role === "ADMIN" ? "管理者" : "代表者"}</p>
                            <p className="text-xs text-white/50 truncate">{email}</p>
                        </div>
                    </div>

                    {/* 登出按钮 (已集成 Server Action) */}
                    <button
                        onClick={handleSignOut}
                        disabled={isPending}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 text-xs font-bold text-white/80 hover:text-white hover:bg-white/10 rounded border border-white/10 transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <LogOut size={14} />
                        )}
                        {isPending ? "ログアウト中..." : "ログアウト"}
                    </button>
                </div>
            </aside>
        </>
    );
}

// ==============================================================================
// 子组件：分区标题
// ==============================================================================
function SectionLabel({ label }: SectionLabelProps) {
    return <div className="px-4 py-2 mt-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</div>;
}

// ==============================================================================
// 子组件：导航单项
// ==============================================================================
function NavItem({ href, icon, label, activePath, onClick }: NavItemProps) {
    const isActive = activePath === href || (href !== "/admin" && activePath.startsWith(href));
    return (
        <Link href={href} onClick={onClick} className={`group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all relative overflow-hidden ${isActive ? "text-white bg-white/10" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <span className={`absolute left-0 top-0 bottom-0 w-1 bg-[#D4AF37] transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}></span>
            <span className={`transition-colors duration-300 ${isActive ? "text-[#D4AF37]" : "group-hover:text-[#D4AF37]"}`}>{icon}</span>
            {label}
        </Link>
    );
}