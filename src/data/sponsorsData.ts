// src/data/sponsorsData.ts

// 1. 定义单条赞助商的数据结构
export type Sponsor = {
  id: string | number;
  name: string;
  img: string;
  url?: string; // 可选：点击跳转的链接
};

// 2. 辅助函数：生成模拟数据
// (为了方便开发，我们写一个函数快速生成 50 个假数据，
//  实际录入时，你可以手动替换成真实数据)
const generateMockSponsors = (prefName: string, count: number): Sponsor[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${prefName}-${i}`,
    name: `${prefName} Local Partner ${i + 1}`,
    // 使用带颜色的占位图，方便区分不同地区
    img: `https://placehold.co/120x60/f8fafc/cbd5e1?text=${prefName.substring(0, 3).toUpperCase()}+${i + 1}`,
    url: "#",
  }));
};

// 3. 核心数据库：按地区存放真实数据
// 这里我举例：北海道和东京有特别定制的数据，其他地区如果没填，稍后我们用 fallback 逻辑处理
export const SPONSOR_DATABASE: Record<string, Sponsor[]> = {
  // === 北海道专属赞助商 ===
  hokkaido: [
    {
      id: 1,
      name: "白い恋人",
      img: "https://placehold.co/120x60/fff/333?text=ISHIYA",
      url: "#",
    },
    {
      id: 2,
      name: "Sapporo Beer",
      img: "https://placehold.co/120x60/fcd34d/333?text=BEER",
      url: "#",
    },
    {
      id: 3,
      name: "ROYCE'",
      img: "https://placehold.co/120x60/1e3a8a/fff?text=ROYCE",
      url: "#",
    },
    // ... 剩下的 47 个你可以继续生成，或者混合使用 helper 函数
    ...generateMockSponsors("Hokkaido", 47),
  ],

  // === 东京专属赞助商 ===
  tokyo: [
    {
      id: 1,
      name: "Tokyo Banana",
      img: "https://placehold.co/120x60/fef08a/333?text=BANANA",
      url: "#",
    },
    ...generateMockSponsors("Tokyo", 49),
  ],

  // === 大阪专属赞助商 ===
  osaka: [...generateMockSponsors("Osaka", 55)],
};

// 4. 对外导出的获取函数 (Smart Accessor)
// 这是一个智能函数：如果数据库里有这个县的数据，就返回这个县的；
// 如果没有（比如还没来得及录入），就自动生成 50 个通用的假数据，保证页面不报错。
export const getSponsorsByPrefecture = (prefSlug: string): Sponsor[] => {
  const normalizedSlug = prefSlug.toLowerCase();

  if (SPONSOR_DATABASE[normalizedSlug]) {
    return SPONSOR_DATABASE[normalizedSlug];
  }

  // Fallback: 如果该地区数据未录入，生成通用占位数据
  return generateMockSponsors(prefSlug, 50);
};
