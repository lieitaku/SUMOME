"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { Character } from "@/components/characters/character-data";
import ComicDecorations from "@/components/characters/ComicDecorations";

type CoreMascotsHeroProps = {
  characters: Character[];
};

type CharacterCopyKey =
  | "characters.sumome"
  | "characters.chanko"
  | "characters.gottsan";

const EASE = "cubic-bezier(0.32,0.72,0,1)";

export default function CoreMascotsHero({ characters }: CoreMascotsHeroProps) {
  const t = useTranslations("CharactersPage");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    /*
     * 布局核心：
     * - 移动端：flex-col（默认），卡片垂直堆叠
     * - 桌面端：flex-row，卡片横排
     * - 展开动画：通过每张卡片的 flex-grow（数字）过渡实现
     *   flex-grow 是数值属性，所有现代浏览器均支持平滑 transition，
     *   不依赖 Tailwind JIT / CSS Grid 任意值，刷新后绝不丢失。
     */
    <div
      className="flex flex-col gap-6 md:flex-row"
      style={{ minHeight: "600px" }}
    >
      {characters.map((character, index) => {
        const isHovered = hoveredIndex === index;
        const copyPrefix = `characters.${character.id}` as CharacterCopyKey;
        const name = t(`${copyPrefix}.name`);
        const nameEn = t(`${copyPrefix}.nameEn`);
        const title = t(`${copyPrefix}.title`);
        const description = t(`${copyPrefix}.description`);
        const quote = t(`${copyPrefix}.quote`);
        const traits = t.raw(`${copyPrefix}.traits`) as string[];

        const flexGrow =
          hoveredIndex === null ? 1 : isHovered ? 2.5 : 1;

        return (
          <div
            key={character.id}
            className="group relative z-0 min-w-0 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm md:group-hover:z-30 md:group-hover:overflow-visible"
            style={{
              flexGrow,
              flexShrink: 1,
              flexBasis: 0,
              minHeight: "450px",
              transition: `flex-grow 0.7s ${EASE}`,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Background gradient */}
            <div
              className={cn(
                "absolute inset-0 z-0 transition-opacity duration-700",
                isHovered ? "opacity-20" : "opacity-10",
                character.theme === "brand" && "bg-gradient-to-br from-sumo-brand to-transparent",
                character.theme === "gold" && "bg-gradient-to-br from-sumo-gold to-transparent",
                character.theme === "red" && "bg-gradient-to-br from-sumo-red to-transparent",
              )}
              style={{ transitionTimingFunction: EASE }}
            />

            {/* Top Info */}
            <div className="absolute top-0 left-0 right-0 p-6 md:p-8 z-20 pointer-events-none">
              <p
                className={cn(
                  "text-xs font-bold uppercase tracking-[0.25em]",
                  character.theme === "brand" && "text-sumo-brand",
                  character.theme === "gold" && "text-sumo-gold",
                  character.theme === "red" && "text-sumo-red",
                )}
              >
                {nameEn}
              </p>
              <h2 className="mt-1 font-serif text-3xl md:text-4xl font-bold tracking-wide text-sumo-text">
                {name}
              </h2>
              <p className="mt-2 text-sm font-medium text-gray-500">{title}</p>
            </div>

            {/* Character Image：略缩小；悬停时略放大上移，overflow-visible 时冲出卡片圆角 */}
            <div
              className="absolute inset-0 z-10 pt-[100px] pb-[120px] md:pb-[100px] transition-transform duration-700 md:group-hover:scale-110 md:group-hover:-translate-y-2"
              style={{ transitionTimingFunction: EASE }}
            >
              {character.imageSrc && (
                <img
                  src={character.imageSrc}
                  alt={t("characterIllustrationAlt", { name })}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  className="h-full w-full origin-bottom scale-[0.9] select-none object-contain object-bottom drop-shadow-xl [-webkit-user-drag:none] [-webkit-touch-callout:none]"
                />
              )}
            </div>

            {/* Quote Decoration (desktop hover only) */}
            <div
              className={cn(
                "absolute inset-0 z-30 hidden md:block pointer-events-none transition-opacity duration-500",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            >
              <ComicDecorations quote={quote} theme={character.theme} />
            </div>

            {/* Bottom Details */}
            <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col justify-end bg-gradient-to-t from-white from-25% via-white/98 to-transparent p-6 md:p-8 pt-20 md:pt-28">
              {/* Mobile Quote */}
              <p className="mb-4 text-center text-sm font-bold italic text-sumo-dark md:hidden">
                {quote}
              </p>

              {/* Expandable description + traits */}
              <div
                className={cn(
                  "grid transition-all duration-700",
                  "grid-rows-[1fr] opacity-100",
                  "md:grid-rows-[0fr] md:opacity-0",
                  "md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100"
                )}
                style={{ transitionTimingFunction: EASE }}
              >
                <div className="overflow-hidden">
                  <div className="w-full min-w-0">
                    {/* 桌面端：介绍单行不换行，随卡片变宽铺满；过长时可横向轻扫 */}
                    <div className="scrollbar-hide w-full min-w-0 md:overflow-x-auto md:overscroll-x-contain">
                      <p className="text-sm leading-relaxed text-gray-700 md:whitespace-nowrap">
                        {description}
                      </p>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {traits.map((trait) => (
                        <span
                          key={trait}
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-bold tracking-wider text-white shadow-sm",
                            character.theme === "brand" && "bg-sumo-brand",
                            character.theme === "gold" && "bg-sumo-gold",
                            character.theme === "red" && "bg-sumo-red",
                          )}
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
