// src/components/activities/articles/Activity_01.tsx
import React from "react";
import { Quote, Info, Newspaper, Award, Gift } from "lucide-react";
import type { CustomActivityProps } from "@/lib/article-registry";
import { txCustomActivity } from "@/lib/custom-activity-copy";

const SPME_SITE_URL = "https://memory-sp.com";

const Activity_01 = ({ activity, locale }: CustomActivityProps) => {
  const tx = (key: string) => txCustomActivity(activity.translations, locale, "act-01", key);
  const spmeLinkLabel = locale.startsWith("ja")
    ? `${tx("note_spm")}（公式サイト、新しいタブで開きます）`
    : `${tx("note_spm")} (official site, opens in new tab)`;

  return (
    <div className="space-y-6 md:space-y-16">
      <section>
        <p className="font-serif text-lg md:text-xl text-sumo-dark leading-[2.0] tracking-wide mb-3 md:mb-8">
          {tx("lead_p1_before")}
          <span className="font-bold border-b-2 border-sumo-gold/40 mx-2 hover:bg-sumo-gold/10 transition-colors px-1 cursor-default">
            {tx("lead_p1_event")}
          </span>
          {tx("lead_p1_after")}
        </p>

        <p className="text-gray-600 leading-loose text-justify mb-3 md:mb-8">{tx("lead_p2")}</p>

        <div className="relative bg-gray-50 border border-gray-200 p-3 md:p-8 rounded-sm my-4 md:my-10 overflow-hidden">
          <div className="absolute -top-4 -right-4 text-gray-100 transform rotate-12">
            <Info size={100} />
          </div>

          <div className="relative z-10 flex gap-4">
            <div className="w-1 h-auto bg-sumo-gold self-stretch rounded-full"></div>
            <div>
              <span className="block text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-3">
                {tx("note_label")}
              </span>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed font-medium">
                {tx("note_body")}
                <a
                  href={SPME_SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={spmeLinkLabel}
                  title="SPME — memory-sp.com"
                  className="inline-block font-bold text-white bg-sumo-red px-2 py-0.5 mx-1.5 rounded text-xs align-middle tracking-wider shadow-sm ring-1 ring-white/15 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:scale-[1.05] hover:shadow-lg hover:shadow-sumo-red/35 hover:ring-white/25 active:translate-y-0 active:scale-[0.98] active:shadow-sm motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sumo-gold focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                >
                  {tx("note_spm")}
                </a>
                {tx("note_after")}
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-600 leading-loose text-justify">{tx("lead_p3")}</p>
      </section>

      <div className="w-20 h-1 bg-gray-100 mx-auto rounded-full"></div>

      <section>
        <div className="mb-4 md:mb-10 text-center md:text-left">
          <span className="inline-block py-1 px-3 border border-sumo-gold/30 text-sumo-gold text-[10px] font-bold tracking-[0.2em] uppercase rounded-full mb-2 md:mb-4">
            {tx("svc_badge")}
          </span>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-sumo-dark">{tx("svc_title")}</h3>
        </div>

        <div className="relative my-4 md:my-12 px-3 md:px-16 py-4 md:py-10 bg-[#FAFAFA] rounded-sm">
          <Quote className="absolute top-4 left-4 text-gray-200 w-8 h-8 md:w-12 md:h-12 rotate-180" />
          <Quote className="absolute bottom-4 right-4 text-gray-200 w-8 h-8 md:w-12 md:h-12" />

          <p className="text-center text-lg md:text-xl font-medium text-gray-700 leading-[2.2] font-serif">
            {tx("quote_line1")}
            <br className="hidden md:inline" />
            {tx("quote_line2")}
            <span className="block mt-2 md:mt-4 text-2xl md:text-3xl font-bold text-sumo-dark bg-gradient-to-r from-sumo-gold/0 via-sumo-gold/20 to-sumo-gold/0 py-2">
              {tx("quote_emphasis")}
            </span>
            {tx("quote_line3")}
          </p>
        </div>
      </section>

      <section>
        <h4 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-3 md:mb-8 border-b border-gray-100 pb-2">
          {tx("feat_heading")}
        </h4>

        <div className="grid gap-3 md:gap-6">
          <div className="group bg-white border border-gray-100 p-4 md:p-8 hover:border-sumo-brand/20 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 rounded-sm relative">
            <div className="flex flex-col md:flex-row gap-3 md:gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-sumo-brand rounded-full flex items-center justify-center">
                <Newspaper size={24} />
              </div>
              <div>
                <h5 className="font-serif font-bold text-lg text-sumo-dark mb-2 md:mb-3">{tx("feat1_title")}</h5>
                <p className="text-gray-500 text-sm leading-loose text-justify">{tx("feat1_body")}</p>
              </div>
            </div>
          </div>

          <div className="group bg-white border border-gray-100 p-4 md:p-8 hover:border-sumo-brand/20 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 rounded-sm relative">
            <div className="flex flex-col md:flex-row gap-3 md:gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <h5 className="font-serif font-bold text-lg text-sumo-dark mb-2 md:mb-3">{tx("feat2_title")}</h5>
                <p className="text-gray-500 text-sm leading-loose text-justify">{tx("feat2_body")}</p>
              </div>
            </div>
          </div>

          <div className="group bg-white border border-gray-100 p-4 md:p-8 hover:border-sumo-brand/20 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 rounded-sm relative">
            <div className="flex flex-col md:flex-row gap-3 md:gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                <Gift size={24} />
              </div>
              <div>
                <h5 className="font-serif font-bold text-lg text-sumo-dark mb-2 md:mb-3">{tx("feat3_title")}</h5>
                <p className="text-gray-500 text-sm leading-loose text-justify">{tx("feat3_body")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sumo-dark text-white p-4 md:p-14 rounded-sm text-center relative overflow-hidden group">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10">
          <p className="font-serif text-xl md:text-2xl font-bold leading-relaxed mb-3 md:mb-6">
            {tx("close1")}
            <br />
            {tx("close2")}
          </p>
          <div className="w-12 h-1 bg-sumo-gold mx-auto mb-3 md:mb-6"></div>
          <p className="text-white/70 text-sm md:text-base leading-loose mb-1 md:mb-2">{tx("close3")}</p>
          <p className="text-white/60 text-sm leading-loose font-light">
            {tx("close4")}
            <br className="hidden md:inline" />
            {tx("close5")}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Activity_01;
