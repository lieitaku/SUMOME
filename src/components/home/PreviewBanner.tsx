"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * 客户端预览横幅：通过 /api/preview/home 判断当前 session 是否处于首页预览，
 * 从而将 headers() 调用移出服务端渲染路径，使首页能享受 ISR 缓存。
 */
export default function PreviewBanner() {
    const tHome = useTranslations("Home");
    const [isPreview, setIsPreview] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("embedded") === "1") return;

        fetch("/api/preview/home", { credentials: "same-origin" })
            .then((r) => r.json())
            .then((data: { isPreview: boolean }) => setIsPreview(data.isPreview))
            .catch(() => {});
    }, []);

    if (!isPreview) return null;

    return (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-bold flex flex-wrap items-center justify-center gap-2">
            <span>{tHome("previewBanner")}</span>
            <a
                href="javascript:history.back()"
                className="underline font-bold hover:no-underline"
            >
                {tHome("previewBack")}
            </a>
        </div>
    );
}
