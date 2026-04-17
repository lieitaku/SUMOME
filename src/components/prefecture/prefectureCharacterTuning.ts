/**
 * 县页头部吉祥物的尺寸配置。
 * 此文件不含 "use client"，可在服务端组件和客户端组件中共同引用。
 *
 * 调整说明：
 * - widthPercentOfViewport：图片宽度相对视口宽度的百分比（中间值）
 * - widthMinPx / widthMaxPx：px 上下限
 * - overallPercent：整体缩放系数（120 = 在上面基础上再 ×1.2）
 * - maxHeightPercentOfViewport / maxHeightPxCap：高度上限
 */
/**
 * 手机端（max-width 767px）仅对立绘做 transform: scale() 的倍数。
 * 气泡宽度仍由列宽决定，不参与缩放；样式见 PrefectureCharacterHero.module.css。
 */
export const HERO_CHARACTER_IMAGE_SCALE_MOBILE = 1.6;

/**
 * 县页 hero 气泡外观（4pt 网格；字号 11px 为历史视觉，其余为 4 的倍数）。
 * 修改此处即可调气泡大小，无需改 globals.css。
 */
export const HERO_BUBBLE_TUNING = {
  fontSizePx: 11,
  paddingX: 12,
  paddingY: 8,
  marginBottom: 12,
  borderRadiusPx: 16,
  /** 气泡底部三角尾巴的宽度（px），调小会显得更精致自然 */
  tailBorderPx: 8,
} as const;

export const PREFECTURE_CHARACTER_HERO_TUNING = {
  widthPercentOfViewport: 26,
  widthMinPx: 100,
  widthMaxPx: 200,
  overallPercent: 120,
  maxHeightPercentOfViewport: 48,
  maxHeightPxCap: 300,
} as const;

/**
 * 根据 TUNING 计算角色列的显式宽度（CSS clamp 字符串）。
 * page.tsx（服务端）与 PrefectureCharacter.tsx（客户端）都调用此函数，
 * 保证两处使用完全相同的宽度，消除气泡溢出覆盖左侧正文的问题。
 */
export function heroCharacterColumnWidth(): string {
  const t = PREFECTURE_CHARACTER_HERO_TUNING;
  const k = Math.max(0.25, Math.min(2, t.overallPercent / 100));
  const minPx = Math.round(t.widthMinPx * k);
  const maxPx = Math.round(t.widthMaxPx * k);
  const vw = Number((t.widthPercentOfViewport * k).toFixed(1));
  return `clamp(${minPx}px, ${vw}vw, ${maxPx}px)`;
}

/** 供组件内部使用的布局计算 */
export function heroImageLayoutStyles(): { columnWidth: string; imgMaxHeight: string } {
  const t = PREFECTURE_CHARACTER_HERO_TUNING;
  const k = Math.max(0.25, Math.min(2, t.overallPercent / 100));
  const maxH = Math.round(t.maxHeightPxCap * k);
  const maxHv = Number((t.maxHeightPercentOfViewport * k).toFixed(1));
  return {
    columnWidth: heroCharacterColumnWidth(),
    imgMaxHeight: `min(${maxHv}vh, ${maxH}px)`,
  };
}
