"use client"; // 👈 必须加这个，因为要用 usePathname

import { usePathname } from "next/navigation";

// 定义路径到日文标题的映射表
const TITLE_MAP: Record<string, string> = {
    "/admin/dashboard": "ダッシュボード",
    "/admin/clubs": "クラブ管理",
    "/admin/clubs/new": "新規クラブ登録",
    "/admin/activities": "活動・ニュース",
    "/admin/magazines": "広報誌データ",
    "/admin/banners": "バナー広告",
    "/admin/prefecture-banners": "都道府県バナー",
    "/admin/settings": "システム設定",
    "/admin/my-club": "クラブ情報編集",
};

export default function AdminPageTitle() {
    const pathname = usePathname();

    // 1. 尝试直接匹配 (精确匹配)
    let title = TITLE_MAP[pathname];

    // 2. 如果没匹配到，处理动态路由 (比如 /admin/clubs/123)
    if (!title) {
        if (pathname.startsWith("/admin/clubs/")) {
            title = "クラブ詳細・編集";
        } else if (pathname.startsWith("/admin/prefecture-banners/")) {
            title = "都道府県バナー編集";
        } else if (pathname.startsWith("/admin/activities/")) {
            title = "記事編集";
        } else {
            title = "管理画面"; // 兜底标题
        }
    }

    return (
        <span className="text-gray-900 ml-1 font-bold">
            {title}
        </span>
    );
}