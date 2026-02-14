"use server";

import { prisma } from "@/lib/db";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { BannerCategory, BannerDisplayMode, BannerSponsorTier } from "@prisma/client";

const BANNER_DISPLAY_SETTINGS_TAG = "banner-display-settings";

// ========== 旗子显示设置（各页面显示俱乐部/赞助商/全部/混合） ==========

export type SponsorTierFilter = "all" | "official_only" | "local_only";

const DEFAULT_DISPLAY_SETTINGS = {
  homeDisplayMode: "mixed" as BannerDisplayMode,
  homeSponsorTierFilter: "all" as SponsorTierFilter,
  prefTopDisplayMode: "mixed" as BannerDisplayMode,
  prefTopSponsorTierFilter: "all" as SponsorTierFilter,
  prefSidebarDisplayMode: "mixed" as BannerDisplayMode,
  prefSidebarSponsorTierFilter: "all" as SponsorTierFilter,
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
    const r = row as {
      homeSponsorTierFilter?: string;
      prefTopSponsorTierFilter?: string;
      prefSidebarSponsorTierFilter?: string;
    } | null;
    const toSponsorFilter = (v: string | undefined): SponsorTierFilter =>
      v === "official_only" || v === "local_only" ? v : "all";
    return {
      homeDisplayMode: (row?.homeDisplayMode ?? DEFAULT_DISPLAY_SETTINGS.homeDisplayMode) as BannerDisplayMode,
      homeSponsorTierFilter: toSponsorFilter(r?.homeSponsorTierFilter),
      prefTopDisplayMode: (row?.prefTopDisplayMode ?? DEFAULT_DISPLAY_SETTINGS.prefTopDisplayMode) as BannerDisplayMode,
      prefTopSponsorTierFilter: toSponsorFilter(r?.prefTopSponsorTierFilter),
      prefSidebarDisplayMode: (row?.prefSidebarDisplayMode ?? DEFAULT_DISPLAY_SETTINGS.prefSidebarDisplayMode) as BannerDisplayMode,
      prefSidebarSponsorTierFilter: toSponsorFilter(r?.prefSidebarSponsorTierFilter),
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
    const prefTopSponsorTierFilterRaw = formData.get("prefTopSponsorTierFilter") as string | null;
    const prefSidebarDisplayMode = (formData.get("prefSidebarDisplayMode") as BannerDisplayMode) || "mixed";
    const prefSidebarSponsorTierFilterRaw = formData.get("prefSidebarSponsorTierFilter") as string | null;

    const validModes: BannerDisplayMode[] = ["all", "club", "sponsor", "mixed"];
    const toMode = (v: string): BannerDisplayMode =>
      validModes.includes(v as BannerDisplayMode) ? (v as BannerDisplayMode) : "mixed";
    const toSponsorFilter = (v: string | null): SponsorTierFilter =>
      v === "official_only" || v === "local_only" ? v : "all";
    const homeSponsorTierFilter = toSponsorFilter(homeSponsorTierFilterRaw);
    const prefTopSponsorTierFilter = toSponsorFilter(prefTopSponsorTierFilterRaw);
    const prefSidebarSponsorTierFilter = toSponsorFilter(prefSidebarSponsorTierFilterRaw);

    await prisma.bannerDisplaySetting.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        homeDisplayMode: toMode(homeDisplayMode),
        homeSponsorTierFilter,
        prefTopDisplayMode: toMode(prefTopDisplayMode),
        prefTopSponsorTierFilter,
        prefSidebarDisplayMode: toMode(prefSidebarDisplayMode),
        prefSidebarSponsorTierFilter,
      },
      update: {
        homeDisplayMode: toMode(homeDisplayMode),
        homeSponsorTierFilter,
        prefTopDisplayMode: toMode(prefTopDisplayMode),
        prefTopSponsorTierFilter,
        prefSidebarDisplayMode: toMode(prefSidebarDisplayMode),
        prefSidebarSponsorTierFilter,
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

// 获取所有 Banner（用于管理后台）；按类别内排序（クラブ / 赞助商各自 1,2,3…）
export async function getAllBanners() {
  return prisma.banner.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
}

// 获取激活的 Banner（用于前台显示）；按类别内排序
export async function getActiveBanners() {
  return prisma.banner.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
}

// 按类别获取激活的 Banner
export async function getActiveBannersByCategory(category: BannerCategory) {
  return prisma.banner.findMany({
    where: { isActive: true, category },
    orderBy: { sortOrder: "asc" },
  });
}

// 创建 Banner（同类别内 sortOrder 自动取 max+1，新条目排到该类别最后）
export async function createBanner(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const image = formData.get("image") as string;
    const alt = formData.get("alt") as string | null;
    const link = formData.get("link") as string | null;
    const category = (formData.get("category") as BannerCategory) || "club";
    const sponsorTierRaw = formData.get("sponsorTier") as string | null;
    const sponsorTier: BannerSponsorTier | null =
      category === "sponsor" && (sponsorTierRaw === "OFFICIAL" || sponsorTierRaw === "LOCAL")
        ? (sponsorTierRaw as BannerSponsorTier)
        : null;

    if (!name || !image) {
      return { success: false, error: "名前と画像は必須です" };
    }

    const maxResult = await prisma.banner.aggregate({
      where: { category },
      _max: { sortOrder: true },
    });
    const sortOrder = (maxResult._max.sortOrder ?? -1) + 1;

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

// 更新 Banner（sortOrder 变更时在同类别内做「插入并顺延」）
export async function updateBanner(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const image = formData.get("image") as string;
    const alt = formData.get("alt") as string | null;
    const link = formData.get("link") as string | null;
    const category = (formData.get("category") as BannerCategory) || "club";
    const newOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isActive = formData.get("isActive") === "true";
    const sponsorTierRaw = formData.get("sponsorTier") as string | null;
    const sponsorTier: BannerSponsorTier | null =
      category === "sponsor" && (sponsorTierRaw === "OFFICIAL" || sponsorTierRaw === "LOCAL")
        ? (sponsorTierRaw as BannerSponsorTier)
        : null;

    if (!id || !name || !image) {
      return { success: false, error: "必須項目が不足しています" };
    }

    const current = await prisma.banner.findUnique({ where: { id }, select: { sortOrder: true, category: true } });
    if (!current) {
      return { success: false, error: "バナーが見つかりません" };
    }
    const oldOrder = current.sortOrder;

    await prisma.$transaction(async (tx) => {
      if (newOrder !== oldOrder) {
        if (newOrder < oldOrder) {
          const others = await tx.banner.findMany({
            where: {
              category: current.category,
              id: { not: id },
              sortOrder: { gte: newOrder, lt: oldOrder },
            },
            orderBy: { sortOrder: "desc" },
          });
          for (const o of others) {
            await tx.banner.update({ where: { id: o.id }, data: { sortOrder: o.sortOrder + 1 } });
          }
        } else {
          const others = await tx.banner.findMany({
            where: {
              category: current.category,
              id: { not: id },
              sortOrder: { gt: oldOrder, lte: newOrder },
            },
            orderBy: { sortOrder: "asc" },
          });
          for (const o of others) {
            await tx.banner.update({ where: { id: o.id }, data: { sortOrder: o.sortOrder - 1 } });
          }
        }
      }
      await tx.banner.update({
        where: { id },
        data: {
          name,
          image,
          alt: alt || name,
          link: link || null,
          category,
          sponsorTier: category === "sponsor" ? (sponsorTier ?? "LOCAL") : null,
          sortOrder: newOrder,
          isActive,
        },
      });
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

// 更新排序（同类别内插入并顺延，与 updateBanner 一致）
export async function updateBannerOrder(id: string, newOrder: number) {
  try {
    const current = await prisma.banner.findUnique({
      where: { id },
      select: { sortOrder: true, category: true },
    });
    if (!current) {
      return { success: false, error: "バナーが見つかりません" };
    }
    const oldOrder = current.sortOrder;
    const newSortOrder = Math.max(0, newOrder);

    await prisma.$transaction(async (tx) => {
      if (newSortOrder !== oldOrder) {
        if (newSortOrder < oldOrder) {
          const others = await tx.banner.findMany({
            where: {
              category: current.category,
              id: { not: id },
              sortOrder: { gte: newSortOrder, lt: oldOrder },
            },
            orderBy: { sortOrder: "desc" },
          });
          for (const o of others) {
            await tx.banner.update({
              where: { id: o.id },
              data: { sortOrder: o.sortOrder + 1 },
            });
          }
        } else {
          const others = await tx.banner.findMany({
            where: {
              category: current.category,
              id: { not: id },
              sortOrder: { gt: oldOrder, lte: newSortOrder },
            },
            orderBy: { sortOrder: "asc" },
          });
          for (const o of others) {
            await tx.banner.update({
              where: { id: o.id },
              data: { sortOrder: o.sortOrder - 1 },
            });
          }
        }
      }
      await tx.banner.update({
        where: { id },
        data: { sortOrder: newSortOrder },
      });
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
