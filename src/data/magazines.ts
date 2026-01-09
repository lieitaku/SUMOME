export type Magazine = {
  id: string;
  title: string;
  subTitle: string;
  publishDate: string;
  coverImage: string;
  description: string;
  toc: string[];
  region: string;
  relatedClubs: string[];
};

export const magazinesData: Magazine[] = [
  {
    id: "vol-01",
    title: "SUMOME Vol.1",
    subTitle: "創刊号：相撲の未来を拓く",
    publishDate: "2024.04.01",
    coverImage: "/images/magazines/cover-1.jpg",
    description:
      "記念すべき創刊号。愛知・岐阜の強豪クラブ取材記事に加え、レジェンド力士への独占インタビューを掲載。",
    toc: [
      "巻頭特集：相撲新時代の幕開け",
      "全国クラブ探訪：愛知・岐阜編",
      "【対談】指導者が語る育成の極意",
    ],
    region: "中部",
    relatedClubs: ["岐阜木野相撲クラブ", "愛知相撲道場", "名古屋少年団"],
  },
  {
    id: "vol-02",
    title: "SUMOME Vol.2",
    subTitle: "関東の虎、西の龍",
    publishDate: "2024.06.15",
    coverImage: "/images/magazines/cover-2.jpg",
    description:
      "関東の強豪大学・高校を特集。埼玉栄、日体大など、名門の稽古場に潜入取材。",
    toc: [
      "特集：名門校の練習メニュー",
      "注目の若手力士インタビュー",
      "夏合宿密着レポート",
    ],
    region: "関東",
    relatedClubs: ["埼玉栄高校", "日本体育大学", "柏相撲少年団"],
  },
  {
    id: "vol-03",
    title: "SUMOME Vol.3",
    subTitle: "北の大地で育つ魂",
    publishDate: "2024.08.20",
    coverImage: "/images/magazines/cover-3.jpg",
    description:
      "北海道・東北特集。雪国ならではのトレーニング法と、粘り強い足腰の秘密に迫る。",
    toc: [
      "地域貢献活動レポート",
      "わんぱく相撲全国大会ハイライト",
      "クラブ運営マネジメント講座",
    ],
    region: "北海道・東北",
    relatedClubs: ["北海道相撲連盟", "青森三沢道場"],
  },
  {
    id: "vol-04",
    title: "SUMOME Vol.4",
    subTitle: "九州・沖縄の風",
    publishDate: "2024.10.10",
    coverImage: "/images/magazines/cover-4.jpg",
    description:
      "相撲どころ九州の底力。地域に根付く土俵文化と、沖縄の独自相撲を取材。",
    toc: ["秋場所展望", "データで見る勝敗の分かれ目", "九州大会レポート"],
    region: "九州・沖縄",
    relatedClubs: ["熊本農業高校", "沖縄浦添道場"],
  },
  {
    id: "vol-05",
    title: "SUMOME Vol.5",
    subTitle: "関西・四国の技",
    publishDate: "2024.12.01",
    coverImage: "/images/magazines/cover-5.jpg",
    description:
      "小柄な選手が大型選手を倒すための「技」を特集。関西・四国の指導者に聞く。",
    toc: [
      "冬場のコンディショニング",
      "怪我を防ぐストレッチ",
      "小兵力士の戦い方",
    ],
    region: "関西",
    relatedClubs: ["近畿大学", "和歌山商業高校", "高知相撲クラブ"],
  },
];
