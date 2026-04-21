import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "@/components/ui/TransitionLink";
import { Search, MapPin, ArrowRight } from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import MapWrapper from "@/components/clubs/MapWrapper";
import MobileBackToHomeInHero from "@/components/layout/MobileBackToHomeInHero";
import { getTranslations } from "next-intl/server";

function siteBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.memory-sumo.com").replace(
    /\/+$/,
    "",
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ClubsMapPage" });
  const base = siteBase();
  const jaUrl = `${base}/clubs/map`;
  const enUrl = `${base}/en/clubs/map`;
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

export default async function ClubsMapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ClubsMapPage" });
  const leadLines = t("heroLead").split("\n");

  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
      <main className="flex-grow">
        <section className="relative pt-public-sticky-header pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(36, 84, 164, 0.03) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(36, 84, 164, 0.03) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-30 left-10 md:left-1/4 text-[40vw] md:text-[25vw] font-serif font-bold text-sumo-brand opacity-[0.03] select-none pointer-events-none leading-none z-0 mix-blend-multiply">
            47
          </div>

          <div className="container mx-auto px-6 relative z-10 max-w-[1280px]">
            <MobileBackToHomeInHero skipHeaderClearancePadding />
            <div className="text-center mb-10 md:mb-20">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-md shadow-[0_2px_0_rgba(0,0,0,0.06)] border border-gray-100">
                <MapPin size={14} className="text-sumo-brand" />
                <span className="text-xs md:text-[10px] font-bold tracking-widest text-sumo-brand uppercase">
                  {t("heroBadge")}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
                {t("heroTitle")}
              </h1>
              <p className="text-gray-500 text-base md:text-base font-medium tracking-widest max-w-lg mx-auto leading-loose">
                {leadLines.map((line, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <>
                        <br className="hidden md:block" />
                      </>
                    )}
                    {line}
                  </React.Fragment>
                ))}
              </p>
            </div>

            <div className="mb-16 md:mb-24">
              <Suspense
                fallback={
                  <div className="h-[600px] w-full bg-gray-100 rounded-md animate-pulse" />
                }
              >
                <MapWrapper />
              </Suspense>
            </div>

            <div className="flex justify-center reveal-up delay-200">
              <Ceramic
                as={Link}
                href="/clubs/"
                className="flex items-center gap-6 px-8 py-5 md:px-12 md:py-7 bg-white group transition-all duration-200 ease-in-out hover:brightness-[1.02] active:scale-[0.98]"
              >
                <div
                  className="w-12 h-12 rounded-md bg-[#F4F5F7] text-sumo-brand flex items-center justify-center
                             group-hover:bg-sumo-brand group-hover:text-white transition-colors duration-200 ease-in-out"
                >
                  <Search size={22} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-xl md:text-xl font-bold text-gray-800 tracking-wide">
                    {t("ctaSearchTitle")}
                  </span>
                </div>
                <div
                  className="hidden md:flex w-8 h-8 items-center justify-center rounded-full border border-gray-200 text-gray-300
                             group-hover:border-sumo-brand group-hover:text-sumo-brand group-hover:rotate-45 transition-all duration-200 ease-in-out ml-2"
                >
                  <ArrowRight size={16} />
                </div>
              </Ceramic>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-sumo-brand/20 to-transparent" />
      </main>
    </div>
  );
}
