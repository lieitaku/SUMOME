"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PageHero from "@/components/common/PageHero";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import CharacterSelector from "@/components/characters/CharacterSelector";
import CharacterProfile from "@/components/characters/CharacterProfile";
import { CHARACTERS } from "@/components/characters/character-data";

export default function CharacterPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = (nextIndex: number) => {
    if (nextIndex === activeIndex) return;
    setActiveIndex(nextIndex);
  };

  return (
    <main className="bg-sumo-bg pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <PageHero
        title="仲間を紹介"
        enTitle="CHARACTERS"
        subtitle="SUMOMEの世界に住む3人の仲間たち"
        backLink={{ href: "/", label: "TOPに戻る" }}
        className="pb-6 md:pb-20"
      />

      <CharacterSelector
        characters={CHARACTERS}
        activeIndex={activeIndex}
        onSelect={handleSelect}
      />

      <Section
        className="py-4 md:py-28 overflow-x-clip overflow-y-visible"
        containerClassName="px-4 md:px-12"
      >
        <CharacterProfile
          characters={CHARACTERS}
          activeIndex={activeIndex}
          onNavigate={handleSelect}
        />
      </Section>

      <section className="relative overflow-hidden rounded-t-[2rem] md:rounded-t-[3rem] bg-sumo-dark py-8 text-white md:py-20">
        <motion.div
          className="pointer-events-none absolute -top-14 right-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="container mx-auto max-w-7xl px-4 text-center md:px-12">
          <p className="text-xs font-bold tracking-[0.28em] text-sumo-gold">-物語に参加しよう-</p>
          <h3 className="mt-2 font-serif text-2xl font-bold md:mt-3 md:text-5xl">
            お気に入りの仲間と、次の思い出へ。
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/80 md:mt-4 md:text-base md:leading-7">
            それぞれの個性が交わると、物語はもっと面白くなる。イベントやクラブを覗いて、
            SUMOMEの世界を体験しよう。
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:mt-8 md:gap-3">
            <Button 
              href="/clubs" 
              className="bg-sumo-gold text-white hover:bg-[#a88b40] shadow-[0_0_15px_rgba(193,161,78,0.4)] hover:shadow-[0_0_25px_rgba(193,161,78,0.6)] border-none transition-all duration-500"
            >
              クラブを見る
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
