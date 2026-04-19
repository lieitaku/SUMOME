import type { Prisma } from "@prisma/client";

/**
 * 文档级多语言：单字段为 `locale -> 文本`。
 * 日文主字段仍存于各模型原生列（name / title / description 等），此处仅存额外语种。
 * 扩展 fr/mn 时只需写入 translations.name.fr 等，无需改表结构。
 */
export type TranslationDoc = Record<string, Partial<Record<string, string>>>;

export function parseTranslationDoc(
  raw: Prisma.JsonValue | null | undefined
): TranslationDoc {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return raw as TranslationDoc;
}

/** 機械翻訳などで translations の任意 locale キーを上書きする（他 locale は保持） */
export function setTranslationLocale(
  doc: TranslationDoc,
  field: string,
  locale: string,
  value: string
): void {
  const prev = doc[field];
  const next = {
    ...(typeof prev === "object" && prev && !Array.isArray(prev) ? prev : {}),
  } as Record<string, string>;
  next[locale] = value.trim();
  doc[field] = next;
}

/** 后台表单读取某一语种的单行译文（如 en） */
export function getLocaleString(
  doc: Prisma.JsonValue | null | undefined,
  field: string,
  locale: string
): string {
  const d = parseTranslationDoc(doc);
  return d[field]?.[locale]?.trim() ?? "";
}

/** 日文 payload 的每个键在 translations 里是否都有各 target locale 的非空译文 */
export function translationDocCoversPayload(
  doc: Prisma.JsonValue | null | undefined,
  payloadKeys: string[],
  targetLocales: string[]
): boolean {
  if (payloadKeys.length === 0 || targetLocales.length === 0) return true;
  const d = parseTranslationDoc(doc);
  for (const key of payloadKeys) {
    for (const loc of targetLocales) {
      if (!d[key]?.[loc]?.trim()) return false;
    }
  }
  return true;
}

/**
 * 在 targetLocales 中，至少有一个 payload 字段尚未录入该 locale 译文的那些 locale（并集）。
 * 用于 skipExisting：只向 Gemini 请求仍缺译文的语种。
 */
export function getMissingLocalesUnion(
  doc: Prisma.JsonValue | null | undefined,
  payload: Record<string, string>,
  targetLocales: string[]
): string[] {
  const d = parseTranslationDoc(doc);
  return targetLocales.filter((loc) =>
    Object.keys(payload).some((key) => !d[key]?.[loc]?.trim())
  );
}

/**
 * 仅保留「在 missingLocales 中仍缺至少一种译文」的字段，避免重复翻已齐字段。
 */
export function filterPayloadNeedingAnyLocale(
  doc: Prisma.JsonValue | null | undefined,
  payload: Record<string, string>,
  missingLocales: string[]
): Record<string, string> {
  if (missingLocales.length === 0) return {};
  const d = parseTranslationDoc(doc);
  const out: Record<string, string> = {};
  for (const [key, val] of Object.entries(payload)) {
    if (!val?.trim()) continue;
    const needs = missingLocales.some((loc) => !d[key]?.[loc]?.trim());
    if (needs) out[key] = val;
  }
  return out;
}

/** 回退顺序：当前 locale → en → 日文主字段 */
export function getTranslated(
  doc: Prisma.JsonValue | null | undefined,
  field: string,
  locale: string,
  fallbackJa: string
): string {
  const d = parseTranslationDoc(doc);
  const perField = d[field];
  if (!perField || typeof perField !== "object") return fallbackJa;
  const order =
    locale === "ja" ? (["ja"] as string[]) : [locale, "en", "ja"];
  for (const loc of order) {
    const v = perField[loc]?.trim();
    if (v) return v;
  }
  return fallbackJa;
}

export type ClubTranslationPatch = {
  nameEn?: string | null;
  descriptionEn?: string | null;
  cityEn?: string | null;
  addressEn?: string | null;
  targetEn?: string | null;
};

function mergeLocaleField(
  d: TranslationDoc,
  field: "name" | "description" | "city" | "address" | "target",
  enValue: string | null | undefined
): void {
  const prev = d[field];
  const next = { ...(typeof prev === "object" && prev && !Array.isArray(prev) ? prev : {}) } as Record<
    string,
    string
  >;
  if (enValue != null && enValue.trim() !== "") next.en = enValue.trim();
  else delete next.en;
  if (Object.keys(next).length) d[field] = next;
  else delete d[field];
}

export function mergeClubTranslations(
  existing: Prisma.JsonValue | null | undefined,
  patch: ClubTranslationPatch
): Prisma.InputJsonValue {
  const d = parseTranslationDoc(existing);
  const name = { ...d.name };
  const desc = { ...d.description };
  if (patch.nameEn != null && patch.nameEn.trim() !== "") name.en = patch.nameEn.trim();
  else delete name.en;
  if (patch.descriptionEn != null && patch.descriptionEn.trim() !== "") {
    desc.en = patch.descriptionEn.trim();
  } else delete desc.en;
  const out: TranslationDoc = { ...d };
  if (Object.keys(name).length) out.name = name;
  else delete out.name;
  if (Object.keys(desc).length) out.description = desc;
  else delete out.description;

  mergeLocaleField(out, "city", patch.cityEn);
  mergeLocaleField(out, "address", patch.addressEn);
  mergeLocaleField(out, "target", patch.targetEn);

  return out as Prisma.InputJsonValue;
}

export function mergeMagazineTranslations(
  existing: Prisma.JsonValue | null | undefined,
  patch: { titleEn?: string | null; descriptionEn?: string | null }
): Prisma.InputJsonValue {
  const d = parseTranslationDoc(existing);
  const title = { ...d.title };
  const description = { ...d.description };
  if (patch.titleEn != null && patch.titleEn.trim() !== "") {
    title.en = patch.titleEn.trim();
  } else delete title.en;
  if (patch.descriptionEn != null && patch.descriptionEn.trim() !== "") {
    description.en = patch.descriptionEn.trim();
  } else delete description.en;
  const out: TranslationDoc = { ...d };
  if (Object.keys(title).length) out.title = title;
  else delete out.title;
  if (Object.keys(description).length) out.description = description;
  else delete out.description;
  return out as Prisma.InputJsonValue;
}

export function mergeActivityTranslations(
  existing: Prisma.JsonValue | null | undefined,
  patch: { titleEn?: string | null; contentEn?: string | null }
): Prisma.InputJsonValue {
  const d = parseTranslationDoc(existing);
  const title = { ...d.title };
  const content = { ...d.content };
  if (patch.titleEn != null && patch.titleEn.trim() !== "") {
    title.en = patch.titleEn.trim();
  } else delete title.en;
  if (patch.contentEn != null && patch.contentEn.trim() !== "") {
    content.en = patch.contentEn.trim();
  } else delete content.en;
  const out: TranslationDoc = { ...d };
  if (Object.keys(title).length) out.title = title;
  else delete out.title;
  if (Object.keys(content).length) out.content = content;
  else delete out.content;
  return out as Prisma.InputJsonValue;
}

/** 用于搜索：某字段下所有已录入的译文 */
export function allTranslationValues(
  doc: Prisma.JsonValue | null | undefined,
  field: string
): string[] {
  const d = parseTranslationDoc(doc);
  const perField = d[field];
  if (!perField) return [];
  return Object.values(perField)
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean);
}
