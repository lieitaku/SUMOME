import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string; // 允许传入额外的样式
  /** 覆盖内部 container 的 class（如手机端缩小 px） */
  containerClassName?: string;
  id?: string; // 用于锚点跳转
  background?: "white" | "gray"; // 限制背景只能是这两种，防止乱用颜色
}

const Section: React.FC<SectionProps> = ({
  children,
  className,
  containerClassName,
  id,
  background = "white",
}) => {
  return (
    <section
      id={id}
      className={cn(
        // 1. 基础布局
        "w-full py-12 md:py-28 relative overflow-hidden",
        // 2. 背景色控制 (瑞士风格只有白和极淡的灰)
        background === "white" ? "bg-sumo-bg" : "bg-gray-50",
        className,
      )}
    >
      {/* 居中容器：控制内容最大宽度，左右留白 */}
      <div className={cn("container mx-auto max-w-7xl px-6 md:px-12", containerClassName)}>
        {children}
      </div>
    </section>
  );
};

export default Section;
