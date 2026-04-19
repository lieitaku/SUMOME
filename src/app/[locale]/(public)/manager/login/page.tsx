import React from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import LoginForm from "@/components/manager/LoginForm";

function siteBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.memory-sumo.com").replace(/\/+$/, "");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ManagerLogin" });
  const base = siteBase();
  const jaUrl = `${base}/manager/login`;
  const enUrl = `${base}/en/manager/login`;
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

export default function ManagerLoginPage() {
  return <LoginForm />;
}
