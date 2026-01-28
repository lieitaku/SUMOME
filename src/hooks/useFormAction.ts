"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * useFormAction 配置项
 */
interface UseFormActionProps {
  successMessage?: string; // 成功时提示的内容
  redirectUrl?: string;    // 成功后跳转的路径（可选）
}

/**
 * Server Action 返回结果的通用类型定义
 */
type ActionResult = {
  error?: string;
  success?: unknown;
  [key: string]: unknown;
} | void | undefined;

/**
 * 通用表单操作钩子
 * 功能：处理 Loading 状态、显示 Toast 反馈、处理重定向冲突
 */
export function useFormAction({ 
  successMessage = "正常に保存されました", 
  redirectUrl 
}: UseFormActionProps = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  /**
   * 提交处理函数
   * @param action 服务器端的 Server Action 函数
   * @param data 要传递给 action 的数据
   */
  const handleSubmit = async <T>(
    action: (data: T) => Promise<ActionResult>,
    data: T
  ) => {
    setIsSubmitting(true);
    
    try {
      // 1. 执行服务器操作
      const result = await action(data);

      // 2. 逻辑错误检查 (如果返回结果中包含 error 字符串)
      if (result && typeof result === 'object' && 'error' in result && typeof result.error === 'string') {
        toast.error("保存中にエラーが発生しました", {
          description: result.error,
        });
        setIsSubmitting(false);
        return false;
      } 
      
      // 3. 成功反馈
      // 弹出成功提示，Sonner 默认会在页面跳转时持久化显示
      toast.success(successMessage);
      
      // 4. 处理跳转逻辑
      if (redirectUrl) {
        // 稍微延迟 100ms 以确保 Toast 动画开始执行
        setTimeout(() => {
          router.push(redirectUrl);
          router.refresh();
        }, 100);
      } else {
        router.refresh(); // 不跳转，仅刷新当前页面数据
        setIsSubmitting(false);
      }
      return true;

    } catch (e) {
      // ✨ 核心修复：处理 Next.js 内部的重定向错误
      const errorMessage = e instanceof Error ? e.message : String(e);
      
      if (errorMessage.includes("NEXT_REDIRECT")) {
        // 这是 Next.js 正常的跳转信号，静默处理即可
        return true;
      }

      // 处理真实的网络或代码错误
      console.error("Form execution error:", e);
      toast.error("通信エラー", { description: "サーバーとの通信に失敗しました" });
      setIsSubmitting(false);
      return false;
    }
  };

  return { isSubmitting, handleSubmit };
}