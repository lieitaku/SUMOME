"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import type { PrefectureCharacter } from "@/data/types";
import { prefectureCharacterImagePath } from "@/data/characters";
import { cn } from "@/lib/utils";
import {
  HERO_BUBBLE_TUNING,
  HERO_CHARACTER_IMAGE_SCALE_MOBILE,
  heroImageLayoutStyles,
} from "./prefectureCharacterTuning";
import styles from "./PrefectureCharacterHero.module.css";

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

  const imgSrc = prefectureCharacterImagePath(prefSlug);

  if (imgError) return null;

  if (variant === "hero") {
    const { columnWidth, imgMaxHeight } = heroImageLayoutStyles();
    const b = HERO_BUBBLE_TUNING;

    const bubbleWrapStyle = {
      marginBottom: b.marginBottom,
      ["--tailPx" as string]: `${b.tailBorderPx}px`,
    } as CSSProperties;

    const bubbleStyle = {
      padding: `${b.paddingY}px ${b.paddingX}px`,
      borderRadius: b.borderRadiusPx,
    } as CSSProperties;

    const bubbleTextStyle = {
      fontSize: b.fontSizePx,
    } as CSSProperties;

    const figureStyle = {
      ["--heroFigureScale" as string]: String(HERO_CHARACTER_IMAGE_SCALE_MOBILE),
      ["--heroImgMaxHeight" as string]: imgMaxHeight,
    } as CSSProperties;

    return (
      <div className={styles.root}>
        <div className={styles.column} style={{ width: columnWidth }}>
          <div className={styles.bubbleWrap} style={bubbleWrapStyle}>
            <div className={styles.bubble} style={bubbleStyle}>
              <p className={styles.bubbleText} style={bubbleTextStyle}>
                {description}
              </p>
            </div>
            <div className={styles.tail} aria-hidden />
          </div>

          <div className={styles.figure} style={figureStyle}>
            <Image
              src={imgSrc}
              alt={character.name}
              width={600}
              height={900}
              sizes="(max-width: 640px) 38vw, (max-width: 1024px) 30vw, 240px"
              className={styles.heroImage}
              onError={() => setImgError(true)}
              priority
            />
          </div>
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
