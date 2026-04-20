// src/components/activities/articles/Activity_04.tsx
import React from "react";
import { MessageSquareQuote, Sparkles } from "lucide-react";
import type { CustomActivityProps } from "@/lib/article-registry";
import { txCustomActivity } from "@/lib/custom-activity-copy";

const Activity_04 = ({ activity, locale }: CustomActivityProps) => {
  const tx = (key: string) => txCustomActivity(activity.translations, locale, "act-04", key);

  return (
    <div className="max-w-3xl mx-auto space-y-6 md:space-y-20">
      <section className="relative">
        <div className="absolute top-0 right-0 hidden md:block">
          <div className="border border-sumo-gold/30 p-2 text-center">
            <span className="block text-[10px] text-gray-400 uppercase tracking-widest">{tx("stamp_month")}</span>
            <span className="block text-xl font-serif font-bold text-sumo-dark">{tx("stamp_days")}</span>
          </div>
        </div>

        <div className="mb-4 md:mb-10">
          <div className="flex items-center gap-3 mb-3 md:mb-6">
            <div className="w-2 h-2 bg-sumo-gold rounded-full"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">{tx("kicker")}</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-sumo-dark font-bold leading-tight mb-3 md:mb-8">
            {tx("title_l1")}
            <br />
            {tx("title_l2")}
          </h2>

          <p className="text-gray-600 leading-[2.4] text-justify font-light text-lg whitespace-pre-line">{tx("intro")}</p>
        </div>
      </section>

      <section>
        <div className="bg-[#FAFAFA] border-l-4 border-sumo-brand p-4 md:p-12 relative rounded-r-sm group hover:bg-[#F5F7FA] transition-colors duration-500">
          <MessageSquareQuote className="absolute top-6 right-6 text-gray-200 w-12 h-12 group-hover:text-sumo-brand/10 transition-colors" />

          <h3 className="font-serif text-xl font-bold text-sumo-dark mb-3 md:mb-6 relative z-10">{tx("fb_title")}</h3>

          <div className="space-y-3 md:space-y-6 relative z-10">
            <p className="text-gray-600 leading-[2.2] text-justify">{tx("fb_p1")}</p>
            <p className="text-gray-600 leading-[2.2] text-justify">{tx("fb_p2")}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-start gap-4 mb-3 md:mb-6">
          <Sparkles className="text-sumo-gold mt-1 flex-shrink-0" size={20} />
          <h3 className="font-serif text-xl font-bold text-sumo-dark">
            {tx("concept_title_l1")}
            <br className="md:hidden" />
            {tx("concept_title_l2")}
          </h3>
        </div>

        <div className="pl-0 md:pl-9 border-l-0 md:border-l border-gray-100 md:ml-2.5">
          <p className="text-gray-600 leading-[2.2] mb-3 md:mb-8 text-justify">{tx("concept_p1")}</p>
          <p className="text-gray-600 leading-[2.2] text-justify">
            {tx("concept_p2_before")}
            <span className="font-bold text-sumo-dark bg-sumo-gold/20 px-2 py-0.5 mx-1 rounded-sm">{tx("concept_memory")}</span>
            {tx("concept_p2_after")}
          </p>
        </div>
      </section>

      <section className="border-t border-gray-100 pt-6 md:pt-16 text-center">
        <div className="inline-block mb-3 md:mb-6">
          <span className="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase border-b border-gray-200 pb-1">
            {tx("team_kicker")}
          </span>
        </div>

        <p className="text-gray-600 leading-[2.4] mb-4 md:mb-10 font-medium whitespace-pre-line">{tx("team_p1")}</p>

        <p className="font-serif font-bold text-sumo-dark text-lg md:text-xl">
          {tx("team_p2")}
          <br className="md:hidden" />
          {tx("team_p3")}
        </p>
      </section>
    </div>
  );
};

export default Activity_04;
