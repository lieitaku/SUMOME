import React from "react";
import LoginForm from "@/components/manager/LoginForm";

// ✅ 强制动态渲染，跳过静态生成
// 这告诉 Next.js："这个页面不要在构建时跑，等用户访问时再跑"
export const dynamic = "force-dynamic";

export default function ManagerLoginPage() {
  return <LoginForm />;
}
