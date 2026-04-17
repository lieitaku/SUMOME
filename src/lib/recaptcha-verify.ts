/**
 * Google reCAPTCHA v3 服务端校验。
 * 环境变量：RECAPTCHA_SECRET_KEY（保密）、NEXT_PUBLIC_RECAPTCHA_SITE_KEY（前端加载脚本用）。
 * 创建密钥：https://www.google.com/recaptcha/admin （选择 reCAPTCHA v3）
 */

const DEFAULT_MIN_SCORE = 0.5;

export async function verifyRecaptchaToken(
  token: string | undefined,
): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[reCAPTCHA] RECAPTCHA_SECRET_KEY not set — skipping verification (development only)",
      );
      return true;
    }
    console.error("RECAPTCHA_SECRET_KEY is not set");
    return false;
  }
  if (!token || token.length < 10) {
    return false;
  }

  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? DEFAULT_MIN_SCORE);
  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = (await res.json()) as {
    success?: boolean;
    score?: number;
    action?: string;
    "error-codes"?: string[];
  };

  if (!data.success) {
    return false;
  }
  const score = data.score ?? 0;
  return score >= minScore;
}
