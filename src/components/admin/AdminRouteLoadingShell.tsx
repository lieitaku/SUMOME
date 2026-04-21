import React from "react";

/**
 * Admin layout 里主内容区与页脚在同一列（main + footer），路由 pending 时若骨架较矮，
 * 会先看到底部版权。用 fixed 盖住主列区域（含 footer），不盖住左侧栏与移动端顶栏。
 *
 * - 移动端：顶栏 h-16 (z-50)，遮罩从其下开始
 * - 桌面：侧栏 w-64 fixed (z-50)，遮罩从 md:left-64 起铺满右侧
 */
const OVERLAY =
  "fixed inset-x-0 bottom-0 left-0 top-16 z-40 md:left-64 md:top-0 md:right-0";

/** 与 admin layout 的 main 内边距一致（fixed 脱离文档流后需自带 padding） */
const INNER =
  "w-full max-w-full flex-1 flex flex-col px-6 py-8 md:px-12 md:py-12 md:pt-8";

export default function AdminRouteLoadingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100dvh-4rem)]">
      <div
        className={`${OVERLAY} flex flex-col bg-[#F4F5F7] overflow-y-auto overscroll-contain`}
        aria-busy
      >
        <div className={INNER}>{children}</div>
      </div>
    </div>
  );
}
