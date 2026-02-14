"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth-utils";

// ==============================================================================
// 🛠️ 通用工具函数：解析 FormData
// ------------------------------------------------------------------------------
// 为什么要写这个？
// 1. 标准的 Object.fromEntries(formData) 无法处理 "subImages" 这种多值数组字段。
// 2. 它只能拿到数组的最后一个值。
// 3. 所以我们需要手动用 formData.getAll() 来获取数组。
// ==============================================================================
function parseFormData(formData: FormData) {
  return {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    logo: formData.get("logo") as string,
    mainImage: formData.get("mainImage") as string,
    mainImagePosition: formData.get("mainImagePosition") as string,
    zipCode: formData.get("zipCode") as string,
    area: formData.get("area") as string,
    city: formData.get("city") as string,
    address: formData.get("address") as string,
    mapUrl: formData.get("mapUrl") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string, // ✨ 新增邮箱
    website: formData.get("website") as string,
    instagram: formData.get("instagram") as string,
    twitter: formData.get("twitter") as string,
    schedule: formData.get("schedule") as string, // 存的是 JSON 字符串
    target: formData.get("target") as string,
    representative: formData.get("representative") as string,

    // ✨ 关键：获取所有名为 'subImages' 的值组成数组
    // 如果前端没传，getAll 会返回空数组 []
    subImages: formData.getAll("subImages") as string[],
  };
}

// ==============================================================================
// 1. 新規作成用 (Create)
// ==============================================================================

const CreateClubSchema = z.object({
  name: z.string().min(1, "クラブ名は必須です"),
  slug: z
    .string()
    .min(3, "IDは3文字以上で入力してください")
    .regex(
      /^[a-z0-9-]+$/,
      "IDは半角英小文字、数字、ハイフン(-)のみ使用可能です",
    ),
  description: z.string().optional(),
  logo: z.string().optional(),
  mainImage: z.string().optional(),
});

export async function createClub(formData: FormData) {
  // 注意：Create 时只校验基本信息，其他详细信息留到 Update 时再填
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
      details: validatedFields.error.flatten(),
    };
  }

  try {
    await prisma.club.create({
      data: {
        ...validatedFields.data,
        area: "未設定",
        address: "未設定",
        subImages: [], // 创建时默认为空数组
      },
    });
  } catch (error) {
    console.error("作成失敗:", error);
    return { error: "このIDは既に使われている可能性があります。" };
  }

  // ✨ 刷新缓存
  revalidatePath("/admin/clubs");
  revalidatePath("/clubs");

  // ✅ 返回成功对象，让前端 Hook 接管跳转
  return { success: true };
}

// ==============================================================================
// 2. 編集・更新用 (Update)
// ==============================================================================

const slugSchema = z
  .string()
  .min(3, "IDは3文字以上で入力してください")
  .regex(/^[a-z0-9-]+$/, "IDは半角英小文字、数字、ハイフン(-)のみ使用可能です");

const UpdateClubSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "クラブ名は必須です"),
  slug: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  mainImage: z.string().optional(),
  mainImagePosition: z.string().optional(),

  // ✨ 新增：副图验证 (虽然前端已经验证了，后端最好再做一次双重保险)
  subImages: z.array(z.string()).optional(),

  zipCode: z.string().optional(),
  area: z.string().min(1, "都道府県は必須です"),
  city: z.string().optional(),
  address: z.string().min(1, "住所は必須です"),
  mapUrl: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(), // ✨ 验证邮箱
  website: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  schedule: z.string().optional(),
  target: z.string().optional(),
  representative: z.string().optional(),
});

export async function updateClub(formData: FormData) {
  // 1. 使用辅助函数正确解析数据 (包括 subImages 数组)
  const rawData = parseFormData(formData);

  // 2. Zod 校验
  const validatedFields = UpdateClubSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: "入力内容に誤りがあります。",
      details: validatedFields.error.flatten(),
    };
  }

  const [currentUser, currentClub] = await Promise.all([
    getCurrentUser(),
    prisma.club.findUnique({
      where: { id: validatedFields.data.id },
      select: { slug: true, ownerId: true },
    }),
  ]);

  if (!currentUser) {
    return { error: "ログインしてください。" };
  }
  const isAdmin = currentUser.role === "ADMIN";
  if (!isAdmin && currentClub?.ownerId !== currentUser.id) {
    return { error: "このクラブの編集権限がありません。" };
  }
  const { id, slug: newSlug, ...rest } = validatedFields.data;
  const oldSlug = currentClub?.slug ?? "";

  // 管理者のみ slug 変更可。変更する場合は形式・重複チェック。
  let slugToUpdate: string | undefined;
  if (isAdmin && newSlug != null && newSlug.trim() !== "" && newSlug !== oldSlug) {
    const slugCheck = slugSchema.safeParse(newSlug);
    if (!slugCheck.success) {
      const msg = slugCheck.error.issues[0]?.message ?? "IDの形式が正しくありません。";
      return {
        error: msg,
        details: { fieldErrors: { slug: slugCheck.error.issues.map((e) => e.message) } },
      };
    }
    const existing = await prisma.club.findFirst({
      where: { slug: newSlug, id: { not: id } },
      select: { id: true },
    });
    if (existing) {
      return { error: "このクラブIDは既に使われています。" };
    }
    slugToUpdate = newSlug;
  }

  const updateData = slugToUpdate != null ? { ...rest, slug: slugToUpdate } : rest;

  try {
    await prisma.club.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/clubs");
    revalidatePath(`/admin/clubs/${id}`);
    revalidatePath("/admin/my-club");
    revalidatePath(`/clubs/${oldSlug}`);
    if (slugToUpdate) revalidatePath(`/clubs/${slugToUpdate}`);

    return { success: true };
  } catch (error) {
    console.error("更新失敗:", error);
    return { error: "データベースの更新に失敗しました。" };
  }
}

// ==============================================================================
// 3. 削除用 (Delete)
// ==============================================================================
export async function deleteClub(id: string) {
  const [currentUser, club] = await Promise.all([
    getCurrentUser(),
    prisma.club.findUnique({
      where: { id },
      select: { slug: true, ownerId: true },
    }),
  ]);
  if (!currentUser) {
    return { error: "ログインしてください。" };
  }
  if (currentUser.role !== "ADMIN" && club?.ownerId !== currentUser.id) {
    return { error: "このクラブの削除権限がありません。" };
  }
  if (!club) {
    return { error: "クラブが見つかりません。" };
  }

  try {
    await prisma.club.delete({ where: { id } });

    revalidatePath("/admin/clubs");
    revalidatePath("/admin/my-club");
    revalidatePath(`/clubs/${club.slug}`);

    return { success: true };
  } catch (error) {
    console.error("削除失敗:", error);
    return { error: "削除に失敗しました。" };
  }
}
