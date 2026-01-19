"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

interface RabbitProps {
  rivSrc: string;
  className?: string;
}

const RabbitActor: React.FC<RabbitProps> = ({ rivSrc, className }) => {
  // 1. 视野状态：默认看不见
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 2. 监听元素是否进入屏幕 (Smart Money 策略：只在需要时消费算力)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // isIntersecting: 是否在视野内
          setIsInView(entry.isIntersecting);
        });
      },
      {
        // 🛠️ 关键参数：rootMargin
        // "200px" 意味着：在兔子还没进入屏幕、距离屏幕还有 200px 时，就提前开始渲染。
        // 这样用户滚过去时，动画已经准备好了，不会闪烁。
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 3. 只有在视野附近时，才初始化 Rive
  // 这能把同时运行的 Rive 实例从 60 个降低到 5-6 个，彻底解决 ArrayBuffer 报错
  return (
    <div ref={containerRef} className={`w-full h-full ${className || ""}`}>
      {isInView ? (
        <RiveWrapper rivSrc={rivSrc} />
      ) : (
        // 占位符：保持布局不塌陷
        <div className="w-full h-full" />
      )}
    </div>
  );
};

// 4. 将 Rive 逻辑拆分为子组件
// 这样当父组件 isInView 变 false 时，React 会彻底卸载这个组件及其 Wasm 内存
const RiveWrapper = ({ rivSrc }: { rivSrc: string }) => {
  const { RiveComponent } = useRive({
    src: rivSrc,
    animations: "Timeline 1",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  return <RiveComponent />;
};

export default RabbitActor;
