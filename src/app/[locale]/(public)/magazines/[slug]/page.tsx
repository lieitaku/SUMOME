import React, { cache } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "@/components/ui/TransitionLink";

import { notFound } from "next/navigation";
import { getPreviewPayload } from "@/lib/preview";
import { getCachedMagazineBySlug } from "@/lib/cached-queries";
import {
  BookOpen,
  Layers,
  ArrowRight,
  ChevronLeft,
  MapPin,
} from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import ScrollToTop from "@/components/common/ScrollToTop";
import { ShareButton, MagazineReader } from "@/components/magazine/MagazineClientComponents";
import { getTranslations } from "next-intl/server";
import {
  magazineDisplayDescription,
  magazineDisplayTitle,
} from "@/lib/i18n-db";
import { regionDisplayForLocale } from "@/lib/prefecture-en";

export const revalidate = 60;

/** 同请求内 generateMetadata 与 Page 各查一次 DB 时合并为单次 */
const getMagazineBySlug = cache((slug: string) => getCachedMagazineBySlug(slug));

const BRAND_BLUE = "#2454a4";

function normalizeReadingDirection(value: unknown): "ltr" | "rtl" {
  if (value == null) return "ltr";
  const s = String(value).trim().toLowerCase();
  return s === "rtl" ? "rtl" : "ltr";
}

function siteBase(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.memory-sumo.com").replace(
    /\/+$/,
    ""
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const magazine = await getMagazineBySlug(slug);
  const t = await getTranslations({ locale, namespace: "MagazineDetail" });
  if (!magazine) {
    return { title: t("metaTitleSuffix") };
  }
  const title = magazineDisplayTitle(magazine, locale);
  const description =
    magazineDisplayDescription(magazine, locale) || t("metaDescriptionFallback");
  const base = siteBase();
  const jaUrl = `${base}/magazines/${slug}`;
  const enUrl = `${base}/en/magazines/${slug}`;
  return {
    title: `${title} | ${t("metaTitleSuffix")}`,
    description,
    alternates: {
      canonical: locale === "en" ? enUrl : jaUrl,
      languages: {
        ja: jaUrl,
        en: enUrl,
      },
    },
  };
}

const MagazineCover3D = ({ src, title }: { src: string; title: string }) => {
  return (
    <div className="relative group perspective-1000">
      <div
        className="relative w-[280px] md:w-[340px] aspect-[3/4] transform rotate-y-[-5deg] rotate-x-[2deg]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 z-10 rounded-r-md overflow-hidden shadow-2xl">
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-r from-white/40 to-transparent z-20 pointer-events-none"></div>
          <Image
            src={src}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 340px"
          />
        </div>

        <div
          className="absolute left-0 top-1 bottom-1 w-[12px] bg-white z-0 -translate-x-[6px] translate-z-[-6px] rotate-y-[-90deg] shadow-inner"
          style={{ background: "linear-gradient(to right, #ddd, #fff 20%, #ddd)" }}
        ></div>

        <div
          className="absolute bottom-0 left-1 right-1 h-[12px] bg-white z-0 translate-y-[6px] rotate-x-[-90deg] shadow-sm"
          style={{
            background: "linear-gradient(to bottom, #f5f5f5, #fff)",
            backgroundImage:
              "repeating-linear-gradient(to right, #f5f5f5 0px, #f5f5f5 1px, #fff 1px, #fff 2px)",
          }}
        ></div>

        <div className="absolute -bottom-8 left-4 right-4 h-4 bg-black/40 blur-xl rounded-[100%] translate-z-[-20px] opacity-60"></div>
      </div>
    </div>
  );
};

