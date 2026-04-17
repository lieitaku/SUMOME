"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

const Z_LIGHTBOX = 100;
const BLUR_PX = 12;
/** motion 的 Target 只接受 CSSStyleDeclaration 中的键，不含 WebkitBackdropFilter；用变量同时驱动两类 backdrop-filter */
const BLUR_CSS_VAR = "--hakuho-backdrop-blur" as const;
const OVERLAY = "rgba(0, 0, 0, 0.32)";
/** 遮罩 + 模糊略长于内容，避免「糊一下贴上」的突兀感 */
const BACKDROP_DURATION_S = 0.52;
const CONTENT_DURATION_S = 0.38;
const CONTENT_DELAY_S = 0.06;
const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** 大图限制在视口内（4 的倍数）；勿对 img 做 scale 动画，否则 transform 会突破 max-* 造成裁切外溢 */
/** 与外层 p-16（64px×2）一起保证不贴边、不溢出 */
const LIGHTBOX_MAX_W_PX = 720;
const LIGHTBOX_MAX_H_PX = 720;
const LIGHTBOX_EDGE_PAD_PX = 128;

type HakuhoLightboxProps = {
  src: string | null;
  onClose: () => void;
};

/**
 * 白鹏大图：Portal 挂 body，原图 object-contain 限框（不拉伸缩略图），周边弱化 + backdrop-blur。
 */
export function HakuhoLightbox({ src, onClose }: HakuhoLightboxProps) {
  const t = useTranslations("Home");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!src) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [src, onClose]);

  useEffect(() => {
    if (!src) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [src]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {src ? (
        <motion.div
          key={src}
          className="fixed inset-0 flex cursor-default items-center justify-center p-16"
          style={{
            zIndex: Z_LIGHTBOX,
            backdropFilter: `blur(var(${BLUR_CSS_VAR}, 0px))`,
            WebkitBackdropFilter: `blur(var(${BLUR_CSS_VAR}, 0px))`,
          }}
          role="dialog"
          aria-modal="true"
          aria-label={t("hakuhoLightboxAria")}
          initial={{
            backgroundColor: "rgba(0, 0, 0, 0)",
            [BLUR_CSS_VAR]: "0px",
          }}
          animate={{
            backgroundColor: OVERLAY,
            [BLUR_CSS_VAR]: `${BLUR_PX}px`,
          }}
          exit={{
            backgroundColor: "rgba(0, 0, 0, 0)",
            [BLUR_CSS_VAR]: "0px",
          }}
          transition={{
            duration: BACKDROP_DURATION_S,
            ease: EASE_SMOOTH,
          }}
          onClick={onClose}
        >
          <motion.div
            className="relative z-10 flex cursor-pointer items-center justify-center"
            style={{
              pointerEvents: "auto",
              maxWidth: `min(calc(100vw - ${LIGHTBOX_EDGE_PAD_PX}px), ${LIGHTBOX_MAX_W_PX}px)`,
              maxHeight: `min(calc(100dvh - ${LIGHTBOX_EDGE_PAD_PX}px), ${LIGHTBOX_MAX_H_PX}px)`,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{
              duration: CONTENT_DURATION_S,
              delay: CONTENT_DELAY_S,
              ease: EASE_SMOOTH,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            role="presentation"
          >
            <img
              src={src}
              alt=""
              draggable={false}
              className="max-h-full max-w-full select-none rounded-sm object-contain"
              style={{
                width: "auto",
                height: "auto",
                touchAction: "manipulation",
                WebkitTouchCallout: "none",
              }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
