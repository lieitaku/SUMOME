import type { CSSProperties } from "react";

/**
 * ==============================================================================
 * 🛠️ 配置文件 (Config)
 * 存放兔子变体数据、概率池逻辑和赞助商数据生成
 * ==============================================================================
 */

// 定义兔子变体的类型结构
export type RabbitVariant = {
  frames: string[]; // 走路的三张帧图
  hand: string; // 手部遮挡图 (拿着旗杆的手)
  flagStyle: {
    // 旗帜微调定位 (不同兔子的手位置不同)
    bottom: string;
    left: string;
    scale?: number;
  };
  // 🆕 身体样式：用于特殊处理（如通过 CSS 裁剪掉耳朵）
  bodyStyle?: CSSProperties;
  // 🆕 新增：手部微调配置 (支持 top, left, transform 等)
  handStyle?: CSSProperties;
};

// 🐰 兔子种类配置库
// 包含 4 种普通兔子 + 1 种特殊的“无耳”变体
export const RABBIT_VARIANTS: RabbitVariant[] = [
  // Index 0: Type 1 (标准版)
  {
    frames: ["/rabbit/1-1.png", "/rabbit/1-2.png", "/rabbit/1-3.png"],
    hand: "/rabbit/hand-1.png",
    flagStyle: { bottom: "20px", left: "3px", scale: 0.7 },
  },
  // Index 1: Type 2 (呆萌版)
  {
    frames: ["/rabbit/2-1.png", "/rabbit/2-2.png", "/rabbit/2-3.png"],
    hand: "/rabbit/hand-2.png",
    flagStyle: { bottom: "-10px", left: "3px", scale: 0.7 },
  },
  // Index 2: Type 3 (活泼版)
  {
    frames: ["/rabbit/3-1.png", "/rabbit/3-2.png", "/rabbit/3-3.png"],
    hand: "/rabbit/hand-3.png",
    flagStyle: { bottom: "30px", left: "-42px", scale: 0.72 },
  },
  // Index 3: Type 4 (稳重版)
  {
    frames: ["/rabbit/4-1.png", "/rabbit/4-2.png", "/rabbit/4-3.png"],
    hand: "/rabbit/hand-4.png",
    flagStyle: { bottom: "20px", left: "33px", scale: 0.72 },
  },

  // Index 4: Type 5 (无耳版 - 基于 Type 1 修改)
  // Smart Practice: 复用 Type 1 的图片资源，通过 CSS clip-path 裁掉耳朵
  {
    frames: ["/rabbit/1-1.png", "/rabbit/1-2.png", "/rabbit/1-3.png"],
    hand: "/rabbit/hand-1.png",
    // 🆕 在这里微调手的位置 (支持 px 或 %)
    handStyle: {
      // translate(水平位移, 垂直位移)
      // 比如：往右移 5px，往上移 15px
      transform: "translate(0,-80px)",
    },
    flagStyle: { bottom: "40px", left: "3px", scale: 0.8 },
    bodyStyle: {
      // ✂️ 核心魔法：裁掉顶部 32% 的区域 (隐藏耳朵)
      clipPath: "inset(30% 0 0 10%)",
    },
  },
];

/**
 * 🎲 概率池 (Probability Pool)
 * ------------------------------------------------------------------------------
 * 为了避免 Hydration Mismatch (服务端与客户端渲染不一致)，我们不使用 Math.random()。
 * 而是使用一个预设好的“洗牌数组”来模拟随机。
 * * 逻辑目标：
 * - 70% 概率出现“无耳兔子” (Index 4)
 * - 30% 概率出现“其他兔子” (Index 0, 1, 2, 3)
 * * 计算：
 * 20 个槽位中：
 * - 14 个位置是 4 (无耳)
 * - 6 个位置分配给 0, 1, 2, 3 (有耳)
 */
export const RABBIT_PROBABILITY_POOL = [
  4, 4, 0, 4, 4, 1, 4, 4, 4, 2, 4, 4, 3, 4, 4, 4, 0, 4, 1, 4,
];

// 🏢 赞助商数据生成 (Smart Logic)
// 自动生成 id: 1~15，对应图片 /images/sponsors/1.png ~ 15.png
export const RAW_SPONSORS = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  // 对应 public/images/sponsors/ 下的文件
  image: `/images/sponsors/${i + 1}.png`,
  alt: `Sponsor ${i + 1}`,
}));
