"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils"; // 引入工具函数

/**
 * ScrollToTop Component
 * ------------------------------------------------------------------
 * 全局回到顶部按钮。
 * 滚动超过 500px 后显示，点击平滑滚动至顶部。
 */
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 监听滚动
  useEffect(() => {
    const toggleVisibility = () => {
      // 滚动超过 500px 才显示，避免在 Hero 区域干扰视线
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // 平滑滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      // 使用 cn() 合并类名，逻辑更清晰
      className={cn(
        "fixed bottom-8 right-6 z-50",
        "flex flex-col items-center justify-center",
        "w-12 h-14 md:w-14 md:h-16",
        "border border-sumo-gold/30 bg-sumo-dark/90 backdrop-blur-md",
        "text-white shadow-xl rounded-sm",
        "transition-all duration-500 ease-out group overflow-hidden",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0 pointer-events-none",
      )}
    >
      {/* 悬停背景填充动画 (红色) */}
      <span className="absolute inset-0 bg-sumo-red translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>

      {/* 内容层 */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        <ArrowUp
          size={18}
          className="text-sumo-gold group-hover:text-white transition-colors duration-300 group-hover:-translate-y-1"
        />
        <span className="font-serif text-[10px] tracking-widest text-gray-300 group-hover:text-white transition-colors duration-300">
          TOP
        </span>
      </div>
    </button>
  );
};

export default ScrollToTop;
