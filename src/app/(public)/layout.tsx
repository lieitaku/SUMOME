import React from "react";
import ScrollRevealProvider from "@/components/layout/ScrollRevealProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";

// 前台布局不需要 html/body，只需要包裹内容
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollRevealProvider>
      <div className="flex flex-col min-h-screen">
        {/* 全局 Header */}
        <Header />

        {/* 页面主体内容 (自动撑开高度) */}
        <main className="flex-grow">
          {children}
        </main>

        {/* 全局 Footer */}
        <Footer />

        {/* 全局回到顶部按钮 */}
        <ScrollToTop />
      </div>
    </ScrollRevealProvider>
  );
}