"use client";

import { cn } from "@/lib/utils";
import Ceramic from "@/components/ui/Ceramic";
import type { Character } from "@/components/characters/character-data";

type CharacterTraitCardsProps = {
  characters: Character[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

const themeStyles = {
  brand: {
    text: "text-sumo-brand",
    border: "border-sumo-brand/30",
    bg: "bg-sumo-brand/10",
  },
  gold: {
    text: "text-sumo-gold",
    border: "border-sumo-gold/35",
    bg: "bg-sumo-gold/10",
  },
  red: {
    text: "text-sumo-red",
    border: "border-sumo-red/30",
    bg: "bg-sumo-red/10",
  },
} as const;

export default function CharacterTraitCards({
  characters,
  activeIndex,
  onSelect,
}: CharacterTraitCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {characters.map((character, index) => {
        const isActive = index === activeIndex;
        const theme = themeStyles[character.theme];

        return (
          <Ceramic
            key={character.id}
            as="button"
            type="button"
            onClick={() => onSelect(index)}
            className={cn(
              "w-full p-5 text-left transition-transform duration-300",
              isActive ? cn("ring-2 -translate-y-1", theme.border) : "",
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-full border border-gray-200 text-sm font-black",
                  isActive ? cn(theme.bg, theme.text) : "bg-gray-50 text-gray-500",
                )}
              >
                {character.name.slice(0, 2)}
              </span>
              <div>
                <p className="font-serif text-xl font-bold text-sumo-text">{character.name}</p>
                <p className={cn("text-xs font-bold tracking-widest", isActive ? theme.text : "text-gray-400")}>
                  {character.title}
                </p>
              </div>
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-gray-600">
              {character.traits.join(" / ")}
            </p>
          </Ceramic>
        );
      })}
    </div>
  );
}
