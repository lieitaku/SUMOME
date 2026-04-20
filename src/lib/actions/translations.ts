"use server";

import { prisma } from "@/lib/db";
import { confirmAdmin } from "@/lib/auth-utils";
import {
  translateAndPersistActivity,
  translateAndPersistClub,
  translateAndPersistMagazine,
} from "@/lib/auto-translate-on-save";
import { revalidateTagMax } from "@/lib/revalidate-tag-max";
import { revalidateLocalizedPath } from "@/lib/revalidate-localized-paths";

export type BatchTranslationItem = {
  type: "club" | "magazine" | "activity";
  id: string;
  slug: string;
  label: string;
};

/** 管理者：一括翻訳用のクラブ・雑誌・活動 ID 一覧（クライアントが順次処理する） */
export async function getBatchTranslationTargets(): Promise<
  { items: BatchTranslationItem[] } | { error: string }
> {
  const admin = await confirmAdmin();
  if (!admin) return { error: "権限がありません。" };

  const [clubs, magazines, activities] = await Promise.all([
    prisma.club.findMany({
      where: { slug: { not: "official-hq" } },
      select: { id: true, slug: true, name: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.magazine.findMany({
      select: { id: true, slug: true, title: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.activity.findMany({
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
    ...activities.map((a) => ({
      type: "activity" as const,
      id: a.id,
      slug: a.slug,
      label: a.title,
    })),
  ];

  return { items };
}

/**
 * 1 件だけ機械翻訳（既存訳は skipExisting でスキップ）。
 * 一括処理中はキャッシュ再検証を抑え、最後に revalidateAfterBatchTranslation を呼ぶ想定。
 * `skipped`: true のときは API を呼ばず DB も未更新（既に訳が揃っている等）。クライアントは待機を短くできる。
 */
export async function runOneBatchTranslation(
  type: "club" | "magazine" | "activity",
  id: string
): Promise<{ success: true; skipped: boolean } | { error: string }> {
  const admin = await confirmAdmin();
  if (!admin) return { error: "権限がありません。" };

  const opts = { skipCacheRevalidation: true, skipExisting: true } as const;
  const result =
    type === "club"
      ? await translateAndPersistClub(id, opts)
      : type === "magazine"
        ? await translateAndPersistMagazine(id, opts)
        : await translateAndPersistActivity(id, opts);

  if (!result.ok) return { error: result.error };
  return { success: true, skipped: !result.updated };
}

/** 一括完了後に公開ページ・管理一覧のキャッシュを更新 */
export async function revalidateAfterBatchTranslation(): Promise<
  { success: true } | { error: string }
> {
  const admin = await confirmAdmin();
  if (!admin) return { error: "権限がありません。" };

  revalidateLocalizedPath("/admin/clubs");
  revalidateLocalizedPath("/admin/magazines");
  revalidateLocalizedPath("/admin/activities");
  revalidateLocalizedPath("/clubs");
  revalidateLocalizedPath("/magazines");
  revalidateLocalizedPath("/activities");
  revalidateTagMax("clubs");
  revalidateTagMax("magazines");
  revalidateTagMax("activities");
  revalidateTagMax("admin-stats");

  return { success: true };
}
