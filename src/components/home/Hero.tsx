"use client";

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import RabbitBanner from "@/components/home/RabbitBanner/RabbitBannerDynamic";
import type { SponsorItem, BannerDisplayMode } from "@/components/home/RabbitBanner";

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
          <span className="text-[10px] md:text-xs font-bold leading-none">年</span>
          <span className="text-[8px] md:text-[9px] tracking-widest opacity-90 mt-0.5 transform scale-90">始動</span>
        </div>
      </div>
      <div className="flex-grow flex flex-col justify-center px-5 md:px-8 relative min-w-0">
        <div
          className={`relative z-10 flex justify-between gap-2 ${
            narrow ? "flex-col items-start gap-2" : "flex-row items-center gap-0"
          }`}
        >
          <div className="flex items-center gap-3 md:gap-6">
            <h1 className="flex items-center gap-2 md:gap-4 font-serif text-sumo-text leading-none select-none">
              <span className="text-3xl md:text-4xl font-black tracking-tighter text-sumo-red">心</span>
              <span className="w-px h-3 bg-gray-400/50 rotate-12"></span>
              <span className="text-3xl md:text-4xl font-black tracking-tighter text-sumo-red">技</span>
              <span className="w-px h-3 bg-gray-400/50 rotate-12"></span>
              <span className="text-3xl md:text-4xl font-black tracking-tighter text-sumo-red">体</span>
            </h1>
          </div>
          <div
            className={`flex flex-col items-end border-gray-400/30 min-w-0 flex-shrink ${
              narrow ? "border-l-0 pl-0 ml-0 self-end" : "border-l pl-4 md:pl-8 ml-2"
            }`}
          >
            <p
              className="font-serif font-bold text-sumo-text tracking-widest leading-none mb-1 text-right whitespace-nowrap"
              style={{ fontSize: "clamp(0.875rem, 4.2vw, 1.25rem)" }}
            >
              伝統を未来へ
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

type HakuhoViewportKind = "phone" | "tablet" | "desktop";

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
 * 桌面端侧图：相对视口定位（以约 1920×1080 下原 300px / -265px 为基准换算），避免改窗口宽度时绝对像素错位、被裁切。
 * 15.625vw ≈ 300px @1920；-24.5vh ≈ -265px @1080。
 */
const HAKUHO_DESKTOP_SHIFT_X = "clamp(200px, 15.625vw, 360px)";
const HAKUHO_DESKTOP_EDGE_PAD = "clamp(8px, 0.42vw, 16px)";

/** 桌面：与兔子横幅之间的留白（4pt 网格） */
const HAKUHO_DESKTOP_SAFE_GAP_PX = 16;
/**
 * 桌面：白鹏顶边距视口顶的最小距离（仅按胶囊顶栏估算，不随滚动/顶栏展开重算）。
 * 与 Header 非滚动态一致：marginTop 12 + 内层 max-h 80 + 与白鹏间距 16。
 */
const HAKUHO_DESKTOP_PILL_TOP_CLEARANCE_PX = 12 + 80 + 16;
/** 桌面：竖直 translate 的美学范围（与历史 -24.5vh 夹紧一致；更负 = 更靠上） */
const HAKUHO_DESKTOP_TY_AEST_MIN = -300;
const HAKUHO_DESKTOP_TY_AEST_MAX = -200;
const HAKUHO_DESKTOP_TY_VH_RATIO = -0.245;
/** 桌面：再缩小的下限（略缩小） */
const HAKUHO_DESKTOP_SCALE_MIN = 0.55;

