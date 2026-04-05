"use client";

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import RabbitBanner from "@/components/home/RabbitBanner/RabbitBannerDynamic";
import type { SponsorItem, BannerDisplayMode } from "@/components/home/RabbitBanner";
import type { HakuhoViewportKind } from "@/components/home/hakuhoDeviceTiers";
import { useHakuhoTierProfile } from "@/components/home/useHakuhoTierProfile";
import { HakuhoLightbox } from "@/components/home/HakuhoLightbox";

type HeroProps = {
  sponsors?: SponsorItem[];
  /** 旗子显示模式：全部 / 仅俱乐部 / 仅赞助商 / 混合（由后台「旗子显示设置」控制） */
  displayMode?: BannerDisplayMode;
  /** 使用视频背景时传入 MP4（可选，与 videoWebmSrc 二选一或同时提供） */
  videoSrc?: string;
  /** WebM 视频，体积通常更小；可只提供 WebM，现代浏览器均支持 */
  videoWebmSrc?: string;
  /** 竖屏/手机端 WebM 视频（9:16），不传则竖屏沿用 videoWebmSrc */
  videoWebmSrcMobile?: string;
  /** 竖屏/手机端 MP4（可选） */
  videoSrcMobile?: string;
  /** 视频封面图（建议从视频截一帧），用于首屏 LCP，使用视频时必填 */
  posterSrc?: string;
  /** 竖屏/手机端封面图（可选），不传则竖屏沿用 posterSrc */
  posterSrcMobile?: string;
};

/** 视口为竖屏或宽高比 ≤1（手机/窄屏）时为 true，用于选择竖屏视频 */
function useIsPortraitOrNarrow() {
  const [portrait, setPortrait] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-aspect-ratio: 1/1)");
    const update = () => setPortrait(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return portrait;
}

/** 视口横向 < 370px 时为窄屏（卡片两行） */
function useNarrowCard() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 369px)");
    const update = () => setNarrow(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return narrow;
}

/** 顶部心技体卡片，视频/图片两种模式共用 */
function HeroContent() {
  const narrow = useNarrowCard();
  const t = useTranslations("Hero");
  const locale = useLocale();
  const isEn = locale === "en";

  return (
    <div
      className={`relative flex flex-row items-stretch rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.1)] ${
        narrow ? "min-h-[80px]" : "h-[80px] md:h-[90px]"
      }`}
    >
      <div className="absolute inset-0 bg-white/90 backdrop-blur-[60px] backdrop-saturate-[1.5]" />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
      <div className="bg-sumo-red text-white w-[60px] md:w-[80px] flex flex-col justify-center items-center shrink-0 relative overflow-hidden z-10 self-stretch min-h-full">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
        <span className="text-[10px] md:text-xs font-bold leading-none opacity-90 font-serif">20</span>
        <span className="text-2xl md:text-3xl font-black tracking-tighter leading-none my-0.5 font-serif">26</span>
        <div className="flex flex-col items-center border-t border-white/30 pt-1 mt-1 w-8">
          <span className="text-[10px] md:text-xs font-bold leading-none">{t("yearUnit")}</span>
          <span className="text-[8px] md:text-[9px] tracking-widest opacity-90 mt-0.5 transform scale-90">{t("launch")}</span>
        </div>
      </div>
      <div className="flex-grow flex flex-col justify-center px-5 md:px-8 relative min-w-0">
        <div
          className={`relative z-10 flex justify-between gap-2 ${
            narrow ? "flex-col items-start gap-2" : "flex-row items-center gap-0"
          }`}
        >
          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            <h1 className="flex items-center gap-2 md:gap-4 font-serif text-sumo-text leading-none select-none">
              <span className="font-black tracking-tighter text-sumo-red text-3xl md:text-4xl">
                {t("shin")}
              </span>
              <span className="w-px h-3 bg-gray-400/50 rotate-12"></span>
              <span className="font-black tracking-tighter text-sumo-red text-3xl md:text-4xl">
                {t("gi")}
              </span>
              <span className="w-px h-3 bg-gray-400/50 rotate-12"></span>
              <span className="font-black tracking-tighter text-sumo-red text-3xl md:text-4xl">
                {t("tai")}
              </span>
            </h1>
          </div>
          <div
            className={`flex flex-col items-end justify-center border-gray-400/30 min-w-0 ${
              narrow ? "border-l-0 pl-0 ml-0 self-end" : "border-l pl-4 md:pl-8 ml-2"
            }`}
          >
            <p
              className={cn(
                "font-bold text-sumo-text leading-[1.3] text-right",
                isEn
                  ? "font-sans uppercase tracking-[0.15em] text-[9px] sm:text-[10px] md:text-xs max-w-[140px] sm:max-w-[160px] md:max-w-[220px] whitespace-normal break-words"
                  : "font-serif tracking-widest whitespace-nowrap mb-1"
              )}
              style={
                isEn
                  ? undefined
                  : { fontSize: "clamp(0.875rem, 4.2vw, 1.25rem)" }
              }
            >
              {t("tagline")}
            </p>
          </div>
        </div>
        <div className="absolute bottom-2 right-3 flex gap-1 opacity-20 pointer-events-none">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full border border-gray-800 bg-transparent"></span>
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gray-800"></span>
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full border border-gray-800 bg-transparent"></span>
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full border border-gray-800 bg-transparent"></span>
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gray-800"></span>
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full border border-gray-800 bg-transparent"></span>
        </div>
      </div>
    </div>
  );
}

/** 手机：与 Tailwind `md` 以下一致 */
const HAKUHO_PHONE_MAX_PX = 767;
/**
 * 平板：768px～1366px，覆盖 iPad mini / Air / Pro 竖横典型逻辑宽度（含 Pro 12.9" 横屏约 1366）
 */
const HAKUHO_TABLET_MAX_PX = 1366;

/**
 * SSR 与客户端首帧必须一致：不可在 useState 初始值里读 window（否则服务端 desktop、水合时手机 → mismatch）。
 * 首帧统一 desktop，mount 后 useEffect 再写入真实档位（手机会有一帧桌面侧图，通常几乎无感）。
 */
function useHakuhoViewportKind(): HakuhoViewportKind {
  const [kind, setKind] = useState<HakuhoViewportKind>("desktop");
  useLayoutEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= HAKUHO_PHONE_MAX_PX) setKind("phone");
      else if (w <= HAKUHO_TABLET_MAX_PX) setKind("tablet");
      else setKind("desktop");
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);
  return kind;
}

