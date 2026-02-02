"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "@/context/TransitionContext";
import React from "react";

// 定义组件属性：继承 Link 的属性 + 原生 a 标签属性 + children
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
        // 1. 如果外部传入了 onClick，先执行
        if (onClick) {
            onClick(e);
        }

        // 2. 排除特殊情况：新窗口打开、按住功能键点击等，走默认浏览器行为
        if (props.target === "_blank" || e.metaKey || e.ctrlKey) {
            return;
        }

        // 3. 阻止默认跳转
        e.preventDefault();

        // 4. 开启“迷雾”加载状态
        startLoading();

        // 5. 执行跳转 (修复核心：安全地获取 URL 字符串)
        // 使用类型断言 (as any) 避免 TypeScript 对于 UrlObject 的类型推断错误
        const targetUrl = typeof href === 'string' ? href : (href as any).href || (href as any).pathname || '';

        if (targetUrl) {
            router.push(targetUrl);
        }
    };

    return (
        <Link href={href} onClick={handleClick} {...props}>
            {children}
        </Link>
    );
}