/**
 * Normalize club contact URLs from DB (handle-only, full URL, missing scheme, etc.)
 * so public <a href> resolves correctly.
 */

/** Strip BOM / zero-width chars / outer quotes (CSV or fat-finger paste). */
function trimToNull(s: string | null | undefined): string | null {
  if (s == null) return null;
  let t = s
    .trim()
    .replace(/[\u200B-\u200D\uFEFF\u2060]/g, "");
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    t = t.slice(1, -1).trim();
  }
  return t === "" ? null : t;
}

/** `//example.com/foo` → `https://example.com/foo` */
function withHttpsSchemeIfProtocolRelative(t: string): string {
  if (t.startsWith("//")) return `https:${t}`;
  return t;
}

function looksLikeHttpUrl(t: string): boolean {
  return /^https?:\/\//i.test(t);
}

function validateHttpUrl(href: string): string | null {
  try {
    const u = new URL(href);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (!u.hostname || u.hostname.length < 1) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function clubWebsiteHref(raw: string | null | undefined): string | null {
  const t0 = trimToNull(raw);
  if (!t0) return null;
  if (/^mailto:/i.test(t0) || /^tel:/i.test(t0)) return t0;
  let t = withHttpsSchemeIfProtocolRelative(t0);
  // Collapse mistaken double scheme (paste error)
  t = t.replace(/^https?:\/\/+https?:\/\//i, "https://");
  if (!looksLikeHttpUrl(t)) t = `https://${t.replace(/^\/+/, "")}`;
  return validateHttpUrl(t);
}

export function clubInstagramHref(raw: string | null | undefined): string | null {
  const t0 = trimToNull(raw);
  if (!t0) return null;
  let t = withHttpsSchemeIfProtocolRelative(t0);
  if (looksLikeHttpUrl(t)) return validateHttpUrl(t);
  let s = t.replace(/^@+/, "");
  s = s.replace(/^(www\.)?instagram\.com\/?/i, "").replace(/^\/+/, "");
  const handle = s.split("/")[0]?.split("?")[0]?.replace(/\/+$/, "") ?? "";
  if (!handle) return null;
  return validateHttpUrl(`https://instagram.com/${handle}`);
}

export function clubTwitterHref(raw: string | null | undefined): string | null {
  const t0 = trimToNull(raw);
  if (!t0) return null;
  let t = withHttpsSchemeIfProtocolRelative(t0);
  if (looksLikeHttpUrl(t)) return validateHttpUrl(t);
  let s = t.replace(/^@+/, "");
  s = s.replace(/^(www\.)?(twitter\.com|x\.com)\/?/i, "").replace(/^\/+/, "");
  const handle = s.split("/")[0]?.split("?")[0]?.replace(/\/+$/, "") ?? "";
  if (!handle) return null;
  return validateHttpUrl(`https://twitter.com/${handle}`);
}

export function clubFacebookHref(raw: string | null | undefined): string | null {
  const t0 = trimToNull(raw);
  if (!t0) return null;
  let t = withHttpsSchemeIfProtocolRelative(t0);
  if (looksLikeHttpUrl(t)) return validateHttpUrl(t);
  let s = t.replace(/^@+/, "");
  s = s.replace(/^(www\.)?facebook\.com\/?/i, "").replace(/^\/+/, "");
  if (!s) return null;
  return validateHttpUrl(`https://www.facebook.com/${s}`);
}

/** rel for external anchors (see ExternalUrlAnchor) */
export const clubExternalLinkRel = "noopener noreferrer" as const;
