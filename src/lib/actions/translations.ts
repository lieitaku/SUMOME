"use server";

import { prisma } from "@/lib/db";
import { confirmAdmin } from "@/lib/auth-utils";
import {
  translateAndPersistClub,
  translateAndPersistMagazine,
} from "@/lib/auto-translate-on-save";
import { revalidateTagMax } from "@/lib/revalidate-tag-max";
import { revalidateLocalizedPath } from "@/lib/revalidate-localized-paths";

export type BatchTranslationItem = {
  type: "club" | "magazine";
  id: string;
  slug: string;
  label: string;
};

/** 管理者：一括翻訳用のクラブ・雑誌 ID 一覧（クライアントが順次処理する） */
export async function getBatchTranslationTargets(): Promise<
  { items: BatchTranslationItem[] } | { error: string }
> {
  const admin = await confirmAdmin();
  if (!admin) return { error: "権限がありません。" };

  const [clubs, magazines] = await Promise.all([
    prisma.club.findMany({
      where: { slug: { not: "official-hq" } },
      select: { id: true, slug: true, name: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.magazine.findMany({
      select: { id: true, slug: true, title: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const items: BatchTranslationItem[] = [
    ...clubs.map((c) => ({
      type: "club" as const,
      id: c.id,
      slug: c.slug,
      label: c.name,
    })),
    ...magazines.map((m) => ({
      type: "magazine" as const,
      id: m.id,
      slug: m.slug,
      label: m.title,
    })),
  ];

  return { items };
}

/**
 * 1 件だけ機械翻訳（既存訳は skipExisting でスキップ）。
 * 一括処理中はキャッシュ再検証を抑え、最後に revalidateAfterBatchTranslation を呼ぶ想定。
 */
export async function runOneBatchTranslation(
  type: "club" | "magazine",
  id: string
): Promise<{ success: true } | { error: string }> {
  const admin = await confirmAdmin();
  if (!admin) return { error: "権限がありません。" };

  const result =
    type === "club"
      ? await translateAndPersistClub(id, {
          skipCacheRevalidation: true,
          skipExisting: true,
        })
      : await translateAndPersistMagazine(id, {
          skipCacheRevalidation: true,
          skipExisting: true,
        });

  if (!result.ok) return { error: result.error };
  return { success: true };
}

/** 一括完了後に公開ページ・管理一覧のキャッシュを更新 */
export async function revalidateAfterBatchTranslation(): Promise<
  { success: true } | { error: string }
> {
  const admin = await confirmAdmin();
  if (!admin) return { error: "権限がありません。" };

  revalidateLocalizedPath("/admin/clubs");
  revalidateLocalizedPath("/admin/magazines");
  revalidateLocalizedPath("/clubs");
  revalidateLocalizedPath("/magazines");
  revalidateTagMax("clubs");
  revalidateTagMax("magazines");
  revalidateTagMax("admin-stats");

  return { success: true };
}
