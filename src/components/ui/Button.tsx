import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  // 新增 "ceramic" 变体
  variant?: "primary" | "outline" | "ghost" | "red" | "ceramic";
  className?: string;
  onClick?: () => void;
  // 是否处于激活状态 (用于筛选器按钮)
  isActive?: boolean;
  // 是否显示箭头 (默认 true，陶瓷按钮通常设为 false)
  showArrow?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
  isActive = false,
  showArrow, // 不设置默认值，在下面逻辑中判断
}) => {
  // 1. 智能判断是否显示箭头
  // 如果用户没传 showArrow：ceramic 默认不显示，其他默认显示
  const shouldShowArrow =
    showArrow !== undefined ? showArrow : variant !== "ceramic";

  // 2. 基础样式 (所有按钮共有)
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-widest transition-all duration-300 transform group relative";

  // 3. 尺寸样式 (为了方便覆盖，把尺寸分离出来，ceramic 使用自己的尺寸)
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

    // 触感陶瓷变体 (Tactile Ceramic)
    ceramic: cn(
      "border-t border-x border-gray-50 ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-white",
      isActive
        ? // 选中状态：浮起 + 蓝底座 + 蓝字 + 强投影
          "-translate-y-1 border-b-4 border-b-sumo-brand text-sumo-brand shadow-[0_10px_20px_rgba(36,84,164,0.15)] z-10"
        : // 未选中状态：沉底 + 灰底座 + 灰字
          "border-b-4 border-b-gray-100 text-gray-400 hover:-translate-y-0.5 hover:border-b-gray-200",
    ),
  };

  const combinedClasses = cn(
    baseStyles,
    sizeStyles,
    variants[variant],
    className,
  );

  // 陶瓷高光效果 (仅在 ceramic 且 active 时显示)
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
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClasses}>
      {content}
    </button>
  );
};

export default Button;
