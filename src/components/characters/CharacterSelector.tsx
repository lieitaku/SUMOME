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
    activeBg: "bg-sumo-brand border-sumo-brand shadow-md scale-105 text-white",
    inactiveText: "text-sumo-brand",
    inactiveBorder: "border-sumo-brand/30",
    hoverBg: "hover:bg-sumo-brand/5",
  },
  gold: {
    activeBg: "bg-sumo-gold border-sumo-gold shadow-md scale-105 text-white",
    inactiveText: "text-sumo-gold",
    inactiveBorder: "border-sumo-gold/30",
    hoverBg: "hover:bg-sumo-gold/5",
  },
  red: {
    activeBg: "bg-sumo-red border-sumo-red shadow-md scale-105 text-white",
    inactiveText: "text-sumo-red",
    inactiveBorder: "border-sumo-red/30",
    hoverBg: "hover:bg-sumo-red/5",
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
                ? theme.activeBg
                : cn("bg-white", theme.inactiveText, theme.inactiveBorder, theme.hoverBg),
            )}
          >
            {character.name}
          </button>
        );
      })}
    </div>
  );
}
