"use client";

import React from "react";
import { Share2, Printer } from "lucide-react";

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
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/activities/${activityId}`
        : "";
    const shareData: ShareData = {
      title: title || "活動レポート",
      url,
      text: title ? `${title} - SUMOME` : "SUMOME 活動レポート",
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
        alert("URLをコピーしました");
      })
      .catch(() => {
        prompt("以下のURLをコピーしてください：", url);
      });
  };

  if (variant === "mobile") {
    return (
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
      >
        <Share2 size={14} /> レポートを共有
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleShare}
        className="flex items-center justify-between px-3 py-2 -ml-3 rounded hover:bg-gray-50 text-xs font-bold text-gray-500 hover:text-sumo-brand transition-colors w-full text-left"
      >
        <span className="flex items-center gap-3">
          <Share2 size={14} /> 共有
        </span>
      </button>
      <button
        onClick={handlePrint}
        className="flex items-center justify-between px-3 py-2 -ml-3 rounded hover:bg-gray-50 text-xs font-bold text-gray-500 hover:text-sumo-dark transition-colors w-full text-left"
      >
        <span className="flex items-center gap-3">
          <Printer size={14} /> 印刷
        </span>
      </button>
    </div>
  );
}
