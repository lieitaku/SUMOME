"use client";

import { Link as IntlLink, useRouter } from "@/i18n/navigation";
import { useTransition } from "@/context/TransitionContext";
import React from "react";

// ==============================================================================
// 🚦 配置区域：只有跳转到以下路径（及其子路径）时，才触发“迷雾”加载动画
// ==============================================================================
const HEAVY_ROUTES = [
    "/clubs/map",
    "/prefectures",
    "/magazines",
];

function pathForHeavyCheck(url: string): string {
    const withoutOrigin = url.replace(/^https?:\/\/[^/]+/i, "");
    const path = withoutOrigin.split("?")[0] ?? "";
    const noEn = path.replace(/^\/en(?=\/|$)/, "") || "/";
    return noEn.startsWith("/") ? noEn : `/${noEn}`;
}

// ==============================================================================

type TransitionLinkProps = React.ComponentProps<typeof IntlLink> & {
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

        if (props.target === "_blank" || e.metaKey || e.ctrlKey) {
            return;
        }

        e.preventDefault();

        const targetUrl =
            typeof href === "string"
                ? href
                : typeof href === "object" && href && "pathname" in href
                  ? String((href as { pathname?: string }).pathname ?? "")
                  : "";

        const normalized = pathForHeavyCheck(
            targetUrl.startsWith("/") ? targetUrl : `/${targetUrl}`
        );
        const isHeavyPage = HEAVY_ROUTES.some(
            (route) => normalized === route || normalized.startsWith(`${route}/`)
        );

        if (isHeavyPage) {
            startLoading();
        }
        /* 程序化 push 时显式滚到顶部，避免部分环境下停留在上一页滚动位置 */
        router.push(href, { scroll: true });
    };

    return (
        <IntlLink href={href} onClick={handleClick} {...props}>
            {children}
        </IntlLink>
    );
}
