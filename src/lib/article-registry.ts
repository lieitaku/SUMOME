import React from "react";
import { Activity, Club } from "@prisma/client";

// --- 1. 定义自定义组件通用的 Props 类型 ---
export interface CustomActivityProps {
  activity: Activity & { club: Club };
}

// --- 2. 核心注册表 ---
// 使用 React.ComponentType 配合具体的 Props 类型，消灭 any 报错
export const ArticleRegistry: Record<string, React.ComponentType<CustomActivityProps>> = {
  // 以后在这里注册手写组件，例如：
  // "special-event-01": SpecialEventComponent,
};

// --- 3. 获取组件的工具函数 ---
export function getArticleContent(id: string) {
  return ArticleRegistry[id] || null;
}