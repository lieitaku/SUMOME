"use client";

import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Link from "@/components/ui/TransitionLink";
import { ChevronLeft, ChevronRight, ListVideo } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PrefAnimationSeries } from "@/data/prefecture-animations";
import { getYoutubeId } from "./prefectureAnimationUtils";
import Ceramic from "@/components/ui/Ceramic";
import type { ThemeColor } from "@/lib/prefectureThemes";

type PrefectureAnimationClientProps = {
  series: PrefAnimationSeries;
  theme: ThemeColor;
  prefSlug: string;
  initialEp1: number;
};

function parseEp1(raw: string | null, max: number, fallback: number): number {
  if (!raw) return Math.min(fallback, max);
  const n = parseInt(raw, 10);
  if (Number.isNaN(n) || n < 1) return 1;
  return Math.min(n, max);
}

export default function PrefectureAnimationClient({
  series,
  theme,
  prefSlug,
  initialEp1,
}: PrefectureAnimationClientProps) {
  const t = useTranslations("PrefectureAnimationPage");
  const router = useRouter();
  const searchParams = useSearchParams();
  const max = series.episodes.length;
  const ep1 = useMemo(
    () => parseEp1(searchParams.get("ep"), max, initialEp1),
    [searchParams, max, initialEp1]
  );
  const index = ep1 - 1;
  const current = series.episodes[index]!;
  const videoId = getYoutubeId(current.source);
  const activeListItemRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    activeListItemRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [ep1]);

  const ceramicStyle = {
    borderBottomColor: theme.color,
    boxShadow: `0 4px 10px -2px ${theme.shadow}, 0 2px 4px -2px ${theme.shadow}`,
  };

  const hrefForEp = (n: number) =>
    n === 1
      ? `/prefectures/${prefSlug}/animation`
      : `/prefectures/${prefSlug}/animation?ep=${n}`;

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const n = parseInt(e.target.value, 10);
    if (Number.isNaN(n) || n < 1) return;
    router.push(hrefForEp(n), { scroll: false });
  };

  return (
    <div className="space-y-5 md:space-y-8">
      <Ceramic
        interactive={false}
        className="border border-gray-100 border-b-[6px] overflow-hidden"
        style={ceramicStyle}
      >
        <div
          className="px-4 py-3 md:px-5 md:py-3.5 text-xs md:text-sm text-gray-600 leading-relaxed border-b border-gray-100 bg-gray-50/80"
          role="note"
        >
          {t("aiDisclosure")}
        </div>
        <div className="relative w-full aspect-video bg-black">
          {videoId ? (
            <iframe
              key={videoId}
              title={current.title}
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          ) : null}
        </div>
      </Ceramic>

      <Ceramic
        interactive={false}
        className="p-4 md:p-6 border border-gray-100 border-b-[6px]"
        style={ceramicStyle}
      >
        <h2
          className="text-sm font-bold text-gray-500 tracking-widest uppercase flex items-center gap-2 mb-3 md:mb-4"
        >
          <ListVideo className="w-4 h-4 shrink-0" style={{ color: theme.color }} />
          {t("episodeList")}
        </h2>

        {/* === 手机端：下拉跳转 + 前后话 + 横向划选集 === */}
        <div className="md:hidden space-y-3">
          <div className="space-y-1.5">
            <label
              htmlFor="pref-anim-episode-select"
              className="text-[11px] font-bold text-gray-400 tracking-wider uppercase"
            >
              {t("episodeSelectLabel")}
            </label>
            <select
              id="pref-anim-episode-select"
              value={String(ep1)}
              onChange={onSelectChange}
              className={cn(
                "w-full min-h-12 appearance-none rounded-xl border-2 border-gray-200 bg-white",
                "px-4 pr-10 text-base font-serif font-bold text-gray-900",
                "focus:outline-none focus:ring-2 focus:ring-sumo-brand/45 focus:ring-offset-0",
                "bg-size-[1.25rem] bg-position-[right_0.75rem_center] bg-no-repeat",
                "bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2024%2024%27%20stroke=%27%236b7280%27%3E%3Cpath%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%272%27%20d=%27M19%209l-7%207-7-7%27/%3E%3C/svg%3E')]"
              )}
            >
              {series.episodes.map((ep, i) => {
                const n = i + 1;
                return (
                  <option key={ep.id} value={String(n)}>
                    {n.toString().padStart(2, "0")} · {ep.title}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-stretch gap-2">
            {ep1 > 1 ? (
              <Link
                href={hrefForEp(ep1 - 1)}
                scroll={false}
                className={cn(
                  "inline-flex min-h-12 min-w-12 flex-1 items-center justify-center gap-1 rounded-xl",
                  "border-2 border-gray-200 bg-white text-sm font-bold text-gray-800",
                  "transition-colors hover:border-gray-300 hover:bg-gray-50",
                  "active:scale-[0.98]"
                )}
                aria-label={t("prevEpisode")}
              >
                <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
                <span className="max-sm:sr-only sm:text-xs md:text-sm">{t("prevEpisode")}</span>
              </Link>
            ) : (
              <span
                className="inline-flex min-h-12 min-w-12 flex-1 items-center justify-center gap-1 rounded-xl border-2 border-gray-100 bg-gray-50/80 text-sm font-bold text-gray-300"
                aria-disabled
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </span>
            )}

            <div
              className="flex min-w-0 min-h-12 flex-[0.6] items-center justify-center rounded-xl border border-gray-200 bg-gray-50/90 px-2 text-sm font-tabular-nums text-gray-600"
              aria-live="polite"
            >
              {t("episodeProgress", { current: ep1, total: max })}
            </div>

            {ep1 < max ? (
              <Link
                href={hrefForEp(ep1 + 1)}
                scroll={false}
                className={cn(
                  "inline-flex min-h-12 min-w-12 flex-1 items-center justify-center gap-1 rounded-xl",
                  "border-2 border-gray-200 bg-white text-sm font-bold text-gray-800",
                  "transition-colors hover:border-gray-300 hover:bg-gray-50",
                  "active:scale-[0.98]"
                )}
                aria-label={t("nextEpisode")}
              >
                <span className="max-sm:sr-only sm:text-xs md:text-sm">{t("nextEpisode")}</span>
                <ChevronRight className="h-5 w-5 shrink-0" aria-hidden />
              </Link>
            ) : (
              <span
                className="inline-flex min-h-12 min-w-12 flex-1 items-center justify-center gap-1 rounded-xl border-2 border-gray-100 bg-gray-50/80 text-sm font-bold text-gray-300"
                aria-disabled
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </span>
            )}
          </div>

          {max > 3 ? (
            <p className="text-[10px] text-gray-400 text-center leading-snug">
              {t("swipeHint")}
            </p>
          ) : null}
          <ul
            className={cn(
              "flex touch-pan-x gap-2 overflow-x-auto overscroll-x-contain pb-1 pt-0.5",
              "snap-x snap-mandatory [scrollbar-width:thin] [-ms-overflow-style:none]"
            )}
            role="list"
            aria-label={t("episodeList")}
          >
            {series.episodes.map((ep, i) => {
              const n = i + 1;
              const active = n === ep1;
              return (
                <li
                  key={ep.id}
                  ref={active ? activeListItemRef : null}
                  className="snap-center shrink-0"
                >
                  <Link
                    href={hrefForEp(n)}
                    scroll={false}
                    className={cn(
                      "flex min-w-18 max-w-28 flex-col items-stretch justify-center gap-0.5 rounded-lg border px-2.5 py-2 text-left transition-all",
                      active
                        ? "shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/80"
                    )}
                    style={
                      active
                        ? {
                            backgroundColor: `${theme.color}14`,
                            borderColor: theme.color,
                          }
                        : undefined
                    }
                  >
                    <span className="text-[10px] font-bold tabular-nums text-gray-400">
                      {n.toString().padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "line-clamp-2 text-xs font-serif font-bold leading-tight",
                        active ? "text-gray-900" : "text-gray-700"
                      )}
                    >
                      {ep.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* === 桌面端：网格列表 === */}
        <ul
          className="hidden md:grid md:grid-cols-2 md:gap-2"
          role="list"
        >
          {series.episodes.map((ep, i) => {
            const n = i + 1;
            const active = n === ep1;
            return (
              <li key={ep.id}>
                <Link
                  href={hrefForEp(n)}
                  scroll={false}
                  className={cn(
                    "block rounded-lg border px-4 py-3 text-left transition-all",
                    active
                      ? "border-transparent shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/80"
                  )}
                  style={
                    active
                      ? {
                          backgroundColor: `${theme.color}12`,
                          borderColor: theme.color,
                          color: "rgb(17 24 39)",
                        }
                      : undefined
                  }
                >
                  <span
                    className="text-xs font-bold tracking-wider uppercase text-gray-400 block mb-0.5"
                  >
                    {n.toString().padStart(2, "0")}
                  </span>
                  <span className="font-serif font-bold text-sm md:text-base text-gray-900">
                    {ep.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Ceramic>
    </div>
  );
}
