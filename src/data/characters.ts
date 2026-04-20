import type { PrefectureCharacter } from "./types";

/**
 * 各都道府县宣传角色集中注册表
 *
 * 使用规则：
 * - Key 必须与路由 slug 完全一致（例："fukui"、"aichi"）
 * - 对应图片放置于 /public/images/characters/[slug].webp
 * - 图片规格统一：600 × 900px，WebP 格式，2:3 比例
 * - 新增角色：在此文件加一条记录 + 放对应图片，无需改动任何县数据文件
 */
export const PREFECTURE_CHARACTERS: Record<string, PrefectureCharacter> = {
  fukui: {
    name: "サウレス",
    nameEn: "Saurus",
    description: "福井の誇り恐竜力士「サウレス」です！",
    descriptionEn: 'Fukui\'s Pride, Dinosaur Rikishi "Saurus"',
  },
  // 以下县角色数据待添加时在此处补充：
  // aichi: { name: "...", description: "...", descriptionEn: "..." },
};

/** 与 PrefectureCharacter 立绘约定一致：public/images/characters/{slug}.webp */
export function prefectureCharacterImagePath(prefSlug: string): string {
  return `/images/characters/${prefSlug}.webp`;
}

/**
 * 「47 都道府県の仲間たち」卡片用：已在 characters.ts 登记且上传立绘的县显示真名与图片。
 */
export function getPrefectureMascotDisplay(
  prefSlug: string,
  locale: string,
): {
  hasCharacter: boolean;
  imageSrc: string;
  name: string;
  nameEn: string;
  title: string;
} {
  const entry = PREFECTURE_CHARACTERS[prefSlug];
  if (!entry) {
    return {
      hasCharacter: false,
      imageSrc: "",
      name: "",
      nameEn: prefSlug.toUpperCase(),
      title: "",
    };
  }
  const title =
    locale === "en" && entry.descriptionEn?.trim()
      ? entry.descriptionEn
      : entry.description;
  return {
    hasCharacter: true,
    imageSrc: prefectureCharacterImagePath(prefSlug),
    name: entry.name,
    nameEn: entry.nameEn?.trim() || prefSlug.toUpperCase(),
    title,
  };
}
