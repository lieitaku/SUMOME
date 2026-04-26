"use client";

import { useTranslations, useLocale } from "next-intl";
import { PREFECTURE_MASCOTS } from "@/components/characters/character-data";
import MascotCard from "@/components/characters/MascotCard";
import { regionDisplayForLocale } from "@/lib/prefecture-en";
import { PREFECTURE_DATABASE } from "@/data/prefectures";
import { getPrefectureMascotDisplay } from "@/data/characters";

export default function PrefectureMascotsGrid() {
  const t = useTranslations("CharactersPage");
  const locale = useLocale();

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {PREFECTURE_MASCOTS.map((mascot) => {
        const prefData = PREFECTURE_DATABASE[mascot.prefecture];
        const jaName = prefData?.name ?? mascot.prefecture.toUpperCase();
        const displayName = regionDisplayForLocale(jaName, locale);
        const display = getPrefectureMascotDisplay(mascot.prefecture, locale);

        return (
          <MascotCard
            key={mascot.id}
            id={mascot.id}
            name={
              display.hasCharacter ? display.name : t("prefectureMascotNamePlaceholder")
            }
            nameEn={display.hasCharacter ? display.nameEn : mascot.id.toUpperCase()}
            title={
              display.hasCharacter ? display.title : t("prefectureMascotComingSoon")
            }
            theme={mascot.theme}
            imageSrc={display.hasCharacter ? display.imageSrc : mascot.imageSrc}
            prefecture={displayName}
            href={`/prefectures/${mascot.prefecture}`}
          />
        );
      })}
    </div>
  );
}
