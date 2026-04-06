"use client";

import React from "react";
import Link from "@/components/ui/TransitionLink";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const Introduction = () => {
  const locale = useLocale();
  const t = useTranslations("Home");
  const isJa = locale === "ja";

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-24 w-full lg:w-fit mx-auto">
      <div className="w-full lg:w-auto flex justify-start reveal-up">
        <h2
          className={cn(
            "text-4xl md:text-5xl lg:text-6xl font-black leading-tight lg:leading-normal tracking-wide text-sumo-text font-serif",
            isJa && "vertical-title"
          )}
        >
          {t.rich("introLine1", {
            heat: (chunks) => <span className="text-sumo-red">{chunks}</span>,
          })}
          <br />
          {t.rich("introLine2", {
            brand: (chunks) => <span className="text-sumo-brand">{chunks}</span>,
          })}
        </h2>
      </div>

      {isJa ? (
        <style
          dangerouslySetInnerHTML={{
            __html: `
        @media (min-width: 1024px) {
          .vertical-title {
            writing-mode: vertical-rl;
            text-orientation: upright;
            height: 480px;
          }
        }
      `,
          }}
        />
      ) : null}

      <div className="w-full lg:w-[500px] flex flex-col items-start reveal-up delay-100">
        <p className="text-sumo-text/80 text-base leading-loose tracking-wide font-medium space-y-4 mb-1 whitespace-pre-line">
          {t("introBody")}
        </p>

        <Link
          href="/about"
          className="group inline-flex items-center gap-2 mt-3 text-sumo-brand border-b border-sumo-brand pb-1 hover:text-sumo-dark hover:border-sumo-dark transition-all md:mt-10"
        >
          <span className="text-sm font-bold tracking-widest">{t("introReadMore")}</span>
          <ArrowRight
            size={16}
            className="transform group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </div>
  );
};

export default Introduction;
