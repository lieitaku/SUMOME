"use client";

import { X } from "lucide-react";

interface PreviewModalProps {
  /** 预览页 URL，设置后 iframe 加载该地址（会带上当前页的 preview cookie） */
  url: string | null;
  onClose: () => void;
  title?: string;
}

/**
 * 在当前页以模态形式显示预览。点击「プレビュー」后不跳转，而是打开此模态，
 * iframe 加载预览 URL 时会携带刚由 POST /admin/api/preview 设置的 cookie，从而正确显示未保存内容。
 */
export default function PreviewModal({ url, onClose, title = "プレビュー" }: PreviewModalProps) {
  if (url == null) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black/80">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white shrink-0">
        <span className="text-sm font-bold">{title}</span>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="閉じる"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 min-h-0 relative">
        <iframe
          src={url}
          title={title}
          className="absolute inset-0 w-full h-full border-0 bg-white"
          sandbox="allow-same-origin allow-scripts allow-popups"
        />
      </div>
    </div>
  );
}
