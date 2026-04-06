"use server";

import { prisma } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { confirmAdmin } from "@/lib/auth-utils";
import { InquiryStatus } from "@prisma/client";
import nodemailer from "nodemailer";

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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
    revalidateTag("admin-stats");
    return { success: true, id: inquiry.id };
  } catch (error) {
    console.error("Failed to create inquiry:", error);
    return { success: false, error: "お問い合わせの送信に失敗しました" };
  }
}

// 更新询问状态
export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  const admin = await confirmAdmin();
  if (!admin) return { success: false, error: "権限がありません。" };

  try {
    await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/inquiries");
    revalidateTag("admin-stats");
    return { success: true };
  } catch (error) {
    console.error("Failed to update inquiry status:", error);
    return { success: false, error: "ステータスの更新に失敗しました" };
  }
}

// 返信
export async function replyToInquiry(id: string, body: string) {
  const admin = await confirmAdmin();
  if (!admin) return { success: false, error: "権限がありません。" };

  const trimmed = body.trim();
  if (!trimmed) return { success: false, error: "返信内容を入力してください。" };
  if (trimmed.length > 2000) return { success: false, error: "返信内容は2000文字以内で入力してください。" };

  const inquiry = await prisma.inquiry.findUnique({ where: { id } });
  if (!inquiry) return { success: false, error: "お問い合わせが見つかりません。" };

  const subject = `Re: お問い合わせ（${inquiry.inquiryType}）`;
  const text = [
    `${inquiry.name} 様`,
    "",
    "この度はお問い合わせいただきありがとうございます。",
    "以下の通りご回答いたします。",
    "",
    trimmed,
    "",
    "──────────────────────",
    "【お問い合わせ内容】",
    inquiry.message,
    "──────────────────────",
    "",
    "※本メールはシステムから自動送信されています。",
    `※ご不明な点は ${process.env.EMAIL_REPLY_TO} までご連絡ください。`,
  ].join("\n");

  try {
    await mailer.sendMail({
      from: `SUMOME <${process.env.EMAIL_FROM}>`,
      replyTo: process.env.EMAIL_REPLY_TO,
      to: inquiry.email,
      subject,
      text,
    });
  } catch (err) {
    console.error("Failed to send reply email:", err);
    return { success: false, error: "メールの送信に失敗しました。時間をおいて再度お試しください。" };
  }

  try {
    await prisma.inquiry.update({
      where: { id },
      data: {
        status: "replied",
        repliedAt: new Date(),
        lastReplyBody: trimmed,
      },
    });
    revalidatePath("/admin/inquiries");
    revalidateTag("admin-stats");
    return { success: true };
  } catch (err) {
    console.error("Failed to update inquiry after reply:", err);
    return { success: false, error: "メールは送信されましたが、ステータスの更新に失敗しました。" };
  }
}

// 删除询问
export async function deleteInquiry(id: string) {
  const admin = await confirmAdmin();
  if (!admin) return { success: false, error: "権限がありません。" };

  try {
    await prisma.inquiry.delete({
      where: { id },
    });

    revalidatePath("/admin/inquiries");
    revalidateTag("admin-stats");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete inquiry:", error);
    return { success: false, error: "削除に失敗しました" };
  }
}
