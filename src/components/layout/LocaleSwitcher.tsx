"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    className?: string;
    /** 公共顶栏：地球图标 + 下拉；后台侧栏：原生 select，不占双按钮宽度 */
    variant?: "default" | "onBrand";
    /** 切换语言后回调（例如关闭手机菜单 / 侧栏） */
    onAfterSelect?: () => void;
    /** 下拉相对触发器：start=左对齐、向右展开（抽屉内语言球在左侧时用）；end=右对齐、向左展开（桌面顶栏右侧用时） */
    menuAlign?: "start" | "end";
    /** 移动端抽屉等：在地球图标右侧显示简短说明（与 `label` 同源文案） */
    showMobileCaption?: boolean;
};

export default function LocaleSwitcher({
    className,
    variant = "default",
    onAfterSelect,
    menuAlign = "end",
    showMobileCaption = false,
}: Props) {
    const t = useTranslations("LocaleSwitcher");
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onDoc = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDoc);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDoc);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    if (variant === "onBrand") {
        return (
            <div className={cn("w-full min-w-0", className)}>
                <label className="sr-only" htmlFor="admin-locale-select">
                    {t("label")}
                </label>
                <select
                    id="admin-locale-select"
                    value={locale}
                    onChange={(e) => {
                        const next = e.target.value as "ja" | "en";
                        router.replace(pathname, { locale: next });
                        onAfterSelect?.();
                    }}
                    className={cn(
                        "w-full max-w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-xs font-bold text-white",
                        "cursor-pointer outline-none transition-colors duration-200 ease-in-out",
                        "hover:bg-white/15",
                        "focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-sumo-brand"
                    )}
                >
                    <option value="ja" className="bg-white text-gray-900">
                        {t("ja")}
                    </option>
                    <option value="en" className="bg-white text-gray-900">
                        {t("en")}
                    </option>
                </select>
            </div>
        );
    }

    const triggerClass = cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-transparent transition-all duration-200 ease-in-out",
        "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-sumo-brand",
        "active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sumo-brand/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        open && "bg-gray-100 text-sumo-brand ring-2 ring-sumo-brand/15"
    );

    const finishPick = () => {
        setOpen(false);
        onAfterSelect?.();
    };

    const triggerButton = (
        <button
            type="button"
            className={triggerClass}
            aria-label={t("label")}
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
        >
            <Globe size={18} strokeWidth={2.25} aria-hidden />
            <span className="pointer-events-none absolute bottom-0.5 right-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded bg-sumo-brand px-0.5 text-[8px] font-black leading-none text-white">
                {locale === "en" ? "EN" : "JP"}
            </span>
        </button>
    );

    return (
        <div
            ref={rootRef}
            className={cn(
                "relative",
                showMobileCaption
                    ? "flex min-w-0 flex-1 items-center gap-3"
                    : "shrink-0",
                className
            )}
        >
            {showMobileCaption ? (
                <>
                    {triggerButton}
                    <span
                        className="min-w-0 flex-1 text-left text-sm font-bold leading-snug text-gray-600"
                        aria-hidden
                    >
                        {t("label")}
                    </span>
                </>
            ) : (
                triggerButton
            )}
            {open ? (
                <div
                    role="listbox"
                    className={cn(
                        "absolute top-[calc(100%+8px)] z-[120] min-w-[168px] rounded-xl border border-gray-100 bg-white py-1 shadow-[0_4px_24px_rgba(0,0,0,0.12)]",
                        menuAlign === "end" ? "right-0" : "left-0"
                    )}
                >
                    <Link
                        href={pathname}
                        locale="ja"
                        className={cn(
                            "flex items-center justify-between gap-4 px-4 py-2.5 text-sm font-bold transition-colors duration-200 ease-in-out",
                            locale === "ja"
                                ? "bg-sumo-brand/5 text-sumo-brand"
                                : "text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={finishPick}
                    >
                        {t("ja")}
                        {locale === "ja" ? (
                            <Check size={16} strokeWidth={2.5} className="shrink-0" aria-hidden />
                        ) : null}
                    </Link>
                    <Link
                        href={pathname}
                        locale="en"
                        className={cn(
                            "flex items-center justify-between gap-4 px-4 py-2.5 text-sm font-bold transition-colors duration-200 ease-in-out",
                            locale === "en"
                                ? "bg-sumo-brand/5 text-sumo-brand"
                                : "text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={finishPick}
                    >
                        {t("en")}
                        {locale === "en" ? (
                            <Check size={16} strokeWidth={2.5} className="shrink-0" aria-hidden />
                        ) : null}
                    </Link>
                </div>
            ) : null}
        </div>
    );
}
