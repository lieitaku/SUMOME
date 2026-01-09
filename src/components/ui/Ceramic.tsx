import React from "react";
import { cn } from "@/lib/utils";

// 定义组件属性
export interface CeramicProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType; // 允许渲染为 div, section, Link, button 等
  href?: string; // 如果渲染为 Link，需要 href
  target?: string; // 链接打开方式
  type?: "button" | "submit" | "reset"; // 如果渲染为 button
  variant?: "white" | "blue"; // 颜色变体
  interactive?: boolean; // 是否开启交互动画
  className?: string;
  children?: React.ReactNode;
}

const Ceramic: React.FC<CeramicProps> = ({
  as: Component = "div", // 默认渲染为 div
  variant = "white",
  interactive = true,
  className,
  children,
  ...props
}) => {
  return (
    <Component
      className={cn(
        // === 1. 基础构造 (Base Structure) ===
        "relative overflow-hidden rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        "block", // 确保它是块级元素

        // === 2. 物理材质 (Physical Material) ===
        "border border-gray-100 border-b-[4px]", // 核心厚度

        // === 3. 颜色变体 ===
        variant === "white" && [
          "bg-white border-b-gray-200",
          // 釉面高光 (Inner Highlight)
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.04)]",
        ],
        // 如果以后有蓝色变体，可以在这里加

        // === 4. 交互效果 (Interactive) ===
        interactive && [
          "cursor-pointer group",
          // Hover: 上浮 + 蓝底座 + 蓝投影
          "hover:-translate-y-1",
          "hover:border-b-sumo-brand",
          "hover:shadow-[0_15px_30px_rgba(36,84,164,0.15)]",
          // Active: 机械下压 (厚度消失 + 位移)
          "active:border-b-[0px] active:translate-y-[3px] active:shadow-none active:duration-100",
        ],

        className,
      )}
      {...props}
    >
      {/* 顶部高光修饰线 (Ceramic Glaze Line) - 纯装饰，增加精致感 */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-50 pointer-events-none" />

      {children}
    </Component>
  );
};

export default Ceramic;
