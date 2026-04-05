"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Hook: useScrollReveal
 * ------------------------------------------------------------------
 * 滚动动画触发钩子。
 * 监听 DOM 中带有 `.reveal-up` 类名的元素，当其进入视口(Viewport)时，
 * 添加 `.is-visible` 类名以触发 CSS transition 动画。
 *
 * 启动观察的时机必须晚于 React hydration，否则服务端渲染的 HTML（无 is-visible）
 * 会在客户端被 observer 先加上 is-visible，导致 hydration mismatch。
 *
 * 重要：仅依赖 pathname + 单次延迟扫描会在 App Router 下漏掉「晚于扫描才挂载」的节点。
 * 典型场景：目标路由有 loading.tsx，pathname 已变但 300ms 时仍是骨架屏（无 .reveal-up），
 * 随后 RSC 替换为真实页面时 pathname 不变，若不再次扫描，首屏 .reveal-up 会一直保持 opacity:0。
 * 因此用 MutationObserver 在仅当子树出现 .reveal-up 相关节点时做防抖扫描，成本低且能覆盖全站。
 *
 * 依赖: globals.css 中的 .reveal-up 和 .is-visible 样式
 */
function mutationAddsRevealUp(mutations: MutationRecord[]): boolean {
  for (const m of mutations) {
    if (m.type !== "childList") continue;
    for (const node of m.addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      const el = node as Element;
      if (el.classList.contains("reveal-up")) return true;
      if (el.querySelector?.(".reveal-up")) return true;
    }
  }
  return false;
}

export const useScrollReveal = () => {
  const pathname = usePathname();

  useEffect(() => {
    const observed = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    const scan = () => {
      document.querySelectorAll(".reveal-up").forEach((el) => {
        if (el.classList.contains("is-visible")) return;
        if (observed.has(el)) return;
        observed.add(el);
        observer.observe(el);
      });
    };

    // 等 hydration 完成后再开始观察，避免 classList.add 导致服务端/客户端 HTML 不一致
    const timer = setTimeout(scan, 300);

    let debounce: ReturnType<typeof setTimeout> | null = null;
    const mutationObserver = new MutationObserver((mutations) => {
      if (!mutationAddsRevealUp(mutations)) return;
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(() => {
        debounce = null;
        scan();
      }, 50);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      clearTimeout(timer);
      if (debounce) clearTimeout(debounce);
    };
  }, [pathname]);
};
