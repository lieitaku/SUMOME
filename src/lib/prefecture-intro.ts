import type { PrefectureInfo } from "@/data/types";
import { PREFECTURE_INTROS_EN } from "@/data/prefectures/intros-en";

export function prefectureIntroForLocale(
  base: PrefectureInfo,
  locale: string
): { title: string; text: string } {
  if (locale === "en") {
    if (base.introTitleEn?.trim() && base.introTextEn?.trim()) {
      return { title: base.introTitleEn, text: base.introTextEn };
    }
    const en = PREFECTURE_INTROS_EN[base.id];
    if (en) {
      return { title: en.introTitleEn, text: en.introTextEn };
    }
  }
  return { title: base.introTitle, text: base.introText };
}
