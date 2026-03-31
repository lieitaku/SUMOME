import React from "react";
// 引入刚才拆分出去的客户端组件
import RegistrationForm from "@/components/manager/RegistrationForm";

// ✅ 核心修复：强制动态渲染，跳过静态生成
// 这告诉 Next.js："这个页面不要在构建时跑，等用户访问时再跑"
export const dynamic = "force-dynamic";

/** 新規登録 Server Action が冷スタート + 外部 API + DB でタイムアウトしにくくする（Vercel プランに応じて上限はクランプ） */
export const maxDuration = 60;

export default function ManagerEntryPage() {
  return (
    // 直接渲染表单组件
    <RegistrationForm />
  );
}