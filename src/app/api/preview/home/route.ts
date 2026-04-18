import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPreview } from "@/lib/preview-store";
import { PREVIEW_COOKIE_NAME } from "@/lib/preview";

export const dynamic = "force-dynamic";

/** 轻量端点：仅判断当前 session 是否有针对首页的预览。 */
export async function GET() {
    const cookieStore = await cookies();
    const previewId = cookieStore.get(PREVIEW_COOKIE_NAME)?.value;

    if (!previewId) {
        return NextResponse.json({ isPreview: false });
    }

    const stored = await getPreview(previewId);
    if (!stored) {
        return NextResponse.json({ isPreview: false });
    }

    const isHome =
        stored.redirectPath === "/" ||
        stored.redirectPath === "" ||
        stored.type === "banner_single";

    return NextResponse.json({ isPreview: isHome });
}