type HakuhoSideLayout = {
  maxWidthPx: number;
  maxHeightPx: number;
  /**
   * 左/右半区外沿留白。CSS 不支持负 padding，负值会转成对应方向的负 margin，把整块半区向外推，便于拉大两图间距。
   */
  padLeftPx: number;
  padRightPx: number;
  nudgeLeft: { x: number; y: number };
  nudgeRight: { x: number; y: number };
  verticalAlign: "center" | "start" | "end";
  /**
   * 仅 phone/tablet：在公式算出的 inwardX 上再减去此项（≥0，建议 4 的倍数），两图更靠屏幕两侧、中间更空。
   */
  compactSpreadExtraPx?: number;
};

/** 负 pad → 负 margin；正 pad → padding（浏览器会忽略负 padding，故不能写负的 paddingLeft） */
function hakuhoHalfOuterStyle(padPx: number, edge: "left" | "right"): React.CSSProperties {
  if (edge === "left") {
    return {
      paddingLeft: Math.max(0, padPx),
      marginLeft: Math.min(0, padPx),
    };
  }
  return {
    paddingRight: Math.max(0, padPx),
    marginRight: Math.min(0, padPx),
  };
}

/**
 * 左右白鹏装饰（桌面 ≥768px）
 *
 * 比例参考底部悬赏旗（`RabbitWalkingBanner` 旗面约 180×260×scale）；当前数值为你本机配置。
 *
 * 手动调整：
 * - maxWidthPx / maxHeightPx：显示上限（object-contain，A4 竖图在框内等比缩放）
 * - padLeftPx / padRightPx：离左/右屏幕边缘（≥0 为内边距；负值会转为负 margin 外推半区）
 * - nudgeLeft / nudgeRight：半区内平移（x 右为正、y 下为正）
 * - verticalAlign：'center' | 'start' | 'end'
 */
const HAKUHO_SIDE_DESKTOP: HakuhoSideLayout = {
  maxWidthPx: Math.round(180 * 1.2),
  maxHeightPx: Math.round(260 * 1.2),
  padLeftPx: 8,
  padRightPx: 8,
  /** 像素 nudge 仅作文档参考；桌面实际渲染用下方 vw/vh 常量 */
  nudgeLeft: { x: 300, y: -265 },
  nudgeRight: { x: -300, y: -265 },
  verticalAlign: "center",
};

/**
 * 桌面端侧图：水平 translate（左 + / 右 −）。
 * - `clamp(MIN, vw, MAX)`：中间项小于 MIN 会顶在 MIN；**大于 MAX 会顶在 MAX**。
 *   例如 `20vw` 在 1920 宽 = 384px，若 MAX 仍为 360，就会「20vw 形同封顶」，无法再向中间加位移——**请提高 MAX_PX**（或改用下方 `…_MAX_VW`）。
 * 向两侧张、远离中间：减小 vw 或减小 MIN。
 */
const HAKUHO_DESKTOP_SHIFT_X_MIN_PX = 32;
const HAKUHO_DESKTOP_SHIFT_X_VW = 25;
/** 像素上限；宽屏上若 `SHIFT_X_VW vw` 常碰到此值，继续往中间靠需调大 */
const HAKUHO_DESKTOP_SHIFT_X_MAX_PX = 960;
/** 可选第二道上限（vw），与 MAX_PX 取较小：`min(MAX_PX, MAX_VW vw)`，避免超宽屏位移过大 */
const HAKUHO_DESKTOP_SHIFT_X_MAX_VW = 42;
const HAKUHO_DESKTOP_EDGE_PAD = "clamp(8px, 0.5vw, 16px)";

/** 桌面：与兔子横幅之间的留白（4pt 网格） */
const HAKUHO_DESKTOP_SAFE_GAP_PX = 16;
/**
 * 桌面：白鹏顶边距视口顶的最小距离（仅按胶囊顶栏估算，不随滚动/顶栏展开重算）。
 * 与 Header 非滚动态一致：marginTop 12 + 桌面胶囊 max-h 88 + 与白鹏间距 16。
 */
const HAKUHO_DESKTOP_PILL_TOP_CLEARANCE_PX = 12 + 88 + 16;
/** 桌面：竖直 translate 的美学范围（与历史 -24.5vh 夹紧一致；更负 = 更靠上） */
const HAKUHO_DESKTOP_TY_AEST_MIN = -300;
const HAKUHO_DESKTOP_TY_AEST_MAX = -200;
const HAKUHO_DESKTOP_TY_VH_RATIO = -0.21;
/**
 * 桌面：布局算法里 scale 的下限（再挤也会停在这里）。
 * 若已改小 `getDesktopHakuhoBaseMaxPx` 仍觉得「缩不动」，多半是基准下限或此处在挡。
 */
const HAKUHO_DESKTOP_SCALE_MIN = 0.12;
/**
 * 桌面：基准 max 宽/高下限（4pt）。原先 100×144 会在你把 vw 调小时早早顶死，看起来像「没法再缩小」。
 */
const HAKUHO_DESKTOP_BASE_MIN_W_PX = 48;
const HAKUHO_DESKTOP_BASE_MIN_H_PX = 64;
/** 与桌面 `getDesktopHakuhoBaseMaxPx` 同源（仅桌面）；手机/平板各自用 `HAKUHO_PHONE_SIDE_*` / `HAKUHO_TABLET_SIDE_*` */
const HAKUHO_SHARED_BASE_VW_PERCENT = 6;
const HAKUHO_SHARED_BASE_MAX_W_PX = 216;
const HAKUHO_SHARED_BASE_MAX_H_PX = 312;
/**
 * 仅手机（≤767）：侧图 `max-width` / `max-height`。与平板、桌面互不影响；公式同 `min(上限, max(下限, vw%))`。
 */
const HAKUHO_PHONE_SIDE_VW_PERCENT = 3;
/** 至少 48px（4pt 网格），避免窄屏上 object-contain 后命中区过小（如 iPhone Pro 393 宽难触发 click） */
const HAKUHO_PHONE_SIDE_MIN_W_PX = 48;
const HAKUHO_PHONE_SIDE_MIN_H_PX = 48;
const HAKUHO_PHONE_SIDE_MAX_W_PX = 216;
const HAKUHO_PHONE_SIDE_MAX_H_PX = 312;
/**
 * 仅平板（768–1366）：侧图上限；与手机独立。
 */
const HAKUHO_TABLET_SIDE_VW_PERCENT = 6;
const HAKUHO_TABLET_SIDE_MIN_W_PX = 48;
const HAKUHO_TABLET_SIDE_MIN_H_PX = 64;
const HAKUHO_TABLET_SIDE_MAX_W_PX = 216;
const HAKUHO_TABLET_SIDE_MAX_H_PX = 312;
/** 侧图阴影：挂在包裹 `<img>` 的容器上，避免 WebKit 对带 filter 的 `<img>` 出现内容不绘制（表现为色块/空白）。 */
const HAKUHO_IMG_DROP_SHADOW =
  "drop-shadow(0 4px 14px rgba(0,0,0,0.12)) drop-shadow(0 12px 36px rgba(0,0,0,0.18))";

