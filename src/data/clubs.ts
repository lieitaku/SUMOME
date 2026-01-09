// src/data/clubs.ts

// 1. 定义类型 (Type Definition)
// 这样在写页面时，TypeScript 会智能提示你有那些字段可用
export type Schedule = {
  day: string;
  time: string;
};

export type Club = {
  id: string; // 使用 string id (如 'tokyo-sumo') 对 SEO 更友好
  name: string; // 俱乐部名称
  slug: string; // URL 路径标识
  mainImage: string; // 列表页和详情页头图
  galleryImages: string[]; // 详情页相册 (3-4张)

  // 基础信息
  area: string; // 地区 (如: 東京都)
  city: string; // 城市 (如: 足立区)
  address: string; // 完整地址 (用于地图)

  // 规模与标签
  memberCount: number; // 人数
  tags: string[]; // 标签 (如: 初心者歓迎, 幼児クラスあり)

  // 详细内容
  description: string; // 简短介绍 (列表页用)
  content: string; // 详细介绍 (详情页用，支持换行)

  // 运营信息
  schedule: Schedule[]; // 稽古时间表
  targetAge: string; // 对象年龄 (如: 幼児〜中学生)
  contactUrl?: string; // 外部联系链接 (可选)
};

// 2. 真实数据 (Mock Data)
// 我们可以先填入几个丰富的数据，之后复制即可
export const clubsData: Club[] = [
  {
    id: "club-01",
    slug: "tokyo-sumo-club",
    name: "東京相撲クラブ",
    mainImage: "/images/clubs/club-1.jpg",
    galleryImages: [
      "/images/clubs/club-1-detail-1.jpg", // 请确保这些图片存在，或者先重复使用主图
      "/images/clubs/club-1-detail-2.jpg",
      "/images/clubs/club-1-detail-3.jpg",
    ],
    area: "東京都",
    city: "墨田区",
    address: "東京都墨田区横網1-3-28",
    memberCount: 12,
    tags: ["初心者歓迎", "駅チカ", "プロ指導"],
    description: "東京の下町で、伝統を守りながら楽しく相撲を学ぶクラブです。",
    content: `
      東京相撲クラブは、創立20年を迎える歴史あるクラブです。
      「礼に始まり礼に終わる」をモットーに、心身の健全な育成を目指しています。
      元プロ力士による直接指導が受けられるため、本格的に強くなりたい子はもちろん、
      礼儀作法を身につけたい初心者の方も大歓迎です。
      土俵は屋内にあり、冷暖房完備で一年中快適に稽古ができます。
    `,
    schedule: [
      { day: "土曜日", time: "10:00 - 12:00" },
      { day: "日曜日", time: "10:00 - 12:00" },
    ],
    targetAge: "5歳 〜 15歳",
  },
  {
    id: "club-02",
    slug: "osaka-tenma-dojo",
    name: "大阪天満道場",
    mainImage: "/images/clubs/club-2.jpg",
    galleryImages: ["/images/clubs/club-2.jpg", "/images/clubs/club-2.jpg"],
    area: "大阪府",
    city: "大阪市北区",
    address: "大阪府大阪市北区天満1-1-1",
    memberCount: 25,
    tags: ["全国大会常連", "女子部あり", "合宿あり"],
    description:
      "関西屈指の強豪道場。全国大会を目指す熱い仲間が集まっています。",
    content: `
      大阪天満道場は、数々の全国大会優勝者を輩出してきた名門道場です。
      厳しい稽古の中にも、仲間との絆を大切にするアットホームな雰囲気があります。
      特に女子相撲の普及に力を入れており、専用の更衣室も完備。
      年に2回の合宿では、技術だけでなくチームワークも磨きます。
    `,
    schedule: [
      { day: "金曜日", time: "17:00 - 19:00" },
      { day: "土曜日", time: "14:00 - 17:00" },
      { day: "日曜日", time: "09:00 - 12:00" },
    ],
    targetAge: "小学生 〜 高校生",
  },
  {
    id: "club-03",
    slug: "nagoya-kinshachi",
    name: "名古屋金鯱部屋",
    mainImage: "/images/clubs/club-3.jpg",
    galleryImages: ["/images/clubs/club-3.jpg", "/images/clubs/club-3.jpg"],
    area: "愛知県",
    city: "名古屋市中区",
    address: "愛知県名古屋市中区二の丸1-1",
    memberCount: 13,
    tags: ["幼児クラス", "親子参加OK", "見学自由"],
    description: "名古屋城の近くで活動中。親子で参加できる楽しい相撲教室です。",
    content: `
      名古屋金鯱部屋は、地域密着型の相撲コミュニティです。
      勝ち負けよりも「相撲を楽しむこと」を重視しています。
      未就学児向けの「わんぱくクラス」が大人気で、親子でまわしをつけて汗を流すこともできます。
      運動不足解消や、子供の基礎体力作りにおすすめです。
    `,
    schedule: [
      { day: "水曜日", time: "18:00 - 19:30" },
      { day: "金曜日", time: "18:00 - 19:30" },
    ],
    targetAge: "3歳 〜 大人",
  },
];
