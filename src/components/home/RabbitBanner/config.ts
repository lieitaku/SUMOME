/**
 * ==============================================================================
 * 🛠️ 配置文件 (Config)
 * 存放兔子变体数据和赞助商数据生成逻辑
 * ==============================================================================
 */

// 定义兔子变体的类型
export type RabbitVariant = {
  frames: string[]; // 走路的三张帧图
  hand: string; // 手部遮挡图 (拿着旗杆的手)
  flagStyle: {
    // 旗帜微调定位 (不同兔子的手位置不同)
    bottom: string;
    left: string;
    scale?: number;
  };
};

// 🐰 兔子种类配置 (4 种形态)
export const RABBIT_VARIANTS: RabbitVariant[] = [
  // Type 1
  {
    frames: ["/rabbit/1-1.png", "/rabbit/1-2.png", "/rabbit/1-3.png"],
    hand: "/rabbit/hand-1.png",
    flagStyle: { bottom: "20px", left: "3px", scale: 0.7 },
  },
  // Type 2
  {
    frames: ["/rabbit/2-1.png", "/rabbit/2-2.png", "/rabbit/2-3.png"],
    hand: "/rabbit/hand-2.png",
    flagStyle: { bottom: "-10px", left: "3px", scale: 0.7 },
  },
  // Type 3
  {
    frames: ["/rabbit/3-1.png", "/rabbit/3-2.png", "/rabbit/3-3.png"],
    hand: "/rabbit/hand-3.png",
    flagStyle: { bottom: "30px", left: "-42px", scale: 0.72 },
  },
  // Type 4
  {
    frames: ["/rabbit/4-1.png", "/rabbit/4-2.png", "/rabbit/4-3.png"],
    hand: "/rabbit/hand-4.png",
    flagStyle: { bottom: "20px", left: "33px", scale: 0.72 },
  },
];

// 🏢 赞助商数据生成 (Smart Logic)
// 自动生成 id: 1~15，对应图片 /images/sponsors/1.png ~ 15.png
export const RAW_SPONSORS = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  // 对应 public/images/sponsors/ 下的文件
  image: `/images/sponsors/${i + 1}.png`,
  alt: `Sponsor ${i + 1}`,
}));
