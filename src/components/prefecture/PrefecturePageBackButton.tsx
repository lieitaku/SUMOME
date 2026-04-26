"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChevronLeft } from "lucide-react";

const buttonClassName =
  "inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 md:bg-white/10 backdrop-blur-md rounded-full border border-white/30 md:border-white/20 hover:bg-white/30 md:hover:bg-white/20 transition-all text-white group";

export default function PrefecturePageBackButton() {
  const router = useRouter();
  const t = useTranslations("PrefecturePage");

  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window === "undefined") return;
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/clubs/map");
        }
      }}
      className={buttonClassName}
    >
      <ChevronLeft
        className="w-4 h-4 md:w-3 md:h-3 group-hover:-translate-x-0.5 transition-transform"
        aria-hidden
      />
      <span className="text-xs md:text-[10px] font-bold tracking-[0.2em] uppercase">
        {t("backPreviousPage")}
      </span>
    </button>
  );
}
