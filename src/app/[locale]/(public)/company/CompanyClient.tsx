"use client";

import React from "react";
import Ceramic from "@/components/ui/Ceramic";
import { Building2, Users, MapPin, Info, Target, Lightbulb, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

const CompanyPage = () => {
  const t = useTranslations("CompanyPage");

  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col selection:bg-sumo-brand selection:text-white">
      <main className="flex-grow">
        <section className="relative bg-sumo-brand text-white pt-24 pb-12 md:pt-32 md:pb-48 overflow-hidden shadow-xl">
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
            COMPANY
          </div>

          <div className="container mx-auto max-w-6xl relative z-10 px-6 text-center">
            <h1 className="text-[clamp(1.25rem,5.2vw+0.45rem,1.875rem)] md:text-6xl font-serif font-bold tracking-tight mb-4 md:mb-6 text-white drop-shadow-sm reveal-up delay-100">
              {t("heroTitle")}
            </h1>

            <p className="text-white/80 text-[clamp(0.65rem,1.65vw+0.42rem,0.875rem)] md:text-base font-medium tracking-wide max-w-xl mx-auto leading-relaxed reveal-up delay-200">
              {t("heroSubtitle")}
            </p>
          </div>
        </section>

        <section className="relative px-4 md:px-6 z-20 -mt-8 md:-mt-24 pb-10 md:pb-32">
          <div className="container mx-auto max-w-4xl">
            <Ceramic
              interactive={false}
              className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden p-5 md:p-16"
            >
              <div className="mb-12 md:mb-20">
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10 border-b border-gray-100 pb-4 md:pb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-sumo-brand/10 flex items-center justify-center text-sumo-brand shrink-0">
                    <Building2 className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h2 className="text-[clamp(1.0625rem,3.4vw+0.5rem,1.5rem)] md:text-3xl font-serif font-bold text-sumo-dark tracking-wide">
                    {t("sectionBasic")}
                  </h2>
                </div>

                <div className="space-y-3 md:space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center py-3 md:py-4 border-b border-gray-50">
                    <div className="w-full md:w-48 text-gray-500 font-bold mb-1 md:mb-0 flex items-center gap-2 text-[clamp(0.6875rem,1.5vw+0.42rem,0.875rem)] md:text-base">
                      <Info size={16} /> {t("labelCompanyName")}
                    </div>
                    <div className="flex-1 text-gray-800 font-medium text-[clamp(0.8125rem,1.8vw+0.45rem,1rem)] md:text-lg">
                      {t("valueCompanyName")}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row py-3 md:py-4 border-b border-gray-50">
                    <div className="w-full md:w-48 text-gray-500 font-bold mb-1 md:mb-0 flex items-center gap-2 mt-1 text-[clamp(0.6875rem,1.5vw+0.42rem,0.875rem)] md:text-base">
                      <Users size={16} /> {t("labelRepresentatives")}
                    </div>
                    <div className="flex-1 text-gray-800 font-medium space-y-1 md:space-y-2 text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">
                      <div className="grid grid-cols-[auto_1fr] gap-x-6 items-baseline">
                        <span className="whitespace-nowrap">{t("roleChairman")}</span>
                        <span>{t("nameChairman")}</span>

                        <span className="whitespace-nowrap">{t("rolePresident")}</span>
                        <span>{t("namePresident")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center py-3 md:py-4 border-b border-gray-50">
                    <div className="w-full md:w-48 text-gray-500 font-bold mb-1 md:mb-0 flex items-center gap-2 text-[clamp(0.6875rem,1.5vw+0.42rem,0.875rem)] md:text-base">
                      <Target size={16} /> {t("labelFounded")}
                    </div>
                    <div className="flex-1 text-gray-800 font-medium text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">
                      {t("valueFounded")}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center py-3 md:py-4 border-b border-gray-50">
                    <div className="w-full md:w-48 text-gray-500 font-bold mb-1 md:mb-0 flex items-center gap-2 text-[clamp(0.6875rem,1.5vw+0.42rem,0.875rem)] md:text-base">
                      <Building2 size={16} /> {t("labelCapital")}
                    </div>
                    <div className="flex-1 text-gray-800 font-medium text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">
                      {t("valueCapital")}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row py-3 md:py-4 border-b border-gray-50">
                    <div className="w-full md:w-48 text-gray-500 font-bold mb-1 md:mb-0 flex items-center gap-2 mt-1 text-[clamp(0.6875rem,1.5vw+0.42rem,0.875rem)] md:text-base">
                      <MapPin size={16} /> {t("labelHeadOffice")}
                    </div>
                    <div className="flex-1 text-gray-800 font-medium leading-relaxed text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">
                      {t("headOfficeLines").split("\n").map((line, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <br />}
                          {line}
                        </React.Fragment>
                      ))}
                      <br />
                      <span className="text-gray-500 text-[clamp(0.625rem,1.35vw+0.38rem,0.75rem)] md:text-sm mt-1 inline-block">
                        {t("headOfficeTelFax")}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row py-3 md:py-4 border-b border-gray-50">
                    <div className="w-full md:w-48 text-gray-500 font-bold mb-1 md:mb-0 flex items-center gap-2 mt-1 text-[clamp(0.6875rem,1.5vw+0.42rem,0.875rem)] md:text-base">
                      <MapPin size={16} /> {t("labelNagoyaOffice")}
                    </div>
                    <div className="flex-1 text-gray-800 font-medium leading-relaxed text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">
                      {t("nagoyaOfficeLines").split("\n").map((line, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <br />}
                          {line}
                        </React.Fragment>
                      ))}
                      <br />
                      <span className="text-gray-500 text-[clamp(0.625rem,1.35vw+0.38rem,0.75rem)] md:text-sm mt-1 inline-block">
                        {t("nagoyaTelFax")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10 border-b border-gray-100 pb-4 md:pb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-sumo-brand/10 flex items-center justify-center text-sumo-brand shrink-0">
                    <Target className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h2 className="text-[clamp(1rem,2.8vw+0.48rem,1.375rem)] md:text-3xl font-serif font-bold text-sumo-dark tracking-wide leading-snug">
                    {t("sectionMemory")}
                  </h2>
                </div>

                <div className="space-y-8 md:space-y-12">
                  <div>
                    <h3 className="text-[clamp(0.9375rem,2.4vw+0.48rem,1.125rem)] md:text-xl font-serif font-bold text-sumo-dark mb-4 md:mb-6 flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[clamp(0.625rem,1.5vw+0.35rem,0.75rem)] md:text-sm shrink-0">
                        {t("outlineNumber")}
                      </span>
                      {t("outlineHeading")}
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-5 md:p-8 border border-gray-100">
                      <div className="space-y-4 text-gray-700 font-medium leading-relaxed md:leading-loose text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base text-justify whitespace-pre-wrap">
                        {t("outlineBody")}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[clamp(0.9375rem,2.4vw+0.48rem,1.125rem)] md:text-xl font-serif font-bold text-sumo-dark mb-4 md:mb-6 flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[clamp(0.625rem,1.5vw+0.35rem,0.75rem)] md:text-sm shrink-0">
                        {t("backgroundNumber")}
                      </span>
                      {t("backgroundHeading")}
                    </h3>

                    <div className="grid gap-4 md:gap-6">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-[clamp(0.8125rem,2vw+0.45rem,1rem)] md:text-lg text-sumo-dark mb-2 md:mb-3 flex items-start md:items-center gap-2">
                          <Lightbulb className="text-yellow-500 shrink-0 mt-0.5 md:mt-0" size={18} />
                          <span>{t("cardSponsorTitle")}</span>
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-[clamp(0.625rem,1.45vw+0.38rem,0.75rem)] md:text-sm whitespace-pre-wrap">
                          {t("cardSponsorBody")}
                        </p>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-[clamp(0.8125rem,2vw+0.45rem,1rem)] md:text-lg text-sumo-dark mb-2 md:mb-3 flex items-start md:items-center gap-2">
                          <Building2 className="text-blue-500 shrink-0 mt-0.5 md:mt-0" size={18} />
                          <span>{t("cardOrgTitle")}</span>
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-[clamp(0.625rem,1.45vw+0.38rem,0.75rem)] md:text-sm">
                          {t("cardOrgBody")}
                        </p>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-[clamp(0.8125rem,2vw+0.45rem,1rem)] md:text-lg text-sumo-dark mb-2 md:mb-3 flex items-start md:items-center gap-2">
                          <Users className="text-pink-500 shrink-0 mt-0.5 md:mt-0" size={18} />
                          <span>{t("cardMemoryTitle")}</span>
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-[clamp(0.625rem,1.45vw+0.38rem,0.75rem)] md:text-sm">
                          {t("cardMemoryBody")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[clamp(0.9375rem,2.4vw+0.48rem,1.125rem)] md:text-xl font-serif font-bold text-sumo-dark mb-4 md:mb-6 flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[clamp(0.625rem,1.5vw+0.35rem,0.75rem)] md:text-sm shrink-0">
                        {t("schemeNumber")}
                      </span>
                      {t("schemeHeading")}
                    </h3>

                    <div className="relative border-l-2 border-sumo-brand/30 ml-2 md:ml-3 space-y-5 md:space-y-8 py-2">
                      <div className="relative pl-6 md:pl-8">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-sumo-brand border-4 border-white"></div>
                        <p className="text-gray-700 font-medium text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">{t("schemeStep1")}</p>
                      </div>

                      <div className="relative pl-6 md:pl-8">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-sumo-brand border-4 border-white"></div>
                        <p className="text-gray-700 font-medium text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">{t("schemeStep2")}</p>
                      </div>

                      <div className="relative pl-6 md:pl-8">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-sumo-brand border-4 border-white"></div>
                        <p className="text-gray-700 font-medium leading-relaxed text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">
                          {t("schemeStep3")}
                        </p>
                      </div>

                      <div className="relative pl-6 md:pl-8">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-sumo-brand border-4 border-white"></div>
                        <p className="text-gray-700 font-medium leading-relaxed text-[clamp(0.75rem,1.65vw+0.42rem,0.875rem)] md:text-base">
                          {t("schemeStep4")}
                        </p>
                        <div className="mt-3 md:mt-4 bg-sumo-brand/5 rounded-lg p-3 md:p-4 border border-sumo-brand/10 flex gap-2 md:gap-3">
                          <CheckCircle2 className="text-sumo-brand shrink-0 mt-0.5" size={16} />
                          <p className="text-[clamp(0.625rem,1.45vw+0.38rem,0.75rem)] md:text-sm text-gray-600 leading-relaxed">
                            {t("schemeStep4Note")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Ceramic>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CompanyPage;
