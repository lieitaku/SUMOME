import React from "react";

/**
 * 公开站 `(public)/layout` 里 Footer 在 `main` 外；路由 pending 时只会替换 `main` 内 children，
 * 容易先看到 Footer、后出正文。用 fixed 遮罩盖住顶栏以下区域（含 Footer），
 * 同时保留文档流占位高度，避免 `main` 因 fixed 子节点塌陷把 Footer 顶到首屏。
 *
 * `top` 取 Header 可能的最大高度（max-h 80px / 88px），避免压住顶栏。
 */
const OVERLAY_TOP =
  "top-[calc(80px+env(safe-area-inset-top))] lg:top-[calc(88px+env(safe-area-inset-top))]";

type PublicRouteLoadingShellProps = {
  children: React.ReactNode;
  /** 遮罩与占位背景，默认与多数公开页一致 */
  className?: string;
};

export default function PublicRouteLoadingShell({
  children,
  className = "bg-[#F4F5F7]",
}: PublicRouteLoadingShellProps) {
  return (
    <div className="relative min-h-[calc(100dvh-4.5rem)]">
      <div
        className={`fixed inset-x-0 bottom-0 ${OVERLAY_TOP} z-50 flex flex-col ${className} antialiased overflow-y-auto overscroll-contain animate-pulse`}
        aria-busy
      >
        {children}
      </div>
    </div>
  );
}
