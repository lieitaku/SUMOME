"use client";

import React from "react";
import Link from "@/components/ui/TransitionLink";
import { useParams, usePathname } from "next/navigation";
import { getPrefectureTheme, DEFAULT_THEME } from "@/lib/prefectureThemes";

// Component: FooterLink
// 链接组件：保持原有逻辑，悬停时使用主题色
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
  const pathname = usePathname();
  const prefSlug = params?.pref as string | undefined;
  const isHomePage = pathname === "/" || pathname === "";

  // 1. 确定当前页面的主题色 (用于图标、线条、链接等)
  const currentTheme = prefSlug ? getPrefectureTheme(prefSlug) : DEFAULT_THEME;
  const themeColor = currentTheme.color;

  // 🌈 彩虹色配置 (用于 Logo)
  const rainbowColors = [
    "#23ac47",
    "#a35ea3",
    "#2454a4",
    "#df282f",
    "#63bbe2",
    "#f49e15",
  ];

  return (
    <footer className="bg-[#faf9f6] text-sumo-dark pt-8 pb-10 md:pt-24 md:pb-12 relative overflow-hidden border-t border-gray-100">
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
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-16 mb-10 md:mb-20">
          {/* --- Left Column: Brand Info --- */}
          <div className="md:w-1/3">
            {isHomePage ? (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center gap-3 mb-4 md:mb-6 group cursor-pointer"
              >
                {/* 竖线：保持跟随主题色，体现地区差异 */}
                <div
                  className="w-1 h-8 transition-transform duration-300 group-hover:scale-y-110"
                  style={{ backgroundColor: themeColor }}
                ></div>

                {/* ✨ Logo：永远保持彩虹色，在主页点击回到顶部 ✨ */}
                <div className="flex items-baseline font-serif font-black text-3xl tracking-[0.1em] leading-none transition-transform duration-300 group-hover:translate-x-1">
                  {["S", "U", "M", "O", "M", "E"].map((char, index) => (
                    <span
                      key={index}
                      style={{ color: rainbowColors[index % rainbowColors.length] }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </button>
            ) : (
              <Link href="/" className="flex items-center gap-3 mb-4 md:mb-6 group">
                {/* 竖线：保持跟随主题色，体现地区差异 */}
                <div
                  className="w-1 h-8 transition-transform duration-300 group-hover:scale-y-110"
                  style={{ backgroundColor: themeColor }}
                ></div>

                {/* ✨ Logo：永远保持彩虹色，点击跳转首页 ✨ */}
                <div className="flex items-baseline font-serif font-black text-3xl tracking-[0.1em] leading-none transition-transform duration-300 group-hover:translate-x-1">
                  {["S", "U", "M", "O", "M", "E"].map((char, index) => (
                    <span
                      key={index}
                      style={{ color: rainbowColors[index % rainbowColors.length] }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </Link>
            )}

            <p className="text-sm text-gray-500 mb-4 md:mb-8 leading-loose font-medium font-sans">
              相撲クラブ検索・応援プラットフォーム
              <br />
              <span className="text-xs opacity-70 mt-2 md:mb-0 md:mt-2 block">
                相撲の魂を、未来へつなぐ。
              </span>
            </p>

          </div>

          {/* --- Right Column: Sitemap --- */}
          <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 text-sm">
            {/* Column 1 */}
            <div>
              <h4 className="flex items-center gap-3 font-serif font-bold text-xs mb-6 tracking-widest uppercase" style={{ color: themeColor }}>
                <span className="w-1 h-4 shrink-0" style={{ backgroundColor: themeColor }} aria-hidden />
                サイトマップ
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
              <h4 className="flex items-center gap-3 font-serif font-bold text-xs mb-6 tracking-widest uppercase" style={{ color: themeColor }}>
                <span className="w-1 h-4 shrink-0" style={{ backgroundColor: themeColor }} aria-hidden />
                運営者の皆さまへ
              </h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li>
                  <FooterLink href="/partners" themeColor={themeColor}>
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
              <h4 className="flex items-center gap-3 font-serif font-bold text-xs mb-6 tracking-widest uppercase" style={{ color: themeColor }}>
                <span className="w-1 h-4 shrink-0" style={{ backgroundColor: themeColor }} aria-hidden />
                サポート
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
        <div className="pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 border-t border-gray-200/60 uppercase tracking-widest">
          <p className="font-sans">
            &copy; 2025 MEMORY INC. All Rights Reserved.
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