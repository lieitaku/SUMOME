/**
 * 稽古日程 JSON の `day` フィールド（主に日文）を公開ページの locale に合わせて表示用に変換する。
 */

export type ScheduleDayI18n = {
  holiday: string;
  irregular: string;
  info: string;
};

const JP_FULL_TO_EN: Record<string, string> = {
  月曜日: "Monday",
  火曜日: "Tuesday",
  水曜日: "Wednesday",
  木曜日: "Thursday",
  金曜日: "Friday",
  土曜日: "Saturday",
  日曜日: "Sunday",
};

/** 単一曜日漢字（文脈は日程の「曜」） */
const JP_CHAR_TO_EN: Record<string, string> = {
  月: "Monday",
  火: "Tuesday",
  水: "Wednesday",
  木: "Thursday",
  金: "Friday",
  土: "Saturday",
  日: "Sunday",
};

function normalizeDayToken(s: string): string {
  return s.trim();
}

/**
 * @param raw DB / フォーム由来の day 文字列
 * @param locale next-intl の locale（ja は原文を返す）
 * @param labels 祝日・不定期・Info 等の UI 文言（messages の ClubDetail から渡す）
 */
export function localizedScheduleDayLabel(
  raw: string,
  locale: string,
  labels: ScheduleDayI18n
): string {
  const s = normalizeDayToken(raw);
  if (!s) return raw;
  if (locale === "ja") return raw;

  const infoKeys = ["info", "Info", "INFO"];
  if (infoKeys.includes(s)) return labels.info;

  if (s === "祝" || s === "祝日") return labels.holiday;
  if (s === "不定期") return labels.irregular;

  if (JP_FULL_TO_EN[s]) return JP_FULL_TO_EN[s];

  if (s.length === 1 && JP_CHAR_TO_EN[s]) return JP_CHAR_TO_EN[s];

  return raw;
}
