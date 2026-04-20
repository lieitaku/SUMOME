import { prisma } from "@/lib/db";
import {
  filterPayloadNeedingAnyLocale,
  getMissingLocalesUnion,
  parseTranslationDoc,
  setTranslationLocale,
} from "@/lib/document-translations";
import {
  getAutoTranslateTargetLocales,
  translateJaFieldsToTargetLocalesWithGapRetry,
  type MultiLocaleFieldResult,
} from "@/lib/translator";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { revalidateTagMax } from "@/lib/revalidate-tag-max";
import { revalidateLocalizedPath } from "@/lib/revalidate-localized-paths";
import {
  getCustomTemplateJaPayload,
  isCustomActivityRoute,
} from "@/lib/custom-activity-copy";

/** updated: translations を DB に書き込んだか。呼び出し元は戻り値を無視してよい。 */
export type TranslatePersistResult =
  | { ok: true; updated: boolean }
  | { ok: false; error: string };

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
  schedule?: string | null;
  representative?: string | null;
}): Record<string, string> {
  const payload: Record<string, string> = {};
  if (row.name?.trim()) payload.name = row.name.trim();
  if (row.description?.trim()) payload.description = row.description.trim();
  if (row.city?.trim() && row.city.trim() !== "未設定") payload.city = row.city.trim();
  if (row.address?.trim() && row.address.trim() !== "未設定") payload.address = row.address.trim();
  if (row.target?.trim()) payload.target = row.target.trim();
  if (row.schedule?.trim()) payload.schedule = row.schedule.trim();
  if (row.representative?.trim()) payload.representative = row.representative.trim();
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

/** 活動の title / content に加え、act-01〜04 ならカスタム本文キーをまとめて送る */
export function buildActivityJaPayload(row: {
  title: string;
  content: string | null;
  customRoute: string | null;
}): Record<string, string> {
  const payload: Record<string, string> = {};
  if (row.title?.trim()) payload.title = row.title.trim();
  if (row.content?.trim()) payload.content = row.content.trim();
  if (row.customRoute && isCustomActivityRoute(row.customRoute)) {
    Object.assign(payload, getCustomTemplateJaPayload(row.customRoute));
  }
  return payload;
}

export type TranslatePersistOptions = {
  /** CLI 脚本等非 Next 请求上下文：跳过 revalidatePath / revalidateTag */
  skipCacheRevalidation?: boolean;
  /** true のとき、各フィールド・各 locale について既存の非空訳があるものはスキップ（一括補完向け） */
  skipExisting?: boolean;
};

/**
 * DB の日文主フィールドを読み、AUTO_TRANSLATE_LOCALES へ機械翻訳して `translations` に保存。
 */
export async function translateAndPersistClub(
  clubId: string,
  options?: TranslatePersistOptions
): Promise<TranslatePersistResult> {
  try {
    const targetLocales = getAutoTranslateTargetLocales();
    if (targetLocales.length === 0) return { ok: true, updated: false };

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
        schedule: true,
        representative: true,
      },
    });
    if (!row) return { ok: true, updated: false };

    const basePayload = buildClubJaPayload(row);
    if (Object.keys(basePayload).length === 0) return { ok: true, updated: false };

    const doc = parseTranslationDoc(row.translations);
    let localesToRequest = targetLocales;
    let payloadToTranslate = basePayload;

    if (options?.skipExisting) {
      const missingLocales = getMissingLocalesUnion(doc, basePayload, targetLocales);
      if (missingLocales.length === 0) return { ok: true, updated: false };
      payloadToTranslate = filterPayloadNeedingAnyLocale(doc, basePayload, missingLocales);
      if (Object.keys(payloadToTranslate).length === 0) return { ok: true, updated: false };
      localesToRequest = missingLocales;
    }

    const translated = await translateJaFieldsToTargetLocalesWithGapRetry(
      payloadToTranslate,
      localesToRequest
    );
    if (Object.keys(translated).length === 0) {
      if (!process.env.GEMINI_API_KEY?.trim()) {
        return {
          ok: false,
          error:
            "GEMINI_API_KEY が未設定のため訳文を保存できません。サーバー環境変数を設定してください。",
        };
      }
      return {
        ok: false,
        error:
          "Gemini から有効な訳文が返りませんでした。API キー・モデル名・レート制限を確認してください。",
      };
    }

    applyMultiLocaleToDoc(doc, translated, localesToRequest);

    await prisma.club.update({
      where: { id: clubId },
      data: { translations: doc as Prisma.InputJsonValue },
    });

    if (!options?.skipCacheRevalidation) {
      revalidatePath("/admin/clubs");
      revalidatePath(`/admin/clubs/${clubId}`);
      revalidateLocalizedPath("/clubs");
      revalidateLocalizedPath(`/clubs/${row.slug}`);
      revalidateLocalizedPath("/activities");
      revalidateTagMax("clubs");
      revalidateTagMax("activities");
      revalidateTagMax("admin-stats");
    }
    return { ok: true, updated: true };
  } catch (e) {
    console.error("[auto-translate club]", clubId, e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "翻訳の保存に失敗しました。",
    };
  }
}