/** 紧凑端侧图：`sideVwMul` 乘在 vw% 与 min/max 钳制上 */
function clampCompactSideMaxPx(
  innerWidth: number,
  vwPercent: number,
  minW: number,
  minH: number,
  maxW: number,
  maxH: number,
  sideVwMul: number,
): { maxW: number; maxH: number } {
  const m = sideVwMul;
  const eff = vwPercent * m;
  return {
    maxW: Math.round(Math.min(maxW * m, Math.max(minW * m, (innerWidth * eff) / 100))),
    maxH: Math.round(Math.min(maxH * m, Math.max(minH * m, (innerWidth * eff) / 100))),
  };
}

/** 桌面侧图基准 max（再经 `desktopHakuhoLayout.scale` 与可用高度夹紧）；`baseVwMul` 为分档系数 */
function getDesktopHakuhoBaseMaxPx(vw: number, baseVwMul = 1): { maxW: number; maxH: number } {
  const pct = HAKUHO_SHARED_BASE_VW_PERCENT * baseVwMul;
  return {
    maxW: Math.min(
      HAKUHO_SHARED_BASE_MAX_W_PX,
      Math.max(HAKUHO_DESKTOP_BASE_MIN_W_PX, (vw * pct) / 100),
    ),
    maxH: Math.min(
      HAKUHO_SHARED_BASE_MAX_H_PX,
      Math.max(HAKUHO_DESKTOP_BASE_MIN_H_PX, (vw * pct) / 100),
    ),
  };
}

function getDisplayedHakuhoSize(img: HTMLImageElement, maxW: number, maxH: number): { w: number; h: number } {
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!nw || !nh) {
    return { w: maxW, h: maxH };
  }
  const r = Math.min(maxW / nw, maxH / nh);
  return { w: nw * r, h: nh * r };
}

/**
 * 平板（iPad 等）：侧图尺寸见 `HAKUHO_TABLET_SIDE_*`；此处 max* 仅满足类型，渲染不用。
 */
const HAKUHO_SIDE_TABLET: HakuhoSideLayout = {
  maxWidthPx: 0,
  maxHeightPx: 0,
  padLeftPx: -100,
  padRightPx: -100,
  nudgeLeft: { x: 0, y: -138 },
  nudgeRight: { x: 0, y: -138 },
  verticalAlign: "center",
  /** 增大可拉开两图；也可配合负的 padLeftPx/padRightPx 外推半区 */
  compactSpreadExtraPx: 0,
};

/**
 * 手机（宽度 ≤767）：侧图尺寸见 `HAKUHO_PHONE_SIDE_*`。
 */
const HAKUHO_SIDE_MOBILE: HakuhoSideLayout = {
  maxWidthPx: 0,
  maxHeightPx: 0,
  padLeftPx: 8,
  padRightPx: 8,
  /** 水平位移改由视口动态计算（向内收，缩窄两图间距）；Y 仅作基底，实际由卡片底边公式覆盖 */
  nudgeLeft: { x: 0, y: -150 },
  nudgeRight: { x: 0, y: -150 },
  verticalAlign: "center",
};

/** 左/右栏素材（与画面人物左右对调：原先 1=左 2=右 观感反了） */
const HAKUHO_LEFT_SRC = "/images/hero/hakuho2.webp";
const HAKUHO_RIGHT_SRC = "/images/hero/hakuho1.webp";

/** 仅拦系统菜单，不 stopPropagation，避免打断 Pointer 长按链 */
function preventContextMenuOnly(e: React.MouseEvent) {
  e.preventDefault();
}

/** 拦原生拖拽 */
function preventImgDragOnly(e: React.DragEvent<HTMLImageElement>) {
  e.preventDefault();
}

/** 手机：侧图顶边与「心技体」卡片底边的固定间距（视口 px，4 的倍数） */
const HAKUHO_MOBILE_CARD_GAP_PX = 100;
/** 平板：同上，略大以适配较大触控目标与阴影 */
const HAKUHO_TABLET_CARD_GAP_PX = 24;
/** 手机向内平移量 = clamp(round(vw * 比例), min, max) */
const HAKUHO_MOBILE_INWARD_X_VW = 0.73;
const HAKUHO_MOBILE_INWARD_X_MIN = 200;
const HAKUHO_MOBILE_INWARD_X_MAX = 360;
/** 平板：视口更宽，用略低 vw 比例 + 更大上限，避免两图过挤 */
const HAKUHO_TABLET_INWARD_X_VW = 0.27;
const HAKUHO_TABLET_INWARD_X_MIN = 220;
const HAKUHO_TABLET_INWARD_X_MAX = 520;

/**
 * 紧凑端竖直锚点：`cardAligned` 跟「心技体」卡片底边；`videoWallPercent` 跟 Hero 高度百分比（配合同一裁切下的视频墙）。
 */
type HakuhoCompactLayoutMode = "cardAligned" | "videoWallPercent";

/**
 * 视频模式：侧图竖直中心落在 Hero 高度的该百分比处（0–100）。与 `HAKUHO_VIDEO_COMPACT_OBJECT_POS` 一起调，直到相框与画面墙面对齐。
 */
const HAKUHO_VIDEO_WALL_PHONE_TOP_PCT = 62;
const HAKUHO_VIDEO_WALL_TABLET_TOP_PCT = 47;
/*
 * 紧凑端（手机 + 平板）poster / 视频的 `object-position`。`object-cover` 裁切随屏变化，需与素材里「墙」对齐后，再调 `HAKUHO_VIDEO_WALL_*_TOP_PCT`。
 */
const HAKUHO_VIDEO_COMPACT_OBJECT_POS = "50% 42%";

type HeroHakuhoSidePanelsProps = {
  /** 包裹 HeroContent 的外壳，用于手机端计算侧图与卡片的避让 */
  heroCardShellRef: React.RefObject<HTMLDivElement | null>;
  /** Hero 根 section，用于与卡片、图片在同一坐标系下算垂直位置 */
  heroSectionRef: React.RefObject<HTMLElement | null>;
  /** Lightbox 打开时为 true，阻止侧栏布局重算抖动（与 ref 同步，供 effect 检测关闭） */
  hakuhoLightboxOpen: boolean;
  hakuhoLightboxOpenRef: React.MutableRefObject<boolean>;
  /** 打开白鹏大图（Portal 原图） */
  onOpenHakuhoLightbox: (src: string) => void;
  /** 底部兔子横幅容器，桌面端用于与白鹏底部避让 */
  rabbitBannerRef: React.RefObject<HTMLDivElement | null>;
  /** 默认 `cardAligned`；视频背景时建议 `videoWallPercent` */
  compactLayoutMode?: HakuhoCompactLayoutMode;
};

