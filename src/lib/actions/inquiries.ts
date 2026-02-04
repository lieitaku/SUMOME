"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InquiryStatus } from "@prisma/client";

// 创建询问（联系表单提交）
export async function createInquiry(formData: {
  name: string;
  furigana?: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
}) {
  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name: formData.name,
        furigana: formData.furigana || null,
        email: formData.email,
        phone: formData.phone || null,
        inquiryType: formData.inquiryType,
        message: formData.message,
        status: "unread",
      },
    });

    revalidatePath("/admin/inquiries");
    return { success: true, id: inquiry.id };
  } catch (error) {
    console.error("Failed to create inquiry:", error);
    return { success: false, error: "お問い合わせの送信に失敗しました" };
  }
}

// 更新询问状态
export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  try {
    await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error) {
    console.error("Failed to update inquiry status:", error);
    return { success: false, error: "ステータスの更新に失敗しました" };
  }
}

// 删除询问
export async function deleteInquiry(id: string) {
  try {
    await prisma.inquiry.delete({
      where: { id },
    });

    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete inquiry:", error);
    return { success: false, error: "削除に失敗しました" };
  }
}
