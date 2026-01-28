"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createStaffAccount(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  try {
    // 1. 在 Supabase Auth 中直接创建用户
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true 
    });

    if (authError) {
      console.error("Auth Error:", authError.message);
      return { error: authError.message };
    }

    // 2. 在 Prisma 数据库中同步创建记录
    // 现在有了 schema 的支持，这里的 name 就不会报错了
    await prisma.user.create({
      data: {
        id: authUser.user.id,
        email: email,
        name: name,
        role: "ADMIN", 
      }
    });

    revalidatePath("/admin/settings");
    return { success: "管理者アカウントを作成しました。" };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "データベースの保存に失敗しました。" };
  }
}