type DesktopHakuhoLayout = {
  ty: number;
  scale: number;
  baseMaxW: number;
  baseMaxH: number;
};

/**
 * 水合首帧必须与 SSR 完全一致：`useState` 初始化函数内禁止读 `window`。
 * 占位视口与旧版「无 window 时」分支相同；`useLayoutEffect` 里会立刻用真实视口覆盖。
 */
const HAKUHO_DESKTOP_LAYOUT_HYDRATE_VW = 1920;
const HAKUHO_DESKTOP_LAYOUT_HYDRATE_VH = 1080;

function createDesktopHakuhoLayoutSnapshot(vw: number, vh: number): DesktopHakuhoLayout {
  const base = getDesktopHakuhoBaseMaxPx(vw);
  const ty = Math.max(
    HAKUHO_DESKTOP_TY_AEST_MIN,
    Math.min(HAKUHO_DESKTOP_TY_AEST_MAX, Math.round(HAKUHO_DESKTOP_TY_VH_RATIO * vh)),
  );
  return { ty, scale: 1, baseMaxW: base.maxW, baseMaxH: base.maxH };
}

type MobileHakuhoLayout = { yExtra: number; inwardX: number };

function HeroHakuhoSidePanels({
  heroCardShellRef,
  heroSectionRef,
  hakuhoLightboxOpen,
  hakuhoLightboxOpenRef,
  onOpenHakuhoLightbox,
  rabbitBannerRef,
  compactLayoutMode = "cardAligned",
}: HeroHakuhoSidePanelsProps) {
  const hakuhoViewportKind = useHakuhoViewportKind();
  const tierProfile = useHakuhoTierProfile(hakuhoViewportKind);
  const compactFactorsRef = useRef(tierProfile.compactFactors);
  compactFactorsRef.current = tierProfile.compactFactors;
  const desktopFactorsRef = useRef(tierProfile.desktopFactors);
  desktopFactorsRef.current = tierProfile.desktopFactors;

  const isCompactHakuho = hakuhoViewportKind !== "desktop";
  const compactLayoutModeRef = useRef(compactLayoutMode);
  compactLayoutModeRef.current = compactLayoutMode;
  const useVideoWallAnchor = isCompactHakuho && compactLayoutMode === "videoWallPercent";

  const [mobileHakuhoLayout, setMobileHakuhoLayout] = useState<MobileHakuhoLayout>({
    yExtra: 0,
    inwardX: 280,
  });
  const [desktopHakuhoLayout, setDesktopHakuhoLayout] = useState<DesktopHakuhoLayout>(() =>
    createDesktopHakuhoLayoutSnapshot(HAKUHO_DESKTOP_LAYOUT_HYDRATE_VW, HAKUHO_DESKTOP_LAYOUT_HYDRATE_VH),
  );
  const leftImgRef = useRef<HTMLImageElement | null>(null);
  const rightImgRef = useRef<HTMLImageElement | null>(null);
  const layoutRafRef = useRef<number>(0);
  const lastAppliedLayoutRef = useRef<MobileHakuhoLayout>({ yExtra: NaN, inwardX: NaN });
  const desktopLayoutRafRef = useRef<number>(0);
  const lastDesktopLayoutRef = useRef<DesktopHakuhoLayout | null>(null);
  const hakuhoKindRef = useRef(hakuhoViewportKind);
  hakuhoKindRef.current = hakuhoViewportKind;

  const sidePreset: HakuhoSideLayout =
    hakuhoViewportKind === "phone"
      ? HAKUHO_SIDE_MOBILE
      : hakuhoViewportKind === "tablet"
        ? HAKUHO_SIDE_TABLET
        : HAKUHO_SIDE_DESKTOP;
  const { padLeftPx, padRightPx, nudgeLeft, nudgeRight, verticalAlign } = sidePreset;

  const isDesktopHakuho = hakuhoViewportKind === "desktop";

  const itemsAlign =
    verticalAlign === "start" ? "items-start" : verticalAlign === "end" ? "items-end" : "items-center";

  const compactSideMaxPx = useMemo(() => {
    if (!isCompactHakuho) return null;
    const iw = tierProfile.innerWidth;
    const m = tierProfile.compactFactors.sideVwMul;
    if (hakuhoViewportKind === "phone") {
      return clampCompactSideMaxPx(
        iw,
        HAKUHO_PHONE_SIDE_VW_PERCENT,
        HAKUHO_PHONE_SIDE_MIN_W_PX,
        HAKUHO_PHONE_SIDE_MIN_H_PX,
        HAKUHO_PHONE_SIDE_MAX_W_PX,
        HAKUHO_PHONE_SIDE_MAX_H_PX,
        m,
      );
    }
    return clampCompactSideMaxPx(
      iw,
      HAKUHO_TABLET_SIDE_VW_PERCENT,
      HAKUHO_TABLET_SIDE_MIN_W_PX,
      HAKUHO_TABLET_SIDE_MIN_H_PX,
      HAKUHO_TABLET_SIDE_MAX_W_PX,
      HAKUHO_TABLET_SIDE_MAX_H_PX,
      m,
    );
  }, [
    isCompactHakuho,
    hakuhoViewportKind,
    tierProfile.innerWidth,
    tierProfile.compactFactors.sideVwMul,
  ]);

  const desktopShiftXCss = useMemo(() => {
    const m = tierProfile.desktopFactors.shiftXVwMul;
    const vwPart = HAKUHO_DESKTOP_SHIFT_X_VW * m;
    const maxVwPart = HAKUHO_DESKTOP_SHIFT_X_MAX_VW * m;
    return `clamp(${HAKUHO_DESKTOP_SHIFT_X_MIN_PX}px, ${vwPart}vw, min(${HAKUHO_DESKTOP_SHIFT_X_MAX_PX}px, ${maxVwPart}vw))`;
  }, [tierProfile.desktopFactors.shiftXVwMul]);

  const imgLayoutStyle: React.CSSProperties = {
    width: "auto",
    height: "auto",
    ...(isDesktopHakuho
      ? {
          maxWidth: Math.round(desktopHakuhoLayout.baseMaxW * desktopHakuhoLayout.scale),
          maxHeight: Math.round(desktopHakuhoLayout.baseMaxH * desktopHakuhoLayout.scale),
          transition: "max-width 200ms ease-in-out, max-height 200ms ease-in-out",
        }
      : compactSideMaxPx
        ? {
            maxWidth: compactSideMaxPx.maxW,
            maxHeight: compactSideMaxPx.maxH,
            transition: "max-width 200ms ease-in-out, max-height 200ms ease-in-out",
          }
        : {}),
    objectFit: "contain",
  };

  const hakuhoFilterWrapperStyle: React.CSSProperties = {
    display: "inline-block",
    lineHeight: 0,
    pointerEvents: "none",
    filter: HAKUHO_IMG_DROP_SHADOW,
    transition: "filter 200ms ease-in-out",
  };

  const leftHalfOuterStyle: React.CSSProperties = isDesktopHakuho
    ? { paddingLeft: HAKUHO_DESKTOP_EDGE_PAD }
    : hakuhoHalfOuterStyle(padLeftPx, "left");

  const rightHalfOuterStyle: React.CSSProperties = isDesktopHakuho
    ? { paddingRight: HAKUHO_DESKTOP_EDGE_PAD }
    : hakuhoHalfOuterStyle(padRightPx, "right");

  const videoWallTopPct =
    (hakuhoViewportKind === "phone" ? HAKUHO_VIDEO_WALL_PHONE_TOP_PCT : HAKUHO_VIDEO_WALL_TABLET_TOP_PCT) +
    tierProfile.compactFactors.wallTopPctOffset;
  const compactHalfVerticalStyle: React.CSSProperties | undefined = useVideoWallAnchor
    ? {
        top: `${videoWallTopPct}%`,
        bottom: "auto",
        height: "auto",
        transform: "translateY(-50%)",
      }
    : undefined;

  /**
   * 移动端：侧图顶边 = 卡片底边 + 固定间距（相对 Hero section 的 flex 竖直居中槽位算一次 yExtra）。
   * 不向 img 挂 ResizeObserver，避免位移 → 测量 → setState 循环导致上下抽搐。
   */
  const applyMobileHakuhoLayout = useCallback(() => {
    if (hakuhoKindRef.current === "desktop") {
      setMobileHakuhoLayout({ yExtra: 0, inwardX: 280 });
      lastAppliedLayoutRef.current = { yExtra: NaN, inwardX: NaN };
      return;
    }
    if (hakuhoLightboxOpenRef.current) return;

    const shell = heroCardShellRef.current;
    const section = heroSectionRef.current;
    const imgEl = leftImgRef.current;
    const videoWall = compactLayoutModeRef.current === "videoWallPercent";

    if (videoWall) {
      const vw = window.innerWidth;
      const phone = hakuhoKindRef.current === "phone";
      const cf = compactFactorsRef.current;
      const inwardRaw = phone
        ? Math.min(
            HAKUHO_MOBILE_INWARD_X_MAX,
            Math.max(HAKUHO_MOBILE_INWARD_X_MIN, Math.round(vw * HAKUHO_MOBILE_INWARD_X_VW)),
          )
        : Math.min(
            HAKUHO_TABLET_INWARD_X_MAX,
            Math.max(HAKUHO_TABLET_INWARD_X_MIN, Math.round(vw * HAKUHO_TABLET_INWARD_X_VW)),
          );
      const spreadExtra = phone
        ? (HAKUHO_SIDE_MOBILE.compactSpreadExtraPx ?? 0)
        : (HAKUHO_SIDE_TABLET.compactSpreadExtraPx ?? 0);
      const inwardX = Math.max(0, Math.round(inwardRaw * cf.inwardMul) - spreadExtra);
      const next = { yExtra: 0, inwardX };
      const last = lastAppliedLayoutRef.current;
      if (last.yExtra === next.yExtra && last.inwardX === next.inwardX) return;
      lastAppliedLayoutRef.current = next;
      setMobileHakuhoLayout(next);
      return;
    }

    if (!shell || !section || !imgEl) return;

    const card = shell.getBoundingClientRect();
    const sec = section.getBoundingClientRect();
    /**
     * 必须用布局高度，不能用 getBoundingClientRect().height：
     * transform 会改变 rect 高度读数，若立刻重算 yExtra 会得到错误 slotTop，位置会「回不去」。
     * offsetHeight / clientHeight 不受 transform 影响。
     */
    const imgH = Math.max(imgEl.offsetHeight, imgEl.clientHeight, 1);
    if (sec.height < 16 || card.height < 8) return;

    const vw = window.innerWidth;
    const phone = hakuhoKindRef.current === "phone";
    const inwardRaw = phone
      ? Math.min(
          HAKUHO_MOBILE_INWARD_X_MAX,
          Math.max(HAKUHO_MOBILE_INWARD_X_MIN, Math.round(vw * HAKUHO_MOBILE_INWARD_X_VW)),
        )
      : Math.min(
          HAKUHO_TABLET_INWARD_X_MAX,
          Math.max(HAKUHO_TABLET_INWARD_X_MIN, Math.round(vw * HAKUHO_TABLET_INWARD_X_VW)),
        );
    const spreadExtra = phone
      ? (HAKUHO_SIDE_MOBILE.compactSpreadExtraPx ?? 0)
      : (HAKUHO_SIDE_TABLET.compactSpreadExtraPx ?? 0);
    const cf = compactFactorsRef.current;
    const inwardX = Math.max(0, Math.round(inwardRaw * cf.inwardMul) - spreadExtra);

    const nudgeYBase = phone ? HAKUHO_SIDE_MOBILE.nudgeLeft.y : HAKUHO_SIDE_TABLET.nudgeLeft.y;
    const cardGap = Math.round(
      (phone ? HAKUHO_MOBILE_CARD_GAP_PX : HAKUHO_TABLET_CARD_GAP_PX) * cf.cardGapMul,
    );

    const slotTop = sec.top + (sec.height - imgH) / 2;
    const targetImgTop = Math.ceil(card.bottom) + cardGap;
    const yExtra = Math.round(targetImgTop - slotTop - nudgeYBase);

    const next = { yExtra, inwardX };
    const last = lastAppliedLayoutRef.current;
    if (last.yExtra === next.yExtra && last.inwardX === next.inwardX) return;
    lastAppliedLayoutRef.current = next;
    setMobileHakuhoLayout(next);
  }, [heroCardShellRef, heroSectionRef, hakuhoLightboxOpenRef]);

  const applyDesktopHakuhoLayout = useCallback(() => {
    if (hakuhoKindRef.current !== "desktop") return;
    if (hakuhoLightboxOpenRef.current) return;

    const section = heroSectionRef.current;
    const imgEl = leftImgRef.current;
    const rabbit = rabbitBannerRef.current;
    if (!section || !imgEl || !rabbit) return;

    const vw = window.innerWidth;
    const rabbitTop = rabbit.getBoundingClientRect().top;
    const sec = section.getBoundingClientRect();
    const vSec = Math.max(sec.height, 1);

    const safeTop = HAKUHO_DESKTOP_PILL_TOP_CLEARANCE_PX;
    const safeBottom = rabbitTop - HAKUHO_DESKTOP_SAFE_GAP_PX;
    let avail = safeBottom - safeTop;
    if (!Number.isFinite(avail) || avail < 64) {
      avail = Math.max(64, vSec * 0.35);
    }

    const base = getDesktopHakuhoBaseMaxPx(vw, desktopFactorsRef.current.baseVwMul);
    let scale = 1;
    let dispH = getDisplayedHakuhoSize(imgEl, base.maxW * scale, base.maxH * scale).h;

    let guard = 0;
    while (dispH > avail * 0.98 && scale > HAKUHO_DESKTOP_SCALE_MIN + 1e-4 && guard < 16) {
      scale *= (avail * 0.98) / dispH;
      scale = Math.min(1, Math.max(HAKUHO_DESKTOP_SCALE_MIN, scale));
      dispH = getDisplayedHakuhoSize(imgEl, base.maxW * scale, base.maxH * scale).h;
      guard += 1;
    }

    const tyAest = Math.max(
      HAKUHO_DESKTOP_TY_AEST_MIN,
      Math.min(HAKUHO_DESKTOP_TY_AEST_MAX, Math.round(HAKUHO_DESKTOP_TY_VH_RATIO * vSec)),
    );

    let flexItemTop = sec.top + (sec.height - dispH) / 2;
    let lo = safeTop - flexItemTop;
    let hi = safeBottom - dispH - flexItemTop;
    guard = 0;
    while (lo > hi && scale > HAKUHO_DESKTOP_SCALE_MIN + 1e-4 && guard < 16) {
      scale *= 0.92;
      scale = Math.max(HAKUHO_DESKTOP_SCALE_MIN, scale);
      dispH = getDisplayedHakuhoSize(imgEl, base.maxW * scale, base.maxH * scale).h;
      flexItemTop = sec.top + (sec.height - dispH) / 2;
      lo = safeTop - flexItemTop;
      hi = safeBottom - dispH - flexItemTop;
      guard += 1;
    }

    const ty = lo > hi ? lo : Math.max(lo, Math.min(hi, tyAest));

    const next: DesktopHakuhoLayout = {
      ty,
      scale,
      baseMaxW: base.maxW,
      baseMaxH: base.maxH,
    };

    const last = lastDesktopLayoutRef.current;
    if (
      last &&
      last.ty === next.ty &&
      last.scale === next.scale &&
      last.baseMaxW === next.baseMaxW &&
      last.baseMaxH === next.baseMaxH
    ) {
      return;
    }
    lastDesktopLayoutRef.current = next;
    setDesktopHakuhoLayout(next);
  }, [heroSectionRef, rabbitBannerRef, hakuhoLightboxOpenRef]);

  const scheduleMobileHakuhoLayout = useCallback(() => {
    if (layoutRafRef.current) cancelAnimationFrame(layoutRafRef.current);
    layoutRafRef.current = requestAnimationFrame(() => {
      layoutRafRef.current = 0;
      applyMobileHakuhoLayout();
    });
  }, [applyMobileHakuhoLayout]);

  const scheduleDesktopHakuhoLayout = useCallback(() => {
    if (desktopLayoutRafRef.current) cancelAnimationFrame(desktopLayoutRafRef.current);
    desktopLayoutRafRef.current = requestAnimationFrame(() => {
      desktopLayoutRafRef.current = 0;
      applyDesktopHakuhoLayout();
    });
  }, [applyDesktopHakuhoLayout]);

  useLayoutEffect(() => {
    if (!isCompactHakuho) {
      setMobileHakuhoLayout({ yExtra: 0, inwardX: 280 });
      lastAppliedLayoutRef.current = { yExtra: NaN, inwardX: NaN };
      return;
    }
    scheduleMobileHakuhoLayout();
    const shell = heroCardShellRef.current;
    const roShell = shell ? new ResizeObserver(() => scheduleMobileHakuhoLayout()) : null;
    if (shell) roShell?.observe(shell);
    const onWin = () => scheduleMobileHakuhoLayout();
    window.addEventListener("resize", onWin);
    window.addEventListener("orientationchange", onWin);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", onWin);
    return () => {
      if (layoutRafRef.current) cancelAnimationFrame(layoutRafRef.current);
      layoutRafRef.current = 0;
      roShell?.disconnect();
      window.removeEventListener("resize", onWin);
      window.removeEventListener("orientationchange", onWin);
      vv?.removeEventListener("resize", onWin);
    };
  }, [
    isCompactHakuho,
    hakuhoViewportKind,
    compactLayoutMode,
    scheduleMobileHakuhoLayout,
    tierProfile.innerWidth,
    tierProfile.phoneTier,
    tierProfile.tabletTier,
    tierProfile.compactFactors.sideVwMul,
    tierProfile.compactFactors.inwardMul,
    tierProfile.compactFactors.cardGapMul,
    tierProfile.compactFactors.wallTopPctOffset,
  ]);

  useLayoutEffect(() => {
    if (!isDesktopHakuho) {
      lastDesktopLayoutRef.current = null;
      return;
    }
    scheduleDesktopHakuhoLayout();
    const onWin = () => scheduleDesktopHakuhoLayout();
    window.addEventListener("resize", onWin);
    window.addEventListener("orientationchange", onWin);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", onWin);
    const rabbit = rabbitBannerRef.current;
    const roRabbit = rabbit ? new ResizeObserver(onWin) : null;
    if (rabbit) roRabbit?.observe(rabbit);
    const section = heroSectionRef.current;
    const roSection = section ? new ResizeObserver(onWin) : null;
    if (section) roSection?.observe(section);
    return () => {
      if (desktopLayoutRafRef.current) cancelAnimationFrame(desktopLayoutRafRef.current);
      desktopLayoutRafRef.current = 0;
      roRabbit?.disconnect();
      roSection?.disconnect();
      window.removeEventListener("resize", onWin);
      window.removeEventListener("orientationchange", onWin);
      vv?.removeEventListener("resize", onWin);
    };
  }, [isDesktopHakuho, scheduleDesktopHakuhoLayout, rabbitBannerRef, tierProfile.desktopTier, tierProfile.desktopFactors.baseVwMul]);

  const prevHakuhoLightboxOpenRef = useRef(hakuhoLightboxOpen);
  useEffect(() => {
    if (prevHakuhoLightboxOpenRef.current && !hakuhoLightboxOpen) {
      if (hakuhoKindRef.current === "desktop") scheduleDesktopHakuhoLayout();
      else scheduleMobileHakuhoLayout();
    }
    prevHakuhoLightboxOpenRef.current = hakuhoLightboxOpen;
  }, [hakuhoLightboxOpen, scheduleDesktopHakuhoLayout, scheduleMobileHakuhoLayout]);

  const mobileYExtra = isCompactHakuho ? mobileHakuhoLayout.yExtra : 0;
  const mobileInwardX = isCompactHakuho ? mobileHakuhoLayout.inwardX : 0;
  const leftTranslateX = isCompactHakuho ? mobileInwardX : nudgeLeft.x;
  const rightTranslateX = isCompactHakuho ? -mobileInwardX : nudgeRight.x;

  const leftInnerTransform = isDesktopHakuho
    ? `translate(${desktopShiftXCss}, ${desktopHakuhoLayout.ty}px)`
    : `translate(${leftTranslateX}px, ${nudgeLeft.y + mobileYExtra}px)`;

  const rightInnerTransform = isDesktopHakuho
    ? `translate(calc(-1 * ${desktopShiftXCss}), ${desktopHakuhoLayout.ty}px)`
    : `translate(${rightTranslateX}px, ${nudgeRight.y + mobileYExtra}px)`;

  const hakuhoThumbInteractionStyle: React.CSSProperties = {
    pointerEvents: "auto",
    cursor: "pointer",
    touchAction: "manipulation",
    WebkitTouchCallout: "none",
    WebkitUserSelect: "none",
    userSelect: "none",
    transform: "translate(0px, 0px) scale(1)",
    transformOrigin: "center center",
    transition: "transform 200ms ease-in-out, max-width 200ms ease-in-out, max-height 200ms ease-in-out",
  };

  return (
    <>
      <div
        className={`pointer-events-none absolute left-0 z-[32] flex w-1/2 ${itemsAlign} justify-start overflow-visible ${
          useVideoWallAnchor ? "" : "inset-y-0"
        }`}
        style={{ ...compactHalfVerticalStyle, ...leftHalfOuterStyle }}
        aria-hidden
      >
        <div
          style={{
            transform: leftInnerTransform,
            transition: "transform 200ms ease-in-out",
            pointerEvents: "none",
          }}
        >
          <span style={hakuhoFilterWrapperStyle}>
            <img
              ref={leftImgRef}
              src={HAKUHO_LEFT_SRC}
              alt=""
              draggable={false}
              className="select-none object-left rounded-sm"
              style={{ ...imgLayoutStyle, ...hakuhoThumbInteractionStyle }}
              onLoad={isCompactHakuho ? scheduleMobileHakuhoLayout : scheduleDesktopHakuhoLayout}
              onClick={(e) => {
                e.stopPropagation();
                onOpenHakuhoLightbox(HAKUHO_LEFT_SRC);
              }}
              onContextMenu={preventContextMenuOnly}
              onDragStart={preventImgDragOnly}
            />
          </span>
        </div>
      </div>
      <div
        className={`pointer-events-none absolute right-0 z-[32] flex w-1/2 ${itemsAlign} justify-end overflow-visible ${
          useVideoWallAnchor ? "" : "inset-y-0"
        }`}
        style={{ ...compactHalfVerticalStyle, ...rightHalfOuterStyle }}
        aria-hidden
      >
        <div
          style={{
            transform: rightInnerTransform,
            transition: "transform 200ms ease-in-out",
            pointerEvents: "none",
          }}
        >
          <span style={hakuhoFilterWrapperStyle}>
            <img
              ref={rightImgRef}
              src={HAKUHO_RIGHT_SRC}
              alt=""
              draggable={false}
              className="select-none object-right rounded-sm"
              style={{ ...imgLayoutStyle, ...hakuhoThumbInteractionStyle }}
              onLoad={isCompactHakuho ? scheduleMobileHakuhoLayout : scheduleDesktopHakuhoLayout}
              onClick={(e) => {
                e.stopPropagation();
                onOpenHakuhoLightbox(HAKUHO_RIGHT_SRC);
              }}
              onContextMenu={preventContextMenuOnly}
              onDragStart={preventImgDragOnly}
            />
          </span>
        </div>
      </div>
    </>
  );
}

