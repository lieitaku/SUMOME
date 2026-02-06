"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "@/context/TransitionContext";
import React from "react";

// ==============================================================================
// 🚦 配置区域：只有跳转到以下路径（及其子路径）时，才触发“迷雾”加载动画
// ==============================================================================
const HEAVY_ROUTES = [
    "/clubs/map",       // 地图页（加载地图组件很重）
    "/prefectures",     // 都道府県列表/详情页（图片很多）
    "/magazines",       // 杂志页（封面图片多，数据库查询较重）
];

// ==============================================================================

type TransitionLinkProps = LinkProps & React.ComponentProps<"a"> & {
    children: React.ReactNode;
};

export default function TransitionLink({
    children,
    href,
    onClick,
    ...props
}: TransitionLinkProps) {
    const router = useRouter();
    const { startLoading } = useTransition();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (onClick) onClick(e);

        // 排除新窗口打开等情况
        if (props.target === "_blank" || e.metaKey || e.ctrlKey) {
            return;
        }

        e.preventDefault();

        // 获取目标 URL 字符串
        const targetUrl = typeof href === 'string' ? href : (href as any).href || '';

        // 🧠 核心智能判断逻辑
        // 检查目标 URL 是否以 HEAVY_ROUTES 中的任意一个开头
        const isHeavyPage = HEAVY_ROUTES.some((route) => targetUrl.startsWith(route));

        if (isHeavyPage) {
            //情况 A: 是重页面 -> 开启迷雾 -> 跳转
            startLoading();
            router.push(targetUrl);
        } else {
            // 情况 B: 是普通页面 -> 直接跳转 (无动画，保留原生极速体验)
            router.push(targetUrl);
        }
    };

    return (
        <Link href={href} onClick={handleClick} {...props}>
            {children}
        </Link>
    );
}