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
  const inputs = { clubName, name, email };

  try {
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
        inputs,
      };
    }

    if (!authData?.user) {
      return {
        message: "登録に失敗しました。",
        inputs,
      };
    }

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
          hidden: true,
          ownerId: authData.user.id,
        },
      });
    } catch (dbError) {
      console.error("DB Error:", dbError);
      return {
        message: "データベースエラーが発生しました。",
        inputs,
      };
    }

    return { success: true, inputs };
  } catch (unexpected) {
    console.error("signUp unexpected error:", unexpected);
    return {
      message: "エラーが発生しました。もう一度お試しください。",
      inputs,
    };
  }
}