export default async function MagazineDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<{ embedded?: string }>;
}) {
  const { locale, slug } = await params;
  const sp = searchParams ? await searchParams : {};
  const isEmbedded = sp?.embedded === "1";

  const localeTag = locale === "en" ? "en-US" : "ja-JP";

  const [t, preview, magazineFromDb] = await Promise.all([
    getTranslations({ locale, namespace: "MagazineDetail" }),
    getPreviewPayload(),
    getMagazineBySlug(slug),
  ]);

  const usePreview =
    preview?.type === "magazine" &&
    preview.payload &&
    typeof preview.payload === "object" &&
    "slug" in preview.payload &&
    String((preview.payload as { slug: unknown }).slug) === slug;

  type MagazineBySlug = NonNullable<Awaited<ReturnType<typeof getMagazineBySlug>>>;

  let magazine: MagazineBySlug | null;
  if (usePreview && preview.payload && typeof preview.payload === "object") {
    const p = preview.payload as Record<string, unknown>;
    magazine = {
      id: String(p.id ?? ""),
      title: String(p.title ?? ""),
      titleEn: p.titleEn != null ? String(p.titleEn) : null,
      slug: String(p.slug ?? slug),
      description: p.description != null ? String(p.description) : null,
      descriptionEn: p.descriptionEn != null ? String(p.descriptionEn) : null,
      region: String(p.region ?? "All"),
      coverImage: p.coverImage != null ? String(p.coverImage) : null,
      images: Array.isArray(p.images) ? (p.images as string[]) : [],
      pdfUrl: p.pdfUrl != null ? String(p.pdfUrl) : null,
      readLink: p.readLink != null ? String(p.readLink) : null,
      issueDate: p.issueDate ? new Date(p.issueDate as string) : new Date(),
      published: true,
      hidden: false,
      readingDirection: normalizeReadingDirection(p.readingDirection),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as MagazineBySlug;
  } else {
    magazine = magazineFromDb;
  }

  if (!magazine) return notFound();

  const titleShown = magazineDisplayTitle(magazine, locale);
  const descriptionShown =
    magazineDisplayDescription(magazine, locale) || t("descriptionEmpty");

  const publishDate = new Date(magazine.issueDate);
  const year = publishDate.getFullYear();
  const month = String(publishDate.getMonth() + 1).padStart(2, "0");
  const day = String(publishDate.getDate()).padStart(2, "0");

  const images = magazine.images || [];
  const readingDir = normalizeReadingDirection(
    (magazine as { readingDirection?: unknown }).readingDirection
  );
  const isRTL = readingDir === "rtl";
  const spreads = [];
  for (let i = 0; i < images.length; i += 2) {
    const first = images[i];
    const second = images[i + 1];
    spreads.push({
      left: isRTL && second ? second : first,
      right: isRTL && second ? first : second || undefined,
    });
  }

  const regionShown = regionDisplayForLocale(magazine.region, locale);

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans selection:bg-sumo-brand selection:text-white flex flex-col">
      {(usePreview && !isEmbedded && (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-bold flex flex-wrap items-center justify-center gap-2">
          <span>{t("previewBanner")}</span>
          <a
            href="javascript:history.back()"
            className="underline font-bold hover:no-underline"
          >
            {t("previewBack")}
          </a>
        </div>
      )) as React.ReactNode}

      <section className="relative bg-sumo-brand text-white pt-32 pb-48 overflow-hidden shadow-xl">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, ${BRAND_BLUE}, #1a3a7a)` }}
        ></div>

        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 text-[15vw] font-black text-white opacity-[0.03] select-none pointer-events-none tracking-tighter mix-blend-overlay">
          MAG
        </div>

        <div className="container mx-auto max-w-6xl relative z-10 px-6 text-center">
          <div className="flex justify-center mb-8">
          <Link
              href="/magazines"
              className="inline-flex items-center gap-2 px-4 py-1.5 backdrop-blur-md rounded-full transition-all text-white group"
              style={{
                backgroundColor: "rgba(193, 161, 78, 0.85)", /* 香槟金 */
                borderColor: "rgba(193, 161, 78, 0.65)",
                borderWidth: "1px",
                borderStyle: "solid",
                boxShadow: "0 10px 15px -3px rgba(193, 161, 78, 0.25)"
              }}
            >
              <ChevronLeft className="w-4 h-4 md:w-3 md:h-3 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs md:text-[10px] font-bold tracking-[0.2em] uppercase">{t("backToList")}</span>
            </Link>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight mb-6 text-white leading-tight">
            {titleShown}
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-white/80 font-medium">
            <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded text-xs md:text-[10px] uppercase tracking-widest border border-white/10">
              <MapPin className="w-4 h-4 shrink-0 md:w-3 md:h-3" aria-hidden /> {regionShown}
            </span>
            <span className="hidden md:inline w-px h-4 bg-white/20"></span>
            <span className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-80">
              {publishDate.toLocaleDateString(localeTag, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}{" "}
              {t("issuedLabel")}
            </span>
          </div>
        </div>
      </section>

      <section className="relative px-4 md:px-6 -mt-32 z-20 pb-32">
        <div className="container mx-auto max-w-6xl">
          <Ceramic interactive={false} className="bg-white border-b-[6px] border-b-sumo-brand shadow-2xl overflow-hidden p-0 rounded-t-[2.5rem]">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[800px]">
              <aside className="lg:col-span-5 border-r border-gray-100 bg-[#FAFAFA] p-8 md:p-16 flex flex-col items-center">
                <div className="sticky top-12 flex flex-col items-center gap-10">
                  {magazine.coverImage && (
                    <MagazineCover3D src={magazine.coverImage} title={titleShown} />
                  )}

                  <div className="w-full max-w-[300px] space-y-4">
                    {magazine.readLink && (
                      <a
                        href={magazine.readLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative w-full flex items-center justify-between px-6 py-4 bg-gray-900 text-white overflow-hidden rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-sumo-brand to-sumo-dark opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative flex items-center gap-3">
                          <BookOpen size={20} className="text-sumo-gold" />
                          <div className="flex flex-col items-start">
                            <span className="text-xs font-bold text-white/50 uppercase tracking-widest leading-none mb-1">
                              {t("digitalEdition")}
                            </span>
                            <span className="text-sm font-bold tracking-widest">{t("readNow")}</span>
                          </div>
                        </div>
                        <ArrowRight size={18} className="relative group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}

                    <div className="w-full">
                      <ShareButton />
                    </div>
                  </div>
                </div>
              </aside>

              <article className="lg:col-span-7 p-8 md:p-20 bg-white">
                <div className="mb-20 max-w-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-[2px] bg-sumo-brand"></div>
                    <h3 className="text-lg md:text-base font-serif font-black text-sumo-brand uppercase tracking-[0.2em]">
                      {t("sectionOverview")}
                    </h3>
                  </div>
                  <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed font-serif text-justify whitespace-pre-wrap">
                    {descriptionShown}
                  </p>
                </div>

                <div>
                  <div className="flex items-end mb-8 border-b border-gray-100 pb-4">
                    <h3 className="text-sm md:text-xs font-black text-gray-400 uppercase tracking-[0.25em] flex items-center gap-2">
                      <Layers className="w-4 h-4 shrink-0 md:w-3.5 md:h-3.5" aria-hidden /> {t("sectionSpreads")}
                    </h3>
                  </div>

                  {spreads.length > 0 ? (
                    <MagazineReader
                      spreads={spreads}
                      coverImage={magazine.coverImage}
                      readingDirection={readingDir}
                      innerImages={images}
                    />
                  ) : (
                    <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <Layers size={32} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-sm font-bold text-gray-400">{t("emptySpreads")}</p>
                    </div>
                  )}

                  {spreads.length > 0 && magazine.readLink && (
                    <div className="mt-16 text-center">
                      <p className="text-xs font-medium text-gray-400 mb-4">{t("previewEnd")}</p>
                      <a
                        href={magazine.readLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sumo-brand font-bold text-sm hover:underline underline-offset-4"
                      >
                        {t("readFull")} <ArrowRight size={14} />
                      </a>
                    </div>
                  )}
                </div>
              </article>
            </div>
          </Ceramic>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
}
