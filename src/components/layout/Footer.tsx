import React from "react";
import { Star, Mail } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // 引入合并工具

/**
 * 内部组件：FooterLink
 * ------------------------------------------------------------------
 * 封装了 "小红点悬停特效"，避免在 Footer 主体中重复写大量样式。
 */
const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="relative group block hover:text-sumo-red transition-colors"
  >
    {/* 小红点：默认透明，Hover 时显现 */}
    <span className="absolute -left-3 top-[0.6em] -translate-y-1/2 w-1.5 h-1.5 bg-sumo-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
    {children}
  </Link>
);

const Footer = () => {
  return (
    <footer className="bg-white text-sumo-dark pt-30 pb-10 relative overflow-hidden">
      {/* 1. 背景纹理：使用 opacity-40 营造纸张质感 */}
      {/* 建议改为本地图片: /images/patterns/washi.png */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/washi.png')]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
          {/* --- 左侧：品牌信息 (Logo & Info) --- */}
          <div className="md:w-1/3">
            <div className="flex items-center gap-4 mb-6">
              {/* 装饰竖线 */}
              <div className="w-1 h-8 bg-sumo-gold"></div>
              <h2 className="text-3xl font-serif font-bold tracking-[0.2em] text-sumo-dark">
                SUMOME
              </h2>
            </div>

            <p className="text-sm text-gray-500 mb-8 leading-loose font-medium">
              相撲クラブ検索・応援プラットフォーム
              <br />
              <span className="text-xs opacity-80">
                運営会社：株式会社MEMORY
              </span>
            </p>

            <div className="flex gap-4">
              {/* 社交按钮：封装样式复用 */}
              {[Star, Mail].map((Icon, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-sumo-dark hover:bg-sumo-red hover:border-sumo-red hover:text-white transition-all duration-300 cursor-pointer group shadow-sm"
                >
                  <Icon
                    size={16}
                    className="group-hover:scale-110 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* --- 右侧：Sitemap (Links) --- */}
          <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
            {/* Column 1: SITEMAP */}
            <div>
              <h4 className="font-bold text-sumo-gold mb-6 tracking-widest text-xs uppercase">
                SITEMAP
              </h4>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <FooterLink href="/">トップページ</FooterLink>
                </li>
                <li>
                  <FooterLink href="/clubs">クラブを探す</FooterLink>
                </li>
                <li>
                  <FooterLink href="/about">SUMOMEについて</FooterLink>
                </li>
                <li>
                  <FooterLink href="/activities">活動レポート</FooterLink>
                </li>
              </ul>
            </div>

            {/* Column 2: FOR MANAGERS */}
            <div>
              <h4 className="font-bold text-sumo-gold mb-6 tracking-widest text-xs uppercase">
                FOR MANAGERS
              </h4>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <FooterLink href="/manager">新規掲載登録（無料）</FooterLink>
                </li>
                <li>
                  <FooterLink href="/login">管理画面ログイン</FooterLink>
                </li>
                <li>
                  <FooterLink href="/photobook">
                    フォトブックについて
                  </FooterLink>
                </li>
              </ul>
            </div>

            {/* Column 3: SUPPORT */}
            <div>
              <h4 className="font-bold text-sumo-gold mb-6 tracking-widest text-xs uppercase">
                SUPPORT
              </h4>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <FooterLink href="/contact">お問い合わせ</FooterLink>
                </li>
                <li>
                  <FooterLink href="/terms">利用規約</FooterLink>
                </li>
                <li>
                  <FooterLink href="/privacy">プライバシーポリシー</FooterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- 底部版权 (Copyright) --- */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 border-t border-gray-100">
          <p>&copy; 2025 SUMOME All Rights Reserved.</p>
          <p className="mt-2 md:mt-0 font-serif italic tracking-wider text-gray-400">
            Connecting Sumo Spirits.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
