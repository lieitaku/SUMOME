"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

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
 * 依赖: globals.css 中的 .reveal-up 和 .is-visible 样式
 */
export const useScrollReveal = () => {
  const pathname = usePathname();

  useEffect(() => {
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

    // 等 hydration 完成后再开始观察，避免 classList.add 导致服务端/客户端 HTML 不一致
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(".reveal-up");
      elements.forEach((el) => observer.observe(el));
    }, 300);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [pathname]);
};
