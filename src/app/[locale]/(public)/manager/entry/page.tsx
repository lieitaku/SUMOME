import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import RegistrationForm from "@/components/manager/RegistrationForm";

function siteBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.memory-sumo.com").replace(/\/+$/, "");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ManagerEntry" });
  const base = siteBase();
  const jaUrl = `${base}/manager/entry`;
  const enUrl = `${base}/en/manager/entry`;
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

export const dynamic = "force-dynamic";

export const maxDuration = 60;

export default function ManagerEntryPage() {
  return <RegistrationForm />;
}
