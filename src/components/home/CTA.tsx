"use client";

import React from "react";
import Section from "@/components/ui/Section";

const CTA = () => {
  return (
    <Section background="white" className="py-0 pt-16 md:pt-40 md:pb-32" id="cta">
      <div className="max-w-5xl mx-auto reveal-up flex flex-col items-center">
        {/* --- 顶部文案区 --- */}
        <div className="text-center">
          <h2 className="text-5xl md:text-7xl font-black text-sumo-text font-serif leading-tight">
            将来の横綱を、
            <br className="md:hidden" />
            <span className="text-sumo-brand inline-block border-b-4 border-sumo-brand pb-2 mx-2">
              ここ
            </span>
            から。
          </h2>
        </div>

        {/* --- 流光引导线 + SCROLL 标识 --- */}
        <div className="mt-12 md:mt-16 flex flex-col items-center gap-3 md:gap-4 opacity-80">
          <div className="relative w-px h-16 md:h-24 overflow-hidden bg-sumo-red/15">
            <div className="absolute inset-0 animate-[cta-flow_1.8s_linear_infinite]">
              <div className="w-full h-1/2 bg-linear-to-b from-transparent to-sumo-red/80" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default CTA;
