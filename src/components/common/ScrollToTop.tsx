"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Ceramic from "@/components/ui/Ceramic";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    // 外层控制进出场动画
    <div
      className={cn(
        "fixed bottom-8 right-6 z-50 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-24 opacity-0 pointer-events-none",
      )}
    >
      {/* 内层 Ceramic 控制点击交互 */}
      <Ceramic
        as="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={cn(
          "flex flex-col items-center justify-center",
          "w-12 h-12 md:w-14 md:h-14",

          // === 颜色逻辑 (修改版) ===
          // 始终保持白底蓝字，哪怕 hover 也不变黑或变实心蓝
          "bg-white text-sumo-brand",

          // 悬停效果：
          // 1. 只有底座变蓝 (能量感)
          // 2. 依然上浮
          "hover:border-b-sumo-brand",
          // 去掉了 hover:bg-sumo-brand 和 hover:text-white
        )}
      >
        <ArrowUp
          size={20}
          strokeWidth={2.5}
          // 图标单独加一个小动画
          className="transition-transform duration-300 group-hover:-translate-y-1"
        />
        <span className="text-[9px] font-black tracking-widest mt-0.5 font-sans">
          TOP
        </span>
      </Ceramic>
    </div>
  );
};

export default ScrollToTop;
