"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ==========================================
// 1. 新規作成用 (Create)
// ==========================================

const CreateClubSchema = z.object({
  name: z.string().min(1, "クラブ名は必須です"),
  slug: z.string()
    .min(3, "IDは3文字以上で入力してください")
    .regex(/^[a-z0-9-]+$/, "IDは半角英小文字、数字、ハイフン(-)のみ使用可能です"),
  description: z.string().optional(),
  logo: z.string().optional(),
  mainImage: z.string().optional(),
});

export async function createClub(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    logo: formData.get("logo"),
    mainImage: formData.get("mainImage"),
  };

  const validatedFields = CreateClubSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: "入力内容に誤りがあります。",
      details: validatedFields.error.flatten()
    };
  }

  try {
    await prisma.club.create({
      data: {
        ...validatedFields.data,
        area: "未設定",
        address: "未設定",
      },
    });
  } catch (error) {
    console.error("作成失敗:", error);
    return { error: "このIDは既に使われている可能性があります。" };
  }

  // ✨ 优化点：刷新相关路径，确保数据最新
  revalidatePath("/admin/clubs");
  revalidatePath("/clubs"); 

  // ❌ 删除了 redirect("/admin/clubs");
  // ✅ 返回成功对象，让前端 Hook 接管跳转和弹窗
  return { success: true }; 
}

// ==========================================
// 2. 編集・更新用 (Update) 
// ==========================================

const UpdateClubSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "クラブ名は必須です"),
  slug: z.string().optional(), 
  description: z.string().optional(),
  logo: z.string().optional(),
  mainImage: z.string().optional(),
  zipCode: z.string().optional(),
  area: z.string().min(1, "都道府県は必須です"),
  city: z.string().optional(),
  address: z.string().min(1, "住所は必須です"),
  mapUrl: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  schedule: z.string().optional(),
  target: z.string().optional(),
  representative: z.string().optional(),
});

export async function updateClub(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = UpdateClubSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { 
      error: "入力内容に誤りがあります。", 
      details: validatedFields.error.flatten() 
    };
  }

  try {
    const { id, slug, ...updateData } = validatedFields.data;

    await prisma.club.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/clubs");
    revalidatePath(`/admin/clubs/${id}`);
    revalidatePath(`/clubs/${slug}`); // 同时也刷新前台展示页

    return { success: true };
  } catch (error) {
    console.error("更新失敗:", error);
    return { error: "データベースの更新に失敗しました。" };
  }
}

// ==========================================
// 3. 削除用 (Delete)
// ==========================================
export async function deleteClub(id: string) {
  try {
    // 1. 先查一下 slug，为了刷新前台路径
    const club = await prisma.club.findUnique({ where: { id }, select: { slug: true } });
    
    // 2. 执行删除
    await prisma.club.delete({ where: { id } });
    
    // 3. 刷新相关缓存
    revalidatePath("/admin/clubs");
    if (club) revalidatePath(`/clubs/${club.slug}`);

    return { success: true };
  } catch (error) {
    console.error("削除失敗:", error);
    return { error: "削除に失敗しました。" };
  }
}