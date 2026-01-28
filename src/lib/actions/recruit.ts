"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ApplicationStatus } from "@prisma/client";

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
 * 将 status 的类型从 string 改为 ApplicationStatus
 */
export async function updateApplicationStatusAction(id: string, status: ApplicationStatus) {
  try {
    await prisma.application.update({
      where: { id },
      data: { 
        status: status 
      },
    });
    revalidatePath("/admin/applications");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "ステータスの更新に失敗しました。" };
  }
}
// 删除
export async function deleteApplicationAction(id: string) {
  try {
    await prisma.application.delete({
      where: { id },
    });
    // 成功后刷新列表页缓存
    revalidatePath("/admin/applications");
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { error: "削除に失敗しました。" };
  }
}