/**
 * 都道府県「アニメーション／紹介動画」シリーズ（v1: YouTube のみ）。
 * 47 県は PREFECTURE_DATABASE から自動生成。各県の YouTube videoId は本番差し替え前提のプレースホルダー。
 */

import { PREFECTURE_DATABASE } from "@/data/prefectures";

export type VideoSource =
  | { kind: "youtube"; videoId: string }
  | { kind: "file"; src: string; poster?: string };

export type AnimationEpisode = {
  id: string;
  title: string;
  source: VideoSource;
};

export type PrefAnimationSeries = {
  prefSlug: string;
  /** 系列タイトル（画面見出し用・日本語県名ベース） */
  title: string;
  episodes: AnimationEpisode[];
};

/** 本番では県・話ごとに差し替え */
const PLACEHOLDER_VIDEO_IDS = ["M7lc1UVf-VE", "jfKfPfyJRdk"] as const;

function episodesForPref(slug: string): AnimationEpisode[] {
  return PLACEHOLDER_VIDEO_IDS.map((videoId, i) => ({
    id: `${slug}-${i + 1}`,
    title: `第${i + 1}話`,
    source: { kind: "youtube" as const, videoId },
  }));
}

function buildRegistry(): Record<string, PrefAnimationSeries> {
  const out: Record<string, PrefAnimationSeries> = {};
  for (const [slug, info] of Object.entries(PREFECTURE_DATABASE)) {
    out[slug] = {
      prefSlug: slug,
      title: `${info.name} 紹介アニメーション`,
      episodes: episodesForPref(slug),
    };
  }
  return out;
}

const REGISTRY: Record<string, PrefAnimationSeries> = buildRegistry();

export function getPrefAnimationSeries(
  prefSlug: string | undefined
): PrefAnimationSeries | null {
  if (!prefSlug) return null;
  return REGISTRY[prefSlug] ?? null;
}

/** sitemap 等: アニメーション付き都道府県 slug の列（47 県） */
export function getPrefSlugsWithAnimation(): string[] {
  return Object.keys(REGISTRY);
}

export function isPrefSlugWithAnimation(prefSlug: string): boolean {
  return prefSlug in REGISTRY;
}
