"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Character } from "@/components/characters/character-data";
import ComicDecorations from "@/components/characters/ComicDecorations";

type CharacterProfileProps = {
  characters: Character[];
  activeIndex: number;
  onNavigate: (nextIndex: number) => void;
};

const themeStyles = {
  brand: {
    text: "text-sumo-brand",
    bgSoft: "from-sumo-brand/10 to-sumo-brand/5",
    badge: "bg-sumo-brand text-white",
    line: "stroke-sumo-brand",
  },
  gold: {
    text: "text-sumo-gold",
    bgSoft: "from-sumo-gold/10 to-sumo-gold/5",
    badge: "bg-sumo-gold text-white",
    line: "stroke-sumo-gold",
  },
  red: {
    text: "text-sumo-red",
    bgSoft: "from-sumo-red/10 to-sumo-red/5",
    badge: "bg-sumo-red text-white",
    line: "stroke-sumo-red",
  },
} as const;

function CharacterPlaceholder({ theme }: { theme: Character["theme"] }) {
  const colorMap = {
    brand: "#0047ab",
    gold: "#c1a14e",
    red: "#de350b",
  } as const;
  const color = colorMap[theme];

  return (
    <svg viewBox="0 0 320 420" className="h-full w-full" aria-hidden>
      <rect x="0" y="0" width="320" height="420" fill="transparent" />
      <circle cx="160" cy="120" r="52" fill="none" stroke={color} strokeWidth="8" />
      <path d="M125 70 L105 28 L150 58" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
      <path d="M196 58 L216 28 L220 78" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
      <rect x="92" y="190" rx="48" ry="48" width="136" height="150" fill="none" stroke={color} strokeWidth="8" />
      <circle cx="142" cy="110" r="5" fill={color} />
      <circle cx="178" cy="110" r="5" fill={color} />
      <path d="M142 140 Q160 158 178 140" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
      <text x="50%" y="388" textAnchor="middle" fill={color} fontSize="24" fontWeight="800">
        CHARACTER
      </text>
    </svg>
  );
}

export default function CharacterProfile({
  characters,
  activeIndex,
  onNavigate,
}: CharacterProfileProps) {
  const n = characters.length;
  const slideFraction = n > 0 ? 100 / n : 100;
  /** Framer 的 x 百分比相对于轨道自身宽度；轨道 = n×视口宽，每次移动 1/n 轨道宽 = 一整屏 */
  const xPercent = n > 0 ? -(activeIndex / n) * 100 : 0;

  return (
    <div className="relative w-full max-w-full overflow-x-clip overflow-y-visible py-2 md:py-4">
      <motion.div
        className="will-change-transform"
        style={{ width: `${n * 100}%`, touchAction: "pan-y" }}
        animate={{ x: `${xPercent}%` }}
        transition={{ 
          type: "spring", 
          stiffness: 250, 
          damping: 25,
          mass: 0.8
        }}
      >
        <motion.div
          className="flex flex-nowrap w-full"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragMomentum={false}
          animate={{ x: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 250, 
            damping: 25,
            mass: 0.8
          }}
          onDragEnd={(_, info) => {
            const swipeThreshold = 50;
            const velocityThreshold = 500;
            
            if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
              onNavigate((activeIndex + 1) % n);
            } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
              onNavigate((activeIndex - 1 + n) % n);
            }
          }}
        >
          {characters.map((character, slideIndex) => {
          const theme = themeStyles[character.theme];
          return (
            <div
              key={character.id}
              className="box-border shrink-0 grow-0"
              style={{ width: `${slideFraction}%` }}
            >
              <article className="relative isolate overflow-hidden rounded-3xl border border-gray-200 bg-white [transform:translateZ(0)]">
                <ComicDecorations quote={character.quote} theme={character.theme} />
                <div className="grid min-h-0 items-stretch gap-0 md:grid-cols-[0.9fr_1.1fr]">
                  <div className={cn("relative min-h-0 aspect-[3/4] overflow-hidden bg-gradient-to-br", theme.bgSoft)}>
                    {character.imageSrc ? (
                      <div className="relative h-full min-h-[12rem] w-full p-4 md:p-8">
                        <Image
                          src={character.imageSrc}
                          alt={`${character.name}のキャラクターイラスト`}
                          fill
                          className="object-contain object-center pointer-events-none select-none"
                          draggable={false}
                          sizes="(max-width: 768px) 100vw, 42vw"
                          priority={slideIndex === activeIndex}
                        />
                      </div>
                    ) : (
                      <div className="h-full w-full p-4 md:p-8">
                        <CharacterPlaceholder theme={character.theme} />
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 p-4 md:p-10">
                    <p className={cn("mb-1 text-xs font-bold tracking-[0.25em]", theme.text)}>{character.nameEn}</p>
                    <h2 className="font-serif text-3xl font-bold tracking-wide text-sumo-text md:text-5xl">
                      {character.name} <span className="ml-1.5 text-lg text-gray-400 md:ml-2 md:text-xl">✦</span>
                    </h2>
                    <p className={cn("mt-1.5 text-sm font-bold tracking-widest", theme.text)}>{character.title}</p>

                    <svg className="my-3 h-4 w-full md:my-4" viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden>
                      <path
                        d="M2 10 C 28 2, 46 18, 70 10 S 110 2, 140 10 S 185 18, 238 10"
                        className={cn("fill-none stroke-2", theme.line)}
                      />
                    </svg>

                    <p className="text-sm leading-7 text-gray-700 md:text-base md:leading-8">{character.description}</p>

                    <div className="mt-4 flex flex-wrap gap-1.5 md:mt-6 md:gap-2">
                      {character.traits.map((trait) => (
                        <span
                          key={trait}
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-bold tracking-wider shadow-sm",
                            theme.badge,
                          )}
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
        </motion.div>
      </motion.div>
    </div>
  );
}
