import type { CSSProperties } from "react";

/**
 * ==============================================================================
 * 🛠️ 配置文件 (Config)
 * ==============================================================================
 */

// 定义兔子变体的类型结构
export type RabbitVariant = {
  rivSrc: string; // 🆕 核心：指定使用哪个 riv 文件
  hand: string; // 手部图片路径

  // 🚩 旗帜配置
  flagStyle: {
    bottom: string;
    left: string;
    scale?: number; // 整体缩放 (可选)
    // 🆕 新增：精确控制旗帜主体的宽高
    size?: {
      width: number; // 旗面宽度 (默认 170)
      height: number; // 旗面高度 (默认 240)
    };
  };

  // ✂️ 身体特殊样式 (如剪耳朵)
  bodyStyle?: CSSProperties;
  // ✋ 手部特殊样式 (位移/旋转)
  handStyle?: CSSProperties;
};

// 🐰 兔子种类配置库 (共 3 种)
export const RABBIT_VARIANTS: RabbitVariant[] = [
  // --- Index 0: Type 1 (标准版) ---
  // 使用: rabbit1.riv
  {
    rivSrc: "/assets/rabbit1.riv",
    hand: "/rabbit/hand-2.png",
    flagStyle: {
      bottom: "60px",
      left: "-2px",
      scale: 0.7,
      size: { width: 170, height: 260 },
    },
    handStyle: { transform: "translate(-5px,-5px)" },
  },

  // --- Index 1: Type 2 (无耳) ---
  // 使用: rabbit1.riv
  {
    rivSrc: "/assets/rabbit1.riv",
    hand: "/rabbit/hand-1.png",
    handStyle: { transform: "translate(-2px,-126px)" },
    flagStyle: {
      bottom: "50px",
      left: "-2px",
      scale: 0.8,
      size: { width: 164, height: 260 },
    },
    bodyStyle: { clipPath: "inset(70% 0 0 10%)" },
  },

  // --- Index 2: Type 3 (特殊版) ---
  // 🆕 使用: rabbit2.riv (第四种兔子用新文件)
  {
    rivSrc: "/assets/rabbit2.riv",
    hand: "/rabbit/hand-4.png",
    // 手部位置微调
    handStyle: { transform: "translate(0,0px)" },
    flagStyle: {
      bottom: "40px",
      left: "34px",
      scale: 0.8,
      size: { width: 160, height: 280 },
    },
  },
];

/**
 * 🎲 概率池 (Probability Pool)
 * ------------------------------------------------------------------------------
 * ⚠️ 修复闪烁的关键：
 * 池子长度必须和 RAW_SPONSORS.length (15) 保持一致，或者是它的倍数。
 * 否则滚动一圈后，第一只兔子和接替它的兔子长得不一样，就会闪烁。
 *
 * 目标分布 (总数 15)：
 * - 80% 无耳 (Index 1): 12 个
 * - 20% 其他 (Index 0, 3): 3 个
 */
export const RABBIT_PROBABILITY_POOL = [
  1, 1, 0, 1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 1, 2,
];

// 🏢 赞助商数据生成
export const RAW_SPONSORS = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  image: `/images/sponsors/${i + 1}.png`,
  alt: `Sponsor ${i + 1}`,
}));
