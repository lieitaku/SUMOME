import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PartnersClient from "./PartnersClient";

function siteBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.memory-sumo.com").replace(/\/+$/, "");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PartnersPage" });
  const base = siteBase();
  const jaUrl = `${base}/partners`;
  const enUrl = `${base}/en/partners`;
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

export default function PartnersPage() {
  return <PartnersClient />;
}
