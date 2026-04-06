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
        "block isolate", // 确保它是块级元素，isolate 创建新堆叠上下文防止 transform 时圆角溢出

        // === 2. 物理材质 (Physical Material) ===
        "border border-b-[4px]", // 核心厚度

        // === 3. 颜色变体 ===
        variant === "white" && [
          "bg-white border-gray-100 border-b-gray-200 text-gray-800",
          // 釉面高光 (Inner Highlight)
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.04)]",
        ],
        variant === "blue" && [
          "bg-sumo-brand text-white border-sumo-brand border-b-[#1a3d7a]", // 深蓝色底座
          // 蓝色的高光与阴影
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_12px_rgba(36,84,164,0.3)]",
        ],

        // === 4. 交互效果 (Interactive) ===
        interactive && [
          "cursor-pointer group",
          "hover:-translate-y-1",
          // Active: 机械下压 (厚度消失 + 位移)
          "active:border-b-[0px] active:translate-y-[3px] active:shadow-none active:duration-100",
        ],
        
        // 针对不同变体的 Hover 效果
        interactive && variant === "white" && [
          "hover:border-b-sumo-brand",
          "hover:shadow-[0_15px_30px_rgba(36,84,164,0.15)]",
        ],
        interactive && variant === "blue" && [
          "hover:brightness-110",
          "hover:shadow-[0_15px_30px_rgba(36,84,164,0.4)]",
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
