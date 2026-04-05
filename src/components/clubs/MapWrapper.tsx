"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

function MapLoading() {
  const t = useTranslations("ClubsMapPage");
  return (
    <div className="w-full h-[600px] flex flex-col items-center justify-center text-gray-400 gap-3 bg-white/50 rounded-md">
      <Loader2 className="animate-spin w-8 h-8 text-sumo-brand" />
      <span className="text-sm font-bold tracking-widest text-gray-500">{t("mapLoading")}</span>
    </div>
  );
}

const JapanMap = dynamic(() => import("@/components/clubs/JapanMap"), {
  ssr: false,
  loading: () => <MapLoading />,
});

export default function MapWrapper() {
  return <JapanMap />;
}
