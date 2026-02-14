import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility Function: cn (ClassName Merger)
 * ------------------------------------------------------------------
 * 用于合并 Tailwind CSS 类名的工具函数。
 * 结合了 clsx 的条件逻辑和 tailwind-merge 的冲突解决能力。
 *
 * @example
 * cn("bg-red-500", isHover && "hover:bg-blue-500", "p-4 p-2")
 * // Output: "bg-red-500 hover:bg-blue-500 p-2" (自动去重，保留最后的 p-2)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 将 clubs 的 mainImagePosition 字符串（如 "50,50"）转为 CSS object-position 值。
 * 缺省或非法时返回 "50% 50%"。
 */
export function getMainImageObjectPosition(value: string | null | undefined): string {
  if (!value || typeof value !== "string") return "50% 50%";
  const parts = value.trim().split(",");
  if (parts.length !== 2) return "50% 50%";
  const x = Number(parts[0]);
  const y = Number(parts[1]);
  if (Number.isNaN(x) || Number.isNaN(y)) return "50% 50%";
  return `${Math.min(100, Math.max(0, x))}% ${Math.min(100, Math.max(0, y))}%`;
}
