"use client";

/** 与 NEXT_PUBLIC_RECAPTCHA_SITE_KEY 一致，供客户端 execute 使用 */
export function getRecaptchaSiteKey(): string | undefined {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
}

export function isRecaptchaSiteKeyConfigured(): boolean {
  return Boolean(getRecaptchaSiteKey());
}

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}

/**
 * 在已通过 grecaptcha.ready 可用后调用：获取 v3 token（无可见勾选框）。
 */
export async function executeRecaptcha(
  action: string,
): Promise<string | null> {
  const siteKey = getRecaptchaSiteKey();
  if (!siteKey || typeof window === "undefined") {
    return null;
  }
  const g = window.grecaptcha;
  if (!g?.execute) {
    return null;
  }
  return new Promise((resolve) => {
    g.ready(async () => {
      try {
        const token = await g.execute(siteKey, { action });
        resolve(token);
      } catch {
        resolve(null);
      }
    });
  });
}
