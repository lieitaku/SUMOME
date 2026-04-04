"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

/** 根 layout 的 html lang 默认为 ja；在客户端按当前 locale 同步，避免嵌套 html。 */
export function DocumentHtmlLang() {
    const locale = useLocale();

    useEffect(() => {
        document.documentElement.lang = locale === "en" ? "en" : "ja";
    }, [locale]);

    return null;
}
