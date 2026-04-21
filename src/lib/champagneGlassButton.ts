import type { CSSProperties } from "react";

/** 登录页 Hero 与 ChampagneGlassLink 共用的香槟玻璃胶囊样式 */
export const CHAMPAGNE_GLASS_BUTTON_STYLE: CSSProperties = {
  backgroundColor: "rgba(193, 161, 78, 0.75)",
  borderColor: "rgba(193, 161, 78, 0.5)",
  borderWidth: "1px",
  borderStyle: "solid",
  boxShadow: "0 3px 8px -2px rgba(193, 161, 78, 0.1)",
};

export const CHAMPAGNE_GLASS_LINK_CLASS =
  "inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md rounded-full transition-all duration-200 ease-in-out text-white group hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";

export const CHAMPAGNE_GLASS_BUTTON_CLASS =
  "inline-flex items-center gap-2 px-4 py-2 backdrop-blur-md rounded-full transition-all duration-200 ease-in-out text-white group hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";
