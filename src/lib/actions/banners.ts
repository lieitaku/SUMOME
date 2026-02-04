"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { BannerCategory } from "@prisma/client";

// 获取所有 Banner（用于管理后台）
export async function getAllBanners() {
  return prisma.banner.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

// 获取激活的 Banner（用于前台显示）
export async function getActiveBanners() {
  return prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

// 按类别获取激活的 Banner
export async function getActiveBannersByCategory(category: BannerCategory) {
  return prisma.banner.findMany({
    where: { isActive: true, category },
    orderBy: { sortOrder: "asc" },
  });
}

// 创建 Banner
export async function createBanner(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const image = formData.get("image") as string;
    const alt = formData.get("alt") as string | null;
    const link = formData.get("link") as string | null;
    const category = (formData.get("category") as BannerCategory) || "club";
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

    if (!name || !image) {
      return { success: false, error: "名前と画像は必須です" };
    }

    await prisma.banner.create({
      data: {
        name,
        image,
        alt: alt || name,
        link: link || null,
        category,
        sortOrder,
        isActive: true,
      },
    });

    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create banner:", error);
    return { success: false, error: "バナーの作成に失敗しました" };
  }
}

// 更新 Banner
export async function updateBanner(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const image = formData.get("image") as string;
    const alt = formData.get("alt") as string | null;
    const link = formData.get("link") as string | null;
    const category = (formData.get("category") as BannerCategory) || "club";
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isActive = formData.get("isActive") === "true";

    if (!id || !name || !image) {
      return { success: false, error: "必須項目が不足しています" };
    }

    await prisma.banner.update({
      where: { id },
      data: {
        name,
        image,
        alt: alt || name,
        link: link || null,
        category,
        sortOrder,
        isActive,
      },
    });

    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update banner:", error);
    return { success: false, error: "バナーの更新に失敗しました" };
  }
}

// 切换 Banner 激活状态
export async function toggleBannerActive(id: string) {
  try {
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      return { success: false, error: "バナーが見つかりません" };
    }

    await prisma.banner.update({
      where: { id },
      data: { isActive: !banner.isActive },
    });

    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle banner:", error);
    return { success: false, error: "ステータスの変更に失敗しました" };
  }
}

// 更新排序
export async function updateBannerOrder(id: string, newOrder: number) {
  try {
    await prisma.banner.update({
      where: { id },
      data: { sortOrder: newOrder },
    });

    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update banner order:", error);
    return { success: false, error: "順序の更新に失敗しました" };
  }
}

// 删除 Banner
export async function deleteBanner(id: string) {
  try {
    await prisma.banner.delete({
      where: { id },
    });

    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete banner:", error);
    return { success: false, error: "バナーの削除に失敗しました" };
  }
}
