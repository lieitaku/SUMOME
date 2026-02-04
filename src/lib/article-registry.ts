import React from "react";
import { Activity, Club } from "@prisma/client";

// 导入自定义文章组件
import Activity_01 from "@/components/activities/articles/Activity_01";
import Activity_02 from "@/components/activities/articles/Activity_02";
import Activity_03 from "@/components/activities/articles/Activity_03";
import Activity_04 from "@/components/activities/articles/Activity_04";

// --- 1. 定义自定义组件通用的 Props 类型 ---
export interface CustomActivityProps {
  activity: Activity & { club: Club };
}

// --- 2. 核心注册表 ---
// 使用 React.ComponentType 配合具体的 Props 类型
// customRoute 字段的值 -> 对应的自定义组件
export const ArticleRegistry: Record<
  string,
  React.ComponentType<CustomActivityProps>
> = {
  "act-01": Activity_01,
  "act-02": Activity_02,
  "act-03": Activity_03,
  "act-04": Activity_04,
};

// --- 3. 获取组件的工具函数 ---
export function getArticleContent(id: string) {
  return ArticleRegistry[id] || null;
}
