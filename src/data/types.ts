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
 * 都道府县宣传角色数据类型
 * 集中存储于 src/data/characters.ts，与县数据文件分离
 */
export type PrefectureCharacter = {
  name: string;           // 角色名，如 "サウレス"
  description: string;    // 日文介绍文本
  descriptionEn?: string; // 英文介绍文本（可选）
  // 图片路径由组件根据 prefSlug 自动拼接，不存入此类型
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
  /** 可选：覆盖 `intros-en` 集中数据时的英文标题 */
  introTitleEn?: string;
  /** 可选：覆盖 `intros-en` 集中数据时的英文正文 */
  introTextEn?: string;
  bannerImg: string; // 顶部 Banner 图片路径
  rikishiList: Rikishi[]; // 该县出身的力士列表
};
