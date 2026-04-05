import introsData from "./intros-en.json";

export type PrefectureIntroEn = {
  introTitleEn: string;
  introTextEn: string;
};

export const PREFECTURE_INTROS_EN = introsData as Record<
  string,
  PrefectureIntroEn
>;
