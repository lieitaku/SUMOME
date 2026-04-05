"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "@/components/ui/TransitionLink";
import Ceramic from "@/components/ui/Ceramic";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { regionDisplayForLocale } from "@/lib/prefecture-en";

type RegionId =
  | "hokkaido_tohoku"
  | "kanto"
  | "chubu"
  | "kansai"
  | "chugoku"
  | "shikoku"
  | "kyushu_okinawa";

type PrefData = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

const PREF_DATA: PrefData[] = [
  { id: "hokkaido", label: "北海道", x: 13, y: 0, w: 3, h: 2 },
  { id: "aomori", label: "青森", x: 13, y: 2, w: 2, h: 1 },
  { id: "akita", label: "秋田", x: 13, y: 3, w: 1, h: 1 },
  { id: "iwate", label: "岩手", x: 14, y: 3, w: 1, h: 1 },
  { id: "yamagata", label: "山形", x: 13, y: 4, w: 1, h: 1 },
  { id: "miyagi", label: "宮城", x: 14, y: 4, w: 1, h: 1 },
  { id: "fukushima", label: "福島", x: 14, y: 5, w: 1, h: 1 },
  { id: "gunma", label: "群馬", x: 12, y: 6, w: 1, h: 1 },
  { id: "tochigi", label: "栃木", x: 13, y: 6, w: 1, h: 1 },
  { id: "ibaraki", label: "茨城", x: 14, y: 6, w: 1, h: 2 },
  { id: "saitama", label: "埼玉", x: 12, y: 7, w: 2, h: 1 },
  { id: "tokyo", label: "東京", x: 12, y: 8, w: 2, h: 1 },
  { id: "chiba", label: "千葉", x: 14, y: 8, w: 1, h: 2 },
  { id: "kanagawa", label: "神奈川", x: 12, y: 9, w: 2, h: 1 },
  { id: "niigata", label: "新潟", x: 12, y: 5, w: 2, h: 1 },
  { id: "toyama", label: "富山", x: 11, y: 5, w: 1, h: 1 },
  { id: "ishikawa", label: "石川", x: 10, y: 5, w: 1, h: 1 },
  { id: "fukui", label: "福井", x: 9, y: 5, w: 1, h: 1 },
  { id: "nagano", label: "長野", x: 11, y: 6, w: 1, h: 2 },
  { id: "gifu", label: "岐阜", x: 10, y: 6, w: 1, h: 2 },
  { id: "yamanashi", label: "山梨", x: 11, y: 8, w: 1, h: 1 },
  { id: "aichi", label: "愛知", x: 10, y: 8, w: 1, h: 1 },
  { id: "shizuoka", label: "静岡", x: 11, y: 9, w: 1, h: 1 },
  { id: "shiga", label: "滋賀", x: 9, y: 6, w: 1, h: 1 },
  { id: "kyoto", label: "京都", x: 8, y: 5, w: 1, h: 2 },
  { id: "mie", label: "三重", x: 9, y: 7, w: 1, h: 2 },
  { id: "nara", label: "奈良", x: 8, y: 7, w: 1, h: 2 },
  { id: "osaka", label: "大阪", x: 7, y: 7, w: 1, h: 2 },
  { id: "wakayama", label: "和歌山", x: 7, y: 9, w: 2, h: 1 },
  { id: "hyogo", label: "兵庫", x: 7, y: 5, w: 1, h: 2 },
  { id: "tottori", label: "鳥取", x: 6, y: 5, w: 1, h: 1 },
  { id: "okayama", label: "岡山", x: 6, y: 6, w: 1, h: 1 },
  { id: "shimane", label: "島根", x: 5, y: 5, w: 1, h: 1 },
  { id: "hiroshima", label: "広島", x: 5, y: 6, w: 1, h: 1 },
  { id: "yamaguchi", label: "山口", x: 4, y: 5, w: 1, h: 2 },
  { id: "kagawa", label: "香川", x: 5, y: 8, w: 1, h: 1 },
  { id: "ehime", label: "愛媛", x: 4, y: 8, w: 1, h: 1 },
  { id: "tokushima", label: "徳島", x: 5, y: 9, w: 1, h: 1 },
  { id: "kochi", label: "高知", x: 4, y: 9, w: 1, h: 1 },
  { id: "fukuoka", label: "福岡", x: 2, y: 5, w: 1, h: 1 },
  { id: "saga", label: "佐賀", x: 1, y: 5, w: 1, h: 1 },
  { id: "nagasaki", label: "長崎", x: 0, y: 5, w: 1, h: 1 },
  { id: "oita", label: "大分", x: 2, y: 6, w: 1, h: 1 },
  { id: "kumamoto", label: "熊本", x: 1, y: 6, w: 1, h: 2 },
  { id: "miyazaki", label: "宮崎", x: 2, y: 7, w: 1, h: 1 },
  { id: "kagoshima", label: "鹿児島", x: 1, y: 8, w: 2, h: 1 },
  { id: "okinawa", label: "沖縄", x: 0, y: 9, w: 1, h: 1 },
];

