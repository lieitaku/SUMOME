"use client";

import React, { useEffect } from "react";
import Button from "@/components/ui/Button";
import Ceramic from "@/components/ui/Ceramic";
import { Scroll, ChevronLeft, MessageSquare, Building2 } from "lucide-react";
import TransitionLink from "@/components/ui/TransitionLink";
import ScrollToTop from "@/components/common/ScrollToTop";
import { useTranslations } from "next-intl";

const PrivacyPage = () => {
  const t = useTranslations("PrivacyPage");
  const s2Tags = t.raw("s2Tags") as string[];
  const s3Items = t.raw("s3Items") as string[];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans flex flex-col selection:bg-sumo-brand selection:text-white">
      <header className="relative bg-sumo-brand text-white pt-32 pb-48 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-sumo-brand to-[#2454a4]"></div>
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute top-1/2 right-10 -translate-y-1/2 text-[15vw] font-black text-white opacity-[0.03] select-none pointer-events-none leading-none mix-blend-overlay tracking-tighter font-sans">
          PRIVACY
        </div>

        <div className="container mx-auto max-w-4xl relative z-10 px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-4 text-white drop-shadow-sm reveal-up delay-100">
            {t("headerTitle")}
          </h1>

          <p className="text-white/60 font-medium tracking-widest text-xs md:text-sm reveal-up delay-200">
            {t("lastUpdated")}
          </p>
        </div>
      </header>

      <section className="relative px-4 md:px-6 z-20 -mt-24 pb-32">
        <div className="container mx-auto max-w-4xl">
          <Ceramic
            interactive={false}
            className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden p-5 sm:p-10 md:p-16 lg:p-20 text-sumo-dark"
          >
            <div className="mb-12 md:mb-16 leading-loose text-gray-700 font-medium text-justify text-sm sm:text-base">
              <p>{t("intro")}</p>
            </div>

            <div className="space-y-12 md:space-y-16">
              <section>
                <h3 className="text-lg sm:text-xl font-serif font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-sumo-gold opacity-60 text-xs sm:text-sm font-sans">01.</span>
                  {t("s1Title")}
                </h3>
                <div className="pl-4 sm:pl-8 border-l-2 border-gray-100">
                  <p className="text-gray-600 leading-relaxed text-justify text-sm sm:text-base">{t("s1Body")}</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg sm:text-xl font-serif font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-sumo-gold opacity-60 text-xs sm:text-sm font-sans">02.</span>
                  {t("s2Title")}
                </h3>
                <div className="pl-4 sm:pl-8 border-l-2 border-gray-100">
                  <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-justify text-sm sm:text-base">
                    {t("s2Intro")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {s2Tags.map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 sm:px-3 py-1 bg-gray-50 text-gray-600 text-xs sm:text-sm font-bold border border-gray-200 rounded-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg sm:text-xl font-serif font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-sumo-gold opacity-60 text-xs sm:text-sm font-sans">03.</span>
                  {t("s3Title")}
                </h3>
                <div className="pl-4 sm:pl-8 border-l-2 border-gray-100">
                  <p className="text-gray-600 mb-4 sm:mb-6 text-justify text-sm sm:text-base">{t("s3Intro")}</p>
                  <ul className="space-y-2 sm:space-y-4 text-gray-600 bg-gray-50/50 p-4 sm:p-6 rounded-sm border border-gray-100/50 text-sm sm:text-base">
                    {s3Items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-3 leading-relaxed text-justify">
                        <Scroll
                          size={14}
                          className="text-sumo-brand mt-0.5 sm:mt-1 flex-shrink-0 opacity-70"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-lg sm:text-xl font-serif font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-sumo-gold opacity-60 text-xs sm:text-sm font-sans">04.</span>
                  {t("s4Title")}
                </h3>
                <div className="pl-4 sm:pl-8 border-l-2 border-gray-100">
                  <p className="text-gray-600 leading-relaxed text-justify text-sm sm:text-base">{t("s4Body")}</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg sm:text-xl font-serif font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-sumo-gold opacity-60 text-xs sm:text-sm font-sans">05.</span>
                  {t("s5Title")}
                </h3>
                <div className="pl-4 sm:pl-8 border-l-2 border-gray-100">
                  <p className="text-gray-600 mb-4 sm:mb-6 text-justify text-sm sm:text-base">{t("s5Intro")}</p>

                  <div className="bg-[#FAFAFA] border border-gray-200 p-4 sm:p-6 md:p-8 rounded-sm relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <Building2 size={14} className="text-sumo-brand shrink-0" />
                          <h4 className="font-serif font-bold text-base sm:text-lg text-sumo-dark">{t("officeName")}</h4>
                        </div>
                        <p className="text-gray-500 text-xs sm:text-sm font-medium pl-0 md:pl-6">{t("officeRole")}</p>
                      </div>
                      <TransitionLink
                        href="/contact"
                        className="flex items-center gap-2 sm:gap-3 bg-white px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 rounded-sm border border-gray-100 shadow-sm group-hover:border-sumo-brand transition-colors shrink-0 md:min-w-[200px] duration-200 ease-in-out active:scale-[0.98]"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 aspect-square rounded-full bg-sumo-brand/10 flex items-center justify-center text-sumo-brand shrink-0 overflow-hidden">
                          <MessageSquare size={12} className="shrink-0" />
                        </div>
                        <div className="min-w-0 flex flex-col gap-0.5 text-left">
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                            {t("contactFormLabel")}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-sumo-dark group-hover:text-sumo-brand transition-colors">
                            {t("contactLinkText")}
                          </span>
                        </div>
                      </TransitionLink>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-12 sm:mt-20 pt-8 sm:pt-10 border-t border-gray-100 text-center">
              <Button
                href="/"
                variant="primary"
                showArrow={false}
                className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm rounded-full shadow-md transition-all duration-300 ease-out hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
              >
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                {t("backHome")}
              </Button>
            </div>
          </Ceramic>
        </div>
      </section>
      <ScrollToTop />
    </div>
  );
};

export default PrivacyPage;
