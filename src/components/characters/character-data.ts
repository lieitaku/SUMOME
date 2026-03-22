/**
 * 角色立绘/头像请放在：public/images/characters/
 * 在 imageSrc 填写以 / 开头的 URL，例如："/images/characters/sumome.webp"
 *（与站内 banner、clubs 等一致，建议用 .webp）
 */
export type CharacterTheme = "brand" | "gold" | "red";

export type Character = {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  description: string;
  traits: string[];
  quote: string;
  theme: CharacterTheme;
  imageSrc: string;
};

export const CHARACTERS: Character[] = [
  {
    id: "sumome",
    name: "すもめ",
    nameEn: "SUMOME",
    title: "怪力の三男",
    description:
      "うさぎ一家の三男として生まれる。3歳で米俵を持ち上げ、周囲を驚かす。",
    traits: ["怪力", "まっすぐ", "行動派"],
    quote: "「やってみる！」",
    theme: "brand",
    imageSrc: "/images/characters/sumome.webp",
  },
  {
    id: "chanko",
    name: "ちゃんこ",
    nameEn: "CHANKO",
    title: "福を呼ぶ食いしん坊",
    description:
      "生まれた時、金のお玉と箸をくわえていた。生涯食べ物に困らない、星のもとに生まれる。",
    traits: ["福運", "食いしん坊", "やさしい"],
    quote: "「おかわり、まだまだ！」",
    theme: "gold",
    imageSrc: "/images/characters/chanko.webp",
  },
  {
    id: "gottsan",
    name: "ごっつぁん",
    nameEn: "GOTTSAN",
    title: "感謝の申し子",
    description:
      "生まれた時「おぎゃぁ」でなく「ごっつぁん！」と母に向かってお礼を言ったらしい。",
    traits: ["礼儀正しい", "情熱", "ムードメーカー"],
    quote: "「ごっつぁんです！」",
    theme: "red",
    imageSrc: "/images/characters/gottsan.webp",
  },
];
