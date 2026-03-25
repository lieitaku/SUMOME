import React from "react";
import ScrollRevealProvider from "@/components/layout/ScrollRevealProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";
import CharacterFloatingEntry from "@/components/common/CharacterFloatingEntry";
import EmbeddedDetector from "@/components/utils/EmbeddedDetector";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://memory-sumo.com/#organization",
      name: "SUMOME",
      alternateName: ["すもめ", "スモメ"],
      url: "https://memory-sumo.com",
      logo: "https://memory-sumo.com/icon.svg",
      description:
        "全国のアマチュア相撲クラブを検索できるポータルサイト。クラブ情報、フォトブック、イベント情報を掲載。",
    },
    {
      "@type": "WebSite",
      "@id": "https://memory-sumo.com/#website",
      url: "https://memory-sumo.com",
      name: "SUMOME（すもめ）",
      alternateName: ["スモメ", "SUMOME"],
      publisher: { "@id": "https://memory-sumo.com/#organization" },
      inLanguage: "ja",
    },
  ],
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollRevealProvider>
      <EmbeddedDetector />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col min-h-screen">
        {/* 全局 Header */}
        <Header />

        {/* 页面主体内容 (自动撑开高度) */}
        <main className="flex-grow">
          {children}
        </main>

        {/* 全局 Footer */}
        <Footer />

        {/* 全局角色悬浮球入口 */}
        <CharacterFloatingEntry />

        {/* 全局回到顶部按钮 */}
        <ScrollToTop />
      </div>
    </ScrollRevealProvider>
  );
}