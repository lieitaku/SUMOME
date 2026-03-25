import React from "react";
import type { Metadata } from "next";
import ClubSearchClient from "@/components/clubs/ClubSearchClient";
import { getCachedAllClubs } from "@/lib/cached-queries";

export const metadata: Metadata = {
  title: "相撲クラブ検索",
  description:
    "全国のアマチュア相撲クラブ・相撲教室を地域・都道府県から検索。キッズ相撲から社会人まで、お近くの相撲クラブを見つけよう。",
  alternates: { canonical: "https://memory-sumo.com/clubs" },
};

export default async function ClubsPage() {
  const clubs = await getCachedAllClubs();
  return <ClubSearchClient initialClubs={clubs} />;
}
