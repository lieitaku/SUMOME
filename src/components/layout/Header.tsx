"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Search, Lock, ChevronRight } from "lucide-react";
import Link from "@/components/ui/TransitionLink";
import { usePathname, useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getPrefectureTheme, DEFAULT_THEME } from "@/lib/prefectureThemes";

/**
 * Header 组件 (最终完美版)
 * 1. 修复：搜索按钮背景色强制跟随主题色。
 * 2. 修复：锁头按钮 Hover 颜色跟随主题色。
 * 3. 保持：Apple 风格丝滑胶囊动画 & 彩虹 Logo。
 */
const Header = () => {
  // --- 1. 状态管理 ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // --- 2. 路由与主题 ---
  const pathname = usePathname();
  const params = useParams();
  const prefSlug = params?.pref as string | undefined;

  // 获取当前地区主题色 (默认为品牌蓝)
  const currentTheme = prefSlug ? getPrefectureTheme(prefSlug) : DEFAULT_THEME;
  const themeColor = currentTheme.color;

  // --- 3. 副作用监听 ---

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 10;
      setIsScrolled((prev) => (prev === next ? prev : next));
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const hideHeaderPaths = ["/manager/login", "/manager/entry"];
  if (hideHeaderPaths.includes(pathname || "")) return null;

  const navItems = [
    { name: "SUMOMEについて", href: "/about" },
    { name: "冊子一覧", href: "/magazines" },
    { name: "イベント", href: "/activities" },
    { name: "お問い合わせ", href: "/contact" },
  ];

  const rainbowColors = [
    "#23ac47",
    "#a35ea3",
    "#2454a4",
    "#df282f",
    "#63bbe2",
    "#f49e15",
  ];

  // --- 4. 样式配置 ---
  const dynamicStyle = {
    "--theme-color": themeColor,
  } as React.CSSProperties;

  return (
    <>
      {/* 🚀 样式注入区域 */}
      <style jsx global>{`
        /* 1. 桌面端：锁头按钮 Hover */
        .login-btn-dynamic:hover {
          background-color: ${themeColor} !important;
          color: white !important;
          border-color: ${themeColor} !important;
        }
        /* 2. 桌面端：导航文字 Hover */
        .nav-item-dynamic:hover {
          color: ${themeColor} !important;
        }
        /* 3. 桌面端：导航下划线 Hover */
        .nav-item-dynamic:hover .nav-underline {
          width: 100% !important;
          background-color: ${themeColor} !important;
        }
        /* 4. 移动端：登录按钮 Hover */
        .mobile-login-btn:hover {
          background-color: ${themeColor} !important;
          border-color: ${themeColor} !important;
          color: white !important;
        }
        
        /* 5. 核心修复：搜索按钮强制背景色 */
        /* 使用 !important 覆盖 Button 组件内部的默认颜色 */
        .search-btn-dynamic {
          background-color: ${themeColor} !important;
          border-color: ${themeColor} !important;
        }
      `}</style>

      {/* 外层定位容器 */}
      <header
        className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none h-auto"
        style={dynamicStyle}
      >
        {/* 内层胶囊容器 - 添加 min-h 和 max-h 防止安卓拉伸 */}
        <div
          className={cn(
            "pointer-events-auto flex items-center justify-between flex-shrink-0",
            "bg-white/95 backdrop-blur-md border border-white/10",
            "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
            "shadow-sm",
            "min-h-[56px] max-h-[80px]"
          )}
          style={{
            width: isScrolled ? "100%" : "95%",
            maxWidth: isScrolled ? "100%" : "1280px",
            marginTop: isScrolled ? "0px" : "12px",
            borderRadius: isScrolled ? "0px" : "50px",
            paddingLeft: isScrolled ? "24px" : "32px",
            paddingRight: isScrolled ? "24px" : "32px",
            paddingTop: "12px",
            paddingBottom: "12px",
            borderBottomColor: isScrolled ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.2)",
          }}
        >

          {/* --- A. Logo 区域（仅 iPad md/lg 缩小，手机与桌面保持原样）--- */}
          <Link
            href="/"
            className="group relative flex items-center gap-2 sm:gap-3 md:gap-2 lg:gap-2.5 xl:gap-4 2xl:gap-4 select-none shrink-0 min-w-0 md:max-w-[min(38%,240px)] lg:max-w-[min(38%,240px)] xl:max-w-none 2xl:max-w-none"
            onClick={() => setMenuOpen(false)}
          >
            {/* SUMOME 文字 - 手机/桌面原样，仅 md/lg 缩小 */}
            <div className="flex items-baseline font-serif font-black text-2xl sm:text-2xl md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl tracking-wider sm:tracking-widest leading-none shrink-0">
              {["S", "U", "M", "O", "M", "E"].map((char, index) => (
                <span
                  key={index}
                  style={{ color: rainbowColors[index % rainbowColors.length] }}
                >
                  {char}
                </span>
              ))}
            </div>

            {/* 分隔线 - 手机/桌面原样，仅 md/lg 缩小 */}
            <span className="h-6 sm:h-6 md:h-4 lg:h-5 xl:h-8 2xl:h-8 w-px bg-gray-200 shrink-0"></span>

            {/* 日语副标题 - 手机/桌面原样，仅 md/lg 缩小 */}
            <div className="flex flex-col justify-center items-start pt-0.5 shrink-0">
              <span className="text-xs sm:text-sm md:text-[9px] lg:text-[10px] xl:text-base 2xl:text-base font-serif font-bold tracking-[0.12em] sm:tracking-[0.15em] md:tracking-[0.1em] lg:tracking-[0.12em] xl:tracking-[0.2em] 2xl:tracking-[0.2em] leading-tight text-gray-600 whitespace-nowrap">
                スモウメモリー
              </span>
              <span className="text-sm sm:text-base md:text-[10px] lg:text-xs xl:text-lg 2xl:text-lg font-serif font-bold tracki  ng-normal sm:tracking-wider md:tracking-wider lg:tracking-widest xl:tracking-widest 2xl:tracking-widest leading-tight mt-0.5 text-gray-600 whitespace-nowrap">
                相撲の思い出
              </span>
            </div>
          </Link>

          {/* --- B. 桌面端导航 --- */}
          <nav className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-8 xl:gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="nav-item-dynamic relative text-sm font-serif font-bold tracking-wide text-gray-600 transition-colors duration-300 group py-1"
              >
                {item.name}
                <span className="nav-underline absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 transition-[width] duration-300 ease-out w-0 bg-gray-200"></span>
              </Link>
            ))}
          </nav>

          {/* --- C. 桌面端操作区 --- */}
          <div className="hidden lg:flex items-center gap-3">
            {/* 1. 登录按钮 */}
            <Link
              href="/manager/login"
              title="管理者ログイン"
              className="login-btn-dynamic w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 transition-all duration-300 border border-transparent"
            >
              <Lock size={16} strokeWidth={2.5} />
            </Link>

            {/* 2. 搜索按钮 (修复：添加 search-btn-dynamic 类名) */}
            <Button
              href="/clubs/map"
              className={cn(
                "search-btn-dynamic", // ✨ 关键：应用强制背景色样式
                "rounded-full px-5 py-2 text-sm font-bold text-white shadow-md",
                "transition-all duration-300 ease-out",
                "hover:shadow-lg hover:brightness-110", // ✨ 悬停变亮，而非变色
                "active:scale-[0.98]"
              )}
            >
              <span className="flex items-center gap-2">
                <Search size={16} />
                <span className="hidden xl:inline">全国のクラブを探す</span>
                <span className="xl:hidden">探す</span>
              </span>
            </Button>
          </div>

          {/* --- D. 移动端菜单切换 --- */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => setMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* --- E. 移动端侧边栏 --- */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[140] transition-opacity duration-300 ease-in-out ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-[150] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-serif font-bold text-sumo-dark border-b border-gray-100 pb-4 flex justify-between items-center group"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
                <ChevronRight
                  size={16}
                  className="text-gray-300 group-hover:text-[var(--chevron-color)] transition-colors"
                  style={{ "--chevron-color": themeColor } as React.CSSProperties}
                />
              </Link>
            ))}
          </div>

          <div className="mt-auto mb-8 space-y-4">
            <Link
              href="/clubs/map"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full text-white py-4 rounded-full font-bold shadow-lg hover:brightness-110 transition-all active:scale-[0.98]"
              style={{ backgroundColor: themeColor }}
            >
              <Search size={18} />
              クラブを探す
            </Link>

            <Link
              href="/manager/login"
              onClick={() => setMenuOpen(false)}
              className="mobile-login-btn flex items-center justify-center gap-2 w-full bg-white text-sumo-dark border border-gray-200 py-3 rounded-full font-bold transition-colors text-sm hover:text-white"
            >
              <Lock size={16} />
              管理者ログイン
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;