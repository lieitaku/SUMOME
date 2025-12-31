/**
 * 力士 (Sumo Wrestler) 数据类型定义
 */
export type Rikishi = {
  name: string; // 四股名 (Shikona)
  stable: string; // 所属部屋
  rank: string; // 番付 (例: 横綱, 大関)
  start: string; // 初土俵 (入门时间)
  end: string; // 引退时间 (在役则为空)
  active: boolean; // 是否现役
};

/**
 * 都道府县 (Prefecture) 数据类型定义
 * 用于动态路由页面的内容展示
 */
export type PrefectureInfo = {
  id: string; // 路由 ID (例: aichi)
  name: string; // 县名 (例: 愛知県)
  introTitle: string; // 介绍标题
  introText: string; // 介绍正文 (支持 HTML 或换行符)
  bannerImg: string; // 顶部 Banner 图片路径
  rikishiList: Rikishi[]; // 该县出身的力士列表
};
