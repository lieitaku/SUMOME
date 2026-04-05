import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CompanyClient from "./CompanyClient";

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
  const t = await getTranslations({ locale, namespace: "CompanyPage" });
  const base = siteBase();
  const jaUrl = `${base}/company`;
  const enUrl = `${base}/en/company`;
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

export default function CompanyPage() {
  return <CompanyClient />;
}