const MOBILE_GROUPS: { regionId: RegionId; ids: string[] }[] = [
  {
    regionId: "hokkaido_tohoku",
    ids: [
      "hokkaido",
      "aomori",
      "akita",
      "iwate",
      "yamagata",
      "miyagi",
      "fukushima",
    ],
  },
  {
    regionId: "kanto",
    ids: [
      "tokyo",
      "kanagawa",
      "chiba",
      "saitama",
      "ibaraki",
      "tochigi",
      "gunma",
    ],
  },
  {
    regionId: "chubu",
    ids: [
      "aichi",
      "shizuoka",
      "gifu",
      "mie",
      "yamanashi",
      "nagano",
      "niigata",
      "toyama",
      "ishikawa",
      "fukui",
    ],
  },
  {
    regionId: "kansai",
    ids: ["osaka", "hyogo", "kyoto", "shiga", "nara", "wakayama"],
  },
  {
    regionId: "chugoku",
    ids: ["tottori", "shimane", "okayama", "hiroshima", "yamaguchi"],
  },
  { regionId: "shikoku", ids: ["tokushima", "kagawa", "ehime", "kochi"] },
  {
    regionId: "kyushu_okinawa",
    ids: [
      "fukuoka",
      "saga",
      "nagasaki",
      "kumamoto",
      "oita",
      "miyazaki",
      "kagoshima",
      "okinawa",
    ],
  },
];

type ThemeColor = {
  bg: string;
  text: string;
  shadow: string;
  dot: string;
};

const EN_SHORT_NAMES: Record<string, string> = {
  hokkaido: "HKD",
  aomori: "AOM",
  akita: "AKT",
  iwate: "IWT",
  yamagata: "YGT",
  miyagi: "MYG",
  fukushima: "FKS",
  gunma: "GNM",
  tochigi: "TCG",
  ibaraki: "IBR",
  saitama: "STM",
  tokyo: "TKY",
  chiba: "CHB",
  kanagawa: "KNG",
  niigata: "NGT",
  toyama: "TYM",
  ishikawa: "ISK",
  fukui: "FKI",
  nagano: "NGN",
  gifu: "GIF",
  yamanashi: "YMN",
  aichi: "AIC",
  shizuoka: "SZO",
  shiga: "SIG",
  kyoto: "KYO",
  mie: "MIE",
  nara: "NAR",
  osaka: "OSK",
  wakayama: "WKY",
  hyogo: "HYG",
  tottori: "TTR",
  okayama: "OKY",
  shimane: "SMN",
  hiroshima: "HRS",
  yamaguchi: "YMC",
  kagawa: "KGW",
  ehime: "EHM",
  tokushima: "TKS",
  kochi: "KOC",
  fukuoka: "FKO",
  saga: "SAG",
  nagasaki: "NGS",
  oita: "OIT",
  kumamoto: "KMT",
  miyazaki: "MYZ",
  kagoshima: "KGS",
  okinawa: "OKN",
};

