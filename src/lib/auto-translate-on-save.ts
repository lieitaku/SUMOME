import { prisma } from "@/lib/db";
import { parseTranslationDoc, setTranslationLocale } from "@/lib/document-translations";
import {
  getAutoTranslateTargetLocales,
  translateJaFieldsToTargetLocales,
  type MultiLocaleFieldResult,
} from "@/lib/translator";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { revalidateTagMax } from "@/lib/revalidate-tag-max";

function applyMultiLocaleToDoc(
  doc: ReturnType<typeof parseTranslationDoc>,
  result: MultiLocaleFieldResult,
  targetLocales: string[]
): void {
  for (const [field, perLocale] of Object.entries(result)) {
    if (!perLocale) continue;
    for (const loc of targetLocales) {
      const text = perLocale[loc];
      if (typeof text === "string" && text.trim() !== "") {
        setTranslationLocale(doc, field, loc, text);
      }
    }
  }
}

/** 与机翻保存逻辑共通的日文抽出（脚本 `--only-missing` 判定用） */
export function buildClubJaPayload(row: {
  name: string;
  description: string | null;
  city: string | null;
  address: string;
  target: string | null;
}): Record<string, string> {
  const payload: Record<string, string> = {};
  if (row.name?.trim()) payload.name = row.name.trim();
  if (row.description?.trim()) payload.description = row.description.trim();
  if (row.city?.trim() && row.city.trim() !== "未設定") payload.city = row.city.trim();
  if (row.address?.trim() && row.address.trim() !== "未設定") payload.address = row.address.trim();
  if (row.target?.trim()) payload.target = row.target.trim();
  return payload;
}

export function buildMagazineJaPayload(row: {
  title: string;
  description: string | null;
}): Record<string, string> {
  const payload: Record<string, string> = {};
  if (row.title?.trim()) payload.title = row.title.trim();
  if (row.description?.trim()) payload.description = row.description.trim();
  return payload;
}

export type TranslatePersistOptions = {
  /** CLI 脚本等非 Next 请求上下文：跳过 revalidatePath / revalidateTag */
  skipCacheRevalidation?: boolean;
};

/**
 * DB の日文主フィールドを読み、AUTO_TRANSLATE_LOCALES へ機械翻訳して `translations` に保存。
 */
export async function translateAndPersistClub(
  clubId: string,
  options?: TranslatePersistOptions
): Promise<void> {
  try {
    const targetLocales = getAutoTranslateTargetLocales();
    if (targetLocales.length === 0) return;

    const row = await prisma.club.findUnique({
      where: { id: clubId },
      select: {
        translations: true,
        slug: true,
        name: true,
        description: true,
        city: true,
        address: true,
        target: true,
      },
    });
    if (!row) return;

    const payload = buildClubJaPayload(row);
    if (Object.keys(payload).length === 0) return;

    const translated = await translateJaFieldsToTargetLocales(payload, targetLocales);
    if (Object.keys(translated).length === 0) return;

    const doc = parseTranslationDoc(row.translations);
    applyMultiLocaleToDoc(doc, translated, targetLocales);

    await prisma.club.update({
      where: { id: clubId },
      data: { translations: doc as Prisma.InputJsonValue },
    });

    if (!options?.skipCacheRevalidation) {
      revalidatePath("/admin/clubs");
      revalidatePath(`/admin/clubs/${clubId}`);
      revalidatePath("/clubs");
      revalidatePath(`/clubs/${row.slug}`);
      revalidateTagMax("clubs");
      revalidateTagMax("admin-stats");
    }
  } catch (e) {
    console.error("[auto-translate club]", clubId, e);
  }
}

export async function translateAndPersistMagazine(
  magazineId: string,
  options?: TranslatePersistOptions
): Promise<void> {
  try {
    const targetLocales = getAutoTranslateTargetLocales();
    if (targetLocales.length === 0) return;

    const row = await prisma.magazine.findUnique({
      where: { id: magazineId },
      select: {
        translations: true,
        slug: true,
        title: true,
        description: true,
      },
    });
    if (!row) return;

    const payload = buildMagazineJaPayload(row);

    if (Object.keys(payload).length === 0) return;

    const translated = await translateJaFieldsToTargetLocales(payload, targetLocales);
    if (Object.keys(translated).length === 0) return;

    const doc = parseTranslationDoc(row.translations);
    applyMultiLocaleToDoc(doc, translated, targetLocales);

    await prisma.magazine.update({
      where: { id: magazineId },
      data: { translations: doc as Prisma.InputJsonValue },
    });

    if (!options?.skipCacheRevalidation) {
      revalidatePath("/admin/magazines");
      revalidatePath(`/admin/magazines/${magazineId}`);
      revalidatePath("/magazines");
      revalidatePath(`/magazines/${row.slug}`);
      revalidateTagMax("magazines");
      revalidateTagMax("admin-stats");
    }
  } catch (e) {
    console.error("[auto-translate magazine]", magazineId, e);
  }
}
