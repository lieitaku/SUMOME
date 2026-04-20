"use client";

import React from "react";
import { Share2, Printer } from "lucide-react";
import { useTranslations } from "next-intl";

interface ActivityActionsProps {
  activityId: string;
  title?: string;
  /** 用于移动端全宽按钮的变体 */
  variant?: "sidebar" | "mobile";
}

export default function ActivityActions({
  activityId,
  title = "",
  variant = "sidebar",
}: ActivityActionsProps) {
  const t = useTranslations("ActivitiesPage");

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/activities/${activityId}`
        : "";
    const shareData: ShareData = {
      title: title || t("shareDefaultTitle"),
      url,
      text: title ? t("shareTextWithTitle", { title }) : t("shareDefaultText"),
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          fallbackCopyUrl(url);
        }
      }
    } else {
      fallbackCopyUrl(url);
    }
  };

  const fallbackCopyUrl = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert(t("actionCopyUrlSuccess"));
      })
      .catch(() => {
        prompt(t("actionCopyUrlPromptHint"), url);
      });
  };

  if (variant === "mobile") {
    return (
      <button
        type="button"
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
      >
        <Share2 size={14} /> {t("actionShareMobile")}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="flex items-center justify-between px-3 py-2 -ml-3 rounded hover:bg-gray-50 text-xs font-bold text-gray-500 hover:text-sumo-brand transition-colors w-full text-left"
      >
        <span className="flex items-center gap-3">
          <Share2 size={14} /> {t("actionShare")}
        </span>
      </button>
      <button
        type="button"
        onClick={handlePrint}
        className="flex items-center justify-between px-3 py-2 -ml-3 rounded hover:bg-gray-50 text-xs font-bold text-gray-500 hover:text-sumo-dark transition-colors w-full text-left"
      >
        <span className="flex items-center gap-3">
          <Printer size={14} /> {t("actionPrint")}
        </span>
      </button>
    </div>
  );
}
