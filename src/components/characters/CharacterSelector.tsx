"use client";

import { cn } from "@/lib/utils";
import type { Character } from "@/components/characters/character-data";

type CharacterSelectorProps = {
  characters: Character[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

const themeStyles = {
  brand: {
    activeRing: "ring-sumo-brand/30",
    activeBottom: "border-b-sumo-brand",
    activeText: "text-sumo-brand",
    activeDot: "bg-sumo-brand",
  },
  gold: {
    activeRing: "ring-sumo-gold/30",
    activeBottom: "border-b-sumo-gold",
    activeText: "text-sumo-gold",
    activeDot: "bg-sumo-gold",
  },
  red: {
    activeRing: "ring-sumo-red/30",
    activeBottom: "border-b-sumo-red",
    activeText: "text-sumo-red",
    activeDot: "bg-sumo-red",
  },
} as const;

export default function CharacterSelector({
  characters,
  activeIndex,
  onSelect,
}: CharacterSelectorProps) {
  return (
    <div className="sticky top-[72px] z-40 border-y border-gray-100 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 md:gap-5 md:px-8">
        {characters.map((character, index) => {
          const isActive = index === activeIndex;
          const theme = themeStyles[character.theme];

          return (
            <button
              key={character.id}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`切换到${character.name}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "group flex min-w-0 items-center gap-2 rounded-full border border-gray-200 border-b-4 px-3 py-2 transition-all duration-500",
                "ease-[cubic-bezier(0.19,1,0.22,1)] active:scale-95 md:px-4",
                isActive
                  ? cn("-translate-y-1 bg-white shadow-lg", theme.activeBottom, theme.activeRing, "ring-2")
                  : "border-b-gray-200 bg-white/70 opacity-80 hover:opacity-100",
              )}
            >
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full border border-gray-200 text-xs font-black tracking-wider transition-all md:size-10",
                  isActive
                    ? cn("bg-white", theme.activeText)
                    : "bg-gray-50 text-gray-400 grayscale",
                )}
              >
                {character.name.slice(0, 2)}
              </span>
              <span
                className={cn(
                  "hidden text-xs font-bold tracking-widest md:inline",
                  isActive ? theme.activeText : "text-gray-500",
                )}
              >
                {character.name}
              </span>
            </button>
          );
        })}
      </div>
      <div className="pb-2 md:hidden">
        <div className="flex items-center justify-center gap-2">
          {characters.map((character, index) => {
            const isActive = index === activeIndex;
            const theme = themeStyles[character.theme];
            return (
              <span
                key={`${character.id}-dot`}
                className={cn(
                  "h-1.5 w-4 rounded-full bg-gray-300 transition-all duration-300",
                  isActive && cn("w-7", theme.activeDot),
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
