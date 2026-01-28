"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

// 定义验证规则
const MagazineSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  slug: z.string().min(1, "IDは必須です").regex(/^[a-z0-9-]+$/, "半角英数字のみ"),
  region: z.string().min(1, "地域を選択してください"), 
  issueDate: z.string().min(1, "発行日は必須です"),
  coverImage: z.string().optional(),
  // ✨ 验证图片数组
  images: z.array(z.string()).optional(), 
  pdfUrl: z.string().optional(),
  readLink: z.string().optional(),
  description: z.string().optional(),
  published: z.boolean().default(true),
});

/**
 * 创建杂志记录
 */
export async function createMagazine(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  
  // ✨ 关键：使用 getAll 获取同名的多个 "images" 字段
  const images = formData.getAll("images") as string[];

  const validated = MagazineSchema.safeParse({
    ...rawData,
    images, // 传入验证
    published: rawData.published === "true",
  });

  if (!validated.success) return { error: "入力内容に誤りがあります。" };

  try {
    await prisma.magazine.create({
      data: {
        title: validated.data.title,
        slug: validated.data.slug,
        region: validated.data.region,
        description: validated.data.description,
        coverImage: validated.data.coverImage,
        pdfUrl: validated.data.pdfUrl,
        readLink: validated.data.readLink,
        published: validated.data.published,
        issueDate: new Date(validated.data.issueDate),
        images: validated.data.images, // ✨ 保存图片数组
      },
    });
    
    // 刷新管理后台和前台的缓存
    revalidatePath("/admin/magazines");
    revalidatePath("/magazines");
    return { success: true };
  } catch (err) {
    // 捕获数据库唯一性冲突 (Slug 重复)
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return { error: "このID（Slug）は既に使用されています。" };
    }
    return { error: "保存に失敗しました。" };
  }
}

/**
 * 更新杂志记录
 */
export async function updateMagazine(id: string, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validated = MagazineSchema.safeParse({
    ...rawData,
    published: rawData.published === "true",
  });

  if (!validated.success) return { error: "入力内容を確認してください。" };

  try {
    const { slug, ...updateData } = validated.data;
    await prisma.magazine.update({
      where: { id },
      data: {
        ...updateData,
        issueDate: new Date(validated.data.issueDate),
      },
    });

    revalidatePath("/admin/magazines");
    revalidatePath("/magazines");
    return { success: true };
  } catch (err) {
    return { error: "更新に失敗しました。" };
  }
}

/**
 * 删除杂志记录
 */
export async function deleteMagazine(id: string) {
  try {
    await prisma.magazine.delete({ where: { id } });
    revalidatePath("/admin/magazines");
    revalidatePath("/magazines");
    return { success: true };
  } catch (err) {
    return { error: "削除に失敗しました。" };
  }
}