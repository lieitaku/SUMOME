/**
 * reCAPTCHA v3 开关与 site key（客户端与服务端共用）。
 * - 网域无效：在 Google Admin 为密钥添加当前站点域名，见 docs/vercel.md。
 * - 预览/临时关闭：设 NEXT_PUBLIC_RECAPTCHA_DISABLED=1（勿用于生产，除非接受无验证码）。
 */

export function isRecaptchaDisabled(): boolean {
  const v = process.env.NEXT_PUBLIC_RECAPTCHA_DISABLED?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/** 未禁用且配置了 key 时返回 site key，否则 undefined */
export function getRecaptchaSiteKeyResolved(): string | undefined {
  if (isRecaptchaDisabled()) return undefined;
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();
  return key || undefined;
}

export function isRecaptchaSiteKeyConfiguredResolved(): boolean {
  return Boolean(getRecaptchaSiteKeyResolved());
}
