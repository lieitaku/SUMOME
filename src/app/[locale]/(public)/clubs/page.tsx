import React from "react";
import type { Metadata } from "next";
import ClubSearchClient from "@/components/clubs/ClubSearchClient";
import { getCachedAllClubs } from "@/lib/cached-queries";
import { getTranslations } from "next-intl/server";

function siteBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.memory-sumo.com").replace(
    /\/+$/,
    ""
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ClubsPage" });
  const base = siteBase();
  const jaUrl = `${base}/clubs`;
  const enUrl = `${base}/en/clubs`;
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: locale === "en" ? enUrl : jaUrl,
      languages: {
        ja: jaUrl,
        en: enUrl,
      },
    },
  };
}

export default async function ClubsPage() {
  const clubs = await getCachedAllClubs();
  return <ClubSearchClient initialClubs={clubs} />;
}
