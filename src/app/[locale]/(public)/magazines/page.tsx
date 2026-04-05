import type { Metadata } from "next";
import MagazinesClient from "./MagazinesClient";
import { getCachedAllMagazines } from "@/lib/cached-queries";
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
  const t = await getTranslations({ locale, namespace: "MagazinesPage" });
  const base = siteBase();
  const jaUrl = `${base}/magazines`;
  const enUrl = `${base}/en/magazines`;
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

export default async function MagazinesPage() {
  const magazines = await getCachedAllMagazines();
  return <MagazinesClient initialMagazines={magazines} />;
}
