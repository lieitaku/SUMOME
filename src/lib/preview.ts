import { cookies } from "next/headers";
import { getPreview } from "@/lib/preview-store";

export const PREVIEW_COOKIE_NAME = "preview_id";

/**
 * Read preview payload from cookie.
 * 使用 getPreview 而非 consume，避免同一页面多次请求（如文档 + RSC）时只有第一次拿到 payload。
 * 过期由 store 的 TTL 清理。
 */
export async function getPreviewPayload(): Promise<{
    type: string;
    redirectPath: string;
    payload: unknown;
} | null> {
    const cookieStore = await cookies();
    const id = cookieStore.get(PREVIEW_COOKIE_NAME)?.value;
    if (!id) return null;
    const stored = getPreview(id);
    if (!stored) return null;
    return {
        type: stored.type,
        redirectPath: stored.redirectPath,
        payload: stored.payload,
    };
}
