"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

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
  return Math.min(2, Math.max(1, n));
}

/** 创建或更新都道府県 Banner（有则更新，无则创建） */
export async function upsertPrefectureBanner(formData: FormData) {
  const pref = (formData.get("pref") as string)?.trim();
  const image = (formData.get("image") as string)?.trim();
  const alt = (formData.get("alt") as string)?.trim() || null;
  const imagePosition = parsePosition(formData.get("imagePosition"));
  const imageScale = parseScale(formData.get("imageScale"));

  if (!UpsertSchema.pref(pref)) return { error: "都道府県を指定してください。" };
  if (!UpsertSchema.image(image)) return { error: "画像URLは必須です。" };
  if (!UpsertSchema.alt(alt)) return { error: "alt は文字列で指定してください。" };

  try {
    await prisma.prefectureBanner.upsert({
      where: { pref },
      create: { pref, image, alt, imagePosition, imageScale },
      update: { image, alt, imagePosition, imageScale },
    });
  } catch (e) {
    console.error("PrefectureBanner upsert failed:", e);
    return { error: "保存に失敗しました。" };
  }

  revalidatePath("/admin/prefecture-banners");
  revalidatePath(`/admin/prefecture-banners/${pref}`);
  revalidatePath(`/prefectures/${pref}`);
  return { success: true };
}

/** 删除都道府県 Banner（恢复为静态默认） */
export async function deletePrefectureBanner(pref: string) {
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
  return { success: true };
}
