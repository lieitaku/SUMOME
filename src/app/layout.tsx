import type { Metadata } from "next";
import ScrollRevealProvider from "@/components/layout/ScrollRevealProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";

// 引入高级字体
import {
  Noto_Serif_JP,
  Noto_Sans_JP,
  Cormorant_Garamond,
} from "next/font/google";
import "./globals.css";

// 配置字体: Noto Serif JP (标题/重点)
const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-noto-serif",
});

// 配置字体: Noto Sans JP (正文)
const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
});

// 配置字体: Cormorant Garamond (英文/数字装饰)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "SUMOME | 全国相撲クラブ検索",
  description: "未来の横綱を、ここから。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSerif.variable} ${notoSans.variable} ${cormorant.variable} font-sans bg-sumo-bg text-sumo-text`}
      >
        <ScrollRevealProvider>
          {/* 全局 Header: 根据路径自动切换深浅主题 */}
          <Header />

          {/* 页面主体内容 */}
          {children}

          {/* 全局 Footer */}
          <Footer />

          {/* 全局回到顶部按钮 */}
          <ScrollToTop />
        </ScrollRevealProvider>
      </body>
    </html>
  );
}
