/**
 * 角色立绘/头像请放在：public/images/characters/
 * 在 imageSrc 填写以 / 开头的 URL，例如："/images/characters/sumome.webp"
 *（与站内 banner、clubs 等一致，建议用 .webp）
 *
 * 名称・紹介文など表示用テキストは messages の CharactersPage.characters.{id} を参照（翻訳対応）。
 */
export type CharacterTheme = "brand" | "gold" | "red";

export type Character = {
  id: string;
  theme: CharacterTheme;
  imageSrc: string;
};

export const CHARACTERS: Character[] = [
  {
    id: "sumome",
    theme: "brand",
    imageSrc: "/images/characters/sumome.webp",
  },
  {
    id: "chanko",
    theme: "gold",
    imageSrc: "/images/characters/chanko.webp",
  },
  {
    id: "gottsan",
    theme: "red",
    imageSrc: "/images/characters/gottsan.webp",
  },
];

export type PrefectureMascot = Character & {
  prefecture: string;
};

export const PREFECTURE_MASCOTS: PrefectureMascot[] = [
  "hokkaido", "aomori", "iwate", "miyagi", "akita", "yamagata", "fukushima",
  "ibaraki", "tochigi", "gunma", "saitama", "chiba", "tokyo", "kanagawa",
  "niigata", "toyama", "ishikawa", "fukui", "yamanashi", "nagano", "gifu",
  "shizuoka", "aichi", "mie", "shiga", "kyoto", "osaka", "hyogo", "nara",
  "wakayama", "tottori", "shimane", "okayama", "hiroshima", "yamaguchi",
  "tokushima", "kagawa", "ehime", "kochi", "fukuoka", "saga", "nagasaki",
  "kumamoto", "oita", "miyazaki", "kagoshima", "okinawa"
].map((pref, index) => ({
  id: pref,
  theme: index % 3 === 0 ? "brand" : index % 3 === 1 ? "gold" : "red",
  imageSrc: "", // 占位图，组件内处理
  prefecture: pref,
}));
