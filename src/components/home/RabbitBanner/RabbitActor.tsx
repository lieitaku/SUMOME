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
  // 1. 状态只用于存储 Observer 的结果
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 2. 最终决定是否渲染：如果是优先加载(priority)，或者在视野内(isInView)
  // 这样如果 priority 为 true，我们甚至不需要去动 state，彻底避免报错
  const shouldRender = priority || isInView;

  useEffect(() => {
    // ✨ 修复：如果开启了保活(priority)，直接跳过 Observer 逻辑
    // 不需要监听，不需要 setState，直接由上面的 shouldRender 控制渲染
    if (priority) {
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      {
        rootMargin: "800px",
        threshold: 0,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [priority]); // 依赖 priority：当它变化时重新决定是否启用 Observer

  return (
    <div ref={containerRef} className={`w-full h-full ${className || ""}`}>
      {shouldRender ? (
        <RiveWrapper rivSrc={rivSrc} playbackRate={playbackRate} />
      ) : (
        <div className="w-full h-full" />
      )}
    </div>
  );
};

const RiveWrapper = ({
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
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (rive) {
      // 修复 Linter 报错
      // eslint-disable-next-line react-hooks/exhaustive-deps
      (rive as unknown as { playbackRate: number }).playbackRate = playbackRate;

      // 强制时间同步
      const animation = rive.animationNames[0];
      if (animation) {
        const syncTime = (Date.now() % 2000) / 1000;
        rive.scrub(animation, syncTime);
        rive.play();
      }
    }
  }, [rive, playbackRate]);

  return <RiveComponent />;
};

export default RabbitActor;