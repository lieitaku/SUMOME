"use client";

import { useEffect, useState } from "react";
import { getRecaptchaSiteKey } from "@/lib/recaptcha-client";
import { isRecaptchaSiteKeyConfiguredResolved } from "@/lib/recaptcha-config";

const SCRIPT_ID = "google-recaptcha-v3";

/**
 * 在联系页挂载时加载 reCAPTCHA v3；卸载时移除脚本与徽章。
 * （否则 Next.js 客户端路由下脚本不卸载，徽章会残留在 body，其它页面也会看到。）
 */
export function useRecaptchaLoader() {
  const siteKey = getRecaptchaSiteKey();
  const [ready, setReady] = useState(!isRecaptchaSiteKeyConfiguredResolved());

  useEffect(() => {
    if (!siteKey) {
      setReady(true);
      return;
    }

    const markReady = () => {
      window.grecaptcha?.ready(() => setReady(true));
    };

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.onload = markReady;
      script.onerror = () => setReady(false);
      document.head.appendChild(script);
    } else {
      markReady();
    }

    return () => {
      document.getElementById(SCRIPT_ID)?.remove();
      document.querySelectorAll(".grecaptcha-badge").forEach((el) => el.remove());
    };
  }, [siteKey]);

  return { ready };
}
