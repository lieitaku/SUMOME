"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { z } from "zod";

export type SignUpState = {
  message?: string;
  error?: {
    clubName?: string[];
    name?: string[];
    email?: string[];
    password?: string[];
  };
  // 新增：用于在前端回填用户之前输入的内容
  inputs?: {
    clubName?: string;
    name?: string;
    email?: string;
    // ⚠️ 安全规范：永远不要回显密码
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
  const supabase = await createClient();

  // 2. Supabase Auth 注册
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name: name },
    },
  });

  if (authError) {
    return {
      message: authError.message,
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

  // 4. 跳转
  redirect("/admin");
}
