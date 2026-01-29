"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server"; // 假设你有这个 Supabase server client
import { revalidatePath } from "next/cache";

export async function signOut() {
  const supabase = await createClient();

  // 1. 执行 Supabase 登出
  await supabase.auth.signOut();

  // 2. 清除缓存 (防止用户点“后退”按钮看到缓存的敏感页面)
  revalidatePath("/", "layout");

  // 3. 重定向到登录页 (或者首页 "/")
  // 对于 Admin 系统，通常跳回 /login 比较合理
  redirect("/manager/login");
}
