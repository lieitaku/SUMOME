"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import type { PrefectureCharacter } from "@/data/types";
import { cn } from "@/lib/utils";

/**
 * 绿色页头（hero）里的角色图：只改下面这个对象即可。
 *
 * - widthPercentOfViewport：相对**视口宽度**的百分比（中间项用 vw）。例如 14 ≈ 理想宽度取 14vw，
 *   再被 min/max 像素夹住。想整体变小就**把这个数字改小**（最直观）。
 * - widthMinPx / widthMaxPx：再小/再大不允许超过的范围（px）。
 * - overallPercent：总体系数（100 = 不额外缩放，80 = 在上面结果上再 ×0.8）。你要的「百分比」也可主要调这个。
 * - textMaxWidthClass：对话框文字区域最大宽度（Tailwind 类）。
 * - heroColumnMaxWidthClass：窄屏时页头「右侧角色+气泡」整块的最大占位宽度，避免挤压左侧标题；lg 起解除上限。
 */
export const PREFECTURE_CHARACTER_HERO_TUNING = {
  widthPercentOfViewport: 18,
  widthMinPx: 80,
  widthMaxPx: 160,
  overallPercent: 120,
  /** 竖直上限：min(视口高度×%, px)，防止手机上一图占半屏 */
  maxHeightPercentOfViewport: 40,
  maxHeightPxCap: 240,
  textMaxWidthClass: "max-w-[85vw] sm:max-w-[240px] lg:max-w-[280px]",
  heroColumnMaxWidthClass:
    "max-w-[min(148px,40vw)] sm:max-w-[min(168px,38vw)] lg:max-w-none",
} as const;

function heroImageLayoutStyles(): { box: CSSProperties; imgMaxHeight: string } {
  const t = PREFECTURE_CHARACTER_HERO_TUNING;
  const k = Math.max(0.25, Math.min(2, t.overallPercent / 100));
  const minPx = Math.round(t.widthMinPx * k);
  const maxPx = Math.round(t.widthMaxPx * k);
  const vw = Number((t.widthPercentOfViewport * k).toFixed(2));
  const maxH = Math.round(t.maxHeightPxCap * k);
  const maxHv = Number((t.maxHeightPercentOfViewport * k).toFixed(2));
  const imgMaxHeight = `min(${maxHv}vh, ${maxH}px)`;
  return {
    box: {
      width: `clamp(${minPx}px, ${vw}vw, ${maxPx}px)`,
      maxWidth: "100%",
    },
    imgMaxHeight,
  };
}

interface PrefectureCharacterProps {
  prefSlug: string;
  character: PrefectureCharacter;
  locale: string;
  themeColor: string;
  /** hero：绿色页头右侧，小图 + 浅色文案；default：内容区用（若需） */
  variant?: "default" | "hero";
}

export default function PrefectureCharacter({
  prefSlug,
  character,
  locale,
  themeColor,
  variant = "default",
}: PrefectureCharacterProps) {
  const [imgError, setImgError] = useState(false);

  const description =
    locale === "en" && character.descriptionEn
      ? character.descriptionEn
      : character.description;

  const imgSrc = `/images/characters/${prefSlug}.webp`;

  if (imgError) return null;

  if (variant === "hero") {
    const { textMaxWidthClass } = PREFECTURE_CHARACTER_HERO_TUNING;
    const { box: boxStyle, imgMaxHeight } = heroImageLayoutStyles();
    return (
      <div className="flex flex-col items-center lg:items-end justify-end w-full max-w-full min-w-0 mx-auto lg:mx-0 pointer-events-none select-none">
        {/* 漫画对话框 */}
        <div className={cn("relative mb-4 drop-shadow-xl pointer-events-auto", textMaxWidthClass)}>
          <div className="bg-white text-gray-900 px-3 py-2 md:px-4 md:py-3 rounded-2xl">
            <p className="text-[11px] md:text-xs font-bold leading-relaxed text-center whitespace-pre-wrap wrap-break-word">
              {description}
            </p>
          </div>
          {/* 气泡尾巴 (纯 CSS 三角形，利用外层 drop-shadow 自动带阴影) */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
        </div>

        <div
          className="relative flex items-end justify-center shrink-0 overflow-visible mx-auto lg:mx-0 leading-none"
          style={boxStyle}
        >
          {/* leading-none + block img：避免内联图片基线在透明底上形成「细边框」 */}
          <Image
            src={imgSrc}
            alt={character.name}
            width={600}
            height={900}
            sizes="(max-width: 1024px) 28vw, 88px"
            className={cn(
              "block h-auto w-full object-contain object-bottom border-0 bg-transparent shadow-none outline-none ring-0",
              "drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
            )}
            style={{
              maxHeight: imgMaxHeight,
              verticalAlign: "bottom",
            }}
            onError={() => setImgError(true)}
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center lg:items-end h-full">
      <div className="relative w-[180px] lg:w-[240px] xl:w-[280px] shrink-0 leading-none">
        <Image
          src={imgSrc}
          alt={character.name}
          width={600}
          height={900}
          className={cn(
            "block w-full h-auto object-contain border-0 bg-transparent shadow-none outline-none ring-0",
            "drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
          )}
          style={{ verticalAlign: "bottom" }}
          onError={() => setImgError(true)}
          priority={false}
        />
      </div>

      <div className="mt-3 lg:mt-4 text-center lg:text-right max-w-[280px]">
        <h4
          className="text-xl lg:text-2xl font-bold tracking-tight leading-tight"
          style={{ color: themeColor }}
        >
          {character.name}
        </h4>
        <p className="text-xs text-gray-500 font-medium leading-relaxed mt-2">
          {description}
        </p>
      </div>
    </div>
  );
}
