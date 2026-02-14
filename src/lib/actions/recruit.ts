"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ApplicationStatus } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth-utils";

interface ApplicationInput {
  clubId: string;
  clubName: string;
  name: string;
  email: string;
  phone?: string;
  experience: string;
  message?: string;
}

export async function submitApplicationAction(data: ApplicationInput) {
  try {
    await prisma.application.create({
      data: {
        clubId: data.clubId,
        clubName: data.clubName,
        name: data.name,
        email: data.email,
        phone: data.phone,
        experience: data.experience,
        message: data.message,
        // 这里默认值已经是 pending，所以可以不写，或者写死：
        status: ApplicationStatus.pending, 
      },
    });
    revalidatePath("/admin/applications");
    return { success: true };
  } catch (error) {
    return { error: "送信に失敗しました。" };
  }
}

/**
 * 将 status 的类型从 string 改为 ApplicationStatus。
 * OWNER 只能更新自己俱乐部的申请；ADMIN 可更新全部。
 */
export async function updateApplicationStatusAction(id: string, status: ApplicationStatus) {
  const user = await getCurrentUser();
  if (!user) return { error: "ログインしてください。" };

  const app = await prisma.application.findUnique({ where: { id }, select: { clubId: true, club: { select: { ownerId: true } } } });
  if (!app) return { error: "申請が見つかりません。" };
  if (user.role === "OWNER" && app.club?.ownerId !== user.id) {
    return { error: "この申請の操作権限がありません。" };
  }

  try {
    await prisma.application.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/applications");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "ステータスの更新に失敗しました。" };
  }
}

/** OWNER 只能删除自己俱乐部的申请；ADMIN 可删除全部。 */
export async function deleteApplicationAction(id: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "ログインしてください。" };

  const app = await prisma.application.findUnique({ where: { id }, select: { club: { select: { ownerId: true } } } });
  if (!app) return { error: "申請が見つかりません。" };
  if (user.role === "OWNER" && app.club?.ownerId !== user.id) {
    return { error: "この申請の操作権限がありません。" };
  }

  try {
    await prisma.application.delete({ where: { id } });
    revalidatePath("/admin/applications");
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { error: "削除に失敗しました。" };
  }
}