import React from "react";
import Activity_01 from "./articles/Activity_01";
import Activity_02 from "./articles/Activity_02";
import Activity_03 from "./articles/Activity_03";
import Activity_04 from "./articles/Activity_04";

// 1. 定义文章组件通用的 Props 类型
// 即使某些文章里暂时没插图，也得接收这个 prop，保持接口一致
export type ArticleComponentProps = {
  mainImage: string;
};

// 2. 更新组件类型定义：告诉它这是一个接收 ArticleComponentProps 的组件
type ArticleComponent = React.ComponentType<ArticleComponentProps>;

const ARTICLE_REGISTRY: Record<string, ArticleComponent> = {
  "act-01": Activity_01,
  "act-02": Activity_02,
  "act-03": Activity_03,
  "act-04": Activity_04,
};

// 辅助函数：根据 ID 获取组件
export const getArticleContent = (id: string) => {
  return ARTICLE_REGISTRY[id] || null;
};
