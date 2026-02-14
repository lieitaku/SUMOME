import { cookies } from "next/headers";
import { consumePreview } from "@/lib/preview-store";

export const PREVIEW_COOKIE_NAME = "preview_id";

/**
 * Read preview payload from cookie (one-time use).
 * Returns { type, redirectPath, payload } or null if missing/expired.
 */
export async function getPreviewPayload(): Promise<{
    type: string;
    redirectPath: string;
    payload: unknown;
} | null> {
    const cookieStore = await cookies();
    const id = cookieStore.get(PREVIEW_COOKIE_NAME)?.value;
    if (!id) return null;
    const stored = consumePreview(id);
    if (!stored) return null;
    return {
        type: stored.type,
        redirectPath: stored.redirectPath,
        payload: stored.payload,
    };
}
