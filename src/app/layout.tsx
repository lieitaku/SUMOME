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

// ----------------------------------------------------------------------
// 元数据配置
// ----------------------------------------------------------------------
export const metadata: Metadata = {
    metadataBase: new URL("https://memory-sumo.com"),
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
    icons: { icon: "/icon.svg" },
    openGraph: {
        title: "SUMOME（すもめ）| 全国の相撲クラブ検索・アマチュア相撲情報",
        description:
            "全国のアマチュア相撲クラブを検索できるポータルサイト。クラブ情報、フォトブック、イベント情報を掲載。未来の横綱を、ここから。",
        url: "https://memory-sumo.com",
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
        canonical: "https://memory-sumo.com",
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
    return (
        <html lang="ja">
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