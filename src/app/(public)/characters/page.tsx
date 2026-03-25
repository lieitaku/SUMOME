import type { Metadata } from "next";
import CharacterPage from "@/components/characters/CharacterPage";

export const metadata: Metadata = {
  title: "キャラクター紹介",
  description:
    "SUMOMEの世界に住む3人の仲間たちを紹介。それぞれの個性豊かなキャラクターと一緒に、相撲の世界を楽しもう。",
  alternates: { canonical: "https://memory-sumo.com/characters" },
};

export default function CharactersRoutePage() {
  return <CharacterPage />;
}
