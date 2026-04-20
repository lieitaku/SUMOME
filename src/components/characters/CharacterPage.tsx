"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import PageHero from "@/components/common/PageHero";
import Button from "@/components/ui/Button";
import { CHARACTERS } from "@/components/characters/character-data";
import CoreMascotsHero from "@/components/characters/CoreMascotsHero";
import PrefectureMascotsGrid from "@/components/characters/PrefectureMascotsGrid";

export default function CharacterPage() {
  const t = useTranslations("CharactersPage");

  return (
    <main className="bg-sumo-bg pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <PageHero
        title={t("heroTitle")}
        enTitle={t("heroEnTitle")}
        eyebrow={t("heroEyebrow")}
        subtitle={t("heroSubtitle")}
        backLink={{ href: "/", label: t("backToTop") }}
        className="pb-4 md:pb-10"
      />

      <div className="mx-auto max-w-7xl px-6 pt-4 pb-10 md:pt-6 md:pb-16 flex flex-col gap-24 md:gap-40">
        <section>
          <CoreMascotsHero characters={CHARACTERS} />
        </section>

        <section>
          <div className="mb-8 flex flex-col items-center text-center">
            <h2 className="font-serif text-3xl font-bold text-sumo-text md:text-4xl">
              {t("prefecturesTitle")}
            </h2>
            <p className="mt-2 text-sm text-gray-500 md:text-base">
              {t("prefecturesSubtitle")}
            </p>
            <div className="mt-4 h-1 w-12 bg-sumo-gold" />
          </div>
          <PrefectureMascotsGrid />
        </section>
      </div>

      <section className="relative overflow-hidden rounded-t-[2rem] md:rounded-t-[3rem] bg-sumo-dark py-8 text-white md:py-20">
        <motion.div
          className="pointer-events-none absolute -top-14 right-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="container mx-auto max-w-7xl px-4 text-center md:px-12">
          <p className="text-xs font-bold tracking-[0.28em] text-sumo-gold">{t("ctaEyebrow")}</p>
          <h3 className="mt-2 font-serif text-2xl font-bold md:mt-3 md:text-5xl">
            {t("ctaTitle")}
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/80 md:mt-4 md:text-base md:leading-7">
            {t("ctaBody")}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:mt-8 md:gap-3">
            <Button 
              href="/clubs" 
              className="bg-sumo-gold text-white hover:bg-[#a88b40] shadow-[0_0_15px_rgba(193,161,78,0.4)] hover:shadow-[0_0_25px_rgba(193,161,78,0.6)] border-none transition-all duration-500"
            >
              {t("ctaClubs")}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
