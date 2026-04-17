"use client";

import { useEffect, useState } from "react";
import {
  getRecaptchaSiteKey,
  isRecaptchaSiteKeyConfigured,
} from "@/lib/recaptcha-client";

const SCRIPT_ID = "google-recaptcha-v3";

/**
 * 在页面挂载时加载 reCAPTCHA v3 脚本；无 site key 时视为已就绪（走开发跳过逻辑）。
 */
export function useRecaptchaLoader() {
  const siteKey = getRecaptchaSiteKey();
  const [ready, setReady] = useState(!isRecaptchaSiteKeyConfigured());

  useEffect(() => {
    if (!siteKey) {
      setReady(true);
      return;
    }

    const markReady = () => {
      window.grecaptcha?.ready(() => setReady(true));
    };

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      markReady();
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.onload = markReady;
    script.onerror = () => setReady(false);
    document.head.appendChild(script);
  }, [siteKey]);

  return { ready };
}
