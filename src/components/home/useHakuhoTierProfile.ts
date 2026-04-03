"use client";

import { useLayoutEffect, useState } from "react";
import type { HakuhoViewportKind } from "@/components/home/hakuhoDeviceTiers";
import {
  getCompactTierFactors,
  getDesktopTierFactors,
  resolveDesktopTier,
  resolvePhoneTier,
  resolveTabletTier,
  type HakuhoCompactTierFactors,
  type HakuhoDesktopTierFactors,
  type HakuhoDesktopTier,
  type HakuhoPhoneTier,
  type HakuhoTabletTier,
} from "@/components/home/hakuhoDeviceTiers";

export type HakuhoTierProfile = {
  innerWidth: number;
  innerHeight: number;
  tabletSpan: number;
  phoneTier: HakuhoPhoneTier;
  tabletTier: HakuhoTabletTier;
  desktopTier: HakuhoDesktopTier;
  compactFactors: HakuhoCompactTierFactors;
  desktopFactors: HakuhoDesktopTierFactors;
};

/** 与 `HAKUHO_DESKTOP_LAYOUT_HYDRATE_*` 一致，避免桌面首帧误用 1080p 分档 */
const HAKUHO_TIER_DIMS_HYDRATE_IW = 1920;
const HAKUHO_TIER_DIMS_HYDRATE_IH = 1080;

/**
 * 随窗口更新分档与系数；不在 useState 初值读 window（SSR 安全）。
 * `compactFactors` 在 kind 为 desktop 时为 identity（紧凑端不渲染）。
 */
export function useHakuhoTierProfile(kind: HakuhoViewportKind): HakuhoTierProfile {
  const [dims, setDims] = useState(() => ({
    iw: HAKUHO_TIER_DIMS_HYDRATE_IW,
    ih: HAKUHO_TIER_DIMS_HYDRATE_IH,
  }));

  useLayoutEffect(() => {
    const update = () => {
      setDims({ iw: window.innerWidth, ih: window.innerHeight });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      vv?.removeEventListener("resize", update);
    };
  }, []);

  const tabletSpan = Math.max(dims.iw, dims.ih);
  const phoneTier = resolvePhoneTier(dims.iw);
  const tabletTier = resolveTabletTier(tabletSpan);
  const desktopTier = resolveDesktopTier(dims.iw);
  const compactFactors = getCompactTierFactors(kind, phoneTier, tabletTier);
  const desktopFactors = getDesktopTierFactors(desktopTier);

  return {
    innerWidth: dims.iw,
    innerHeight: dims.ih,
    tabletSpan,
    phoneTier,
    tabletTier,
    desktopTier,
    compactFactors,
    desktopFactors,
  };
}
