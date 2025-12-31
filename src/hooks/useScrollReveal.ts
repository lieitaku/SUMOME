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
 * 依赖: globals.css 中的 .reveal-up 和 .is-visible 样式
 */
export const useScrollReveal = () => {
  const pathname = usePathname();

  useEffect(() => {
    // 初始化 IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // 动画只触发一次，性能优化
          }
        });
      },
      {
        threshold: 0.1, // 元素出现 10% 时触发
        rootMargin: "0px 0px -50px 0px", // 稍微提前一点点触发，体验更流畅
      },
    );

    // 延迟执行：确保 Next.js 路由切换后的 DOM 渲染完毕
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(".reveal-up");
      if (elements.length > 0) {
        elements.forEach((el) => observer.observe(el));
      }
    }, 100);

    // 清理函数：组件卸载或路由变化时，断开观察，防止内存泄漏
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [pathname]); // 监听路径变化，确保切页面后动画重置
};
