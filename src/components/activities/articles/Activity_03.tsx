// src/components/activities/articles/Activity_03.tsx
import React from "react";
import { Ticket, Calendar, MapPin, ArrowUpRight, Info } from "lucide-react";
import type { CustomActivityProps } from "@/lib/article-registry";
import { txCustomActivity } from "@/lib/custom-activity-copy";

const Activity_03 = ({ activity, locale }: CustomActivityProps) => {
  const tx = (key: string) => txCustomActivity(activity.translations, locale, "act-03", key);

  const tags = [
    { icon: "📱", key: "tag_phone" as const },
    { icon: "👨‍👩‍👧", key: "tag_family" as const },
    { icon: "✨", key: "tag_free" as const },
  ];

  return (
    <div className="space-y-6 md:space-y-16">
      <section className="border-b border-gray-100 pb-4 md:pb-12">
        <div className="flex items-center gap-4 mb-3 md:mb-8">
          <span className="bg-sumo-dark text-white text-[10px] font-bold px-3 py-1 tracking-widest uppercase rounded-sm shadow-sm">
            {tx("pr_badge")}
          </span>
          <div className="h-4 w-px bg-gray-200"></div>
          <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">{tx("pr_dates")}</span>
        </div>

        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-sumo-dark font-bold leading-tight mb-3 md:mb-8">
          {tx("pr_title_l1")}
          <br className="md:hidden" />
          {tx("pr_title_l2")}
        </h2>

        <p className="text-gray-600 leading-[2.2] text-lg font-light text-justify">
          {tx("pr_intro")}
          <span className="font-bold text-sumo-dark border-b-2 border-sumo-gold/50 mx-1 px-1 hover:bg-sumo-gold/10 transition-colors">
            {tx("pr_trial")}
          </span>
          {tx("pr_intro_after")}
        </p>
      </section>

      <section>
        <div className="bg-[#FAFAFA] border border-gray-100 rounded-sm p-4 md:p-20 relative overflow-hidden group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[12rem] font-serif font-bold text-gray-200/40 select-none pointer-events-none leading-none -mt-8 font-italic">
            &
          </div>

          <div className="text-center mb-6 md:mb-16 relative z-10">
            <h3 className="text-2xl md:text-4xl font-serif font-bold text-sumo-dark leading-snug tracking-wide">
              {tx("concept_h3_l1")}
              <br />
              {tx("concept_h3_l2")}
            </h3>
            <div className="w-16 h-[3px] bg-sumo-gold mx-auto mt-3 md:mt-8 rounded-full"></div>
          </div>

          <div className="max-w-2xl mx-auto relative z-10 space-y-4 md:space-y-10">
            <p className="text-gray-600 leading-[2.2] text-justify md:text-center font-light">{tx("concept_p1")}</p>

            <div className="bg-white p-4 md:p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border-t-4 border-sumo-dark relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-100/50 backdrop-blur-sm -z-10 transform skew-x-12"></div>

              <h4 className="font-serif text-sumo-dark font-bold text-lg mb-3 md:mb-4 flex items-center justify-center gap-3">
                <span className="w-2 h-2 bg-sumo-gold rounded-full"></span>
                {tx("card_title")}
              </h4>
              <p className="text-gray-500 text-sm leading-loose text-justify">{tx("card_body")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative group perspective-1000">
        <div className="absolute inset-0 bg-sumo-gold/5 transform rotate-1 rounded-sm transition-transform duration-500 group-hover:rotate-0"></div>

        <div className="relative bg-white border border-sumo-gold border-dashed rounded-sm p-4 md:p-12 shadow-sm transition-transform duration-500 group-hover:-translate-y-1">
          <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#ffffff] rounded-full transform -translate-y-1/2 border-r border-sumo-gold border-dashed hidden md:block"></div>
          <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#ffffff] rounded-full transform -translate-y-1/2 border-l border-sumo-gold border-dashed hidden md:block"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-10 border-b border-gray-100 pb-3 md:pb-8 border-dashed">
            <div className="flex items-center gap-3 text-sumo-gold mb-2 md:mb-0">
              <Ticket size={24} />
              <span className="text-xs font-bold tracking-[0.3em] uppercase">{tx("ticket_invite")}</span>
            </div>
            <div className="text-sumo-dark font-serif font-bold text-xl md:text-3xl tracking-tight">{tx("ticket_title")}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 items-end">
            <div>
              <p className="text-gray-600 text-sm leading-loose mb-3 md:mb-6 text-justify">{tx("ticket_p1")}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.key}
                    className="bg-gray-50 text-gray-500 border border-gray-200 px-3 py-1.5 text-[10px] font-bold tracking-wider rounded-sm uppercase flex items-center gap-2"
                  >
                    <span>{tag.icon}</span> {tx(tag.key)}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-end">
              <div className="text-center group-hover:scale-110 transition-transform duration-500">
                <p className="text-[10px] text-gray-400 mb-1 font-bold tracking-widest uppercase">{tx("price_hint")}</p>
                <p className="text-sumo-dark font-serif font-bold text-5xl">¥0</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="border-t-2 border-sumo-dark mb-2"></div>
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200 py-3 md:py-6 gap-4 hover:bg-gray-50 transition-colors px-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest md:col-span-1 py-1 flex items-center gap-2">
              <Info size={12} /> {tx("spec_event_label")}
            </div>
            <div className="text-sm font-bold text-sumo-dark md:col-span-3 font-serif tracking-wide">
              {tx("spec_event_name")} <br />
              <span className="text-xs text-gray-400 font-sans font-normal mt-1 block">{tx("spec_event_sub")}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200 py-3 md:py-6 gap-4 hover:bg-gray-50 transition-colors px-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest md:col-span-1 py-1 flex items-center gap-2">
              <Calendar size={12} /> {tx("spec_date_label")}
            </div>
            <div className="text-sm font-medium text-gray-700 md:col-span-3">{tx("spec_date_value")}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200 py-3 md:py-6 gap-4 hover:bg-gray-50 transition-colors px-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest md:col-span-1 py-1 flex items-center gap-2">
              <MapPin size={12} /> {tx("spec_venue_label")}
            </div>
            <div className="text-sm font-medium text-gray-700 md:col-span-3">{tx("spec_venue_value")}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200 py-3 md:py-6 gap-4 hover:bg-gray-50 transition-colors px-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest md:col-span-1 py-1 flex items-center gap-2">
              <Ticket size={12} /> {tx("spec_content_label")}
            </div>
            <div className="text-sm font-medium text-gray-700 md:col-span-3">{tx("spec_content_value")}</div>
          </div>
        </div>
      </section>

      <section className="flex flex-col md:flex-row justify-between items-end pt-3 md:pt-8 bg-gray-50 p-4 md:p-8 rounded-sm">
        <p className="text-gray-600 leading-loose text-sm font-medium mb-3 md:mb-0 whitespace-pre-line">{tx("closing_p")}</p>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 whitespace-nowrap text-sumo-dark text-xs font-bold tracking-widest uppercase cursor-pointer hover:text-sumo-gold transition-colors border-b border-sumo-dark pb-1 hover:border-sumo-gold group"
        >
          {tx("official_link")}
          <ArrowUpRight
            size={14}
            className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </section>
    </div>
  );
};

export default Activity_03;
