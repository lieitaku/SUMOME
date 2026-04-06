import type { Magazine } from "@prisma/client";

/** 英語ロケールのとき nameEn があれば優先、なければ name */
export function clubDisplayName(
  club: { name: string; nameEn?: string | null },
  locale: string
): string {
  if (locale === "en") {
    const en = club.nameEn?.trim();
    if (en) return en;
  }
  return club.name;
}

export function clubDisplayDescription(
  club: { description?: string | null; descriptionEn?: string | null },
  locale: string
): string | null {
  if (locale === "en") {
    const en = club.descriptionEn?.trim();
    if (en) return en;
  }
  const ja = club.description?.trim();
  return ja || null;
}

export function activityDisplayTitle(
  activity: { title: string; titleEn?: string | null },
  locale: string
): string {
  if (locale === "en") {
    const en = activity.titleEn?.trim();
    if (en) return en;
  }
  return activity.title;
}

/** 記事本文の英語フォールバック（ブロック JSON の英訳がない場合） */
export function activityDisplayContentFallback(
  activity: { content?: string | null; contentEn?: string | null },
  locale: string
): string | null {
  if (locale === "en") {
    const en = activity.contentEn?.trim();
    if (en) return en;
  }
  const ja = activity.content?.trim();
  return ja || null;
}

export function magazineDisplayTitle(
  magazine: Pick<Magazine, "title" | "titleEn">,
  locale: string
): string {
  if (locale === "en") {
    const en = magazine.titleEn?.trim();
    if (en) return en;
  }
  return magazine.title;
}

export function magazineDisplayDescription(
  magazine: Pick<Magazine, "description" | "descriptionEn">,
  locale: string
): string | null {
  if (locale === "en") {
    const en = magazine.descriptionEn?.trim();
    if (en) return en;
  }
  const ja = magazine.description?.trim();
  return ja || null;
}
