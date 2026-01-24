import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "ghost" | "red" | "ceramic";
  className?: string;
  isActive?: boolean;
  showArrow?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  variant = "primary",
  className = "",
  isActive = false,
  showArrow,
  ...props
}) => {
  // 1. 智能判断是否显示箭头
  const shouldShowArrow =
    showArrow !== undefined ? showArrow : variant !== "ceramic";

  // 2. 基础样式 (升级：加入更高级的缓动曲线和点击缩放反馈)
  // ease-[cubic-bezier(0.19,1,0.22,1)] 是一种类似 iOS 的高级阻尼感动画
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-widest transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] transform group relative disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none active:scale-95";

  // 3. 尺寸样式 (升级：Primary/Outline 使用更现代的圆角)
  const sizeStyles =
    variant === "ceramic"
      ? "px-6 py-3 rounded-xl text-sm" // 陶瓷保持方形圆角
      : "px-8 py-4 rounded-full text-sm md:text-base"; // 其他按钮改为胶囊形，更灵动

  // 4. 变体样式定义 (全面升级质感)
  const variants = {
    // 品牌主按钮：同色系弥散阴影 + 上浮效果
    primary:
      "bg-sumo-brand text-white shadow-lg shadow-sumo-brand/20 hover:bg-[#2a60b8] hover:shadow-xl hover:shadow-sumo-brand/40 hover:-translate-y-1",

    // 红色警示按钮：同理
    red: "bg-sumo-red text-white shadow-lg shadow-sumo-red/20 hover:bg-red-600 hover:shadow-xl hover:shadow-sumo-red/40 hover:-translate-y-1",

    // 描边按钮：背景微透，边框加深
    outline:
      "bg-transparent border-2 border-sumo-brand text-sumo-brand hover:bg-sumo-brand/5 hover:border-sumo-brand hover:text-sumo-brand hover:-translate-y-0.5",

    // 幽灵按钮：极简交互
    ghost: "text-gray-500 hover:text-sumo-brand hover:bg-gray-50",

    // 触感陶瓷变体 (保持不变)
    ceramic: cn(
      "border-t border-x border-gray-50 ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-white active:scale-100", // Ceramic 不缩放
      isActive
        ? "-translate-y-1 border-b-4 border-b-sumo-brand text-sumo-brand shadow-[0_10px_20px_rgba(36,84,164,0.15)] z-10"
        : "border-b-4 border-b-gray-100 text-gray-400 hover:-translate-y-0.5 hover:border-b-gray-200"
    ),
  };

  const combinedClasses = cn(
    baseStyles,
    sizeStyles,
    variants[variant],
    className
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
        // 箭头动画优化：根据 Hover 状态轻微位移
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
    <button className={combinedClasses} {...props}>
      {content}
    </button>
  );
};

export default Button;