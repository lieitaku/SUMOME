/**
 * ==============================================================================
 * 🛠️ 配置文件 (Config)
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

// 🐰 兔子种类配置 (目前有 4 种形态)
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

// 🏢 赞助商初始数据
// 即使这里只有几个，主程序也会自动复制以填满屏幕
export const RAW_SPONSORS = [
  { id: 1, name: "SUMOME", color: "bg-[#1B1C37]" },
  { id: 2, name: "Premium", color: "bg-[#A82429]" },
  { id: 3, name: "Golden", color: "bg-[#C39B4F]" },
  { id: 4, name: "Memory", color: "bg-[#5D3F6A]" },
  { id: 5, name: "Future", color: "bg-[#2F4F4F]" },
];
