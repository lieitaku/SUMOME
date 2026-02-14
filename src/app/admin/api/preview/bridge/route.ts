import { NextRequest, NextResponse } from "next/server";
import { getPreview } from "@/lib/preview-store";

const PREVIEW_COOKIE = "preview_id";
const COOKIE_MAX_AGE = 300;

/**
 * iframe 预览桥接：在 iframe 内先请求此 URL，服务端设置 preview_id cookie 后 302 到目标页。
 * 这样 iframe 的第二次请求（目标页）会带上 cookie，能正确读到 payload。
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const path = searchParams.get("path");
    if (!id || !path || !path.startsWith("/")) {
        return NextResponse.json({ error: "id and path required" }, { status: 400 });
    }
    const stored = getPreview(id);
    if (!stored) {
        return NextResponse.json({ error: "Preview expired or not found" }, { status: 404 });
    }
    const res = NextResponse.redirect(new URL(path, request.url), 302);
    res.cookies.set(PREVIEW_COOKIE, id, {
        httpOnly: true,
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
    return res;
}
