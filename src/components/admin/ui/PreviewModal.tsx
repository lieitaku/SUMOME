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
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black/50 backdrop-blur-sm overflow-hidden">
      {/* 内层卡片：与 admin UI 风格一致 */}
      <div className="mx-4 mt-4 mb-0 md:mx-8 md:mt-8 md:mb-0 flex flex-col flex-1 min-h-0 bg-white rounded-t-2xl border-x border-t border-gray-200 shadow-2xl overflow-hidden">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-gray-50/80 border-b border-gray-100 shrink-0">
          <span className="text-sm font-bold text-gray-800">{title}</span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:bg-sumo-brand/10 hover:text-sumo-brand transition-colors"
            aria-label="閉じる"
          >
            <X size={20} />
          </button>
        </div>
        {/* iframe 区域 */}
        <div className="flex-1 min-h-0 relative overflow-hidden">
          <iframe
            src={url}
            title={title}
            className="absolute inset-0 w-full h-full border-0 bg-white block"
            sandbox="allow-same-origin allow-scripts allow-popups"
          />
        </div>
        {/* 底部栏：防止点击穿透，与顶部风格统一 */}
        <div className="flex items-center justify-end px-4 md:px-6 py-3 bg-gray-50/80 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-sumo-brand text-white text-sm font-bold rounded-xl hover:brightness-110 transition-all"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
