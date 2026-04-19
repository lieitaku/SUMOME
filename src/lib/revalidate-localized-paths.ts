import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";

/**
 * next-intl `localePrefix: "as-needed"`：デフォルト言語はプレフィックスなし、その他は `/{locale}/...`。
 * `revalidatePath("/clubs/...")` だけでは `/en/clubs/...` の RSC キャッシュが残ることがあるため、両方を無効化する。
 */
export function revalidateLocalizedPath(pathWithoutLocale: string): void {
  const path = pathWithoutLocale.startsWith("/") ? pathWithoutLocale : `/${pathWithoutLocale}`;
  revalidatePath(path);
  for (const loc of routing.locales) {
    if (loc === routing.defaultLocale) continue;
    revalidatePath(`/${loc}${path}`);
  }
}
