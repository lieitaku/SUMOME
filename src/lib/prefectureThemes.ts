// src/lib/prefectureThemes.ts

export type ThemeColor = {
  gradient: string; // 背景渐变 (Banner/Footer)
  color: string; // 强调色 (文字/按钮/边框)
  shadow: string; // 阴影色 (带透明度)
  dot?: string; // 地图圆点色 (可选)
};

// 默认主题 (品牌蓝)
export const DEFAULT_THEME: ThemeColor = {
  gradient: "from-sumo-brand to-[#2454a4]",
  color: "#2454a4",
  shadow: "rgba(36, 84, 164, 0.25)",
};

// 地区主题映射表 (Key: 县名 slug)
export const PREFECTURE_THEME_MAP: Record<string, ThemeColor> = {
  // === 北海道・東北 (Sapphire Blue) ===
  hokkaido: {
    gradient: "from-[#005f99] to-[#003366]",
    color: "#005f99",
    shadow: "rgba(0, 95, 153, 0.3)",
  },
  aomori: {
    gradient: "from-[#005f99] to-[#003366]",
    color: "#005f99",
    shadow: "rgba(0, 95, 153, 0.3)",
  },
  akita: {
    gradient: "from-[#005f99] to-[#003366]",
    color: "#005f99",
    shadow: "rgba(0, 95, 153, 0.3)",
  },
  iwate: {
    gradient: "from-[#005f99] to-[#003366]",
    color: "#005f99",
    shadow: "rgba(0, 95, 153, 0.3)",
  },
  yamagata: {
    gradient: "from-[#005f99] to-[#003366]",
    color: "#005f99",
    shadow: "rgba(0, 95, 153, 0.3)",
  },
  miyagi: {
    gradient: "from-[#005f99] to-[#003366]",
    color: "#005f99",
    shadow: "rgba(0, 95, 153, 0.3)",
  },
  fukushima: {
    gradient: "from-[#005f99] to-[#003366]",
    color: "#005f99",
    shadow: "rgba(0, 95, 153, 0.3)",
  },

  // === 関東 (Amethyst Purple) ===
  tokyo: {
    gradient: "from-[#7B2CBF] to-[#480CA8]",
    color: "#7B2CBF",
    shadow: "rgba(123, 44, 191, 0.3)",
  },
  kanagawa: {
    gradient: "from-[#7B2CBF] to-[#480CA8]",
    color: "#7B2CBF",
    shadow: "rgba(123, 44, 191, 0.3)",
  },
  chiba: {
    gradient: "from-[#7B2CBF] to-[#480CA8]",
    color: "#7B2CBF",
    shadow: "rgba(123, 44, 191, 0.3)",
  },
  saitama: {
    gradient: "from-[#7B2CBF] to-[#480CA8]",
    color: "#7B2CBF",
    shadow: "rgba(123, 44, 191, 0.3)",
  },
  ibaraki: {
    gradient: "from-[#7B2CBF] to-[#480CA8]",
    color: "#7B2CBF",
    shadow: "rgba(123, 44, 191, 0.3)",
  },
  tochigi: {
    gradient: "from-[#7B2CBF] to-[#480CA8]",
    color: "#7B2CBF",
    shadow: "rgba(123, 44, 191, 0.3)",
  },
  gunma: {
    gradient: "from-[#7B2CBF] to-[#480CA8]",
    color: "#7B2CBF",
    shadow: "rgba(123, 44, 191, 0.3)",
  },

  // === 中部 (Emerald Green) ===
  aichi: {
    gradient: "from-[#2E8B57] to-[#115e34]",
    color: "#2E8B57",
    shadow: "rgba(46, 139, 87, 0.3)",
  },
  shizuoka: {
    gradient: "from-[#2E8B57] to-[#115e34]",
    color: "#2E8B57",
    shadow: "rgba(46, 139, 87, 0.3)",
  },
  gifu: {
    gradient: "from-[#2E8B57] to-[#115e34]",
    color: "#2E8B57",
    shadow: "rgba(46, 139, 87, 0.3)",
  },
  mie: {
    gradient: "from-[#2E8B57] to-[#115e34]",
    color: "#2E8B57",
    shadow: "rgba(46, 139, 87, 0.3)",
  },
  nagano: {
    gradient: "from-[#2E8B57] to-[#115e34]",
    color: "#2E8B57",
    shadow: "rgba(46, 139, 87, 0.3)",
  },
  yamanashi: {
    gradient: "from-[#2E8B57] to-[#115e34]",
    color: "#2E8B57",
    shadow: "rgba(46, 139, 87, 0.3)",
  },
  niigata: {
    gradient: "from-[#2E8B57] to-[#115e34]",
    color: "#2E8B57",
    shadow: "rgba(46, 139, 87, 0.3)",
  },
  toyama: {
    gradient: "from-[#2E8B57] to-[#115e34]",
    color: "#2E8B57",
    shadow: "rgba(46, 139, 87, 0.3)",
  },
  ishikawa: {
    gradient: "from-[#2E8B57] to-[#115e34]",
    color: "#2E8B57",
    shadow: "rgba(46, 139, 87, 0.3)",
  },
  fukui: {
    gradient: "from-[#2E8B57] to-[#115e34]",
    color: "#2E8B57",
    shadow: "rgba(46, 139, 87, 0.3)",
  },

  // === 近畿 (Bronze/Apricot) ===
  osaka: {
    gradient: "from-[#B85C38] to-[#743518]",
    color: "#B85C38",
    shadow: "rgba(184, 92, 56, 0.3)",
  },
  kyoto: {
    gradient: "from-[#B85C38] to-[#743518]",
    color: "#B85C38",
    shadow: "rgba(184, 92, 56, 0.3)",
  },
  hyogo: {
    gradient: "from-[#B85C38] to-[#743518]",
    color: "#B85C38",
    shadow: "rgba(184, 92, 56, 0.3)",
  },
  shiga: {
    gradient: "from-[#B85C38] to-[#743518]",
    color: "#B85C38",
    shadow: "rgba(184, 92, 56, 0.3)",
  },
  nara: {
    gradient: "from-[#B85C38] to-[#743518]",
    color: "#B85C38",
    shadow: "rgba(184, 92, 56, 0.3)",
  },
  wakayama: {
    gradient: "from-[#B85C38] to-[#743518]",
    color: "#B85C38",
    shadow: "rgba(184, 92, 56, 0.3)",
  },

  // === 中国 (Amber Gold) ===
  tottori: {
    gradient: "from-[#D99A26] to-[#A06C0C]",
    color: "#D99A26",
    shadow: "rgba(217, 154, 38, 0.3)",
  },
  shimane: {
    gradient: "from-[#D99A26] to-[#A06C0C]",
    color: "#D99A26",
    shadow: "rgba(217, 154, 38, 0.3)",
  },
  okayama: {
    gradient: "from-[#D99A26] to-[#A06C0C]",
    color: "#D99A26",
    shadow: "rgba(217, 154, 38, 0.3)",
  },
  hiroshima: {
    gradient: "from-[#D99A26] to-[#A06C0C]",
    color: "#D99A26",
    shadow: "rgba(217, 154, 38, 0.3)",
  },
  yamaguchi: {
    gradient: "from-[#D99A26] to-[#A06C0C]",
    color: "#D99A26",
    shadow: "rgba(217, 154, 38, 0.3)",
  },

  // === 四国 (Mikan Orange) ===
  tokushima: {
    gradient: "from-[#E67E22] to-[#A04000]",
    color: "#E67E22",
    shadow: "rgba(230, 126, 34, 0.3)",
  },
  kagawa: {
    gradient: "from-[#E67E22] to-[#A04000]",
    color: "#E67E22",
    shadow: "rgba(230, 126, 34, 0.3)",
  },
  ehime: {
    gradient: "from-[#E67E22] to-[#A04000]",
    color: "#E67E22",
    shadow: "rgba(230, 126, 34, 0.3)",
  },
  kochi: {
    gradient: "from-[#E67E22] to-[#A04000]",
    color: "#E67E22",
    shadow: "rgba(230, 126, 34, 0.3)",
  },

  // === 九州・沖縄 (Caribbean Blue) ===
  fukuoka: {
    gradient: "from-[#009688] to-[#00695C]",
    color: "#009688",
    shadow: "rgba(0, 150, 136, 0.3)",
  },
  saga: {
    gradient: "from-[#009688] to-[#00695C]",
    color: "#009688",
    shadow: "rgba(0, 150, 136, 0.3)",
  },
  nagasaki: {
    gradient: "from-[#009688] to-[#00695C]",
    color: "#009688",
    shadow: "rgba(0, 150, 136, 0.3)",
  },
  kumamoto: {
    gradient: "from-[#009688] to-[#00695C]",
    color: "#009688",
    shadow: "rgba(0, 150, 136, 0.3)",
  },
  oita: {
    gradient: "from-[#009688] to-[#00695C]",
    color: "#009688",
    shadow: "rgba(0, 150, 136, 0.3)",
  },
  miyazaki: {
    gradient: "from-[#009688] to-[#00695C]",
    color: "#009688",
    shadow: "rgba(0, 150, 136, 0.3)",
  },
  kagoshima: {
    gradient: "from-[#009688] to-[#00695C]",
    color: "#009688",
    shadow: "rgba(0, 150, 136, 0.3)",
  },
  okinawa: {
    gradient: "from-[#009688] to-[#00695C]",
    color: "#009688",
    shadow: "rgba(0, 150, 136, 0.3)",
  },
};

// 辅助函数：根据县名 slug 获取主题
export const getPrefectureTheme = (prefName: string): ThemeColor => {
  return PREFECTURE_THEME_MAP[prefName] || DEFAULT_THEME;
};
