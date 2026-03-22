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
    activeText: "text-sumo-brand",
    activeBg: "bg-sumo-brand/10",
  },
  gold: {
    activeText: "text-sumo-gold",
    activeBg: "bg-sumo-gold/10",
  },
  red: {
    activeText: "text-sumo-red",
    activeBg: "bg-sumo-red/10",
  },
} as const;

export default function CharacterSelector({
  characters,
  activeIndex,
  onSelect,
}: CharacterSelectorProps) {
  return (
    <div className="flex justify-center gap-1.5 px-3 pt-1 pb-3 md:gap-6 md:px-4 md:py-6">
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
              "rounded-full border px-3 py-2 text-xs font-bold transition-all duration-300 md:px-8 md:py-2.5 md:text-base",
              isActive
                ? cn("border-transparent shadow-sm", theme.activeBg, theme.activeText)
                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700",
            )}
          >
            {character.name}
          </button>
        );
      })}
    </div>
  );
}
