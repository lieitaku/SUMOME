import type { Magazine } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { getTranslated } from "@/lib/document-translations";
import { regionDisplayForLocale } from "@/lib/prefecture-en";

export function clubDisplayName(
  club: { name: string; translations?: Prisma.JsonValue | null },
  locale: string
): string {
  if (locale === "ja") return club.name;
  return getTranslated(club.translations ?? null, "name", locale, club.name);
}

/**
 * 活动卡片 MapPin 一行。
 * - 日语：仍用 location，否则俱乐部日文名。
 * - 非日语：主催名一律走 `clubDisplayName`（读 translations.name.*）；
 *   仅当 location 存在且与日文俱乐部名不同（视为另填场地）时，附在译名后。
 */
export function activityCardLocationLine(
  activity: { location: string | null },
  club: { name: string; translations?: Prisma.JsonValue | null } | null,
  locale: string
): string {
  const loc = activity.location?.trim() ?? "";
  if (!club) return loc;

  const nameJa = club.name.trim();
  const collapse = (s: string) => s.replace(/\s+/g, "");
  const orgLine = clubDisplayName(club, locale);

  if (locale === "ja") {
    return loc || orgLine;
  }

  if (!loc || collapse(loc) === collapse(nameJa)) {
    return orgLine;
  }
  return `${orgLine} · ${loc}`;
}

export function clubDisplayDescription(
  club: {
    description?: string | null;
    translations?: Prisma.JsonValue | null;
  },
  locale: string
): string | null {
  const ja = club.description?.trim();
  if (locale === "ja") return ja || null;
  const fromDoc = getTranslated(
    club.translations ?? null,
    "description",
    locale,
    ja ?? ""
  );
  return fromDoc.trim() || ja || null;
}

/** 都道府県等：DB は主に日文表記。英文站用 prefecture-en 映射，无需写入 translations */
export function clubDisplayArea(
  club: { area: string },
  locale: string
): string {
  return regionDisplayForLocale(club.area, locale);
}

export function clubDisplayCity(
  club: {
    city?: string | null;
    translations?: Prisma.JsonValue | null;
  },
  locale: string
): string | null {
  const ja = club.city?.trim() ?? "";
  if (locale === "ja") return ja || null;
  const fromDoc = getTranslated(
    club.translations ?? null,
    "city",
    locale,
    ja
  );
  return fromDoc.trim() || ja || null;
}

export function clubDisplayAddress(
  club: {
    address?: string | null;
    translations?: Prisma.JsonValue | null;
  },
  locale: string
): string | null {
  const ja = club.address?.trim() ?? "";
  if (locale === "ja") return ja || null;
  const fromDoc = getTranslated(
    club.translations ?? null,
    "address",
    locale,
    ja
  );
  return fromDoc.trim() || ja || null;
}

/** 募集対象などカンマ区切りの原文を丸ごと翻訳 JSON で上書き表示 */
export function clubDisplayTarget(
  club: {
    target?: string | null;
    translations?: Prisma.JsonValue | null;
  },
  locale: string
): string | null {
  const ja = club.target?.trim() ?? "";
  if (locale === "ja") return ja || null;
  const fromDoc = getTranslated(
    club.translations ?? null,
    "target",
    locale,
    ja
  );
  return fromDoc.trim() || ja || null;
}

/** 稽古日程 JSON 文字列：locale ごとに `translations.schedule.<loc>` があればその JSON 文字列を使用 */
export function clubDisplaySchedule(
  club: {
    schedule?: string | null;
    translations?: Prisma.JsonValue | null;
  },
  locale: string
): string | null {
  const ja = club.schedule?.trim() ?? "";
  if (locale === "ja") return ja || null;
  const fromDoc = getTranslated(
    club.translations ?? null,
    "schedule",
    locale,
    ja
  );
  return fromDoc.trim() || ja || null;
}

/** 代表者名 */
export function clubDisplayRepresentative(
  club: {
    representative?: string | null;
    translations?: Prisma.JsonValue | null;
  },
  locale: string
): string | null {
  const ja = club.representative?.trim() ?? "";
  if (locale === "ja") return ja || null;
  const fromDoc = getTranslated(
    club.translations ?? null,
    "representative",
    locale,
    ja
  );
  return fromDoc.trim() || ja || null;
}

export function activityDisplayTitle(
  activity: {
    title: string;
    translations?: Prisma.JsonValue | null;
  },
  locale: string
): string {
  if (locale === "ja") return activity.title;
  return getTranslated(
    activity.translations ?? null,
    "title",
    locale,
    activity.title
  );
}

export function activityDisplayContentFallback(
  activity: {
    content?: string | null;
    translations?: Prisma.JsonValue | null;
  },
  locale: string
): string | null {
  const ja = activity.content?.trim();
  if (locale === "ja") return ja || null;
  const fromDoc = getTranslated(
    activity.translations ?? null,
    "content",
    locale,
    ja ?? ""
  );
  return fromDoc.trim() || ja || null;
}

/** 英語等は `Magazine.translations.title.en`（管理画面の英語タイトル）を参照。未入力時は日文タイトルにフォールバック。 */
export function magazineDisplayTitle(
  magazine: Pick<Magazine, "title" | "translations">,
  locale: string
): string {
  if (locale === "ja") return magazine.title;
  return getTranslated(
    magazine.translations ?? null,
    "title",
    locale,
    magazine.title
  );
}

/** 英語等は `translations.description.en`（管理の英語概要）を参照。未入力時は日文にフォールバック。 */
export function magazineDisplayDescription(
  magazine: Pick<Magazine, "description" | "translations">,
  locale: string
): string | null {
  const ja = magazine.description?.trim();
  if (locale === "ja") return ja || null;
  const fromDoc = getTranslated(
    magazine.translations ?? null,
    "description",
    locale,
    ja ?? ""
  );
  return fromDoc.trim() || ja || null;
}
