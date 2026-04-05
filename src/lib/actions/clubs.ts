"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
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
    nameEn: (formData.get("nameEn") as string) || "",
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    descriptionEn: (formData.get("descriptionEn") as string) || "",
    logo: formData.get("logo") as string,
    mainImage: formData.get("mainImage") as string,
    mainImagePosition: formData.get("mainImagePosition") as string,
    mainImageScale: formData.get("mainImageScale") as string,
    mainImageRotation: formData.get("mainImageRotation") as string,
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
  nameEn: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  logo: z.string().optional(),
  mainImage: z.string().optional(),
});

export async function createClub(formData: FormData) {
  // 注意：Create 时只校验基本信息，其他详细信息留到 Update 时再填
  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    nameEn: formData.get("nameEn"),
    description: formData.get("description"),
    descriptionEn: formData.get("descriptionEn"),
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
    const { nameEn, descriptionEn, ...restCreate } = validatedFields.data;
    await prisma.club.create({
      data: {
        ...restCreate,
        nameEn: nameEn?.trim() || null,
        descriptionEn: descriptionEn?.trim() || null,
        area: "未設定",
        address: "未設定",
        subImages: [], // 创建时默认为空数组
      },
    });
  } catch (error) {
    console.error("作成失敗:", error);
    return { error: "このIDは既に使われている可能性があります。" };
  }

  revalidatePath("/admin/clubs");
  revalidatePath("/clubs");
  revalidateTag("clubs");
  revalidateTag("admin-stats");

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
  nameEn: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  logo: z.string().optional(),
  mainImage: z.string().optional(),
  mainImagePosition: z.string().optional(),
  mainImageScale: z.string().optional(),
  mainImageRotation: z.string().optional(),

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
  const { id, slug: newSlug, nameEn, descriptionEn, ...rest } = validatedFields.data;
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

  const mainImageScaleNum =
    rest.mainImageScale != null && rest.mainImageScale !== ""
      ? (() => {
          const n = parseFloat(rest.mainImageScale as string);
          return Number.isNaN(n) ? undefined : Math.min(4, Math.max(1, n));
        })()
      : undefined;

  const mainImageRotationNum =
    rest.mainImageRotation != null && rest.mainImageRotation !== ""
      ? (() => {
          const n = parseInt(rest.mainImageRotation as string, 10);
          return [0, 90, 180, 270].includes(n) ? n : undefined;
        })()
      : undefined;

  const updateData = {
    ...rest,
    nameEn: nameEn?.trim() ? nameEn.trim() : null,
    descriptionEn: descriptionEn?.trim() ? descriptionEn.trim() : null,
    ...(slugToUpdate != null ? { slug: slugToUpdate } : {}),
    mainImageScale: mainImageScaleNum,
    mainImageRotation: mainImageRotationNum,
  };

  const doRevalidate = () => {
    revalidatePath("/admin/clubs");
    revalidatePath(`/admin/clubs/${id}`);
    revalidatePath("/admin/my-club");
    revalidatePath(`/clubs/${oldSlug}`);
    if (slugToUpdate) revalidatePath(`/clubs/${slugToUpdate}`);
    revalidateTag("clubs");
    revalidateTag("admin-stats");
  };

  try {
    await prisma.club.update({
      where: { id },
      data: updateData,
    });
    doRevalidate();
    return { success: true };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("更新失敗:", error);

    // mainImageRotation カラム未存在時は omit してリトライ（マイグレーション未適用対応）
    if (
      mainImageRotationNum != null &&
      /mainImageRotation|does not exist|column.*not found/i.test(errMsg)
    ) {
      try {
        const { mainImageRotation: _, ...dataWithoutRotation } = updateData;
        await prisma.club.update({
          where: { id },
          data: dataWithoutRotation,
        });
        doRevalidate();
        return { success: true };
      } catch (retryErr) {
        console.error("更新リトライ失敗:", retryErr);
        return { error: "データベースの更新に失敗しました。" };
      }
    }
    if (/mainImagePosition|mainImageScale|does not exist|column.*not found/i.test(errMsg)) {
      return {
        error:
          "データベースのマイグレーションが未適用の可能性があります。`npx prisma migrate deploy` を実行してください。",
      };
    }
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
    revalidateTag("clubs");
    revalidateTag("admin-stats");

    return { success: true };
  } catch (error) {
    console.error("削除失敗:", error);
    return { error: "削除に失敗しました。" };
  }
}

// ==============================================================================
// 4. 表示 / 非表示 切り替え用 (Toggle Hidden)
// ==============================================================================
export async function toggleClubHidden(id: string) {
  const [currentUser, club] = await Promise.all([
    getCurrentUser(),
    prisma.club.findUnique({
      where: { id },
      select: { slug: true, ownerId: true, hidden: true },
    }),
  ]);

  if (!currentUser) {
    return { error: "ログインしてください。" };
  }

  const isAdmin = currentUser.role === "ADMIN";
  if (!isAdmin && club?.ownerId !== currentUser.id) {
    return { error: "このクラブの編集権限がありません。" };
  }

  // ✨ 審査制ロジック：一般ユーザー(OWNER)は「非公開→公開」への変更不可
  if (!isAdmin && club.hidden === true) {
    return { error: "公開するには管理者の承認が必要です。事務局へご連絡ください。" };
  }

  if (!club) {
    return { error: "クラブが見つかりません。" };
  }

  try {
    await prisma.club.update({
      where: { id },
      data: { hidden: !club.hidden },
    });

    // 一覧・マイページ・詳細・トップなどを更新
    revalidatePath("/admin/clubs");
    revalidatePath("/admin/my-club");
    revalidatePath(`/clubs/${club.slug}`);
    revalidateTag("clubs");
    revalidateTag("admin-stats");
    revalidateTag("home-pickup");

    return { success: true };
  } catch (error) {
    console.error("非表示切り替え失敗:", error);
    return { error: "非表示ステータスの更新に失敗しました。" };
  }
}
