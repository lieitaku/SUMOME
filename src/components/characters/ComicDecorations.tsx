"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CharacterTheme } from "@/components/characters/character-data";

type ComicDecorationsProps = {
  quote: string;
  theme: CharacterTheme;
};

const themeClass = {
  brand: {
    border: "border-sumo-brand/30",
    text: "text-sumo-brand",
    pulse: "bg-sumo-brand/20",
  },
  gold: {
    border: "border-sumo-gold/40",
    text: "text-sumo-gold",
    pulse: "bg-sumo-gold/20",
  },
  red: {
    border: "border-sumo-red/30",
    text: "text-sumo-red",
    pulse: "bg-sumo-red/20",
  },
} as const;

export default function ComicDecorations({ quote, theme }: ComicDecorationsProps) {
  const style = themeClass[theme];

  return (
    <>
      <motion.span
        className={cn("absolute right-3 top-3 text-xl", style.text)}
        animate={{ rotate: [0, 18, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      >
        ✦
      </motion.span>

      <motion.div
        className={cn(
          "absolute bottom-4 left-4 z-20 rounded-2xl border bg-white/85 px-3 py-2 text-xs font-bold backdrop-blur-sm md:text-sm",
          style.border,
          style.text,
        )}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        {quote}
        <span
          className={cn(
            "absolute -bottom-2 left-5 block h-3 w-3 rotate-45 border-b border-r bg-white/90",
            style.border,
          )}
          aria-hidden
        />
      </motion.div>

      <motion.div
        className={cn("pointer-events-none absolute right-7 top-10 h-14 w-14 rounded-full blur-md", style.pulse)}
        animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
    </>
  );
}
