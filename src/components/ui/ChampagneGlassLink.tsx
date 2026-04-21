"use client";

import React from "react";
import Link from "@/components/ui/TransitionLink";
import { cn } from "@/lib/utils";
import {
  CHAMPAGNE_GLASS_BUTTON_CLASS,
  CHAMPAGNE_GLASS_BUTTON_STYLE,
  CHAMPAGNE_GLASS_LINK_CLASS,
} from "@/lib/champagneGlassButton";

export type ChampagneGlassLinkProps = React.ComponentProps<typeof Link>;

export function ChampagneGlassLink({
  className,
  style,
  ...props
}: ChampagneGlassLinkProps) {
  return (
    <Link
      {...props}
      style={{ ...CHAMPAGNE_GLASS_BUTTON_STYLE, ...style }}
      className={cn(CHAMPAGNE_GLASS_LINK_CLASS, className)}
    />
  );
}

export function ChampagneGlassButton({
  className,
  style,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      {...props}
      style={{ ...CHAMPAGNE_GLASS_BUTTON_STYLE, ...style }}
      className={cn(CHAMPAGNE_GLASS_BUTTON_CLASS, className)}
    />
  );
}

/** 浅色背景页「返回主页」：品牌蓝实心胶囊（阴影略轻，与香槟区分布一致） */
export const BRAND_HOME_BACK_LINK_CLASS =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ease-out text-white font-bold bg-sumo-brand border border-sumo-brand shadow-[0_3px_8px_-2px_rgba(0,71,171,0.14)] hover:brightness-110 hover:shadow-[0_4px_12px_-2px_rgba(0,71,171,0.18)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sumo-brand/50";

export function BrandBlueHomeLink({
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return <Link {...props} className={cn(BRAND_HOME_BACK_LINK_CLASS, "text-xs tracking-wide", className)} />;
}
