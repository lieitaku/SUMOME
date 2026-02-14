"use server";

import { prisma } from "@/lib/db";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { BannerCategory, BannerDisplayMode, BannerSponsorTier } from "@prisma/client";

const BANNER_DISPLAY_SETTINGS_TAG = "banner-display-settings";

// ========== 旗子显示设置（各页面显示俱乐部/赞助商/全部/混合） ==========

const DEFAULT_DISPLAY_SETTINGS = {
  homeDisplayMode: "mixed" as BannerDisplayMode,
  homeSponsorTierFilter: "all" as "all" | "official_only",
  prefTopDisplayMode: "mixed" as BannerDisplayMode,
  prefSidebarDisplayMode: "mixed" as BannerDisplayMode,
};

/** 表是否存在（迁移未执行时会报错） */
function isTableMissingError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return msg.includes("does not exist") || msg.includes("BannerDisplaySetting");
}

async function getBannerDisplaySettingsUncached() {
  try {
    let row = await prisma.bannerDisplaySetting.findUnique({
      where: { id: "default" },
    });
    if (!row) {
      await prisma.bannerDisplaySetting.create({
        data: {
          id: "default",
          ...DEFAULT_DISPLAY_SETTINGS,
        },
      });
      row = await prisma.bannerDisplaySetting.findUnique({
        where: { id: "default" },
      });
    }
    const homeFilter = (row as { homeSponsorTierFilter?: string } | null)?.homeSponsorTierFilter;
    return {
      homeDisplayMode: (row?.homeDisplayMode ?? DEFAULT_DISPLAY_SETTINGS.homeDisplayMode) as BannerDisplayMode,
      homeSponsorTierFilter: (homeFilter === "official_only" ? "official_only" : "all") as "all" | "official_only",
      prefTopDisplayMode: (row?.prefTopDisplayMode ?? DEFAULT_DISPLAY_SETTINGS.prefTopDisplayMode) as BannerDisplayMode,
      prefSidebarDisplayMode: (row?.prefSidebarDisplayMode ?? DEFAULT_DISPLAY_SETTINGS.prefSidebarDisplayMode) as BannerDisplayMode,
    };
  } catch (error) {
    if (isTableMissingError(error)) {
      console.warn(
        "[getBannerDisplaySettings] 表 BannerDisplaySetting 尚未创建，请执行: npx prisma migrate deploy 或 npx prisma db push"
      );
      return { ...DEFAULT_DISPLAY_SETTINGS };
    }
    console.error("getBannerDisplaySettings:", error);
    return { ...DEFAULT_DISPLAY_SETTINGS };
  }
}

/** 获取旗子显示设置（前台 Home / Pref 用，无则返回默认；带缓存，后台更新时会失效） */
export async function getBannerDisplaySettings() {
  return unstable_cache(
    getBannerDisplaySettingsUncached,
    [BANNER_DISPLAY_SETTINGS_TAG],
    { revalidate: 60, tags: [BANNER_DISPLAY_SETTINGS_TAG] }
  )();
}

/** 更新旗子显示设置（后台用） */
export async function updateBannerDisplaySettings(formData: FormData) {
  try {
    const homeDisplayMode = (formData.get("homeDisplayMode") as BannerDisplayMode) || "mixed";
    const homeSponsorTierFilterRaw = formData.get("homeSponsorTierFilter") as string | null;
    const prefTopDisplayMode = (formData.get("prefTopDisplayMode") as BannerDisplayMode) || "mixed";
    const prefSidebarDisplayMode = (formData.get("prefSidebarDisplayMode") as BannerDisplayMode) || "mixed";

    const validModes: BannerDisplayMode[] = ["all", "club", "sponsor", "mixed"];
    const toMode = (v: string): BannerDisplayMode =>
      validModes.includes(v as BannerDisplayMode) ? (v as BannerDisplayMode) : "mixed";
    const homeSponsorTierFilter = homeSponsorTierFilterRaw === "official_only" ? "official_only" : "all";

    await prisma.bannerDisplaySetting.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        homeDisplayMode: toMode(homeDisplayMode),
        homeSponsorTierFilter,
        prefTopDisplayMode: toMode(prefTopDisplayMode),
        prefSidebarDisplayMode: toMode(prefSidebarDisplayMode),
      },
      update: {
        homeDisplayMode: toMode(homeDisplayMode),
        homeSponsorTierFilter,
        prefTopDisplayMode: toMode(prefTopDisplayMode),
        prefSidebarDisplayMode: toMode(prefSidebarDisplayMode),
      },
    });

    revalidatePath("/admin/banners");
    revalidatePath("/");
    revalidateTag(BANNER_DISPLAY_SETTINGS_TAG);
    return { success: true };
  } catch (error) {
    console.error("updateBannerDisplaySettings:", error);
    return { success: false, error: "表示設定の更新に失敗しました" };
  }
}

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
    const sponsorTierRaw = formData.get("sponsorTier") as string | null;
    const sponsorTier: BannerSponsorTier | null =
      category === "sponsor" && (sponsorTierRaw === "OFFICIAL" || sponsorTierRaw === "LOCAL")
        ? (sponsorTierRaw as BannerSponsorTier)
        : null;

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
        sponsorTier: category === "sponsor" ? (sponsorTier ?? "LOCAL") : null,
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
    const sponsorTierRaw = formData.get("sponsorTier") as string | null;
    const sponsorTier: BannerSponsorTier | null =
      category === "sponsor" && (sponsorTierRaw === "OFFICIAL" || sponsorTierRaw === "LOCAL")
        ? (sponsorTierRaw as BannerSponsorTier)
        : null;

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
        sponsorTier: category === "sponsor" ? (sponsorTier ?? "LOCAL") : null,
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
