"use client";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/**
 * ScrollRevealProvider
 * ------------------------------------------------------------------
 * 全局动画 Provider。
 * 负责在客户端初始化 IntersectionObserver，
 * 让所有带有 .reveal-up 类名的元素都能触发上浮动画。
 */
export default function ScrollRevealProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useScrollReveal(); // 初始化 Hook
  return <>{children}</>;
}
