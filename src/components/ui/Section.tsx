import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string; // 允许传入额外的样式
  id?: string; // 用于锚点跳转
  background?: "white" | "gray"; // 限制背景只能是这两种，防止乱用颜色
}

const Section: React.FC<SectionProps> = ({
  children,
  className,
  id,
  background = "white",
}) => {
  return (
    <section
      id={id}
      className={cn(
        // 1. 基础布局
        "w-full py-20 md:py-28 relative overflow-hidden",
        // 2. 背景色控制 (瑞士风格只有白和极淡的灰)
        background === "white" ? "bg-sumo-bg" : "bg-gray-50",
        className,
      )}
    >
      {/* 居中容器：控制内容最大宽度，左右留白 */}
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        {children}
      </div>
    </section>
  );
};

export default Section;
