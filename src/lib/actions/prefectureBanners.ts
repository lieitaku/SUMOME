"use server";

import { prisma } from "@/lib/db";
import { confirmAdmin } from "@/lib/auth-utils";
import { revalidatePath, revalidateTag } from "next/cache";

/** 获取单个都道府県的 Banner 配置 */
export async function getPrefectureBanner(pref: string) {
  return prisma.prefectureBanner.findUnique({
    where: { pref },
  });
}

/** 获取所有都道府県 Banner 配置（用于管理列表） */
export async function getAllPrefectureBanners() {
  return prisma.prefectureBanner.findMany({
    orderBy: { pref: "asc" },
  });
}

const UpsertSchema = {
  pref: (v: unknown) => typeof v === "string" && v.length > 0,
  image: (v: unknown) => typeof v === "string" && v.length > 0,
  alt: (v: unknown) => v == null || typeof v === "string",
};

function parsePosition(value: unknown): string {
  if (value == null || typeof value !== "string") return "50,50";
  const s = value.trim();
  const parts = s.split(",");
  if (parts.length !== 2) return "50,50";
  const x = Math.min(100, Math.max(0, Number(parts[0]) || 50));
  const y = Math.min(100, Math.max(0, Number(parts[1]) || 50));
  return `${Math.round(x)},${Math.round(y)}`;
}

function parseScale(value: unknown): number {
  if (value == null) return 1;
  const n = typeof value === "number" ? value : parseFloat(String(value).trim());
  if (Number.isNaN(n)) return 1;
  return Math.min(4, Math.max(1, n));
}

function parseRotation(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = parseInt(String(value).trim(), 10);
  return [0, 90, 180, 270].includes(n) ? n : null;
}

/** 创建或更新都道府県 Banner（有则更新，无则创建） */
export async function upsertPrefectureBanner(formData: FormData) {
  const admin = await confirmAdmin();
  if (!admin) return { error: "権限がありません。" };

  const pref = (formData.get("pref") as string)?.trim();
  const image = (formData.get("image") as string)?.trim();
  const alt = (formData.get("alt") as string)?.trim() || null;
  const imagePosition = parsePosition(formData.get("imagePosition"));
  const imageScale = parseScale(formData.get("imageScale"));
  const imageRotation = parseRotation(formData.get("imageRotation"));

  if (!UpsertSchema.pref(pref)) return { error: "都道府県を指定してください。" };
  if (!UpsertSchema.image(image)) return { error: "画像URLは必須です。" };
  if (!UpsertSchema.alt(alt)) return { error: "alt は文字列で指定してください。" };

  const featuredRaw = (formData.get("featuredClubId") as string)?.trim();
  const featuredClubId =
    featuredRaw && featuredRaw.length > 0 ? featuredRaw : null;

  const createData = {
    pref,
    image,
    alt,
    imagePosition,
    imageScale,
    featuredClubId,
    ...(imageRotation != null ? { imageRotation } : {}),
  };
  const updateData = {
    image,
    alt,
    imagePosition,
    imageScale,
    featuredClubId,
    ...(imageRotation != null ? { imageRotation } : {}),
  };

  try {
    await prisma.prefectureBanner.upsert({
      where: { pref },
      create: createData,
      update: updateData,
    });
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e);
    console.error("PrefectureBanner upsert failed:", e);

    // imageRotation カラム未存在時は omit してリトライ（マイグレーション未適用対応）
    if (imageRotation != null && /imageRotation|does not exist|column.*not found/i.test(errMsg)) {
      try {
        const { imageRotation: _, ...createWithoutRotation } = createData;
        const { imageRotation: __, ...updateWithoutRotation } = updateData;
        await prisma.prefectureBanner.upsert({
          where: { pref },
          create: createWithoutRotation,
          update: updateWithoutRotation,
        });
      } catch (retryErr) {
        console.error("PrefectureBanner upsert retry failed:", retryErr);
        return { error: "保存に失敗しました。" };
      }
    } else if (/featuredClubId/i.test(errMsg)) {
      const { featuredClubId: _fc, ...createNoFeatured } = createData;
      const { featuredClubId: __fc, ...updateNoFeatured } = updateData;
      try {
        await prisma.prefectureBanner.upsert({
          where: { pref },
          create: createNoFeatured,
          update: updateNoFeatured,
        });
      } catch (retryErr) {
        console.error("PrefectureBanner upsert (without featuredClubId) failed:", retryErr);
        return { error: "保存に失敗しました。マイグレーションを確認してください。" };
      }
    } else if (/imagePosition|imageScale|does not exist|column.*not found/i.test(errMsg)) {
      return { error: "データベースのマイグレーションが未適用の可能性があります。`npx prisma migrate deploy` を実行してください。" };
    } else {
      return { error: "保存に失敗しました。" };
    }
  }

  revalidatePath("/admin/prefecture-banners");
  revalidatePath(`/admin/prefecture-banners/${pref}`);
  revalidatePath(`/prefectures/${pref}`);
  revalidateTag("prefecture-banners");
  return { success: true };
}

/** 删除都道府県 Banner（恢复为静态默认） */
export async function deletePrefectureBanner(pref: string) {
  const admin = await confirmAdmin();
  if (!admin) return { error: "権限がありません。" };

  try {
    await prisma.prefectureBanner.delete({
      where: { pref },
    });
  } catch (e) {
    console.error("PrefectureBanner delete failed:", e);
    return { error: "削除に失敗しました。" };
  }

  revalidatePath("/admin/prefecture-banners");
  revalidatePath(`/prefectures/${pref}`);
  revalidateTag("prefecture-banners");
  return { success: true };
}