const Hero = ({
  sponsors,
  displayMode,
  videoSrc,
  videoWebmSrc,
  videoWebmSrcMobile,
  videoSrcMobile,
  posterSrc,
  posterSrcMobile,
}: HeroProps) => {
  const hasAnyVideo = Boolean(videoSrc || videoWebmSrc || videoWebmSrcMobile || videoSrcMobile);
  const hasAnyPoster = Boolean(posterSrc || posterSrcMobile);
  const [videoMediaFailed, setVideoMediaFailed] = useState(false);
  /** 视频 404 / 解码失败 / 无可用 source 时回退到下方 SVG 四帧模式，避免一直显示「?」占位 */
  const useVideo = hasAnyPoster && hasAnyVideo && !videoMediaFailed;
  const isMobileView = useIsPortraitOrNarrow();
  const hakuhoViewportKind = useHakuhoViewportKind();
  const isHakuhoCompactTouch = hakuhoViewportKind !== "desktop";
  const [canLoadVideo, setCanLoadVideo] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroCardShellRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const rabbitBannerRef = useRef<HTMLDivElement>(null);
  const hakuhoLightboxOpenRef = useRef(false);
  const [hakuhoLightboxSrc, setHakuhoLightboxSrc] = useState<string | null>(null);

  const openHakuhoLightbox = useCallback((src: string) => {
    hakuhoLightboxOpenRef.current = true;
    setHakuhoLightboxSrc(src);
  }, []);

  const closeHakuhoLightbox = useCallback(() => {
    hakuhoLightboxOpenRef.current = false;
    setHakuhoLightboxSrc(null);
  }, []);

  const effectiveWebm = isMobileView && videoWebmSrcMobile ? videoWebmSrcMobile : videoWebmSrc;
  const effectiveMp4 = isMobileView && videoSrcMobile ? videoSrcMobile : videoSrc;
  const effectivePoster = (isMobileView ? (posterSrcMobile ?? posterSrc) : (posterSrc ?? posterSrcMobile)) ?? "";

  // 延迟加载视频：等页面主资源加载完再请求视频，避免拖慢 LCP
  useEffect(() => {
    if (!useVideo) return;
    const onLoad = () => setCanLoadVideo(true);
    if (typeof document !== "undefined" && document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [useVideo]);

  // 图片模式：4 帧轮播
  useEffect(() => {
    if (useVideo) return;
    const interval = setInterval(() => setFrameIndex((prev) => (prev + 1) % 4), 4000);
    return () => clearInterval(interval);
  }, [useVideo]);

  const onVideoPlaying = () => setVideoPlaying(true);

  // ========== 视频背景模式：横屏用 16:9，竖屏用 9:16 ==========
  if (useVideo) {
    return (
      <section
        ref={heroSectionRef}
        className="relative w-full h-screen overflow-hidden bg-sumo-bg shadow-[0_4px_30px_-12px_rgba(0,0,0,0.15)]"
      >
        {/* 背景层：poster 立即显示 → 视频加载后淡入；视频用 min-w/min-h + 居中确保填满无黑边 */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none [&_*]:pointer-events-none">
          <img
            src={effectivePoster}
            alt=""
            draggable={false}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              isHakuhoCompactTouch ? "" : "object-center"
            } ${videoPlaying ? "opacity-0" : "opacity-100"}`}
            aria-hidden
            fetchPriority="high"
            onContextMenu={isHakuhoCompactTouch ? preventContextMenuOnly : undefined}
            onDragStart={isHakuhoCompactTouch ? preventImgDragOnly : undefined}
            style={{
              ...(isHakuhoCompactTouch ? { objectPosition: HAKUHO_VIDEO_COMPACT_OBJECT_POS } : {}),
              ...(isHakuhoCompactTouch
                ? { WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none" }
                : {}),
            }}
          />
          {canLoadVideo && (effectiveWebm || effectiveMp4) && (
            <video
              key={isMobileView ? "mobile" : "desktop"}
              ref={videoRef}
              className="absolute top-1/2 left-1/2 block min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 scale-[1.02] object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={effectivePoster}
              preload="metadata"
              onPlaying={onVideoPlaying}
              onError={() => setVideoMediaFailed(true)}
              aria-hidden
              controlsList="nodownload nofullscreen noremoteplayback"
              disablePictureInPicture
              onContextMenu={isHakuhoCompactTouch ? preventContextMenuOnly : undefined}
              style={{
                ...(isHakuhoCompactTouch ? { objectPosition: HAKUHO_VIDEO_COMPACT_OBJECT_POS } : {}),
                ...(isHakuhoCompactTouch ? { WebkitTouchCallout: "none" } : {}),
              }}
            >
              {effectiveWebm && <source src={effectiveWebm} type="video/webm" />}
              {effectiveMp4 && <source src={effectiveMp4} type="video/mp4" />}
            </video>
          )}
        </div>
        <HeroHakuhoSidePanels
          heroCardShellRef={heroCardShellRef}
          heroSectionRef={heroSectionRef}
          hakuhoLightboxOpen={hakuhoLightboxSrc !== null}
          hakuhoLightboxOpenRef={hakuhoLightboxOpenRef}
          onOpenHakuhoLightbox={openHakuhoLightbox}
          rabbitBannerRef={rabbitBannerRef}
          compactLayoutMode="videoWallPercent"
        />
        <HakuhoLightbox src={hakuhoLightboxSrc} onClose={closeHakuhoLightbox} />
        <div
          ref={heroCardShellRef}
          className="absolute z-30 reveal-up top-32 left-1/2 -translate-x-1/2 w-[92vw] max-w-[600px] pointer-events-none [&_*]:pointer-events-none"
        >
          <HeroContent />
        </div>
        <div
          ref={rabbitBannerRef}
          className="pointer-events-none absolute bottom-0 w-full z-40"
        >
          <RabbitBanner sponsors={sponsors} displayMode={displayMode} />
        </div>
      </section>
    );
  }

  // ========== 原有图片 + 4 帧轮播模式 ==========
  const CHAR_Y = 1300;
  const CHAR_SIZE = 750;
  const WORLD_W = 5440;
  const WORLD_H = 3136;
  const CHAR_X = (WORLD_W - CHAR_SIZE) / 2;

  return (
    <section
      ref={heroSectionRef}
      className="relative w-full h-screen overflow-hidden bg-sumo-bg shadow-[0_4px_30px_-12px_rgba(0,0,0,0.15)]"
    >
      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <image href="/images/hero/bg.webp" width={WORLD_W} height={WORLD_H} x="0" y="0" />
        <image
          href="/images/hero/l1.webp"
          x={CHAR_X}
          y={CHAR_Y}
          width={CHAR_SIZE}
          height={CHAR_SIZE}
          className={`transition-opacity duration-300 ${frameIndex === 0 ? "opacity-100" : "opacity-0"}`}
        />
        <image
          href="/images/hero/l2.webp"
          x={CHAR_X}
          y={CHAR_Y}
          width={CHAR_SIZE}
          height={CHAR_SIZE}
          className={`transition-opacity duration-300 ${frameIndex === 1 ? "opacity-100" : "opacity-0"}`}
        />
        <image
          href="/images/hero/r1.webp"
          x={CHAR_X}
          y={CHAR_Y}
          width={CHAR_SIZE}
          height={CHAR_SIZE}
          className={`transition-opacity duration-300 ${frameIndex === 2 ? "opacity-100" : "opacity-0"}`}
        />
        <image
          href="/images/hero/r2.webp"
          x={CHAR_X}
          y={CHAR_Y}
          width={CHAR_SIZE}
          height={CHAR_SIZE}
          className={`transition-opacity duration-300 ${frameIndex === 3 ? "opacity-100" : "opacity-0"}`}
        />
      </svg>

      <HeroHakuhoSidePanels
        heroCardShellRef={heroCardShellRef}
        heroSectionRef={heroSectionRef}
        hakuhoLightboxOpen={hakuhoLightboxSrc !== null}
        hakuhoLightboxOpenRef={hakuhoLightboxOpenRef}
        onOpenHakuhoLightbox={openHakuhoLightbox}
        rabbitBannerRef={rabbitBannerRef}
      />
      <HakuhoLightbox src={hakuhoLightboxSrc} onClose={closeHakuhoLightbox} />

      <div
        ref={heroCardShellRef}
        className="absolute z-30 reveal-up top-32 left-1/2 -translate-x-1/2 w-[92vw] max-w-[600px] pointer-events-none [&_*]:pointer-events-none"
      >
        <HeroContent />
      </div>
      <div
        ref={rabbitBannerRef}
        className="pointer-events-none absolute bottom-0 w-full z-40"
      >
        <RabbitBanner sponsors={sponsors} displayMode={displayMode} />
      </div>
    </section>
  );
};

export default Hero;