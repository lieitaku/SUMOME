"use client";

import React from "react";
import { Star, Mail } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPrefectureTheme, DEFAULT_THEME } from "@/lib/prefectureThemes";

// Component: FooterLink
// Handles hover color transition dynamically based on the current theme
const FooterLink = ({
  href,
  children,
  themeColor,
}: {
  href: string;
  children: React.ReactNode;
  themeColor: string;
}) => (
  <Link
    href={href}
    className="relative group flex items-center transition-all duration-300"
    style={
      {
        "--hover-color": themeColor,
      } as React.CSSProperties
    }
  >
    <style jsx>{`
      .group:hover {
        color: var(--hover-color);
      }
    `}</style>
    {/* Decorative dot on hover */}
    <span
      className="absolute -left-3 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ backgroundColor: themeColor }}
    ></span>
    {/* Slight movement on hover */}
    <span className="group-hover:translate-x-1 transition-transform duration-300">
      {children}
    </span>
  </Link>
);

const Footer = () => {
  const params = useParams();
  const prefSlug = params?.pref as string | undefined;

  // Determine current theme color
  // Defaults to brand blue if not on a specific prefecture page
  const currentTheme = prefSlug ? getPrefectureTheme(prefSlug) : DEFAULT_THEME;
  const themeColor = currentTheme.color;

  return (
    <footer className="bg-[#faf9f6] text-sumo-dark pt-24 pb-12 relative overflow-hidden border-t border-gray-100">
      {/* Background Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Top Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent opacity-60 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
          {/* --- Left Column: Brand Info --- */}
          <div className="md:w-1/3">
            <div className="flex items-center gap-4 mb-6">
              {/* Vertical Brand Line: Dynamic Color */}
              <div
                className="w-1 h-8"
                style={{ backgroundColor: themeColor }}
              ></div>
              {/* Logo Text: Dynamic Color */}
              <h2
                className="text-3xl font-serif font-black tracking-[0.1em]"
                style={{ color: themeColor }}
              >
                SUMOME
              </h2>
            </div>

            <p className="text-sm text-gray-500 mb-8 leading-loose font-medium font-sans">
              相撲クラブ検索・応援プラットフォーム
              <br />
              <span className="text-xs opacity-70 mt-2 block">
                Connecting the spirits of Sumo to the future.
              </span>
            </p>

            <div className="flex gap-3">
              {[Star, Mail].map((Icon, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 transition-all duration-300 cursor-pointer group shadow-sm"
                  style={
                    {
                      "--hover-color": themeColor,
                    } as React.CSSProperties
                  }
                >
                  <style jsx>{`
                    .group:hover {
                      background-color: var(--hover-color);
                      border-color: var(--hover-color);
                      color: white;
                    }
                  `}</style>
                  <Icon
                    size={16}
                    className="group-hover:scale-110 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* --- Right Column: Sitemap --- */}
          <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
            {/* Column 1 */}
            <div>
              <h4
                className="font-serif font-bold mb-6 tracking-widest text-xs uppercase border-b pb-2 inline-block"
                style={{
                  color: themeColor,
                  borderColor: `${themeColor}1A`, // 10% opacity
                }}
              >
                SITEMAP
              </h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li>
                  <FooterLink href="/" themeColor={themeColor}>
                    トップページ
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/clubs" themeColor={themeColor}>
                    クラブを探す
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/about" themeColor={themeColor}>
                    SUMOMEについて
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/activities" themeColor={themeColor}>
                    イベント一覧
                  </FooterLink>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4
                className="font-serif font-bold mb-6 tracking-widest text-xs uppercase border-b pb-2 inline-block"
                style={{
                  color: themeColor,
                  borderColor: `${themeColor}1A`,
                }}
              >
                FOR MANAGERS
              </h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li>
                  <FooterLink href="/manager/entry" themeColor={themeColor}>
                    新規掲載登録（無料）
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/manager/login" themeColor={themeColor}>
                    管理画面ログイン
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/magazines" themeColor={themeColor}>
                    フォトブックについて
                  </FooterLink>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4
                className="font-serif font-bold mb-6 tracking-widest text-xs uppercase border-b pb-2 inline-block"
                style={{
                  color: themeColor,
                  borderColor: `${themeColor}1A`,
                }}
              >
                SUPPORT
              </h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li>
                  <FooterLink href="/contact" themeColor={themeColor}>
                    お問い合わせ
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/terms" themeColor={themeColor}>
                    利用規約
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/privacy" themeColor={themeColor}>
                    プライバシーポリシー
                  </FooterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- Bottom Copyright --- */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 border-t border-gray-200/60 uppercase tracking-widest">
          <p className="font-sans">
            &copy; 2025 SUMOME INC. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span
              className="font-serif italic normal-case tracking-normal text-xs"
              style={{ color: `${themeColor}99` }} // 60% opacity for designer credit
            >
              Designed by SUMOME Creative
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
