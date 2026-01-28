import type { Metadata } from "next";
import {
    Noto_Serif_JP,
    Noto_Sans_JP,
    Cormorant_Garamond,
} from "next/font/google";
import "./globals.css";

// 配置字体: Noto Serif JP (标题/重点 - 衬线体)
const notoSerif = Noto_Serif_JP({
    subsets: ["latin"],
    weight: ["400", "700", "900"],
    variable: "--font-noto-serif",
});

// 配置字体: Noto Sans JP (正文 - 无衬线)
const notoSans = Noto_Sans_JP({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-noto-sans",
});

// 配置字体: Cormorant Garamond (英文数字装饰)
const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-cormorant",
});

export const metadata: Metadata = {
    title: "SUMOME | 全国相撲クラブ検索",
    description: "未来の横綱を、ここから。",
};

// 根布局只保留 html 和 body
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body
                className={`${notoSerif.variable} ${notoSans.variable} ${cormorant.variable} font-sans bg-sumo-bg text-sumo-text antialiased selection:bg-sumo-brand selection:text-white`}
            >
                {children}
            </body>
        </html>
    );
}