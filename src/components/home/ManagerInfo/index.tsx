"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import BenefitCard from "./BenefitCard";
import Section from "@/components/ui/Section";

const ManagerInfo = () => {
  const t = useTranslations("Home");

  return (
    <Section background="white" id="manager-info" className="pt-6 md:pt-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start relative z-10">
        <div className="lg:col-span-5 lg:sticky lg:top-32 reveal-up">
          <h2 className="text-4xl md:text-5xl font-serif font-black mb-6 leading-tight text-sumo-text">
            {t("managerHeadingLine1")}
            <br />
            {t("managerHeadingLine2")}
          </h2>

          <p className="text-sumo-text/70 leading-loose mb-6 md:mb-10 font-medium text-sm md:text-base">
            {t.rich("managerLead", {
              br: () => <br />,
              free: (chunks) => (
                <span className="text-sumo-red border-b-2 border-sumo-red mx-2 font-black text-lg inline">
                  {chunks}
                </span>
              ),
            })}
          </p>

          <Button href="/partners" variant="primary" className="px-10 py-5 shadow-sm">
            {t("managerCta")}
          </Button>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6 md:gap-0 mt-2 md:mt-8 lg:mt-0 md:border-t md:border-gray-200">
          <BenefitCard
            number="01"
            delay="delay-100"
            title={t("benefit1Title")}
            desc={t("benefit1Desc")}
          />
          <BenefitCard
            number="02"
            delay="delay-200"
            title={t("benefit2Title")}
            desc={t("benefit2Desc")}
          />
          <BenefitCard
            number="03"
            delay="delay-300"
            title={t("benefit3Title")}
            desc={t("benefit3Desc")}
          />
        </div>
      </div>
    </Section>
  );
};

export default ManagerInfo;
