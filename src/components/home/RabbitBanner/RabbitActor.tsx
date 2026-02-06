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
  // 💡 分离 "曾经可见" 和 "当前可见" 两个状态：
  // - hasBeenVisible: 一旦 true 就永不回 false → 控制是否挂载 Rive（避免反复创建/销毁 WebGL 上下文导致闪烁）
  // - isInView: 实时变化 → 控制 Rive 是否播放（离开视口暂停节省 GPU）
  const [hasBeenVisible, setHasBeenVisible] = useState(priority);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobileRef = useRef(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    if (priority) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasBeenVisible(true);
            setIsInView(true);
          } else {
            setIsInView(false);
          }
        });
      },
      {
        // 移动端进一步减小缓冲区，确保同时活跃的 WebGL 实例更少
        rootMargin: isMobileRef.current ? "50px" : "200px",
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [priority]);

  return (
    <div ref={containerRef} className={`w-full h-full ${className || ""}`}>
      {(priority || hasBeenVisible) ? (
        <RiveWrapper
          rivSrc={rivSrc}
          playbackRate={playbackRate}
          isPlaying={priority || isInView}
        />
      ) : (
        // 占位符，保持布局不塌陷
        <div className="w-full h-full invisible" />
      )}
    </div>
  );
};

const RiveWrapper = React.memo(({
  rivSrc,
  playbackRate,
  isPlaying,
}: {
  rivSrc: string;
  playbackRate: number;
  isPlaying: boolean;
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

  // 设置播放速率
  useEffect(() => {
    if (rive) {
      // 🛠️ 修复说明：
      // (rive as unknown as { playbackRate: number }):
      // 先转为 unknown 再转为具体对象结构。绕过 TS 类型缺失且不使用 'any' 的标准做法。

      // eslint-disable-next-line react-hooks/immutability
      (rive as unknown as { playbackRate: number }).playbackRate = playbackRate;
    }
  }, [rive, playbackRate]);

  // 💡 播放/暂停 + 全局同步
  // 原理：所有兔子使用 performance.now() 作为共享时钟。
  // 公式：syncTime = (页面运行时间 / 1000) * playbackRate
  // 在任意实时时刻 T，任何兔子的动画位置 = syncTime + (T - mount时刻) * rate
  //   = (mount时刻/1000)*rate + (T - mount时刻)*rate
  //   = T * rate / 1000
  // 结论：无论何时挂载/恢复，所有兔子始终在同一动画帧上。
  useEffect(() => {
    if (!rive) return;
    if (isPlaying) {
      const animation = rive.animationNames[0];
      if (animation) {
        const syncTime = (performance.now() / 1000) * playbackRate;
        rive.scrub(animation, syncTime);
      }
      rive.play();
    } else {
      rive.pause();
    }
  }, [rive, isPlaying, playbackRate]);

  return <RiveComponent className="w-full h-full block" />;
});

RiveWrapper.displayName = "RiveWrapper";

export default RabbitActor;
