"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Character } from "@/components/characters/character-data";
import ComicDecorations from "@/components/characters/ComicDecorations";

type CharacterProfileProps = {
  character: Character;
  activeIndex: number;
  direction: number;
  onNavigate: (nextIndex: number) => void;
  total: number;
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
  character,
  activeIndex,
  direction,
  onNavigate,
  total,
}: CharacterProfileProps) {
  const reduceMotion = useReducedMotion();
  const theme = themeStyles[character.theme];

  return (
    <div className="relative">
      <AnimatePresence custom={direction} mode="wait">
        <motion.article
          key={character.id}
          custom={direction}
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, x: direction >= 0 ? 120 : -120, scale: 0.96 }
          }
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction >= 0 ? -120 : 120, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          drag={reduceMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80) onNavigate((activeIndex + 1) % total);
            if (info.offset.x > 80) onNavigate((activeIndex - 1 + total) % total);
          }}
          className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
        >
          <ComicDecorations quote={character.quote} theme={character.theme} />
          <div className="grid items-stretch gap-0 md:grid-cols-[0.9fr_1.1fr]">
            <div className={cn("relative aspect-[3/4] overflow-hidden bg-gradient-to-br", theme.bgSoft)}>
              <motion.div
                animate={reduceMotion ? {} : { y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-full p-8"
              >
                <CharacterPlaceholder theme={character.theme} />
              </motion.div>
            </div>

            <div className="relative z-10 p-6 md:p-10">
              <p className={cn("mb-2 text-xs font-bold tracking-[0.25em]", theme.text)}>{character.nameEn}</p>
              <h2 className="font-serif text-4xl font-bold tracking-wide text-sumo-text md:text-5xl">
                {character.name} <span className="ml-2 text-xl text-gray-400">✦</span>
              </h2>
              <p className={cn("mt-2 text-sm font-bold tracking-widest", theme.text)}>{character.title}</p>

              <svg className="my-4 h-4 w-full" viewBox="0 0 240 20" preserveAspectRatio="none" aria-hidden>
                <path
                  d="M2 10 C 28 2, 46 18, 70 10 S 110 2, 140 10 S 185 18, 238 10"
                  className={cn("fill-none stroke-2", theme.line)}
                />
              </svg>

              <p className="text-base leading-8 text-gray-700">{character.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
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
        </motion.article>
      </AnimatePresence>
    </div>
  );
}
