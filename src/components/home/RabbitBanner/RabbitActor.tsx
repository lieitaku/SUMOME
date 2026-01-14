"use client";

import React, { useState, useEffect } from "react";

/**
 * ==============================================================================
 * 🐇 子组件: 兔子演员 (RabbitActor)
 * 负责播放帧动画，处理图片预加载
 * ==============================================================================
 */

interface RabbitProps {
  frames: string[];
  fps?: number; // 帧率，控制走路快慢
}

const RabbitActor: React.FC<RabbitProps> = ({ frames, fps = 8 }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // 动画序列：0 -> 1 -> 2 -> 1 -> 0 ... (形成流畅的往返走路感)
  const sequence = [0, 1, 2, 1];

  // 1. 图片预加载逻辑 (防止动画开始时闪烁)
  useEffect(() => {
    setIsLoaded(false);
    let loadedCount = 0;
    frames.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frames.length) setIsLoaded(true);
      };
    });
  }, [frames]);

  // 2. 动画定时器
  useEffect(() => {
    if (!isLoaded) return;
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % sequence.length);
    }, 1000 / fps);
    return () => clearInterval(timer);
  }, [fps, isLoaded]);

  const currentFrameIndex = sequence[stepIndex];

  return (
    <div className="w-full h-full">
      {isLoaded && (
        <img
          src={frames[currentFrameIndex]}
          alt="Rabbit"
          className="w-full h-full object-contain pointer-events-none"
        />
      )}
    </div>
  );
};

export default RabbitActor;
