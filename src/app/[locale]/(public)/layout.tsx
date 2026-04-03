import React from "react";
import ScrollRevealProvider from "@/components/layout/ScrollRevealProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";
import CharacterFloatingEntry from "@/components/common/CharacterFloatingEntry";
import EmbeddedDetector from "@/components/utils/EmbeddedDetector";
import { getLocale, getTranslations } from "next-intl/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("JsonLd");
  const locale = await getLocale();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.memory-sumo.com/#organization",
        name: "SUMOME",
        alternateName: ["すもめ", "スモメ"],
        url: "https://www.memory-sumo.com",
        logo: "https://www.memory-sumo.com/icons/apple-touch-icon.png",
        description: t("orgDescription"),
      },
      {
        "@type": "WebSite",
        "@id": "https://www.memory-sumo.com/#website",
        url: "https://www.memory-sumo.com",
        name: t("websiteName"),
        alternateName: ["スモメ", "SUMOME"],
        publisher: { "@id": "https://www.memory-sumo.com/#organization" },
        inLanguage: locale === "en" ? "en" : "ja",
      },
    ],
  };

  return (
    <ScrollRevealProvider>
      <EmbeddedDetector />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow">
          {children}
        </main>

        <Footer />

        <CharacterFloatingEntry />

        <ScrollToTop />
      </div>
    </ScrollRevealProvider>
  );
}
