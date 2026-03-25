import type { Metadata } from "next";
// 1. 引入字体加载器
import {
    Noto_Serif_JP,
    Noto_Sans_JP,
    Cormorant_Garamond,
} from "next/font/google";
// 2. 引入全局样式
import "./globals.css";
// 3. 引入转场动画上下文和加载组件
import { TransitionProvider } from "@/context/TransitionContext";
import PageLoader from "@/components/ui/PageLoader";

// ----------------------------------------------------------------------
// 字体配置区域
// ----------------------------------------------------------------------

// 标题/重点字体 (衬线体 - 庄重感)
const notoSerif = Noto_Serif_JP({
    subsets: ["latin"],
    weight: ["400", "700", "900"],
    variable: "--font-noto-serif",
    display: "swap", // 优化加载策略
});

// 正文字体 (无衬线体 - 易读性)
const notoSans = Noto_Sans_JP({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-noto-sans",
    display: "swap",
});

// 英文/数字装饰字体 (优雅感)
const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-cormorant",
    display: "swap",
});

// 更新图标后递增，便于浏览器与 CDN 跳过旧缓存
const FAVICON_VERSION = "6";

/**
 * Next.js 会把 metadata 里的相对路径（如 /favicon.ico）按 metadataBase 拼成绝对 URL。
 * 若开发环境仍用线上域名，本地访问 localhost 时标签图标会去拉线上的 favicon，永远像「旧图标」。
 */
function getMetadataBase(): URL {
    if (process.env.NODE_ENV === "development") {
        const port = process.env.PORT || "3000";
        const protocol = process.env.__NEXT_EXPERIMENTAL_HTTPS ? "https" : "http";
        return new URL(`${protocol}://localhost:${port}`);
    }
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
    if (envUrl) {
        try {
            return new URL(envUrl);
        } catch {
            /* ignore */
        }
    }
    if (process.env.VERCEL_URL) {
        return new URL(`https://${process.env.VERCEL_URL}`);
    }
    return new URL("https://www.memory-sumo.com");
}

// ----------------------------------------------------------------------
// 元数据配置
// ----------------------------------------------------------------------
export const metadata: Metadata = {
    metadataBase: getMetadataBase(),
    verification: {
        google: "0hQ6bhAEpUdJ_Knewca79UXs6SunCcR-CdcNelcNHJA",
    },
    title: {
        default: "SUMOME（すもめ／スモメ）| 全国の相撲クラブ検索・アマチュア相撲情報",
        template: "%s | SUMOME（すもめ）",
    },
    description:
        "SUMOME（すもめ／スモメ）は、全国のアマチュア相撲クラブを検索できるポータルサイトです。相撲クラブの情報、フォトブック、スポーツイベント情報を掲載。未来の横綱を、ここから。",
    keywords: [
        "すもめ",
        "スモメ",
        "SUMOME",
        "相撲クラブ",
        "アマチュア相撲",
        "相撲教室",
        "相撲",
        "キッズ相撲",
        "少年相撲",
        "相撲クラブ検索",
        "全国相撲",
    ],
    // 图标必须在 <head> 里用「根相对路径」写死，勿用 metadata.icons：
    // Next 会把 metadata 里的路径按 metadataBase 拼成绝对 URL，易导致本地/预览仍指向线上旧 favicon。
    openGraph: {
        title: "SUMOME（すもめ）| 全国の相撲クラブ検索・アマチュア相撲情報",
        description:
            "全国のアマチュア相撲クラブを検索できるポータルサイト。クラブ情報、フォトブック、イベント情報を掲載。未来の横綱を、ここから。",
        url: "https://www.memory-sumo.com",
        siteName: "SUMOME",
        type: "website",
        locale: "ja_JP",
    },
    twitter: {
        card: "summary_large_image",
        title: "SUMOME（すもめ）| 全国の相撲クラブ検索",
        description:
            "全国のアマチュア相撲クラブを検索できるポータルサイト。未来の横綱を、ここから。",
    },
    alternates: {
        canonical: "https://www.memory-sumo.com",
    },
};

// ----------------------------------------------------------------------
// 根布局组件 (Root Layout)
// ----------------------------------------------------------------------
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const v = FAVICON_VERSION;
    return (
        <html lang="ja">
            <head>
                {/*
                  Safari 会单独缓存「页面 URL ↔ favicon」，并常先探测根路径 /favicon.ico（无查询串易命中旧图）。
                  第一条必须是带版本号的 /favicon.ico，再跟 PNG / 备用 ico。
                */}
                <link
                    rel="icon"
                    type="image/x-icon"
                    href={`/favicon.ico?v=${v}`}
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="96x96"
                    href={`/icons/favicon-96x96.png?v=${v}`}
                />
                <link
                    rel="icon"
                    type="image/x-icon"
                    href={`/icons/sumo-favicon.ico?v=${v}`}
                    sizes="48x48"
                />
                <link rel="shortcut icon" href={`/icons/sumo-favicon.ico?v=${v}`} />
                <link rel="apple-touch-icon" href={`/icons/apple-touch-icon.png?v=${v}`} />
                <link rel="manifest" href={`/site.webmanifest?v=${v}`} />
            </head>
            <body
                // 组合所有字体变量和全局基础样式
                className={`${notoSerif.variable} ${notoSans.variable} ${cormorant.variable} font-sans bg-sumo-bg text-sumo-text antialiased selection:bg-sumo-brand selection:text-white`}
            >
                {/* TransitionProvider 包裹所有内容，
            确保 TransitionContext 在整个应用中可用 
        */}
                <TransitionProvider>
                    {/* 全局加载遮罩 (PageLoader)：平时隐藏，路由跳转时触发“迷雾”效果 */}
                    <PageLoader />

                    {/* 页面主体内容 */}
                    {children}
                </TransitionProvider>
            </body>
        </html>
    );
}