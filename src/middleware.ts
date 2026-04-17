import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";
import { PREVIEW_COOKIE_NAME, PREVIEW_ID_HEADER } from "@/lib/preview-constants";

const handleI18nRouting = createMiddleware(routing);

function getLocaleFromPath(pathname: string): "ja" | "en" {
    if (pathname === "/en" || pathname.startsWith("/en/")) {
        return "en";
    }
    return "ja";
}

/** `/en/...` を除いたパス（middleware 段階の URL は next-intl 済み） */
function stripEnPrefix(pathname: string): string {
    if (pathname === "/en") return "/";
    if (pathname.startsWith("/en/")) return pathname.slice(3);
    return pathname;
}

function loginUrl(request: NextRequest, locale: "ja" | "en"): URL {
    const path = locale === "en" ? "/en/manager/login" : "/manager/login";
    return new URL(path, request.url);
}

function adminMagazinesUrl(request: NextRequest, locale: "ja" | "en"): URL {
    const path = locale === "en" ? "/en/admin/magazines" : "/admin/magazines";
    return new URL(path, request.url);
}

function copyCookies(from: NextResponse, to: NextResponse) {
    from.cookies.getAll().forEach(({ name, value, ...options }) => {
        to.cookies.set(name, value, options);
    });
}

export async function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    const previewId = request.cookies.get(PREVIEW_COOKIE_NAME)?.value;
    if (previewId) {
        requestHeaders.set(PREVIEW_ID_HEADER, previewId);
    }
    const requestWithPreview = new NextRequest(request.url, {
        headers: requestHeaders,
    });

    const intlResponse = handleI18nRouting(requestWithPreview);

    if (intlResponse.headers.get("location")) {
        return intlResponse;
    }

    const pathname = request.nextUrl.pathname;
    const locale = getLocaleFromPath(pathname);
    const normalizedPath = stripEnPrefix(pathname);

    const isAdminPath = normalizedPath.startsWith("/admin");
    const isManagerLoginPath = normalizedPath.startsWith("/manager/login");

    /** 公开页不需要会话：跳过 Supabase，降低 TTFB / FCP（Speed Insights 主要瓶颈之一） */
    if (!isAdminPath && !isManagerLoginPath) {
        return intlResponse;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return intlResponse;
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) =>
                    request.cookies.set(name, value)
                );
                cookiesToSet.forEach(({ name, value, options }) =>
                    intlResponse.cookies.set(name, value, options)
                );
            },
        },
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (isAdminPath && !user) {
        const redirectRes = NextResponse.redirect(loginUrl(request, locale));
        copyCookies(intlResponse, redirectRes);
        return redirectRes;
    }

    if (isManagerLoginPath && user) {
        const redirectRes = NextResponse.redirect(adminMagazinesUrl(request, locale));
        copyCookies(intlResponse, redirectRes);
        return redirectRes;
    }

    if (user?.email) {
        intlResponse.headers.set("x-user-email", user.email);
    }

    return intlResponse;
}

export const config = {
    matcher: [
        // 排除静态资源与 Rive（.riv）；否则 intl 中间件可能改写请求，Rive 会得到非二进制正文 → Console「Bad header」
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|riv|wasm|webm|mp4|m4v|mov|ogv|ogg|woff2|webmanifest)$).*)",
    ],
};
