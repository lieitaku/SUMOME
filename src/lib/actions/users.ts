"use server";

import { supabaseAdmin } from "@/lib/supabase/admin"; // 用于管理员操作 (创建别人)
import { createClient } from "@/lib/supabase/server"; // 用于当前用户操作 (修改自己)
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/navigation";
import { authErrorToJapanese } from "@/lib/auth-error-messages";
import { confirmAdmin } from "@/lib/auth-utils";

/**
 * ==============================================================================
 * 1. 创建管理员账户 (Create Staff Account)
 * ------------------------------------------------------------------------------
 * 权限：仅限 ADMIN 角色调用
 * 逻辑：在 Supabase Auth 和 Prisma DB 中同步创建记录
 * ==============================================================================
 */
export async function createStaffAccount(formData: FormData) {
  const admin = await confirmAdmin();
  if (!admin) {
    return { error: "権限がありません。" };
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  // 简单的后端校验
  if (!email || !password || !name) {
    return { error: "すべての項目を入力してください。" };
  }

  try {
    // 1. 在 Supabase Auth 中直接创建用户 (无需发送确认邮件)
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // 自动确认邮箱
        user_metadata: { name: name }, // 将名字也存入 metadata 方便 Supabase 端读取
      });

    if (authError) {
      console.error("Auth Error:", authError.message);
      return { error: authErrorToJapanese(authError.message) };
    }

    if (!authUser.user) {
      return { error: "ユーザーの作成に失敗しました。" };
    }

    // 2. 在 Prisma 数据库中同步创建记录
    await prisma.user.create({
      data: {
        id: authUser.user.id, // 关键：ID 必须与 Supabase Auth ID 一致
        email: email,
        name: name,
        role: "ADMIN", // 默认赋予管理员权限
      },
    });

    revalidatePath("/admin/settings");
    return { success: "管理者アカウントを作成しました。" };
  } catch (error) {
    console.error("Database Error:", error);
    // 处理 Prisma 唯一性约束错误 (P2002)
    if ((error as any).code === "P2002") {
      return { error: "このメールアドレスは既に登録されています。" };
    }
    return { error: "データベースの保存に失敗しました。" };
  }
}

/**
 * ==============================================================================
 * 2. 更新个人资料 (Update My Profile)
 * ------------------------------------------------------------------------------
 * 权限：登录用户 (ADMIN / OWNER)
 * 逻辑：更新 Prisma 中的 name 字段，同时同步 Supabase metadata
 * ==============================================================================
 */
export async function updateMyProfile(formData: FormData) {
  const name = formData.get("name") as string;

  if (!name) {
    return { error: "名前を入力してください。" };
  }

  try {
    // 1. 获取当前操作的用户客户端
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "認証されていません。" };
    }

    // 2. 更新 Prisma 数据库 (这是我们应用的主数据源)
    await prisma.user.update({
      where: { id: user.id },
      data: { name: name },
    });

    // 3. (可选) 同步更新 Supabase User Metadata，保持一致性
    await supabase.auth.updateUser({
      data: { name: name },
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Profile Update Error:", error);
    return { error: "プロフィールの更新に失敗しました。" };
  }
}

/**
 * ==============================================================================
 * 3. 修改密码 (Update Password)
 * ------------------------------------------------------------------------------
 * 权限：登录用户 (ADMIN / OWNER)
 * 逻辑：调用 Supabase Auth API 修改密码
 * ==============================================================================
 */
export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;

  if (!password || password.length < 8) {
    return { error: "パスワードは8文字以上で入力してください。" };
  }

  try {
    // 1. 获取当前用户客户端
    const supabase = await createClient();

    // 2. 调用 Supabase 修改密码接口
    // 注意：updateUser 只能修改 *当前登录用户* 的密码
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error("Password Update Error:", error.message);
      return {
        error: "パスワードの変更に失敗しました。もう一度お試しください。",
      };
    }

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("System Error:", error);
    return { error: "システムエラーが発生しました。" };
  }
}

/**
 * ==============================================================================
 * 4. 注销当前账户 (Delete My Account)
 * ------------------------------------------------------------------------------
 * 权限：登录用户 (ADMIN / OWNER)
 * 逻辑：OWNER 先删俱乐部（级联活动/申请）再删 User；ADMIN 校验最后一名及是否有投稿。
 *       然后删除 Prisma User、Supabase Auth 用户，登出并跳转首页。
 * ==============================================================================
 */
export async function deleteMyAccount(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return { error: "認証されていません。" };
  }

  const userId = authUser.id;
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      _count: { select: { activities: true } },
    },
  });

  if (!dbUser) {
    return { error: "ユーザーが見つかりません。" };
  }

  if (dbUser.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return { error: "最後の管理者のため削除できません。" };
    }
    if (dbUser._count.activities > 0) {
      return {
        error:
          "投稿した活動・ニュースがあるため削除できません。別の管理者に譲渡するか、該当コンテンツを削除してください。",
      };
    }
  }

  try {
    if (dbUser.role === "OWNER") {
      await prisma.club.deleteMany({ where: { ownerId: userId } });
    }
    await prisma.user.delete({ where: { id: userId } });

    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteAuthError) {
      console.error("Auth deleteUser Error:", deleteAuthError);
      return { error: "アカウントの削除に失敗しました。しばらくしてからお試しください。" };
    }

    await supabase.auth.signOut();
    revalidatePath("/", "layout");
  } catch (err) {
    console.error("deleteMyAccount Error:", err);
    return { error: "アカウントの削除に失敗しました。" };
  }

  redirect("/account-deleted");
}
