import { headers } from "next/headers";
import { getPreview } from "@/lib/preview-store";
import { PREVIEW_ID_HEADER } from "@/lib/preview-constants";

export { PREVIEW_COOKIE_NAME, PREVIEW_ID_HEADER } from "@/lib/preview-constants";

/**
 * Read preview payload：preview_id 由 middleware 从 cookie 写入 {@link PREVIEW_ID_HEADER}。
 * RSC 内不调用 cookies()，仅读 headers；无预览时不打 DB。
 */
export async function getPreviewPayload(): Promise<{
    type: string;
    redirectPath: string;
    payload: unknown;
} | null> {
    const headersList = await headers();
    const id = headersList.get(PREVIEW_ID_HEADER);
    if (!id) return null;
    const stored = await getPreview(id);
    if (!stored) return null;
    return {
        type: stored.type,
        redirectPath: stored.redirectPath,
        payload: stored.payload,
    };
}
