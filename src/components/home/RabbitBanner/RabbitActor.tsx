"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

interface RabbitProps {
  rivSrc: string;
  className?: string;
  playbackRate?: number;
  priority?: boolean;
}

const RabbitActor: React.FC<RabbitProps> = ({
  rivSrc,
  className,
  playbackRate = 0.5,
  priority = false
}) => {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const shouldRender = priority || isInView;

  useEffect(() => {
    if (priority) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 💡 核心修复：直接使用 isIntersecting
          setIsInView(entry.isIntersecting);
        });
      },
      {
        // 💡 核心修复：大幅减小缓冲区
        // 800px -> 100px (手机) / 200px (电脑)
        // 这样可以确保 iOS 上同时活跃的 WebGL 实例不超过 8-10 个
        rootMargin: typeof window !== 'undefined' && window.innerWidth < 768 ? "100px" : "200px",
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [priority]);

  return (
    <div ref={containerRef} className={`w-full h-full ${className || ""}`}>
      {shouldRender ? (
        <RiveWrapper rivSrc={rivSrc} playbackRate={playbackRate} />
      ) : (
        // 占位符，保持布局不塌陷
        <div className="w-full h-full invisible" />
      )}
    </div>
  );
};

const RiveWrapper = React.memo(({
  rivSrc,
  playbackRate
}: {
  rivSrc: string;
  playbackRate: number;
}) => {
  const { rive, RiveComponent } = useRive({
    src: rivSrc,
    animations: "Timeline 1",
    autoplay: true,
    // 💡 优化：禁用鼠标/触摸监听器，纯展示用途可以节省 CPU
    shouldDisableRiveListeners: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (rive) {
      // 🛠️ 修复说明：
      // 1. (rive as unknown as { playbackRate: number }):
      //    先转为 unknown 再转为具体对象结构。这是绕过 TS 类型缺失且不使用 'any' 的标准做法。
      // 2. eslint-disable-next-line react-hooks/immutability:
      //    保留这个注释，因为 Rive 官方确实要求直接修改实例属性。

      // eslint-disable-next-line react-hooks/immutability
      (rive as unknown as { playbackRate: number }).playbackRate = playbackRate;

      // 腿部动作同步逻辑
      const animation = rive.animationNames[0];
      if (animation) {
        const syncTime = (Date.now() % 2000) / 1000;
        rive.scrub(animation, syncTime);
        rive.play();
      }
    }
  }, [rive, playbackRate]);

  return <RiveComponent className="w-full h-full block" />;
});

RiveWrapper.displayName = "RiveWrapper";

export default RabbitActor;