"use client";

import React, { useEffect } from "react";
import Link from "@/components/ui/TransitionLink";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  MousePointerClick,
  Sparkles,
  FileText,
  PenTool,
} from "lucide-react";
import { useTranslations } from "next-intl";

import Ceramic from "@/components/ui/Ceramic";
import Button from "@/components/ui/Button";
import MobileBackToHomeInHero from "@/components/layout/MobileBackToHomeInHero";

const BRAND_BLUE = "#2454a4";

const PartnersPage = () => {
  const t = useTranslations("PartnersPage");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#F4F5F7] font-sans selection:text-white"
      style={{ "--selection-bg": BRAND_BLUE } as React.CSSProperties}
    >
      <style jsx global>{`
        ::selection {
          background-color: var(--selection-bg);
        }
      `}</style>

      <section className="relative pt-0 pb-12 md:pb-32 overflow-hidden bg-white lg:pt-48">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-2/3 h-full bg-blue-50/50 skew-x-[-12deg] translate-x-1/4"></div>
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="container mx-auto max-w-6xl px-4 md:px-6 relative z-10">
          <MobileBackToHomeInHero />
          <div className="flex flex-col items-center max-w-2xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs md:text-[10px] font-bold tracking-[0.2em] uppercase mb-6 border border-blue-100">
                <Sparkles size={12} />
                {t("heroBadge")}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-gray-900 leading-[1.1] mb-6">
                {t("heroTitleBefore")}
                <br />
                <span className="text-[#2454a4]">{t("heroTitleAccent")}</span>
              </h1>

              <p className="text-lg text-gray-500 font-medium leading-relaxed mb-8">
                {t("heroLine1")}
                <br className="hidden md:inline" />
                {t("heroLine2")}
                {t("heroLine3Before")}
                <span className="font-black text-sumo-red">{t("heroFree")}</span>
                {t("heroLine3After")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  href="/manager/entry"
                  className="px-8 py-4 bg-[#2454a4] text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 ease-in-out active:scale-[0.98]"
                >
                  <span className="flex items-center gap-2 font-bold tracking-widest">
                    {t("ctaPrimary")}
                  </span>
                </Button>
                <Link
                  href="#features"
                  className="px-8 py-4 bg-white border border-gray-200 text-gray-600 font-bold tracking-widest rounded-sm hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 ease-in-out flex items-center justify-center active:scale-[0.98]"
                >
                  {t("ctaSecondary")}
                </Link>
              </div>

              <p className="mt-4 text-sm md:text-xs text-gray-400 font-medium">{t("heroNote")}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="pt-8 pb-8 md:py-24 px-4 md:px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-3xl font-serif font-bold text-gray-900 mb-2">
              {t("featuresTitle")}
            </h2>
            <p className="text-base md:text-base text-gray-500 mb-2">{t("featuresSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <Ceramic
              interactive={false}
              className="bg-white p-5 md:p-8 border-b-[4px]"
              style={{ borderBottomColor: BRAND_BLUE }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-[#2454a4] rounded-xl flex items-center justify-center mb-4 md:mb-6">
                <MousePointerClick className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="text-lg md:text-lg font-bold text-gray-900 mb-2 md:mb-3">{t("f1Title")}</h3>
              <p className="text-base md:text-sm text-gray-600 leading-relaxed">{t("f1Desc")}</p>
            </Ceramic>

            <Ceramic
              interactive={false}
              className="bg-white p-5 md:p-8 border-b-[4px]"
              style={{ borderBottomColor: BRAND_BLUE }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-[#2454a4] rounded-xl flex items-center justify-center mb-4 md:mb-6">
                <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="text-lg md:text-lg font-bold text-gray-900 mb-2 md:mb-3">{t("f2Title")}</h3>
              <p className="text-base md:text-sm text-gray-600 leading-relaxed">{t("f2Desc")}</p>
            </Ceramic>

            <Ceramic
              interactive={false}
              className="bg-white p-5 md:p-8 border-b-[4px]"
              style={{ borderBottomColor: BRAND_BLUE }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-[#2454a4] rounded-xl flex items-center justify-center mb-4 md:mb-6">
                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="text-lg md:text-lg font-bold text-gray-900 mb-2 md:mb-3">{t("f3Title")}</h3>
              <p className="text-base md:text-sm text-gray-600 leading-relaxed">{t("f3Desc")}</p>
            </Ceramic>
          </div>
        </div>
      </section>

      <section className="pt-2 pb-2 md:py-24 bg-[#F4F5F7]">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-3xl font-serif font-bold text-gray-900 mb-3">{t("stepsTitle")}</h2>
            <p className="text-base md:text-base text-gray-500 font-medium">{t("stepsSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="relative overflow-hidden bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#2454a4]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 group">
              <div className="absolute -top-6 -right-4 text-9xl font-black text-gray-50 group-hover:text-blue-50/60 transition-colors duration-500 pointer-events-none select-none">
                1
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#2454a4] group-hover:scale-110 group-hover:bg-[#2454a4] group-hover:text-white transition-all duration-300 shadow-sm">
                    <MousePointerClick className="w-5 h-5" />
                  </div>
                  <span
                    className="text-sm font-bold leading-tight tracking-wide uppercase"
                    style={{ color: BRAND_BLUE }}
                  >
                    {t("stepLabel1")}
                  </span>
                </div>
                <h3 className="text-xl md:text-lg font-bold text-gray-900 mb-3 group-hover:text-[#2454a4] transition-colors">
                  {t("step1Title")}
                </h3>
                <p className="text-base md:text-sm text-gray-500 leading-relaxed">{t("step1Desc")}</p>
              </div>
            </div>

            <div className="relative overflow-hidden bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#2454a4]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 group">
              <div className="absolute -top-6 -right-4 text-9xl font-black text-gray-50 group-hover:text-blue-50/60 transition-colors duration-500 pointer-events-none select-none">
                2
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#2454a4] group-hover:scale-110 group-hover:bg-[#2454a4] group-hover:text-white transition-all duration-300 shadow-sm">
                    <PenTool className="w-5 h-5" />
                  </div>
                  <span
                    className="text-sm font-bold leading-tight tracking-wide uppercase"
                    style={{ color: BRAND_BLUE }}
                  >
                    {t("stepLabel2")}
                  </span>
                </div>
                <h3 className="text-xl md:text-lg font-bold text-gray-900 mb-3 group-hover:text-[#2454a4] transition-colors">
                  {t("step2Title")}
                </h3>
                <p className="text-base md:text-sm text-gray-500 leading-relaxed">{t("step2Desc")}</p>
              </div>
            </div>

            <div className="relative overflow-hidden bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#2454a4]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 group">
              <div className="absolute -top-6 -right-4 text-9xl font-black text-gray-50 group-hover:text-blue-50/60 transition-colors duration-500 pointer-events-none select-none">
                3
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#2454a4] group-hover:scale-110 group-hover:bg-[#2454a4] group-hover:text-white transition-all duration-300 shadow-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span
                    className="text-sm font-bold leading-tight tracking-wide uppercase"
                    style={{ color: BRAND_BLUE }}
                  >
                    {t("stepLabel3")}
                  </span>
                </div>
                <h3 className="text-xl md:text-lg font-bold text-gray-900 mb-3 group-hover:text-[#2454a4] transition-colors">
                  {t("step3Title")}
                </h3>
                <p className="text-base md:text-sm text-gray-500 leading-relaxed">{t("step3Desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-2 md:pt-24 pb-12 md:pb-40 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <Ceramic
            interactive={false}
            className="bg-[#2454a4] text-white p-8 md:p-16 text-center border-none shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-serif font-black mb-4 md:mb-6">{t("bottomTitle")}</h2>
              <p className="text-sm md:text-base text-blue-100 mb-8 md:mb-10 max-w-lg mx-auto leading-relaxed">
                {t("bottomLine1")}
                <br />
                {t("bottomLine2")}
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  href="/manager/entry"
                  className="px-6 sm:px-10 py-4 sm:py-5 bg-white text-[#2454a4] shadow-lg hover:shadow-xl hover:bg-gray-50 border-none transition-all duration-200 ease-in-out active:scale-[0.98]"
                >
                  <span className="flex items-center gap-2 font-bold tracking-widest text-sm sm:text-base whitespace-nowrap">
                    <Users className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" />
                    {t("bottomCta")}
                  </span>
                </Button>
              </div>
              <p className="mt-6 text-xs text-blue-200 opacity-80">
                {t("bottomLoginLead")}{" "}
                <Link href="/manager/login" className="underline hover:text-white font-bold">
                  {t("bottomLogin")}
                </Link>
              </p>
            </div>
          </Ceramic>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;
