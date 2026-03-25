"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { authErrorToJapanese } from "@/lib/auth-error-messages";

export type SignUpState = {
  success?: boolean;
  message?: string;
  error?: {
    clubName?: string[];
    name?: string[];
    email?: string[];
    password?: string[];
  };
  inputs?: {
    clubName?: string;
    name?: string;
    email?: string;
  };
};

const SignUpSchema = z.object({
  clubName: z.string().min(1, "クラブ名は必須です"),
  name: z.string().min(1, "代表者氏は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
});

export async function signUp(
  prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const rawData = {
    clubName: formData.get("clubName") as string,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // 1. 校验输入
  const validatedFields = SignUpSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
      inputs: {
        clubName: rawData.clubName,
        name: rawData.name,
        email: rawData.email,
      },
    };
  }

  const { email, password, name, clubName } = validatedFields.data;

  // 2. Supabase Auth 注册（用 Admin API 仅为避免发确认邮件报错；角色由下方 Prisma 的 role: "OWNER" 决定，不是管理员）
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

  if (authError) {
    return {
      message: authErrorToJapanese(authError.message),
      inputs: { clubName, name, email },
    };
  }

  if (!authData.user) {
    return {
      message: "登録に失敗しました。",
      inputs: { clubName, name, email },
    };
  }

  // 3. Prisma 写入 User 表
  try {
    await prisma.user.create({
      data: {
        id: authData.user.id,
        email: email,
        name: name,
        role: "OWNER",
      },
    });

    await prisma.club.create({
      data: {
        name: clubName,
        slug: `club-${Date.now()}`,
        area: "未設定",
        address: "未設定",
        published: false,
        hidden: true, // ✨ デフォルトで非公開（審査制）
        ownerId: authData.user.id,
      },
    });
  } catch (dbError) {
    console.error("DB Error:", dbError);
    return {
      message: "データベースエラーが発生しました。",
      inputs: { clubName, name, email },
    };
  }

  return { success: true, inputs: { clubName, name, email } };
}
