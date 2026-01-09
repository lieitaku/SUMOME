"use client";

import React from "react";
import { Star, Mail } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 内部组件：FooterLink
 * ------------------------------------------------------------------
 * 优化点：
 * 1. 悬停时文字变红 (sumo-red)。
 * 2. 增加微小的右移位移动画 (translate-x-1)，增加灵动感。
 * 3. 左侧的小红点保持，作为视觉引导。
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
    className="relative group flex items-center hover:text-sumo-red transition-all duration-300"
  >
    {/* 装饰点：悬停时浮现 */}
    <span className="absolute -left-3 w-1 h-1 bg-sumo-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    {/* 文字：悬停时微右移 */}
    <span className="group-hover:translate-x-1 transition-transform duration-300">
      {children}
    </span>
  </Link>
);

const Footer = () => {
  return (
    // 背景色改为淡米色 (off-white)，更像纸张
    <footer className="bg-[#faf9f6] text-sumo-dark pt-24 pb-12 relative overflow-hidden border-t border-gray-100">
      {/* 1. 背景纹理层 (CSS 模拟纸张质感) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* 装饰：顶部渐变阴影，增加层次感 */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent opacity-60 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
          {/* --- 左侧：品牌信息 --- */}
          <div className="md:w-1/3">
            <div className="flex items-center gap-4 mb-6">
              {/* 品牌色竖线 (Blue) */}
              <div className="w-1 h-8 bg-sumo-brand"></div>
              <h2 className="text-3xl font-serif font-black tracking-[0.1em] text-sumo-dark">
                SUMOME
              </h2>
            </div>

            <p className="text-sm text-gray-500 mb-8 leading-loose font-medium font-sans">
              相撲クラブ検索・応援プラットフォーム
              <br />
              <span className="text-xs opacity-70 mt-2 block">
                Connecting the spirits of Sumo to the future.
              </span>
            </p>

            <div className="flex gap-3">
              {[Star, Mail].map((Icon, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:bg-sumo-brand hover:border-sumo-brand hover:text-white transition-all duration-300 cursor-pointer group shadow-sm"
                >
                  <Icon
                    size={16}
                    className="group-hover:scale-110 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* --- 右侧：Sitemap (Grid Layout) --- */}
          {/* 增加 font-serif 给标题，营造“目录”感 */}
          <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
            {/* Column 1 */}
            <div>
              {/* 标题颜色更新为 Brand Blue，字体改为衬线体 */}
              <h4 className="font-serif font-bold text-sumo-brand mb-6 tracking-widest text-xs uppercase border-b border-sumo-brand/10 pb-2 inline-block">
                SITEMAP
              </h4>
              <ul className="space-y-4 text-gray-500 font-medium">
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
                  <FooterLink href="/activities">イベント一覧</FooterLink>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="font-serif font-bold text-sumo-brand mb-6 tracking-widest text-xs uppercase border-b border-sumo-brand/10 pb-2 inline-block">
                FOR MANAGERS
              </h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li>
                  <FooterLink href="/manager/entry">
                    新規掲載登録（無料）
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/manager/login">
                    管理画面ログイン
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/magazines">
                    フォトブックについて
                  </FooterLink>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="font-serif font-bold text-sumo-brand mb-6 tracking-widest text-xs uppercase border-b border-sumo-brand/10 pb-2 inline-block">
                SUPPORT
              </h4>
              <ul className="space-y-4 text-gray-500 font-medium">
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
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 border-t border-gray-200/60 uppercase tracking-widest">
          <p className="font-sans">
            &copy; 2025 SUMOME INC. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span className="font-serif italic text-sumo-brand/60 normal-case tracking-normal text-xs">
              Designed by SUMOME Creative
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
