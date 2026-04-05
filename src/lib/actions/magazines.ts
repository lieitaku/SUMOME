"use server";

import { z } from "zod";
import { prisma } from "@/lib/db"; // 保持您原有的引用路径
import { revalidatePath, revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { confirmAdmin } from "@/lib/auth-utils";

// Zod Schema
const MagazineSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  titleEn: z.string().optional().nullable(),
  slug: z
    .string()
    .min(1, "IDは必須です")
    .regex(/^[a-z0-9-]+$/, "半角英数字とハイフンのみ"),
  region: z.string().min(1, "地域を選択してください"),
  issueDate: z.string().transform((str) => new Date(str)),
  coverImage: z.string().optional().nullable(),
  pdfUrl: z.string().optional().nullable(),
  readLink: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  published: z.boolean(),
  images: z.array(z.string()),
  readingDirection: z.enum(["ltr", "rtl"]).default("ltr"),
});

// 解析 FormData 的辅助函数
function parseFormData(formData: FormData) {
  return {
    title: formData.get("title") as string,
    titleEn: (formData.get("titleEn") as string) || null,
    slug: formData.get("slug") as string,
    region: formData.get("region") as string,
    issueDate: formData.get("issueDate") as string,
    coverImage: (formData.get("coverImage") as string) || null,
    pdfUrl: (formData.get("pdfUrl") as string) || null,
    readLink: (formData.get("readLink") as string) || null,
    description: (formData.get("description") as string) || null,
    descriptionEn: (formData.get("descriptionEn") as string) || null,
    published: formData.get("published") === "true",
    images: formData.getAll("images") as string[],
    readingDirection:
      formData.get("readingDirection") === "rtl" ? "rtl" : "ltr",
  };
}

/**
 * 创建杂志
 */
export async function createMagazine(formData: FormData) {
    const admin = await confirmAdmin();
    if (!admin) return { error: "権限がありません。" };

  try {
    const rawData = parseFormData(formData);
    const validated = MagazineSchema.safeParse(rawData);

    if (!validated.success) {
      console.error("Validation Error:", validated.error);
      return { error: "入力内容に誤りがあります。" };
    }

    await prisma.magazine.create({
      data: validated.data,
    });

    revalidatePath("/admin/magazines");
    revalidatePath("/magazines");
    revalidateTag("magazines");
    revalidateTag("admin-stats");

    return { success: true, message: "登録しました" };
  } catch (err) {
    console.error("Create Error:", err);
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return { error: "このID（Slug）は既に使用されています。" };
    }
    return { error: "保存に失敗しました。" };
  }
}

/**
 * 更新杂志
 */
export async function updateMagazine(id: string, formData: FormData) {
  const admin = await confirmAdmin();
  if (!admin) return { error: "権限がありません。" };

  try {
    const rawData = parseFormData(formData);
    const validated = MagazineSchema.safeParse(rawData);

    if (!validated.success) {
      console.error("Validation Error:", validated.error);
      return { error: "入力内容を確認してください。" };
    }

    const existing = await prisma.magazine.findFirst({
      where: { slug: validated.data.slug, NOT: { id: id } },
    });
    if (existing) return { error: "このID（Slug）は既に使用されています。" };

    await prisma.magazine.update({
      where: { id },
      data: validated.data,
    });

    revalidatePath("/admin/magazines");
    revalidatePath(`/admin/magazines/${id}`);
    revalidatePath("/magazines");
    revalidatePath(`/magazines/${validated.data.slug}`);
    revalidateTag("magazines");
    revalidateTag("admin-stats");

    return { success: true, message: "保存しました" };
  } catch (err) {
    console.error("Update Error:", err);
    return { error: "更新に失敗しました。" };
  }
}

/**
 * 删除杂志
 */
export async function deleteMagazine(id: string) {
  const admin = await confirmAdmin();
  if (!admin) return { success: false, message: "権限がありません。" };

  try {
    await prisma.magazine.delete({ where: { id } });
    revalidatePath("/admin/magazines");
    revalidatePath("/magazines");
    revalidateTag("magazines");
    revalidateTag("admin-stats");

    return { success: true, message: "削除しました" };
  } catch (err) {
    console.error("Delete Error:", err);
    return { success: false, message: "削除に失敗しました。" };
  }
}

// ==============================================================================
// 表示 / 非表示 切り替え (Toggle Hidden) — クラブ編集と同様の管理者向けロジック
// ==============================================================================
export async function toggleMagazineHidden(id: string) {
  const admin = await confirmAdmin();
  if (!admin) {
    return { error: "権限がありません。" };
  }

  const magazine = await prisma.magazine.findUnique({
    where: { id },
    select: { slug: true, hidden: true },
  });

  if (!magazine) {
    return { error: "広報誌が見つかりません。" };
  }

  try {
    await prisma.magazine.update({
      where: { id },
      data: { hidden: !magazine.hidden },
    });

    revalidatePath("/admin/magazines");
    revalidatePath(`/admin/magazines/${id}`);
    revalidatePath("/magazines");
    revalidatePath(`/magazines/${magazine.slug}`);
    revalidateTag("magazines");
    revalidateTag("admin-stats");

    return { success: true };
  } catch (error) {
    console.error("非表示切り替え失敗:", error);
    return { error: "非表示ステータスの更新に失敗しました。" };
  }
}
