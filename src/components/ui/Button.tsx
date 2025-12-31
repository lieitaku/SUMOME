import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "ios" | "gold" | "navy" | "primary";
  withShine?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
} & React.ComponentProps<"button"> &
  React.ComponentProps<typeof Link>;

const Button = ({
  children,
  href,
  variant = "ios",
  withShine = false,
  className = "",
  ...props
}: ButtonProps) => {
  // 1. 基础样式
  const baseStyles =
    "relative overflow-hidden rounded-full inline-flex items-center justify-center transition-all duration-300 group";

  // 2. 变体样式
  const variants = {
    // [红色 iOS 风格] (默认: 透明 -> 红)
    ios: `
      bg-transparent text-sumo-dark border border-gray-200
      hover:text-white hover:border-sumo-red
      before:absolute before:inset-0 before:bg-sumo-red 
      before:origin-left before:scale-x-0 before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.22,1,0.36,1)] before:-z-10
      hover:before:scale-x-100
    `,

    // [金色 VIP 风格] (透明 -> 金)
    gold: `
      text-sumo-gold border border-sumo-gold
      hover:text-white
      before:absolute before:inset-0 before:bg-sumo-gold
      before:origin-left before:scale-x-0 before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.22,1,0.36,1)] before:-z-10
      hover:before:scale-x-100
    `,

    // [深紫 风格] (白底 -> 紫)
    navy: `
      bg-white text-sumo-dark border border-gray-200
      hover:text-white hover:border-sumo-dark
      before:absolute before:inset-0 before:bg-sumo-dark
      before:origin-left before:scale-x-0 before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.22,1,0.36,1)] before:-z-10
      hover:before:scale-x-100
    `,

    // [新增：实心主色风格] (红底 -> 白底 + 红字)
    // 这种风格用于 CTA 区域，非常醒目且高级
    primary: `
      bg-sumo-red text-white border border-sumo-red
      hover:text-sumo-red hover:border-white
      /* 注意：这里没有 -z-10，因为我们需要白色层盖住原本的红色背景 */
      before:absolute before:inset-0 before:bg-white
      before:origin-left before:scale-x-0 before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.22,1,0.36,1)]
      hover:before:scale-x-100
    `,
  };

  // 3. 扫光特效
  const shineStyles = withShine
    ? `
    after:absolute after:top-0 after:-left-[100%] after:w-1/2 after:h-full 
    after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent
    after:-skew-x-[20deg] hover:after:left-[200%] hover:after:transition-[left] hover:after:duration-1000 after:transition-none
  `
    : "";

  const combinedClassName = cn(
    baseStyles,
    variants[variant],
    shineStyles,
    className,
  );

  // 渲染逻辑
  if (href) {
    return (
      <Link href={href} className={combinedClassName} {...props}>
        {/* 关键：z-10 确保文字永远浮在动画层(before)之上 */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

export default Button;
