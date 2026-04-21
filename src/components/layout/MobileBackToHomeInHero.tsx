"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  BrandBlueHomeLink,
  ChampagneGlassLink,
} from "@/components/ui/ChampagneGlassLink";
import { cn } from "@/lib/utils";

const EXACT_PATHS = [
  "/about",
  "/magazines",
  "/activities",
  "/contact",
  "/company",
  "/partners",
  "/clubs",
  "/clubs/map",
  "/terms",
  "/privacy",
] as const;

function shouldShowMobileBackHome(pathname: string | null): boolean {
  if (!pathname) return false;
  if ((EXACT_PATHS as readonly string[]).includes(pathname)) return true;
  if (pathname.startsWith("/magazines/")) return true;
  if (pathname.startsWith("/activities/")) return true;
  return false;
}

function isLightBackgroundPage(pathname: string): boolean {
  return pathname === "/clubs" || pathname === "/clubs/map" || pathname === "/partners";
}

type MobileBackToHomeInHeroProps = {
  /** 追加在根节点上（如与父级 container 对齐） */
  className?: string;
  /**
   * 为 true 时不加顶栏占位（由外层 section 等写 `pt-public-sticky-header`）。
   * 用于 clubs/map 等页。
   */
  skipHeaderClearancePadding?: boolean;
};

/**
 * 放在各页 Hero/首屏区块**内部**（与标题同一 section），与标题共享背景与 ScrollReveal。
 */
export default function MobileBackToHomeInHero({
  className,
  skipHeaderClearancePadding = false,
}: MobileBackToHomeInHeroProps) {
  const pathname = usePathname();
  const t = useTranslations("Layout");

  if (!shouldShowMobileBackHome(pathname)) return null;

  const light = isLightBackgroundPage(pathname);

  const linkInner = (
    <>
      <ChevronLeft
        size={16}
        className="shrink-0 group-hover:-translate-x-1 transition-transform duration-200 ease-in-out"
        aria-hidden
      />
      <span className="text-xs font-bold tracking-wide">{t("mobileBackToHome")}</span>
    </>
  );

  return (
    <div
      className={cn(
        "lg:hidden w-full pb-4",
        !skipHeaderClearancePadding && "pt-public-sticky-header",
        "relative z-[20]",
        className
      )}
    >
      {/* padding 放在无 reveal-up 的外层，避免与顶栏重叠；仅按钮参与入场动画 */}
      <div className="flex w-full justify-center reveal-up">
        {light ? (
          <BrandBlueHomeLink href="/" aria-label={t("mobileBackToHomeAria")} className="group">
            {linkInner}
          </BrandBlueHomeLink>
        ) : (
          <ChampagneGlassLink href="/" aria-label={t("mobileBackToHomeAria")} className="group">
            {linkInner}
          </ChampagneGlassLink>
        )}
      </div>
    </div>
  );
}
