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
    // 外层控制进出场动画；preview-embedded 时隐藏（iframe 内预览）
    <div
      data-embedded-hide
      className={cn(
        "print:hidden",
        "fixed bottom-8 right-6 z-50 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-24 opacity-0 pointer-events-none",
      )}
    >
      {/* 内层 Ceramic 控制点击交互 */}
      <Ceramic
        as="button"
        variant="blue"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={cn(
          "flex flex-col items-center justify-center",
          "w-14 h-14 md:w-16 md:h-16", // 手机端和电脑端都适当放大
        )}
      >
        <ArrowUp
          size={24}
          strokeWidth={2.5}
          // 图标单独加一个小动画
          className="transition-transform duration-300 group-hover:-translate-y-1"
        />
        <span className="text-[10px] font-black tracking-widest mt-0.5 font-sans">
          TOP
        </span>
      </Ceramic>
    </div>
  );
};

export default ScrollToTop;
