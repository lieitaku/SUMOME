import React from "react";
import ClubSearchClient from "@/components/clubs/ClubSearchClient";
import { getCachedAllClubs } from "@/lib/cached-queries";

export default async function ClubsPage() {
  const clubs = await getCachedAllClubs();
  return <ClubSearchClient initialClubs={clubs} />;
}
