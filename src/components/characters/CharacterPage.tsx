"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PageHero from "@/components/common/PageHero";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import CharacterSelector from "@/components/characters/CharacterSelector";
import CharacterProfile from "@/components/characters/CharacterProfile";
import CharacterTraitCards from "@/components/characters/CharacterTraitCards";
import { CHARACTERS } from "@/components/characters/character-data";

export default function CharacterPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleSelect = (nextIndex: number) => {
    if (nextIndex === activeIndex) return;
    setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveIndex(nextIndex);
  };

  return (
    <main className="bg-sumo-bg pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <PageHero
        title="仲間を紹介"
        enTitle="CHARACTERS"
        subtitle="SUMOMEの世界に住む3人の仲間たち"
        backLink={{ href: "/", label: "TOPに戻る" }}
      />

      <CharacterSelector
        characters={CHARACTERS}
        activeIndex={activeIndex}
        onSelect={handleSelect}
      />

      <Section className="pt-8 md:pt-12">
        <CharacterProfile
          character={CHARACTERS[activeIndex]}
          activeIndex={activeIndex}
          direction={direction}
          onNavigate={handleSelect}
          total={CHARACTERS.length}
        />
      </Section>

      <Section className="pt-2 md:pt-4" background="gray">
        <div className="mb-6 text-center">
          <p className="text-xs font-bold tracking-[0.3em] text-sumo-brand">CHARACTER TRAITS</p>
          <h3 className="mt-2 font-serif text-3xl font-bold text-sumo-text">三者三様の魅力</h3>
        </div>
        <CharacterTraitCards
          characters={CHARACTERS}
          activeIndex={activeIndex}
          onSelect={handleSelect}
        />
      </Section>

      <section className="relative overflow-hidden rounded-t-[3rem] bg-sumo-dark py-14 text-white md:py-20">
        <motion.div
          className="pointer-events-none absolute -top-14 right-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="container mx-auto max-w-7xl px-6 text-center md:px-12">
          <p className="text-xs font-bold tracking-[0.28em] text-sumo-gold">JOIN THE STORY</p>
          <h3 className="mt-3 font-serif text-3xl font-bold md:text-5xl">
            お気に入りの仲間と、次の思い出へ。
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
            それぞれの個性が交わると、物語はもっと面白くなる。イベントやクラブを覗いて、
            SUMOMEの世界を体験しよう。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/activities" variant="primary">
              イベントを見る
            </Button>
            <Button href="/clubs" variant="outline" className="border-white text-white hover:bg-white/10">
              クラブを見る
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
