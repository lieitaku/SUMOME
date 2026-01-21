import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// 继承原生 Button 属性，支持 type="submit", disabled, style 等
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "ghost" | "red" | "ceramic";
  className?: string;
  isActive?: boolean; // 用于筛选器按钮
  showArrow?: boolean; // 是否显示箭头
}

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  variant = "primary",
  className = "",
  isActive = false,
  showArrow,
  // 提取出不需要传给 DOM 的自定义属性，剩下的 props (如 type, disabled) 传给 button
  ...props
}) => {
  // 1. 智能判断是否显示箭头
  // 如果用户没传 showArrow：ceramic 默认不显示，其他默认显示
  const shouldShowArrow =
    showArrow !== undefined ? showArrow : variant !== "ceramic";

  // 2. 基础样式
  // 新增 disabled:opacity-50 disabled:cursor-not-allowed 处理禁用状态
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-widest transition-all duration-300 transform group relative disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none";

  // 3. 尺寸样式
  const sizeStyles =
    variant === "ceramic"
      ? "px-6 py-3 rounded-xl text-sm"
      : "px-8 py-4 rounded-sm text-base";

  // 4. 变体样式定义
  const variants = {
    primary: "bg-sumo-brand text-white hover:bg-black hover:shadow-lg",
    red: "bg-sumo-red border-2 border-sumo-red text-white hover:bg-white hover:text-sumo-red hover:shadow-lg",
    outline:
      "border-2 border-sumo-brand text-sumo-brand hover:bg-sumo-brand hover:text-white",
    ghost: "text-sumo-text hover:text-sumo-brand bg-transparent",

    // 触感陶瓷变体
    ceramic: cn(
      "border-t border-x border-gray-50 ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-white",
      isActive
        ? // 选中状态
          "-translate-y-1 border-b-4 border-b-sumo-brand text-sumo-brand shadow-[0_10px_20px_rgba(36,84,164,0.15)] z-10"
        : // 未选中状态
          "border-b-4 border-b-gray-100 text-gray-400 hover:-translate-y-0.5 hover:border-b-gray-200",
    ),
  };

  const combinedClasses = cn(
    baseStyles,
    sizeStyles,
    variants[variant],
    className,
  );

  // 陶瓷高光效果
  const ceramicHighlight = variant === "ceramic" && isActive && (
    <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] pointer-events-none" />
  );

  const content = (
    <>
      {ceramicHighlight}
      {children}
      {shouldShowArrow && (
        <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      )}
    </>
  );

  if (href) {
    // Link 不接受 disabled 等 button 属性，所以这里只传必要的
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {content}
    </button>
  );
};

export default Button;
