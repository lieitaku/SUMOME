"use client";

import React from "react";
import Link from "@/components/ui/TransitionLink";
import { useParams } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
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
    className="relative group flex items-center min-h-11 -mx-3 px-3 py-2 rounded-lg transition-colors duration-300 active:bg-black/4 md:min-h-0 md:mx-0 md:px-0 md:py-0 md:rounded-none md:active:bg-transparent"
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
      className="absolute left-1 md:-left-3 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ backgroundColor: themeColor }}
    ></span>
    {/* Slight movement on hover */}
    <span className="group-hover:translate-x-1 transition-transform duration-300 min-w-0">
      {children}
    </span>
  </Link>
);

const Footer = () => {
  const t = useTranslations("Footer");
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
    <footer className="relative isolate border-t border-gray-100 bg-[#faf9f6] text-sumo-dark selection:bg-sumo-brand selection:text-white pt-12 pb-[calc(2.5rem+env(safe-area-inset-bottom))] md:pt-24 md:pb-12">
      {/* 仅背景层裁切；顶部白渐变只在 md+ 显示，避免移动端叠在 Logo 上造成「发白」 */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-0 left-0 hidden h-24 w-full bg-linear-to-b from-white to-transparent opacity-50 md:block" />
      </div>

      {/* 实色底 + 明确 z-index：保证盖住装饰层；水平留白用 Tailwind，避免仅依赖 globals 时未生效 */}
      <div className="relative z-10 mx-auto box-border min-w-0 w-full max-w-7xl bg-[#faf9f6] pl-7 pr-5 pt-0 pb-0 sm:pl-8 sm:pr-6 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-16 mb-12 md:mb-20">
          {/* --- Left Column: Brand Info --- */}
          <div className="md:w-1/3 pt-1 md:pt-0">
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
                <div className="flex items-baseline font-serif font-black text-4xl md:text-3xl tracking-[0.1em] leading-none transition-transform duration-300 group-hover:translate-x-1">
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
                <div className="flex items-baseline font-serif font-black text-4xl md:text-3xl tracking-[0.1em] leading-none transition-transform duration-300 group-hover:translate-x-1">
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

            <p className="text-lg md:text-sm text-gray-500 mb-8 md:mb-8 leading-relaxed font-medium font-sans tracking-wide">
              {t("tagline")}
              <br />
              <span className="text-base md:text-xs opacity-70 mt-2 md:mb-0 md:mt-2 block">
                {t("taglineSub")}
              </span>
            </p>

          </div>

          {/* --- Right Column: Sitemap --- */}
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8 sm:gap-y-8 md:gap-12 text-base md:text-sm min-w-0">
            {/* Column 1 */}
            <div className="min-w-0 max-sm:border-b max-sm:border-gray-100 max-sm:pb-8 max-sm:last:border-b-0 max-sm:last:pb-0">
              <h4 className="flex items-center gap-3 font-serif font-bold text-base md:text-xs mb-6 tracking-widest uppercase" style={{ color: themeColor }}>
                <span className="w-1 h-5 md:h-4 shrink-0" style={{ backgroundColor: themeColor }} aria-hidden />
                <span className="min-w-0">{t("sitemap")}</span>
              </h4>
              <ul className="space-y-1 md:space-y-4 text-gray-500 font-medium">
                <li>
                  <FooterLink href="/" themeColor={themeColor}>
                    {t("top")}
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/clubs" themeColor={themeColor}>
                    {t("findClubs")}
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/about" themeColor={themeColor}>
                    {t("about")}
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/activities" themeColor={themeColor}>
                    {t("events")}
                  </FooterLink>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="min-w-0 max-sm:border-b max-sm:border-gray-100 max-sm:pb-8 max-sm:last:border-b-0 max-sm:last:pb-0">
              <h4 className="flex items-center gap-3 font-serif font-bold text-base md:text-xs mb-6 tracking-widest uppercase" style={{ color: themeColor }}>
                <span className="w-1 h-5 md:h-4 shrink-0" style={{ backgroundColor: themeColor }} aria-hidden />
                <span className="min-w-0">{t("forOperators")}</span>
              </h4>
              <ul className="space-y-1 md:space-y-4 text-gray-500 font-medium">
                <li>
                  <FooterLink href="/partners" themeColor={themeColor}>
                    {t("registerFree")}
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/manager/login" themeColor={themeColor}>
                    {t("adminLogin")}
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/magazines" themeColor={themeColor}>
                    {t("aboutMagazines")}
                  </FooterLink>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="min-w-0 max-sm:border-b max-sm:border-gray-100 max-sm:pb-8 max-sm:last:border-b-0 max-sm:last:pb-0">
              <h4 className="flex items-center gap-3 font-serif font-bold text-base md:text-xs mb-6 tracking-widest uppercase" style={{ color: themeColor }}>
                <span className="w-1 h-5 md:h-4 shrink-0" style={{ backgroundColor: themeColor }} aria-hidden />
                <span className="min-w-0">{t("support")}</span>
              </h4>
              <ul className="space-y-1 md:space-y-4 text-gray-500 font-medium">
                <li>
                  <FooterLink href="/contact" themeColor={themeColor}>
                    {t("contact")}
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/terms" themeColor={themeColor}>
                    {t("terms")}
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/privacy" themeColor={themeColor}>
                    {t("privacy")}
                  </FooterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- Bottom Copyright --- */}
        <div className="pt-8 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left text-sm md:text-[10px] text-gray-400 border-t border-gray-200/60 uppercase tracking-widest leading-relaxed">
          <p className="font-sans max-w-prose md:max-w-none">
            {t("copyright")}
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;