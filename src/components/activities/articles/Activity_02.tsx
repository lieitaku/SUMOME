// src/components/activities/articles/Activity_02.tsx
import React from "react";
import Image from "next/image";
import { Calendar, MapPin, CloudSun, Quote } from "lucide-react";
import type { CustomActivityProps } from "@/lib/article-registry";
import { txCustomActivity } from "@/lib/custom-activity-copy";

const Activity_02 = ({ activity, locale }: CustomActivityProps) => {
  const tx = (key: string) => txCustomActivity(activity.translations, locale, "act-02", key);

  const galleryImages = [
    "/images/activities/activity-2/act02-yokohama-scene-01.webp",
    "/images/activities/activity-2/act02-yokohama-scene-02.webp",
    "/images/activities/activity-2/act02-yokohama-scene-03.webp",
    "/images/activities/activity-2/act02-yokohama-scene-04.webp",
    "/images/activities/activity-2/act02-yokohama-scene-05.webp",
  ];

  return (
    <div className="space-y-8 md:space-y-24">
      <section className="relative">
        <div className="flex flex-wrap gap-y-4 gap-x-8 border-b border-gray-100 pb-3 md:pb-8 mb-4 md:mb-12">
          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-sumo-gold group-hover:bg-sumo-gold group-hover:text-white transition-colors">
              <Calendar size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                {tx("hdr_date_label")}
              </span>
              <span className="text-xs font-bold text-sumo-dark tracking-wide">{tx("hdr_date_value")}</span>
            </div>
          </div>

          <div className="w-px h-8 bg-gray-100 hidden sm:block"></div>

          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-sumo-gold group-hover:bg-sumo-gold group-hover:text-white transition-colors">
              <MapPin size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                {tx("hdr_place_label")}
              </span>
              <span className="text-xs font-bold text-sumo-dark tracking-wide">{tx("hdr_place_value")}</span>
            </div>
          </div>

          <div className="w-px h-8 bg-gray-100 hidden sm:block"></div>

          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-sumo-gold group-hover:bg-sumo-gold group-hover:text-white transition-colors">
              <CloudSun size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                {tx("hdr_weather_label")}
              </span>
              <span className="text-xs font-bold text-sumo-dark tracking-wide">{tx("hdr_weather_value")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl">
        <p className="font-serif text-2xl md:text-3xl text-sumo-dark leading-[1.6] font-bold mb-4 md:mb-10">
          {tx("hero_l1")}
          <br />
          {tx("hero_l2")}
          <br className="md:hidden" />
          {tx("hero_l3")}
        </p>
        <div className="pl-6 border-l-2 border-sumo-gold/30">
          <p className="text-gray-600 leading-[2.2] text-justify">{tx("intro")}</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:gap-16 items-start">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-gray-100 group shadow-lg">
          <Image
            src={galleryImages[0]}
            alt={tx("img_alt_left")}
            fill
            className="object-cover transition-transform duration-[1.5s] group-hover:scale-110 grayscale-[0.1] group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
        </div>

        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-gray-100 group mt-12 md:mt-32 shadow-lg">
          <Image
            src={galleryImages[1]}
            alt={tx("img_alt_right")}
            fill
            className="object-cover transition-transform duration-[1.5s] group-hover:scale-110 grayscale-[0.1] group-hover:grayscale-0"
          />
          <div className="absolute -top-16 -right-6 text-[120px] font-serif font-bold text-gray-100 -z-10 select-none opacity-50">
            01
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col mb-4 md:mb-12">
          <span className="text-[10px] font-bold tracking-[0.2em] text-sumo-gold uppercase mb-3 flex items-center gap-2">
            <div className="w-6 h-px bg-sumo-gold"></div>
            {tx("fb_kicker")}
          </span>
          <h3 className="text-3xl font-serif font-bold text-sumo-dark">
            {tx("fb_title_l1")}
            <br className="md:hidden" />
            {tx("fb_title_l2")}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-center">
          <div>
            <p className="text-gray-600 leading-[2.2] mb-4 md:mb-10 text-justify">{tx("fb_p1")}</p>

            <div className="bg-[#FAFAFA] border border-gray-100 p-4 md:p-8 relative rounded-sm group hover:border-sumo-gold/30 transition-colors">
              <Quote
                className="absolute top-6 right-6 text-gray-200 group-hover:text-sumo-gold/20 transition-colors"
                size={40}
              />
              <p className="font-bold text-sumo-dark text-lg mb-3 md:mb-6 relative z-10 font-serif">{tx("quote_title")}</p>
              <div className="w-8 h-1 bg-sumo-gold mb-3 md:mb-4"></div>
              <p className="text-gray-500 text-xs leading-relaxed font-medium whitespace-pre-line">{tx("quote_sub")}</p>
            </div>
          </div>

          <div className="relative group perspective-1000">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm shadow-2xl transform rotate-2 group-hover:rotate-0 transition-all duration-700 bg-white p-2">
              <div className="relative w-full h-full overflow-hidden rounded-sm">
                <Image src={galleryImages[2]} alt={tx("img_main_alt")} fill className="object-cover" />
              </div>
            </div>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-md rotate-[-3deg] shadow-sm z-20"></div>
          </div>
        </div>
      </section>

      <section className="bg-sumo-dark text-white p-4 md:p-20 rounded-sm relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-serif font-bold mb-3 md:mb-8">{tx("value_title")}</h3>
          <p className="text-white/80 leading-[2.2] mb-3 md:mb-8 text-justify">{tx("value_p1")}</p>
          <p className="text-white/80 leading-[2.2] text-justify">
            {tx("value_p2_before")}
            <span className="font-bold text-white mx-1 border-b border-sumo-gold pb-1">{tx("value_capsule")}</span>
            {tx("value_p2_after")}
          </p>
        </div>
      </section>

      <section className="relative py-4 md:py-12">
        <div className="absolute top-0 left-4 right-4 bottom-0 border border-dashed border-gray-200 -z-10 rounded-sm"></div>

        <div className="grid grid-cols-2 gap-3 md:gap-12 px-4 md:px-20">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm shadow-md group">
            <Image
              src={galleryImages[3]}
              alt={tx("smile_alt1")}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm shadow-md mt-6 md:mt-24 group">
            <Image
              src={galleryImages[4]}
              alt={tx("smile_alt2")}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        <div className="text-center mt-3 md:mt-8">
          <div className="inline-flex items-center gap-3 text-[9px] font-bold tracking-[0.3em] text-gray-300 uppercase">
            <div className="w-8 h-px bg-gray-200"></div>
            {tx("smile_caption")}
            <div className="w-8 h-px bg-gray-200"></div>
          </div>
        </div>
      </section>

      <section className="pt-4 md:pt-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 leading-[2.4] mb-4 md:mb-12 font-medium whitespace-pre-line">{tx("outro_p1")}</p>

          <p className="text-gray-600 leading-[2.4] mb-4 md:mb-12 font-medium whitespace-pre-line">{tx("outro_p2")}</p>

          <div className="flex flex-col items-center">
            <p className="font-serif font-bold text-sumo-dark text-lg tracking-wide">{tx("sign_team")}</p>
            <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mt-2">{tx("sign_date")}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Activity_02;
