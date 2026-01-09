export type Activity = {
  id: string;
  title: string;
  date: string; // 格式: YYYY.MM.DD
  location: string;
  img: string; // 封面图/列表图
  category: string; // 类别标签 (如: EVENT REPORT, TOURNAMENT)
};

export const activitiesData: Activity[] = [
  {
    id: "act-01",
    title: "仙台MIFAフットボールパーク / イベント出展のお知らせ",
    date: "2025.11.20",
    location: "宮城県仙台市",
    category: "EVENT REPORT",
    img: "/images/activities/activity-1/activity-cover.jpg",
  },
  {
    id: "act-02",
    title: "横浜赤レンガ倉庫 / 大盛況のうちに終了しました！！",
    date: "2025.11.15",
    location: "神奈川県横浜市",
    category: "EVENT REPORT",
    img: "/images/activities/activity-2/activity-cover.jpg",
  },
  {
    id: "act-03",
    title: "横浜赤レンガ倉庫 / YOKOHAMA URBAN SPORTS FESTIVAL ’25",
    date: "2025.10.22",
    location: "神奈川県横浜市",
    category: "FESTIVAL",
    img: "/images/activities/activity-3/activity-cover.jpg",
  },
  {
    id: "act-04",
    title:
      "みんなの森 ぎふ メディアコスモス / ぎふアクションスポーツフェスティバル2025",
    date: "2025.09.27",
    location: "岐阜県岐阜市",
    category: "FESTIVAL",
    img: "/images/activities/activity-4/activity-cover.jpg",
  },
  // 你可以继续添加更多数据...
];
