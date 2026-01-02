// src/data/mockData.ts

import { time } from "console";

/**
 * 1. Hero Background Images
 * 首页首屏轮播背景图 (预留功能)
 */
export const heroImagesData = [
  "/images/bg/hero-bg-1.jpeg",
  "/images/bg/hero-bg-2.jpeg",
  "/images/bg/hero-bg-3.jpeg",
];

/**
 * 2. Clubs Data
 * 首页 "Pickup Clubs" 区域展示的推荐俱乐部
 */
export const clubsData = [
  {
    id: 1,
    name: "東京相撲クラブ",
    area: "東京都",
    tag: "12人",
    time: "毎週土曜 10:00-12:00",
    img: "/images/clubs/club-1.jpg",
  },
  {
    id: 2,
    name: "大阪天満道場",
    area: "大阪府",
    tag: "25人",
    time: "毎週金・土・日曜 14:00-17:00",
    img: "/images/clubs/club-2.jpg",
  },
  {
    id: 3,
    name: "名古屋金鯱部屋",
    area: "愛知県",
    tag: "13人",
    time: "毎週月・水・金曜 18:00-20:00",
    img: "/images/clubs/club-3.jpg",
  },
];

/**
 * 3. Activities Data
 * 首页 "Activity Report" 区域展示的活动报告
 */
export const activitiesData = [
  {
    id: 1,
    title: "仙台MIFAフットボールパーク/イベント",
    date: "2025.11.20",
    location: "宮城",
    img: "/images/activities/activity-1.jpg",
  },
  {
    id: 2,
    title: "横浜赤レンガ倉庫 / 大盛況のうちに終了しました！！",
    date: "2025.11.15",
    location: "神奈川",
    img: "/images/activities/activity-2.jpg",
  },
  {
    id: 3,
    title: "横浜赤レンガ倉庫 / YOKOHAMA URBAN SPORTS FESTIVAL ’25",
    date: "2025.11.15",
    location: "神奈川",
    img: "/images/activities/activity-3.jpg",
  },
  {
    id: 4,
    title:
      "みんなの森 ぎふ メディアコスモス / ぎふアクションスポーツフェスティバル2025",
    date: "2025.09.27",
    location: "岐阜",
    img: "/images/activities/activity-4.jpg",
  },
];