/** 桌面侧图 max 尺寸：与 `clamp(100px,11.25vw,216px)` / `clamp(144px,16.25vw,312px)` 等价，供数值缩放 */
function getDesktopHakuhoBaseMaxPx(vw: number): { maxW: number; maxH: number } {
  return {
    maxW: Math.min(216, Math.max(100, (vw * 11.25) / 100)),
    maxH: Math.min(312, Math.max(144, (vw * 16.25) / 100)),
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
 * 平板（iPad 等）：尺寸与位移介于手机与桌面之间；水平位移由紧凑布局动态算 inwardX。
 */
const HAKUHO_SIDE_TABLET: HakuhoSideLayout = {
  maxWidthPx: Math.round(180 * 0.7),
  maxHeightPx: Math.round(260 * 0.7),
  padLeftPx: -100,
  padRightPx: -100,
  nudgeLeft: { x: 0, y: -138 },
  nudgeRight: { x: 0, y: -138 },
  verticalAlign: "center",
  /** 增大可拉开两图；也可配合负的 padLeftPx/padRightPx 外推半区 */
  compactSpreadExtraPx: 0,
};

/**
 * 左右白鹏装饰（手机，宽度 ≤767）——与桌面完全独立，可单独改比例与位置。
 */
const HAKUHO_SIDE_MOBILE: HakuhoSideLayout = {
  maxWidthPx: Math.round(180 * 0.55),
  maxHeightPx: Math.round(260 * 0.55),
  padLeftPx: 8,
  padRightPx: 8,
  /** 水平位移改由视口动态计算（向内收，缩窄两图间距）；Y 仅作基底，实际由卡片底边公式覆盖 */
  nudgeLeft: { x: 0, y: -150 },
  nudgeRight: { x: 0, y: -150 },
  verticalAlign: "center",
};

type HakuhoSideId = "left" | "right";

/** 仅拦系统菜单，不 stopPropagation，避免打断 Pointer 长按链 */
function preventContextMenuOnly(e: React.MouseEvent) {
  e.preventDefault();
}

/** 拦原生拖拽；禁止 stopPropagation，否则部分 WebKit 会提前 pointercancel，导致自定义长按放大永远不触发 */
function preventImgDragOnly(e: React.DragEvent<HTMLImageElement>) {
  e.preventDefault();
}

/** 手机端侧图：长按放大（translate 到视口中心 + scale，仍单张 img） */
const HAKUHO_LONG_PRESS_MS = 280;
/** 缩放上下限：实际倍数由「装入半屏」公式算出后再夹紧 */
const HAKUHO_PINCH_SCALE_MIN = 2.2;
const HAKUHO_PINCH_SCALE_MAX = 5.75;
/** 长按后整图 `object-contain` 适配在视口宽/高的该比例框内（约半屏） */
const HAKUHO_ZOOM_VIEWPORT_FRACTION = 0.5;
/** 长按聚焦：弱化层模糊（px，4 的倍数） */
const HAKUHO_ZOOM_BACKDROP_BLUR_PX = 12;
/** 弱化层底色（略压暗，突出前景照片） */
const HAKUHO_ZOOM_DIM_OVERLAY = "rgba(0,0,0,0.32)";
/** 长按放大时锚点相对视口几何中心再往上（px，4 的倍数） */
const HAKUHO_ZOOM_ANCHOR_UP_PX = 64;
/** 手机：侧图顶边与「心技体」卡片底边的固定间距（视口 px，4 的倍数） */
const HAKUHO_MOBILE_CARD_GAP_PX = 20;
/** 平板：同上，略大以适配较大触控目标与阴影 */
const HAKUHO_TABLET_CARD_GAP_PX = 24;
/** 手机向内平移量 = clamp(round(vw * 比例), min, max) */
const HAKUHO_MOBILE_INWARD_X_VW = 0.6;
const HAKUHO_MOBILE_INWARD_X_MIN = 200;
const HAKUHO_MOBILE_INWARD_X_MAX = 360;
/** 平板：视口更宽，用略低 vw 比例 + 更大上限，避免两图过挤 */
const HAKUHO_TABLET_INWARD_X_VW = 0.34;
const HAKUHO_TABLET_INWARD_X_MIN = 220;
const HAKUHO_TABLET_INWARD_X_MAX = 520;

type HeroHakuhoSidePanelsProps = {
  /** 包裹 HeroContent 的外壳，用于手机端计算侧图与卡片的避让 */
  heroCardShellRef: React.RefObject<HTMLDivElement | null>;
  /** Hero 根 section，用于与卡片、图片在同一坐标系下算垂直位置 */
  heroSectionRef: React.RefObject<HTMLElement | null>;
  /** 底部兔子横幅容器，桌面端用于与白鹏底部避让 */
  rabbitBannerRef: React.RefObject<HTMLDivElement | null>;
};

type DesktopHakuhoLayout = {
  ty: number;
  scale: number;
  baseMaxW: number;
  baseMaxH: number;
};

type MobileHakuhoLayout = { yExtra: number; inwardX: number };

function HeroHakuhoSidePanels({ heroCardShellRef, heroSectionRef, rabbitBannerRef }: HeroHakuhoSidePanelsProps) {
  const hakuhoViewportKind = useHakuhoViewportKind();
  const isCompactHakuho = hakuhoViewportKind !== "desktop";

  const [zoomSide, setZoomSide] = useState<HakuhoSideId | null>(null);
  const [zoomPan, setZoomPan] = useState<{ x: number; y: number } | null>(null);
  const [zoomScale, setZoomScale] = useState(HAKUHO_PINCH_SCALE_MIN);
  const [mobileHakuhoLayout, setMobileHakuhoLayout] = useState<MobileHakuhoLayout>({
    yExtra: 0,
    inwardX: 280,
  });
  const [desktopHakuhoLayout, setDesktopHakuhoLayout] = useState<DesktopHakuhoLayout>(() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1920;
    const vh = typeof window !== "undefined" ? window.innerHeight : 1080;
    const base = getDesktopHakuhoBaseMaxPx(vw);
    const ty = Math.max(
      HAKUHO_DESKTOP_TY_AEST_MIN,
      Math.min(HAKUHO_DESKTOP_TY_AEST_MAX, Math.round(HAKUHO_DESKTOP_TY_VH_RATIO * vh)),
    );
    return { ty, scale: 1, baseMaxW: base.maxW, baseMaxH: base.maxH };
  });
  const leftImgRef = useRef<HTMLImageElement | null>(null);
  const rightImgRef = useRef<HTMLImageElement | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTargetSideRef = useRef<HakuhoSideId | null>(null);
  const zoomSideRef = useRef<HakuhoSideId | null>(null);
  zoomSideRef.current = zoomSide;
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
  const { maxWidthPx, maxHeightPx, padLeftPx, padRightPx, nudgeLeft, nudgeRight, verticalAlign } = sidePreset;

  const isDesktopHakuho = hakuhoViewportKind === "desktop";

  const itemsAlign =
    verticalAlign === "start" ? "items-start" : verticalAlign === "end" ? "items-end" : "items-center";

  const imgBaseStyle: React.CSSProperties = {
    width: "auto",
    height: "auto",
    ...(isDesktopHakuho
      ? {
          maxWidth: Math.round(desktopHakuhoLayout.baseMaxW * desktopHakuhoLayout.scale),
          maxHeight: Math.round(desktopHakuhoLayout.baseMaxH * desktopHakuhoLayout.scale),
          transition: "max-width 200ms ease-in-out, max-height 200ms ease-in-out",
        }
      : {
          maxWidth: maxWidthPx,
          maxHeight: maxHeightPx,
        }),
    objectFit: "contain",
    filter:
      "drop-shadow(0 4px 14px rgba(0,0,0,0.12)) drop-shadow(0 12px 36px rgba(0,0,0,0.18))",
  };

  const leftHalfOuterStyle: React.CSSProperties = isDesktopHakuho
    ? { paddingLeft: HAKUHO_DESKTOP_EDGE_PAD }
    : hakuhoHalfOuterStyle(padLeftPx, "left");

  const rightHalfOuterStyle: React.CSSProperties = isDesktopHakuho
    ? { paddingRight: HAKUHO_DESKTOP_EDGE_PAD }
    : hakuhoHalfOuterStyle(padRightPx, "right");

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
    if (zoomSideRef.current !== null) return;

    const shell = heroCardShellRef.current;
    const section = heroSectionRef.current;
    const imgEl = leftImgRef.current;
    if (!shell || !section || !imgEl) return;

    const card = shell.getBoundingClientRect();
    const sec = section.getBoundingClientRect();
    /**
     * 必须用布局高度，不能用 getBoundingClientRect().height：
     * 长按放大时 img 带 scale(2)，rect 高度会随变换/过渡变化，松手后若立刻重算 yExtra 会得到错误 slotTop，位置会「回不去」。
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
    const inwardX = Math.max(0, inwardRaw - spreadExtra);

    const nudgeYBase = phone ? HAKUHO_SIDE_MOBILE.nudgeLeft.y : HAKUHO_SIDE_TABLET.nudgeLeft.y;
    const cardGap = phone ? HAKUHO_MOBILE_CARD_GAP_PX : HAKUHO_TABLET_CARD_GAP_PX;

    const slotTop = sec.top + (sec.height - imgH) / 2;
    const targetImgTop = Math.ceil(card.bottom) + cardGap;
    const yExtra = Math.round(targetImgTop - slotTop - nudgeYBase);

    const next = { yExtra, inwardX };
    const last = lastAppliedLayoutRef.current;
    if (last.yExtra === next.yExtra && last.inwardX === next.inwardX) return;
    lastAppliedLayoutRef.current = next;
    setMobileHakuhoLayout(next);
  }, [heroCardShellRef, heroSectionRef]);

  const applyDesktopHakuhoLayout = useCallback(() => {
    if (hakuhoKindRef.current !== "desktop") return;
    if (zoomSideRef.current !== null) return;

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

    const base = getDesktopHakuhoBaseMaxPx(vw);
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
  }, [heroSectionRef, rabbitBannerRef]);

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
  }, [isCompactHakuho, hakuhoViewportKind, scheduleMobileHakuhoLayout]);

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
  }, [isDesktopHakuho, scheduleDesktopHakuhoLayout, rabbitBannerRef]);

  const mobileYExtra = isCompactHakuho ? mobileHakuhoLayout.yExtra : 0;
  const mobileInwardX = isCompactHakuho ? mobileHakuhoLayout.inwardX : 0;
  const leftTranslateX = isCompactHakuho ? mobileInwardX : nudgeLeft.x;
  const rightTranslateX = isCompactHakuho ? -mobileInwardX : nudgeRight.x;

  const leftInnerTransform = isDesktopHakuho
    ? `translate(${HAKUHO_DESKTOP_SHIFT_X}, ${desktopHakuhoLayout.ty}px)`
    : `translate(${leftTranslateX}px, ${nudgeLeft.y + mobileYExtra}px)`;

  const rightInnerTransform = isDesktopHakuho
    ? `translate(calc(-1 * ${HAKUHO_DESKTOP_SHIFT_X}), ${desktopHakuhoLayout.ty}px)`
    : `translate(${rightTranslateX}px, ${nudgeRight.y + mobileYExtra}px)`;

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current != null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressTargetSideRef.current = null;
  };

  const onSidePointerDown = (side: HakuhoSideId) => (e: React.PointerEvent<HTMLImageElement>) => {
    if (!isCompactHakuho) return;
    /**
     * 触摸/手写笔：默认长按会被系统拿去出「保存图片」等，常伴随提前 pointercancel。
     * 在可取消阶段 preventDefault，保留我们的 Pointer + 定时长按放大（侧图命中区小，一般不用于拖页滚动）。
     */
    if (e.pointerType === "touch" || e.pointerType === "pen") {
      if (e.cancelable) e.preventDefault();
    }
    if (longPressTimerRef.current != null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressTargetSideRef.current = side;
    longPressTimerRef.current = setTimeout(() => {
      longPressTimerRef.current = null;
      if (longPressTargetSideRef.current !== side) return;
      const el = side === "left" ? leftImgRef.current : rightImgRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const iw = Math.max(rect.width, 1);
      const ih = Math.max(rect.height, 1);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const boxW = vw * HAKUHO_ZOOM_VIEWPORT_FRACTION;
      const boxH = vh * HAKUHO_ZOOM_VIEWPORT_FRACTION;
      const fitScale = Math.min(boxW / iw, boxH / ih);
      const nextScale = Math.min(
        HAKUHO_PINCH_SCALE_MAX,
        Math.max(HAKUHO_PINCH_SCALE_MIN, fitScale),
      );
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const vx = vw / 2;
      const vy = vh / 2 - HAKUHO_ZOOM_ANCHOR_UP_PX;
      setZoomScale(nextScale);
      setZoomPan({
        x: Math.round(vx - cx),
        y: Math.round(vy - cy),
      });
      setZoomSide(side);
    }, HAKUHO_LONG_PRESS_MS);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onSidePointerUpEnd = (e: React.PointerEvent<HTMLImageElement>) => {
    clearLongPressTimer();
    setZoomSide(null);
    setZoomPan(null);
    setZoomScale(HAKUHO_PINCH_SCALE_MIN);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    if (isCompactHakuho) scheduleMobileHakuhoLayout();
  };

  const mobileImgStyle = (side: HakuhoSideId): React.CSSProperties | undefined => {
    if (!isCompactHakuho) return undefined;
    const zoomed = zoomSide === side;
    const panX = zoomed && zoomPan ? zoomPan.x : 0;
    const panY = zoomed && zoomPan ? zoomPan.y : 0;
    const baseFilter = typeof imgBaseStyle.filter === "string" ? imgBaseStyle.filter : "";
    return {
      pointerEvents: "auto",
      /** none：减少浏览器把长按交给系统菜单/拖拽，仍可用 Pointer 实现放大（侧图区域小） */
      touchAction: "none",
      WebkitTouchCallout: "none",
      WebkitUserSelect: "none",
      userSelect: "none",
      transform: zoomed
        ? `translate(${panX}px, ${panY}px) scale(${zoomScale})`
        : "translate(0px, 0px) scale(1)",
      transformOrigin: "center center",
      transition: "transform 200ms ease-in-out, filter 200ms ease-in-out",
      ...(zoomed && baseFilter
        ? { filter: `${baseFilter} brightness(1.06) saturate(1.06)` }
        : {}),
    };
  };

  return (
    <>
      {isCompactHakuho && (
        <div
          className={`absolute inset-0 z-35 pointer-events-none ease-in-out ${
            zoomSide ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transitionDuration: "200ms",
            transitionProperty: "opacity, backdrop-filter, -webkit-backdrop-filter, background-color",
            backgroundColor: zoomSide ? HAKUHO_ZOOM_DIM_OVERLAY : "transparent",
            backdropFilter: zoomSide ? `blur(${HAKUHO_ZOOM_BACKDROP_BLUR_PX}px)` : "blur(0px)",
            WebkitBackdropFilter: zoomSide ? `blur(${HAKUHO_ZOOM_BACKDROP_BLUR_PX}px)` : "blur(0px)",
          }}
          aria-hidden
        />
      )}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 flex w-1/2 ${itemsAlign} justify-start ${
          zoomSide === "left" ? "z-50" : "z-20"
        }`}
        style={leftHalfOuterStyle}
        aria-hidden
      >
        <div
          style={{
            transform: leftInnerTransform,
            transition: isDesktopHakuho ? "transform 200ms ease-in-out" : undefined,
          }}
        >
          <img
            ref={leftImgRef}
            src="/images/hero/hakuho1.webp"
            alt=""
            draggable={false}
            className="select-none object-left rounded-sm"
            style={{ ...imgBaseStyle, ...mobileImgStyle("left") }}
            onLoad={isCompactHakuho ? scheduleMobileHakuhoLayout : scheduleDesktopHakuhoLayout}
            onPointerDown={isCompactHakuho ? onSidePointerDown("left") : undefined}
            onPointerUp={isCompactHakuho ? onSidePointerUpEnd : undefined}
            onPointerCancel={isCompactHakuho ? onSidePointerUpEnd : undefined}
            onContextMenu={isCompactHakuho ? preventContextMenuOnly : undefined}
            onDragStart={isCompactHakuho ? preventImgDragOnly : undefined}
          />
        </div>
      </div>
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 flex w-1/2 ${itemsAlign} justify-end ${
          zoomSide === "right" ? "z-50" : "z-20"
        }`}
        style={rightHalfOuterStyle}
        aria-hidden
      >
        <div
          style={{
            transform: rightInnerTransform,
            transition: isDesktopHakuho ? "transform 200ms ease-in-out" : undefined,
          }}
        >
          <img
            ref={rightImgRef}
            src="/images/hero/hakuho2.webp"
            alt=""
            draggable={false}
            className="select-none object-right rounded-sm"
            style={{ ...imgBaseStyle, ...mobileImgStyle("right") }}
            onLoad={isCompactHakuho ? scheduleMobileHakuhoLayout : scheduleDesktopHakuhoLayout}
            onPointerDown={isCompactHakuho ? onSidePointerDown("right") : undefined}
            onPointerUp={isCompactHakuho ? onSidePointerUpEnd : undefined}
            onPointerCancel={isCompactHakuho ? onSidePointerUpEnd : undefined}
            onContextMenu={isCompactHakuho ? preventContextMenuOnly : undefined}
            onDragStart={isCompactHakuho ? preventImgDragOnly : undefined}
          />
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
  const useVideo = hasAnyPoster && hasAnyVideo;
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
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={effectivePoster}
            alt=""
            draggable={false}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
              videoPlaying ? "opacity-0" : "opacity-100"
            }`}
            aria-hidden
            fetchPriority="high"
            onContextMenu={isHakuhoCompactTouch ? preventContextMenuOnly : undefined}
            onDragStart={isHakuhoCompactTouch ? preventImgDragOnly : undefined}
            style={
              isHakuhoCompactTouch
                ? { WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none" }
                : undefined
            }
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
              aria-hidden
              controlsList="nodownload nofullscreen noremoteplayback"
              disablePictureInPicture
              onContextMenu={isHakuhoCompactTouch ? preventContextMenuOnly : undefined}
              style={isHakuhoCompactTouch ? { WebkitTouchCallout: "none" } : undefined}
            >
              {effectiveWebm && <source src={effectiveWebm} type="video/webm" />}
              {effectiveMp4 && <source src={effectiveMp4} type="video/mp4" />}
            </video>
          )}
        </div>
        <HeroHakuhoSidePanels
          heroCardShellRef={heroCardShellRef}
          heroSectionRef={heroSectionRef}
          rabbitBannerRef={rabbitBannerRef}
        />
        <div
          ref={heroCardShellRef}
          className="absolute z-30 reveal-up top-32 left-1/2 -translate-x-1/2 w-[92vw] max-w-[600px]"
        >
          <HeroContent />
        </div>
        <div ref={rabbitBannerRef} className="absolute bottom-0 w-full z-30">
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
        rabbitBannerRef={rabbitBannerRef}
      />

      <div
        ref={heroCardShellRef}
        className="absolute z-30 reveal-up top-32 left-1/2 -translate-x-1/2 w-[92vw] max-w-[600px]"
      >
        <HeroContent />
      </div>
      <div ref={rabbitBannerRef} className="absolute bottom-0 w-full z-30">
        <RabbitBanner sponsors={sponsors} displayMode={displayMode} />
      </div>
    </section>
  );
};

export default Hero;