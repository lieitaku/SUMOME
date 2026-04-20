"use client";

import { cn } from "@/lib/utils";
import type { CharacterTheme } from "@/components/characters/character-data";
import { useTranslations } from "next-intl";

type MascotCardProps = {
  id: string;
  name: string;
  nameEn: string;
  title?: string;
  theme: CharacterTheme;
  imageSrc: string;
  prefecture?: string;
  className?: string;
  onClick?: () => void;
};

const themeStyles = {
  brand: {
    bgSoft: "from-sumo-brand/10 to-sumo-brand/5",
    text: "text-sumo-brand",
  },
  gold: {
    bgSoft: "from-sumo-gold/10 to-sumo-gold/5",
    text: "text-sumo-gold",
  },
  red: {
    bgSoft: "from-sumo-red/10 to-sumo-red/5",
    text: "text-sumo-red",
  },
} as const;

function CharacterPlaceholder({
  theme,
  label,
}: {
  theme: CharacterTheme;
  label: string;
}) {
  const colorMap = {
    brand: "#0047ab",
    gold: "#c1a14e",
    red: "#de350b",
  } as const;
  const color = colorMap[theme];

  return (
    <svg viewBox="0 0 320 420" className="h-full w-full" aria-hidden>
      <rect x="0" y="0" width="320" height="420" fill="transparent" />
      <circle cx="160" cy="120" r="52" fill="none" stroke={color} strokeWidth="8" />
      <path d="M125 70 L105 28 L150 58" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
      <path d="M196 58 L216 28 L220 78" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
      <rect x="92" y="190" rx="48" ry="48" width="136" height="150" fill="none" stroke={color} strokeWidth="8" />
      <circle cx="142" cy="110" r="5" fill={color} />
      <circle cx="178" cy="110" r="5" fill={color} />
      <path d="M142 140 Q160 158 178 140" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
      <text x="50%" y="388" textAnchor="middle" fill={color} fontSize="24" fontWeight="800">
        {label}
      </text>
    </svg>
  );
}

export default function MascotCard({
  name,
  nameEn,
  title,
  theme,
  imageSrc,
  prefecture,
  className,
  onClick,
}: MascotCardProps) {
  const style = themeStyles[theme];
  const t = useTranslations("CharactersPage");

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative z-0 flex w-full flex-col rounded-2xl border border-gray-200 bg-white p-3 text-left",
        "transition-all duration-300 ease-out",
        "hover:z-20 hover:-translate-y-1.5 hover:shadow-xl hover:border-gray-300",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-sumo-brand focus-visible:ring-offset-2",
        "active:scale-[0.98]",
        className,
      )}
    >
      {/* 背景单独裁切；立绘层不裁切，悬停时可略「冲出」圆角框 */}
      <div className="relative isolate w-full aspect-[4/5]">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br",
            style.bgSoft,
          )}
        />
        {prefecture && (
          <div className="absolute left-3 top-3 z-20 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-widest text-sumo-dark shadow-sm backdrop-blur-sm">
            {prefecture}
          </div>
        )}
        {imageSrc ? (
          <div className="absolute inset-0 z-10 flex items-end justify-center p-2 pt-10 md:pt-2">
            <div className="h-full w-full origin-bottom transition-transform duration-500 ease-out group-hover:scale-[1.05] group-hover:-translate-y-1 group-hover:drop-shadow-md">
              <img
                src={imageSrc}
                alt={t("characterIllustrationAlt", { name })}
                className="h-full w-full object-contain object-bottom"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 z-10 flex items-end justify-center p-6 pt-12 md:pt-6 opacity-40">
            <div className="h-full w-full origin-bottom transition-transform duration-500 ease-out group-hover:scale-[1.04] group-hover:-translate-y-0.5">
              <CharacterPlaceholder theme={theme} label={t("placeholderLabel")} />
            </div>
          </div>
        )}
      </div>

      {/* Text Area */}
      <div className="mt-4 flex flex-col px-1 pb-1">
        <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", style.text)}>
          {nameEn}
        </p>
        <h3 className="mt-1 font-serif text-lg font-bold tracking-wide text-gray-900">
          {name}
        </h3>
        {title ? (
          <p className="mt-1.5 text-xs font-medium leading-relaxed text-gray-500 line-clamp-1">
            {title}
          </p>
        ) : null}
      </div>
    </button>
  );
}
