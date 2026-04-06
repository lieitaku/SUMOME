"use client";

import * as React from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { clubExternalLinkRel } from "@/lib/club-contact-urls";

export type ExternalUrlAnchorProps = Omit<
  React.ComponentPropsWithoutRef<"a">,
  "rel" | "target" | "href"
> & {
  href: string;
};

const MD_MIN = "(min-width: 768px)";

function isDesktopViewport(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia(MD_MIN).matches;
}

/**
 * 外部 URL：桌面端用原生 target=_blank（不劫持）；移动端 preventDefault + window.open，
 * 避免内嵌环境双开与原页跟跳；open 失败仅 Toast/复制，不使用 location。
 */
export default function ExternalUrlAnchor({
  href,
  onClick,
  onPointerDown,
  children,
  ...rest
}: ExternalUrlAnchorProps) {
  const t = useTranslations("ExternalLink");

  return (
    <a
      href={href}
      target="_blank"
      rel={clubExternalLinkRel}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        if (!e.defaultPrevented) e.stopPropagation();
      }}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (isDesktopViewport()) return;
        e.preventDefault();
        const w = window.open(href, "_blank", "noopener,noreferrer");
        if (w == null) {
          void (async () => {
            try {
              await navigator.clipboard.writeText(href);
              toast.success(t("toastCopied"));
            } catch {
              toast.error(t("toastBlockedTitle"), {
                description: `${t("toastBlockedDescription")}\n${href}`,
              });
            }
          })();
        }
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