const REGION_THEMES: Record<RegionId, ThemeColor> = {
  hokkaido_tohoku: {
    bg: "#89C3EB",
    text: "#1D4E72",
    shadow: "#5B92B6",
    dot: "#5B92B6",
  },
  kanto: {
    bg: "#D4A3CF",
    text: "#5D2A5D",
    shadow: "#A67CA1",
    dot: "#A67CA1",
  },
  chubu: {
    bg: "#93CA76",
    text: "#2B5219",
    shadow: "#6A9C50",
    dot: "#6A9C50",
  },
  kansai: {
    bg: "#F0CFA0",
    text: "#754C24",
    shadow: "#C2A176",
    dot: "#C2A176",
  },
  chugoku: {
    bg: "#F4D565",
    text: "#6B591B",
    shadow: "#C4A84D",
    dot: "#C4A84D",
  },
  shikoku: {
    bg: "#FFB35C",
    text: "#664200",
    shadow: "#CC8F4A",
    dot: "#CC8F4A",
  },
  kyushu_okinawa: {
    bg: "#75CCD1",
    text: "#1D666A",
    shadow: "#4DA1A6",
    dot: "#4DA1A6",
  },
};

const TIP_PAD = 12;
const TIP_EST_W = 280;
const TIP_EST_H = 48;

function clampTipPixels(clientX: number, clientY: number) {
  if (typeof window === "undefined") {
    return { left: clientX + TIP_PAD, top: clientY + TIP_PAD };
  }
  let left = clientX + TIP_PAD;
  let top = clientY + TIP_PAD;
  left = Math.min(left, window.innerWidth - TIP_EST_W - TIP_PAD);
  left = Math.max(TIP_PAD, left);
  if (top + TIP_EST_H > window.innerHeight - TIP_PAD) {
    top = clientY - TIP_EST_H - TIP_PAD;
  }
  top = Math.max(TIP_PAD, top);
  return { left, top };
}

