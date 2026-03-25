import type { Metadata } from "next";
import MagazinesClient from "./MagazinesClient";
import { getCachedAllMagazines } from "@/lib/cached-queries";

export const metadata: Metadata = {
  title: "フォトブック一覧",
  description:
    "SUMOMEの相撲フォトブック一覧。全国各地の相撲大会・イベントの写真を掲載したフォトマガジンをご覧いただけます。",
  alternates: { canonical: "https://memory-sumo.com/magazines" },
};

export default async function MagazinesPage() {
  const magazines = await getCachedAllMagazines();
  return <MagazinesClient initialMagazines={magazines} />;
}
