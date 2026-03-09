import { NextRequest, NextResponse } from "next/server";
import { getPreview } from "@/lib/preview-store";

const PREVIEW_COOKIE = "preview_id";
const COOKIE_MAX_AGE = 300;

/**
 * iframe 预览桥接：在 iframe 内先请求此 URL，服务端设置 preview_id cookie 后 200 返回 HTML，
 * 通过 meta refresh 触发客户端跳转。浏览器会先处理 Set-Cookie 再跳转，避免 302 时 Set-Cookie
 * 在某些浏览器中不被正确应用的已知问题。
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const path = searchParams.get("path");
    if (!id || !path || !path.startsWith("/")) {
        return NextResponse.json({ error: "id and path required" }, { status: 400 });
    }
    const stored = await getPreview(id);
    if (!stored) {
        return NextResponse.json({ error: "Preview expired or not found" }, { status: 404 });
    }
    const pathWithEmbedded = path + (path.includes("?") ? "&" : "?") + "embedded=1";
    const targetUrl = new URL(pathWithEmbedded, request.url).toString();
    const escapedUrl = targetUrl.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${escapedUrl}"></head><body>Redirecting...</body></html>`;
    const res = new NextResponse(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
    });
    res.cookies.set(PREVIEW_COOKIE, id, {
        httpOnly: true,
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
    return res;
}
