export type Magazine = {
  id: string;
  title: string;
  subTitle: string;
  publishDate: string;
  coverImage: string;
  description: string;
  toc: string[]; // 目录 (Table of Contents)
};

// 这里的图片路径使用了之前的命名规范，请确保图片真实存在
export const magazinesData: Magazine[] = [
  {
    id: "vol-01",
    title: "SUMOME Vol.1",
    subTitle: "創刊号：相撲の未来を拓く",
    publishDate: "2024.04.01",
    coverImage: "/images/magazines/cover-1.jpg",
    description:
      "記念すべき創刊号。全国の強豪クラブ取材記事に加え、レジェンド力士への独占インタビューを掲載。相撲の伝統と革新が交差する瞬間を切り取りました。",
    toc: [
      "巻頭特集：相撲新時代の幕開け",
      "全国クラブ探訪：愛知・岐阜編",
      "【対談】指導者が語る育成の極意",
      "SUMOMEの目指す未来",
    ],
  },
  {
    id: "vol-02",
    title: "SUMOME Vol.2",
    subTitle: "技を磨く、心を育てる",
    publishDate: "2024.06.15",
    coverImage: "/images/magazines/cover-2.jpg",
    description:
      "「心技体」の「技」にフォーカス。基本動作から応用まで、プロが教える技術論を徹底解剖。次世代の力士たち必見の一冊です。",
    toc: [
      "特集：四股・鉄砲の科学",
      "注目の若手力士インタビュー",
      "夏合宿密着レポート",
      "栄養士が教える力士メシ",
    ],
  },
  {
    id: "vol-03",
    title: "SUMOME Vol.3",
    subTitle: "地域と生きる相撲クラブ",
    publishDate: "2024.08.20",
    coverImage: "/images/magazines/cover-3.jpg",
    description:
      "地域密着型のクラブ運営にスポットライトを当てます。祭り、ボランティア、地域交流。土俵の外で生まれる絆の物語。",
    toc: [
      "地域貢献活動レポート",
      "わんぱく相撲全国大会ハイライト",
      "クラブ運営マネジメント講座",
      "読者の広場",
    ],
  },
  // ... 你可以继续复制添加更多，只需修改 id 和图片路径
  {
    id: "vol-04",
    title: "SUMOME Vol.4",
    subTitle: "秋場所展望号",
    publishDate: "2024.10.10",
    coverImage: "/images/magazines/cover-4.jpg",
    description:
      "秋の大会シーズン到来。注目の取組予想と、各カテゴリーの優勝候補を徹底分析。",
    toc: [
      "秋場所展望",
      "データで見る勝敗の分かれ目",
      "メンタルトレーニング入門",
    ],
  },
  {
    id: "vol-05",
    title: "SUMOME Vol.5",
    subTitle: "冬の鍛錬",
    publishDate: "2024.12.01",
    coverImage: "/images/magazines/cover-5.jpg",
    description:
      "寒さに負けない体づくり。冬場のトレーニング法と怪我予防について専門家が解説。",
    toc: [
      "冬場のコンディショニング",
      "怪我を防ぐストレッチ",
      "温故知新：名力士の稽古",
    ],
  },
];