const JapanMap = () => {
  const locale = useLocale();
  const tRegions = useTranslations("ClubSearch");
  const tMap = useTranslations("ClubsMapPage");
  const [tooltipFullName, setTooltipFullName] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const pendingPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const applyTipPosition = useCallback(() => {
    const el = tooltipRef.current;
    if (!el) return;
    const { x, y } = pendingPosRef.current;
    const { left, top } = clampTipPixels(x, y);
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  }, []);

  const scheduleTipPosition = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      applyTipPosition();
    });
  }, [applyTipPosition]);

  useLayoutEffect(() => {
    if (tooltipFullName) applyTipPosition();
  }, [tooltipFullName, applyTipPosition]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const showDesktopEnTip = useCallback(
    (fullName: string, clientX: number, clientY: number) => {
      pendingPosRef.current = { x: clientX, y: clientY };
      setTooltipFullName(fullName);
      scheduleTipPosition();
    },
    [scheduleTipPosition],
  );

  const moveDesktopEnTip = useCallback(
    (clientX: number, clientY: number) => {
      pendingPosRef.current = { x: clientX, y: clientY };
      scheduleTipPosition();
    },
    [scheduleTipPosition],
  );

  const hideDesktopEnTip = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setTooltipFullName(null);
  }, []);

  const getStyle = (x: number, y: number, w: number, h: number) => {
    const unitX = 100 / 17;
    const unitY = 100 / 10;
    const gap = 0.3;
    return {
      left: `${x * unitX + gap / 2}%`,
      top: `${y * unitY + gap / 2}%`,
      width: `${w * unitX - gap}%`,
      height: `${h * unitY - gap}%`,
    };
  };

  const prefLabelForDisplay = (id: string) => {
    const row = PREF_DATA.find((p) => p.id === id);
    return row ? regionDisplayForLocale(row.label, locale) : id;
  };

  const getRegionProps = (id: string, isMobile: boolean) => {
    const group = MOBILE_GROUPS.find((g) => g.ids.includes(id));
    if (!group) return { style: {}, className: "" };

    const theme = REGION_THEMES[group.regionId];
    const customStyle = {
      "--r-bg": theme.bg,
      "--r-text": theme.text,
      "--r-shadow": theme.shadow,
    } as React.CSSProperties;

    const baseClasses =
      "bg-[var(--r-bg)] shadow-none border-0 ring-0 transition-all duration-300 ease-in-out";

    let stateClasses = "";
    if (isMobile) {
      stateClasses = cn(
        "text-[var(--r-text)]",
        "shadow-[0_2px_0_var(--r-shadow)]",
        "border-b-2 border-[var(--r-shadow)]",
        "active:translate-y-[2px] active:shadow-none active:border-b-0 active:scale-[0.98]",
      );
    } else {
      stateClasses = cn(
        "text-[var(--r-text)] font-bold",
        "opacity-75 hover:opacity-100",
        "border-b-2 border-transparent hover:border-[var(--r-shadow)]",
        "hover:shadow-[0_2px_0_var(--r-shadow)]",
        "hover:-translate-y-0.5",
        "active:scale-[0.98]",
      );
    }

    return {
      style: customStyle,
      className: cn(baseClasses, stateClasses),
    };
  };

  return (
    <div className="w-full">
      <div className="md:hidden flex flex-col gap-10">
        {MOBILE_GROUPS.map((group) => {
          const theme = REGION_THEMES[group.regionId];
          return (
            <div key={group.regionId}>
              <h3 className="flex items-center gap-2 mb-4 pl-1">
                <div
                  className="w-2 h-2 rounded-full shadow-sm"
                  style={{ backgroundColor: theme.dot }}
                />
                <span className="text-sumo-dark font-serif font-bold tracking-widest text-base">
                  {tRegions(`regions.${group.regionId}`)}
                </span>
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {group.ids.map((id) => {
                  const { style, className } = getRegionProps(id, true);
                  return (
                    <Ceramic
                      key={id}
                      as={Link}
                      href={`/prefectures/${id}`}
                      title={prefLabelForDisplay(id)}
                      style={style}
                      className={cn(
                        "flex items-center justify-center py-3 rounded-md font-bold",
                        locale === "en"
                          ? "text-xs leading-tight text-center px-1 whitespace-normal break-words hyphens-auto"
                          : "text-sm tracking-widest",
                        className,
                      )}
                    >
                      {prefLabelForDisplay(id)}
                    </Ceramic>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="hidden md:block relative w-full max-w-[900px] aspect-[17/10] mx-auto select-none"
        lang={locale === "en" ? "en" : "ja"}
      >
        {PREF_DATA.map((pref) => {
          const { style: regionStyle, className } = getRegionProps(
            pref.id,
            false,
          );
          const positionStyle = getStyle(pref.x, pref.y, pref.w, pref.h);
          const label = prefLabelForDisplay(pref.id);
          const desktopLabel =
            locale === "en" ? EN_SHORT_NAMES[pref.id] ?? label : label;
          return (
            <Ceramic
              key={pref.id}
              as={Link}
              href={`/prefectures/${pref.id}`}
              title={locale === "en" ? undefined : label}
              aria-label={label}
              onMouseEnter={
                locale === "en"
                  ? (e: React.MouseEvent) =>
                      showDesktopEnTip(label, e.clientX, e.clientY)
                  : undefined
              }
              onMouseMove={
                locale === "en"
                  ? (e: React.MouseEvent) => moveDesktopEnTip(e.clientX, e.clientY)
                  : undefined
              }
              onMouseLeave={locale === "en" ? hideDesktopEnTip : undefined}
              style={{ ...positionStyle, ...regionStyle }}
              className={cn(
                "absolute flex items-center justify-center rounded-md hover:z-10",
                locale === "en"
                  ? "text-xs md:text-sm tracking-widest"
                  : "text-sm tracking-widest",
                className,
              )}
            >
              {desktopLabel}
            </Ceramic>
          );
        })}
        <div className="absolute -bottom-8 right-0 flex flex-col items-end opacity-40 pointer-events-none">
          <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-sumo-dark flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sumo-brand" />
            {tMap("mapLegend")}
          </span>
        </div>
      </div>
      {locale === "en" && tooltipFullName && (
        <div
          ref={tooltipRef}
          className="hidden md:block fixed z-[100] pointer-events-none px-3 py-2 rounded-md bg-sumo-brand text-white text-xs font-medium shadow-lg ring-1 ring-white/20 max-w-[min(280px,calc(100vw-24px))] leading-snug left-0 top-0"
          style={{ willChange: "left, top" }}
          role="tooltip"
        >
          {tooltipFullName}
        </div>
      )}
    </div>
  );
};

export default JapanMap;
