"use server";

import { z } from "zod";
import { prisma } from "@/lib/db"; // 保持您原有的引用路径
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

// Zod Schema
const MagazineSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
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
  published: z.boolean(),
  images: z.array(z.string()),
});

// 解析 FormData 的辅助函数
function parseFormData(formData: FormData) {
  return {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    region: formData.get("region") as string,
    issueDate: formData.get("issueDate") as string,
    coverImage: (formData.get("coverImage") as string) || null,
    pdfUrl: (formData.get("pdfUrl") as string) || null,
    readLink: (formData.get("readLink") as string) || null,
    description: (formData.get("description") as string) || null,
    published: formData.get("published") === "true",
    images: formData.getAll("images") as string[],
  };
}

/**
 * 创建杂志
 */
export async function createMagazine(formData: FormData) {
  try {
    const rawData = parseFormData(formData);
    const validated = MagazineSchema.safeParse(rawData);

    if (!validated.success) {
      console.error("Validation Error:", validated.error);
      return { success: false, message: "入力内容に誤りがあります。" };
    }

    await prisma.magazine.create({
      data: validated.data,
    });

    revalidatePath("/admin/magazines");
    revalidatePath("/magazines");

    // ✅ 关键修改：返回成功状态，把控制权交给前端（前端会弹窗并跳转）
    return { success: true, message: "登録しました" };
  } catch (err) {
    console.error("Create Error:", err);
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return {
        success: false,
        message: "このID（Slug）は既に使用されています。",
      };
    }
    return { success: false, message: "保存に失敗しました。" };
  }
}

/**
 * 更新杂志
 */
export async function updateMagazine(id: string, formData: FormData) {
  try {
    const rawData = parseFormData(formData);
    const validated = MagazineSchema.safeParse(rawData);

    if (!validated.success) {
      console.error("Validation Error:", validated.error);
      return { success: false, message: "入力内容を確認してください。" };
    }

    const existing = await prisma.magazine.findFirst({
      where: { slug: validated.data.slug, NOT: { id: id } },
    });
    if (existing)
      return {
        success: false,
        message: "このID（Slug）は既に使用されています。",
      };

    await prisma.magazine.update({
      where: { id },
      data: validated.data,
    });

    // 刷新缓存
    revalidatePath("/admin/magazines");
    revalidatePath(`/admin/magazines/${id}`); // 确保 Description 刷新
    revalidatePath("/magazines");
    revalidatePath(`/magazines/${validated.data.slug}`);

    // ✅ 关键修改：返回成功状态
    return { success: true, message: "保存しました" };
  } catch (err) {
    console.error("Update Error:", err);
    return { success: false, message: "更新に失敗しました。" };
  }
}

/**
 * 删除杂志
 */
export async function deleteMagazine(id: string) {
  try {
    await prisma.magazine.delete({ where: { id } });
    revalidatePath("/admin/magazines");
    revalidatePath("/magazines");
    // ✅ 保持一致，返回成功状态
    return { success: true, message: "削除しました" };
  } catch (err) {
    console.error("Delete Error:", err);
    return { success: false, message: "削除に失敗しました。" };
  }
}
