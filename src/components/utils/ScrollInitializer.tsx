"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

// 这个组件的作用只有一个：在客户端挂载时启动滚动动画
export default function ScrollInitializer() {
    useScrollReveal();
    return null; // 它不渲染任何东西，只是一个逻辑触发器
}