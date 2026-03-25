"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { prisma } from "@/lib/db";
import { z } from "zod";

export type VerifyResult = {
  verified?: boolean;
  userId?: string;
  error?: string;
};

export type ResetResult = {
  success?: boolean;
  error?: string;
};

const VerifySchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  clubName: z.string().min(1, "クラブ名は必須です"),
  name: z.string().min(1, "代表者氏名は必須です"),
});

const ResetSchema = z.object({
  userId: z.string().min(1),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
});

export async function verifyIdentity(
  email: string,
  clubName: string,
  name: string,
): Promise<VerifyResult> {
  const parsed = VerifySchema.safeParse({ email, clubName, name });
  if (!parsed.success) {
    return { error: "入力内容に不備があります。" };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: parsed.data.email,
        name: parsed.data.name,
        clubs: { some: { name: parsed.data.clubName } },
      },
      select: { id: true },
    });

    if (!user) {
      return { error: "入力内容が一致しません。登録時の情報を正確に入力してください。" };
    }

    return { verified: true, userId: user.id };
  } catch (e) {
    console.error("verifyIdentity error:", e);
    return { error: "サーバーエラーが発生しました。しばらくしてからお試しください。" };
  }
}

export async function resetPassword(
  userId: string,
  password: string,
): Promise<ResetResult> {
  const parsed = ResetSchema.safeParse({ userId, password });
  if (!parsed.success) {
    return { error: "パスワードは8文字以上で入力してください。" };
  }

  try {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      parsed.data.userId,
      { password: parsed.data.password },
    );

    if (error) {
      console.error("Supabase reset error:", error.message);
      return { error: "パスワードの更新に失敗しました。もう一度お試しください。" };
    }

    return { success: true };
  } catch (e) {
    console.error("resetPassword error:", e);
    return { error: "サーバーエラーが発生しました。しばらくしてからお試しください。" };
  }
}
