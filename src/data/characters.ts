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
    description: "福井の誇り恐竜力士「サウレス」です！",
    descriptionEn: 'Fukui\'s Pride, Dinosaur Rikishi "Saurus"',
  },
  // 以下县角色数据待添加时在此处补充：
  // aichi: { name: "...", description: "...", descriptionEn: "..." },
};
