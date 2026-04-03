/**
 * 白鹏分档：基准为 Pro Max（手机）、11" iPad 横屏长边（平板）、4K（桌面）。
 * 其它档位系数默认 1 / 偏移 0，可在表中按真机微调。
 */

export type HakuhoViewportKind = "phone" | "tablet" | "desktop";

/** 手机分档：innerWidth（竖屏为主），≤767 时生效 */
export type HakuhoPhoneTier = "se" | "mini" | "mid" | "plus" | "pro" | "promax";

/** 平板分档：max(innerWidth, innerHeight)，768–1366 大类内生效 */
export type HakuhoTabletTier = "ipad_mini" | "ipad_11" | "ipad_13";

/** 桌面分档：innerWidth，>1366 */
export type HakuhoDesktopTier = "d1080" | "d2k" | "d4k";

/** 紧凑端相对基准的倍率/偏移（基准档全为 1 与 0） */
export type HakuhoCompactTierFactors = {
  /** 乘在侧图 vw% 与 min/max 像素钳制上，保持比例 */
  sideVwMul: number;
  /** 乘在 inwardRaw（向内平移）上 */
  inwardMul: number;
  /** 加在视频墙 `top` 百分比上 */
  wallTopPctOffset: number;
  /** 乘在卡片模式 cardGap 上 */
  cardGapMul: number;
};

export type HakuhoDesktopTierFactors = {
  /** 乘在 `getDesktopHakuhoBaseMaxPx` 的 vw 贡献 */
  baseVwMul: number;
  /** 乘在桌面 SHIFT_X 的 vw 两段上 */
  shiftXVwMul: number;
};

const IDENTITY_COMPACT: HakuhoCompactTierFactors = {
  sideVwMul: 1,
  inwardMul: 1,
  wallTopPctOffset: 0,
  cardGapMul: 1,
};

const IDENTITY_DESKTOP: HakuhoDesktopTierFactors = {
  baseVwMul: 1,
  shiftXVwMul: 1,
};

/** Safari 逻辑宽约：SE 320/375、mini 375、6.1 390、Plus 414、Pro 393/402、Pro Max 430 */
export function resolvePhoneTier(innerWidth: number): HakuhoPhoneTier {
  if (innerWidth < 360) return "se";
  if (innerWidth < 375) return "mini";
  if (innerWidth < 390) return "mid";
  if (innerWidth < 403) return "plus";
  if (innerWidth < 420) return "pro";
  return "promax";
}

/**
 * 机身长边约：mini 1133、11" 1194、13" 1366（横屏典型，用于竖屏时仍能识别机型档）
 */
export function resolveTabletTier(tabletSpan: number): HakuhoTabletTier {
  if (tabletSpan <= 1148) return "ipad_mini";
  if (tabletSpan < 1280) return "ipad_11";
  return "ipad_13";
}

export function resolveDesktopTier(innerWidth: number): HakuhoDesktopTier {
  if (innerWidth <= 1920) return "d1080";
  if (innerWidth <= 2560) return "d2k";
  return "d4k";
}

/** 基准：promax；其余默认同基准，可单独调小/调大 */
export const HAKUHO_PHONE_TIER_FACTORS: Record<HakuhoPhoneTier, HakuhoCompactTierFactors> = {
  se: { ...IDENTITY_COMPACT },
  mini: { ...IDENTITY_COMPACT },
  mid: { ...IDENTITY_COMPACT },
  plus: { ...IDENTITY_COMPACT },
  pro: { ...IDENTITY_COMPACT },
  promax: { ...IDENTITY_COMPACT },
};

/** 基准：ipad_11 */
export const HAKUHO_TABLET_TIER_FACTORS: Record<HakuhoTabletTier, HakuhoCompactTierFactors> = {
  ipad_mini: { ...IDENTITY_COMPACT },
  ipad_11: { ...IDENTITY_COMPACT },
  ipad_13: { ...IDENTITY_COMPACT },
};

/** 基准：d4k */
export const HAKUHO_DESKTOP_TIER_FACTORS: Record<HakuhoDesktopTier, HakuhoDesktopTierFactors> = {
  d1080: { ...IDENTITY_DESKTOP },
  d2k: { ...IDENTITY_DESKTOP },
  d4k: { ...IDENTITY_DESKTOP },
};

export function getCompactTierFactors(
  kind: HakuhoViewportKind,
  phoneTier: HakuhoPhoneTier,
  tabletTier: HakuhoTabletTier,
): HakuhoCompactTierFactors {
  if (kind === "phone") return HAKUHO_PHONE_TIER_FACTORS[phoneTier];
  if (kind === "tablet") return HAKUHO_TABLET_TIER_FACTORS[tabletTier];
  return IDENTITY_COMPACT;
}

export function getDesktopTierFactors(tier: HakuhoDesktopTier): HakuhoDesktopTierFactors {
  return HAKUHO_DESKTOP_TIER_FACTORS[tier];
}
