import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { setPreview } from "@/lib/preview-store";

const PREVIEW_COOKIE = "preview_id";
const COOKIE_MAX_AGE = 300; // 5 minutes

export async function POST(request: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: { type: string; redirectPath: string; payload: unknown };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { type, redirectPath, payload } = body;
    if (!type || typeof redirectPath !== "string" || redirectPath.length === 0) {
        return NextResponse.json({ error: "type and redirectPath required" }, { status: 400 });
    }

    // Normalize path: must start with /
    const path = redirectPath.startsWith("/") ? redirectPath : `/${redirectPath}`;

    const id = crypto.randomUUID().slice(0, 8);
    setPreview(id, type, path, payload);

    const url = new URL(request.url);
    const origin = url.origin;
    const redirectUrl = `${origin}${path}`;
    // 用于 iframe 预览：先打开 bridge，在 iframe 内设置 cookie 再跳转，避免 iframe 不带上父页的 cookie
    const bridgeUrl = `${origin}/admin/api/preview/bridge?id=${encodeURIComponent(id)}&path=${encodeURIComponent(path)}`;

    const res = NextResponse.json({ redirectUrl, previewId: id, bridgeUrl });
    res.cookies.set(PREVIEW_COOKIE, id, {
        httpOnly: true,
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
    return res;
}