export async function translateAndPersistMagazine(
  magazineId: string,
  options?: TranslatePersistOptions
): Promise<TranslatePersistResult> {
  try {
    const targetLocales = getAutoTranslateTargetLocales();
    if (targetLocales.length === 0) return { ok: true, updated: false };

    const row = await prisma.magazine.findUnique({
      where: { id: magazineId },
      select: {
        translations: true,
        slug: true,
        title: true,
        description: true,
      },
    });
    if (!row) return { ok: true, updated: false };

    const basePayload = buildMagazineJaPayload(row);

    if (Object.keys(basePayload).length === 0) return { ok: true, updated: false };

    const doc = parseTranslationDoc(row.translations);
    let localesToRequest = targetLocales;
    let payloadToTranslate = basePayload;

    if (options?.skipExisting) {
      const missingLocales = getMissingLocalesUnion(doc, basePayload, targetLocales);
      if (missingLocales.length === 0) return { ok: true, updated: false };
      payloadToTranslate = filterPayloadNeedingAnyLocale(doc, basePayload, missingLocales);
      if (Object.keys(payloadToTranslate).length === 0) return { ok: true, updated: false };
      localesToRequest = missingLocales;
    }

    const translated = await translateJaFieldsToTargetLocalesWithGapRetry(
      payloadToTranslate,
      localesToRequest
    );
    if (Object.keys(translated).length === 0) {
      if (!process.env.GEMINI_API_KEY?.trim()) {
        return {
          ok: false,
          error:
            "GEMINI_API_KEY が未設定のため訳文を保存できません。サーバー環境変数を設定してください。",
        };
      }
      return {
        ok: false,
        error:
          "Gemini から有効な訳文が返りませんでした。API キー・モデル名・レート制限を確認してください。",
      };
    }

    applyMultiLocaleToDoc(doc, translated, localesToRequest);

    await prisma.magazine.update({
      where: { id: magazineId },
      data: { translations: doc as Prisma.InputJsonValue },
    });

    if (!options?.skipCacheRevalidation) {
      revalidatePath("/admin/magazines");
      revalidatePath(`/admin/magazines/${magazineId}`);
      revalidateLocalizedPath("/magazines");
      revalidateLocalizedPath(`/magazines/${row.slug}`);
      revalidateTagMax("magazines");
      revalidateTagMax("admin-stats");
    }
    return { ok: true, updated: true };
  } catch (e) {
    console.error("[auto-translate magazine]", magazineId, e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "翻訳の保存に失敗しました。",
    };
  }
}

export async function translateAndPersistActivity(
  activityId: string,
  options?: TranslatePersistOptions
): Promise<TranslatePersistResult> {
  try {
    const targetLocales = getAutoTranslateTargetLocales();
    if (targetLocales.length === 0) return { ok: true, updated: false };

    const row = await prisma.activity.findUnique({
      where: { id: activityId },
      select: {
        translations: true,
        title: true,
        content: true,
        customRoute: true,
      },
    });
    if (!row) return { ok: true, updated: false };

    const basePayload = buildActivityJaPayload({
      title: row.title,
      content: row.content,
      customRoute: row.customRoute,
    });
    if (Object.keys(basePayload).length === 0) return { ok: true, updated: false };

    const doc = parseTranslationDoc(row.translations);
    let localesToRequest = targetLocales;
    let payloadToTranslate = basePayload;

    if (options?.skipExisting) {
      const missingLocales = getMissingLocalesUnion(doc, basePayload, targetLocales);
      if (missingLocales.length === 0) return { ok: true, updated: false };
      payloadToTranslate = filterPayloadNeedingAnyLocale(doc, basePayload, missingLocales);
      if (Object.keys(payloadToTranslate).length === 0) return { ok: true, updated: false };
      localesToRequest = missingLocales;
    }

    const translated = await translateJaFieldsToTargetLocalesWithGapRetry(
      payloadToTranslate,
      localesToRequest
    );
    if (Object.keys(translated).length === 0) {
      if (!process.env.GEMINI_API_KEY?.trim()) {
        return {
          ok: false,
          error:
            "GEMINI_API_KEY が未設定のため訳文を保存できません。サーバー環境変数を設定してください。",
        };
      }
      return {
        ok: false,
        error:
          "Gemini から有効な訳文が返りませんでした。API キー・モデル名・レート制限を確認してください。",
      };
    }

    applyMultiLocaleToDoc(doc, translated, localesToRequest);

    await prisma.activity.update({
      where: { id: activityId },
      data: { translations: doc as Prisma.InputJsonValue },
    });

    if (!options?.skipCacheRevalidation) {
      revalidatePath("/admin/activities");
      revalidatePath(`/admin/activities/${activityId}`);
      revalidatePath("/activities");
      revalidatePath(`/activities/${activityId}`);
      revalidateLocalizedPath("/activities");
      revalidateLocalizedPath(`/activities/${activityId}`);
      revalidateTagMax("activities");
      revalidateTagMax("admin-stats");
    }
    return { ok: true, updated: true };
  } catch (e) {
    console.error("[auto-translate activity]", activityId, e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "翻訳の保存に失敗しました。",
    };
  }
}
