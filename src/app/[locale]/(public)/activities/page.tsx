import React from "react";
import type { Metadata } from "next";
import ActivitiesListClient from "@/components/activities/ActivitiesListClient";
import { getCachedActivitiesPage } from "@/lib/cached-queries";
import { getTranslations } from "next-intl/server";
import MobileBackToHomeInHero from "@/components/layout/MobileBackToHomeInHero";

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
  const t = await getTranslations({ locale, namespace: "ActivitiesPage" });
  const base = siteBase();
  const jaUrl = `${base}/activities`;
  const enUrl = `${base}/en/activities`;
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

export default async function ActivitiesPage({
  searchParams,
  params,
}: {
  searchParams?: Promise<{ page?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const sp = searchParams ? await searchParams : {};
  const pageParam = sp.page;
  const initialPage = Math.max(1, Number(pageParam) || 1);
  const [t, initialData] = await Promise.all([
    getTranslations({ locale, namespace: "ActivitiesPage" }),
    getCachedActivitiesPage(initialPage),
  ]);

  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
      <main className="flex-grow">
        <section className="relative pt-0 pb-20 md:pb-32 overflow-hidden bg-sumo-brand text-white shadow-xl lg:pt-40">
          <div className="absolute inset-0 bg-gradient-to-b from-sumo-brand to-[#2454a4]"></div>
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 text-[18vw] font-black text-white opacity-[0.04] select-none pointer-events-none leading-none z-0 mix-blend-overlay tracking-tighter font-sans">
            EVENTS
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center">
            <MobileBackToHomeInHero />
            <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight mb-6 text-white drop-shadow-sm reveal-up delay-100">
              {t("heroTitle")}
            </h1>
            <p className="text-white/80 font-medium tracking-wide max-w-xl mx-auto leading-relaxed reveal-up delay-200">
              {t("heroSubtitle")}
            </p>
          </div>
        </section>

        <ActivitiesListClient
          initialPage={initialPage}
          initialData={{
            ...initialData,
            activities: initialData.activities.map((act) => ({
              ...act,
              date: act.date instanceof Date ? act.date.toISOString() : act.date,
            })),
          }}
        />
      </main>
    </div>
  );
}
