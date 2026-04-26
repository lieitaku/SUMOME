import React, { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "@/components/ui/TransitionLink";
import ScrollToTop from "@/components/common/ScrollToTop";
import PrefectureAnimationClient from "@/components/prefecture/PrefectureAnimationClient";
import {
  getPrefAnimationSeries,
  getPrefSlugsWithAnimation,
} from "@/data/prefecture-animations";
import { PREFECTURE_DATABASE } from "@/data/prefectures";
import { getPrefectureTheme } from "@/lib/prefectureThemes";
import { regionDisplayForLocale } from "@/lib/prefecture-en";
import { cn } from "@/lib/utils";
import { EpisodeNavSkeleton } from "./EpisodeNavSkeleton";

export const revalidate = 60;

export function generateStaticParams() {
  return getPrefSlugsWithAnimation().map((pref) => ({ pref }));
}

function siteBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.memory-sumo.com").replace(
    /\/+$/,
    ""
  );
}

interface PageProps {
  params: Promise<{ locale: string; pref: string }>;
  searchParams: Promise<{ ep?: string }>;
}

function parseEp1Param(raw: string | undefined, max: number): number {
  if (!raw) return 1;
  const n = parseInt(raw, 10);
  if (Number.isNaN(n) || n < 1) return 1;
  return Math.min(n, max);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pref: string }>;
}): Promise<Metadata> {
  const { locale, pref } = await params;
  const series = getPrefAnimationSeries(pref);
  const prefData = PREFECTURE_DATABASE[pref];
  if (!series || !prefData) {
    return { title: "SUMOME" };
  }
  const displayName = regionDisplayForLocale(prefData.name, locale);
  const t = await getTranslations({ locale, namespace: "PrefectureAnimationPage" });
  const base = siteBase();
  const path = `/prefectures/${pref}/animation`;
  const jaUrl = `${base}${path}`;
  const enUrl = `${base}/en${path}`;
  return {
    title: t("metaTitle", { seriesTitle: series.title, prefName: displayName }),
    description: t("metaDescription", { prefName: displayName, seriesTitle: series.title }),
    alternates: {
      canonical: locale === "en" ? enUrl : jaUrl,
      languages: {
        ja: jaUrl,
        en: enUrl,
      },
    },
  };
}

export default async function PrefectureAnimationPage({ params, searchParams }: PageProps) {
  const { locale, pref } = await params;
  const sp = await searchParams;
  const series = getPrefAnimationSeries(pref);
  const prefData = PREFECTURE_DATABASE[pref];
  if (!series || !prefData) {
    notFound();
  }

  const theme = getPrefectureTheme(pref);
  const displayName = regionDisplayForLocale(prefData.name, locale);
  const t = await getTranslations({ locale, namespace: "PrefectureAnimationPage" });
  const max = series.episodes.length;
  const initialEp1 = parseEp1Param(sp.ep, max);

  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
      <header
        className={cn(
          "relative z-10 pt-28 md:pt-32 pb-12 md:pb-16 text-white",
          "bg-linear-to-b",
          theme.gradient
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-20"
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="container mx-auto max-w-4xl px-6 relative z-10">
          <div className="mb-6">
            <Link
              href={`/prefectures/${pref}`}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 md:bg-white/10 backdrop-blur-md rounded-full border border-white/30 md:border-white/20 hover:bg-white/30 md:hover:bg-white/20 transition-all text-white group"
            >
              <ChevronLeft className="w-4 h-4 md:w-3 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs md:text-[10px] font-bold tracking-[0.2em] uppercase">
                {t("backToPref", { prefName: displayName })}
              </span>
            </Link>
          </div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/80 mb-2">
            {t("kicker", { prefName: displayName })}
          </p>
          <h1
            className="text-2xl md:text-4xl font-serif font-black tracking-tight text-white drop-shadow-md leading-tight"
          >
            {series.title}
          </h1>
        </div>
      </header>

      <main className="grow container mx-auto max-w-4xl px-6 py-8 md:py-12 -mt-4 md:-mt-6 relative z-20">
        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="h-[min(60vw,360px)] rounded-lg bg-white border border-gray-100 shadow-md animate-pulse" />
              <EpisodeNavSkeleton />
            </div>
          }
        >
          <PrefectureAnimationClient
            series={series}
            theme={theme}
            prefSlug={pref}
            initialEp1={initialEp1}
          />
        </Suspense>
      </main>
      <ScrollToTop />
    </div>
  );
}
