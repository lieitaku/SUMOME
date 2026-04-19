import { revalidateTag as nextRevalidateTag } from "next/cache";

/** Next.js 16 では `revalidateTag(tag, "max")` の第2引数が推奨 */
export function revalidateTagMax(tag: string) {
  return nextRevalidateTag(tag, "max");
}
