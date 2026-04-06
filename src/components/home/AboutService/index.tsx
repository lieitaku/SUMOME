"use client";

import React, { useMemo } from "react";
import Section from "@/components/ui/Section";
import { useTranslations } from "next-intl";
import Introduction from "./Introduction";
import ServiceCard from "./ServiceCard";

type ServiceItem = {
  id: string;
  kanji: string;
  title: string;
  desc: string;
  img: string;
  delay: string;
  href: string;
  themeGradient: string;
  shadowColor: string;
};

const SERVICE_BASE: Omit<ServiceItem, "desc">[] = [
  {
    id: "01",
    kanji: "探",
    title: "SEARCH",
    img: "/images/about/search.webp",
    delay: "",
    href: "/clubs/map",
    themeGradient: "bg-gradient-to-br from-[#2a9d6c] to-[#175036]",
    shadowColor: "shadow-green-900/30",
  },
  {
    id: "02",
    kanji: "結",
    title: "CONNECT",
    img: "https://cdn.pixabay.com/photo/2019/09/20/10/45/write-4491459_1280.jpg",
    delay: "delay-100",
    href: "/partners",
    themeGradient: "bg-gradient-to-br from-[#df282f] to-[#b01c22]",
    shadowColor: "shadow-red-900/30",
  },
  {
    id: "03",
    kanji: "録",
    title: "ARCHIVE",
    img: "https://cdn.pixabay.com/photo/2014/08/22/18/46/photographer-424620_1280.jpg",
    delay: "delay-200",
    href: "/magazines",
    themeGradient: "bg-gradient-to-br from-[#E6B422] to-[#B8860B]",
    shadowColor: "shadow-yellow-900/30",
  },
];

const AboutService = () => {
  const t = useTranslations("Home");
  const services = useMemo<ServiceItem[]>(
    () =>
      SERVICE_BASE.map((item, idx) => ({
        ...item,
        desc: t(
          idx === 0
            ? "serviceSearchDesc"
            : idx === 1
              ? "serviceConnectDesc"
              : "serviceRecordDesc"
        ),
      })),
    [t]
  );

  return (
    <Section background="white" className="pt-2! pb-10! md:py-28!" id="service">
      <div className="mb-6 md:mb-32">
        <Introduction />
      </div>

      <div className="relative z-10">
        <div className="mb-6 md:mb-16 reveal-up border-b border-gray-200 pb-4 md:pb-8">
          <h2 className="text-4xl md:text-5xl font-black text-sumo-text font-serif">
            {t.rich("pillarsTitle", {
              three: (chunks) => <span className="text-sumo-red">{chunks}</span>,
            })}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 items-stretch">
          {services.map((item, idx) => (
            <ServiceCard
              key={item.id}
              {...item}
              delayClass={item.delay}
              isStaggered={idx === 1}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default AboutService;
