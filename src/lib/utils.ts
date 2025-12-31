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
