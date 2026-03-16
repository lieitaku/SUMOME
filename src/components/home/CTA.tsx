"use client";

import React from "react";
import Image from "next/image";
import Section from "@/components/ui/Section";

const CTA = () => {
  return (
    <Section background="white" className="!py-0" id="cta">
      <div className="max-w-5xl mx-auto reveal-up flex flex-col items-center">
        {/* --- 纯净图片展示 --- */}
        <div className="w-full max-w-4xl mx-auto">
          <Image
            src="/images/CTA/CTA.webp?v=4"
            alt="将来の横綱を、ここから。"
            width={3840}
            height={1200}
            className="w-full h-auto block"
            priority
          />
        </div>
      </div>

      {/* 模块分割线 */}
      <div className="mt-2 md:mt-16 w-full max-w-6xl mx-auto border-t border-stone-100" />
    </Section>
  );
};

export default CTA;
