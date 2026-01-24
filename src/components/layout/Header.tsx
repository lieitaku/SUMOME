"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Search, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getPrefectureTheme, DEFAULT_THEME } from "@/lib/prefectureThemes";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const params = useParams();
  const prefSlug = params?.pref as string | undefined;

  // 确定当前主题色
  const currentTheme = prefSlug ? getPrefectureTheme(prefSlug) : DEFAULT_THEME;
  const themeColor = currentTheme.color;
  const defaultBlue = DEFAULT_THEME.color;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
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

  // 逻辑：初始状态下需要彩色文本的页面
  const isHomePage = pathname === "/";
  const exactLightPaths = ["/clubs", "/clubs/search", "/partners"];
  const isLightPage = exactLightPaths.includes(pathname || "");
  const isPrefecturePage = !!prefSlug;

  // 文本颜色逻辑
  const getTextColorStyle = () => {
    if (isScrolled) {
      // 滚动后：县级页面保持主题色，其他页面恢复默认蓝
      if (isPrefecturePage) return themeColor;
      return defaultBlue;
    }
    // 未滚动：浅色页面使用主题色，其他页面使用白色
    if (isLightPage) return themeColor;
    return "#ffffff";
  };

  const navTextColor = getTextColorStyle();

  const headerContainerClass = isScrolled
    ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
    : "bg-transparent py-5";

  const loginButtonClass =
    isScrolled || isLightPage
      ? "bg-gray-100"
      : "bg-white/20 text-white hover:bg-white hover:text-sumo-dark";

  const rainbowColors = [
    "#23ac47",
    "#a35ea3",
    "#2454a4",
    "#df282f",
    "#63bbe2",
    "#f49e15",
  ];

  // 操作按钮颜色逻辑
  // 首页：红色 (#df282f)
  // 县级页面：地区主题色
  // 其他：默认蓝
  const actionButtonColor = isHomePage ? "#df282f" : themeColor;

  return (
    <>
      <header
        className={`fixed top-0 w-full z-[100] transition-all duration-300 ease-in-out ${headerContainerClass}`}
        style={
          {
            "--header-theme": navTextColor,
          } as React.CSSProperties
        }
      >
        <div className="container mx-auto px-6 flex justify-between items-center h-full">
          {/* --- Logo 区域 --- */}
          <Link
            href="/"
            className="group z-[110] relative flex items-center gap-4 transition-colors duration-300"
            onClick={() => setMenuOpen(false)}
            style={{ color: navTextColor }}
          >
            <div className="flex items-baseline font-serif font-black text-3xl tracking-widest leading-none">
              {["S", "U", "M", "O", "M", "E"].map((char, index) => {
                let finalColor;

                if (isHomePage) {
                  finalColor = rainbowColors[index % rainbowColors.length];
                } else {
                  finalColor = navTextColor;
                }

                return (
                  <span
                    key={index}
                    className="transition-colors duration-500"
                    style={{ color: finalColor }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            <span
              className="h-8 w-[1px] transition-colors duration-500"
              style={{
                backgroundColor:
                  isScrolled || isLightPage
                    ? `${navTextColor}33`
                    : "rgba(255,255,255,0.3)",
              }}
            ></span>

            <div className="flex flex-col justify-center items-start h-full pt-0.5">
              <span className="text-[9px] font-sans font-bold tracking-[0.2em] leading-tight transition-colors duration-500 opacity-70">
                スモウメモリー
              </span>
              <span className="text-xs font-serif font-medium tracking-widest leading-tight mt-0.5 transition-colors duration-500">
                相撲の思い出
              </span>
            </div>
          </Link>

          {/* --- 桌面端导航 --- */}
          <nav className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-8 xl:gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-sm font-serif font-bold tracking-wide transition-colors duration-300 group py-1"
                style={{ color: navTextColor }}
              >
                {item.name}
                <span
                  className="absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 transition-[width] duration-300 ease-out w-0 group-hover:w-full"
                  style={{ backgroundColor: navTextColor }}
                ></span>
              </Link>
            ))}
          </nav>

          {/* --- 桌面端操作区 --- */}
          {/* 在此注入 CSS 变量以避免将 'style' 传递给 Button 组件 */}
          <div
            className="hidden lg:flex items-center gap-4"
            style={
              {
                "--btn-bg": actionButtonColor,
                "--login-hover": navTextColor,
              } as React.CSSProperties
            }
          >
            <Link
              href="/manager/login"
              title="管理者ログイン"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${loginButtonClass}`}
              style={
                isScrolled || isLightPage
                  ? ({ color: navTextColor } as React.CSSProperties)
                  : undefined
              }
            >
              <Lock size={16} strokeWidth={2.5} />
            </Link>
            <style jsx>{`
              .bg-gray-100:hover {
                background-color: var(--login-hover) !important;
                color: white !important;
              }
            `}</style>

            {/* 主搜索按钮 */}
            <Button
              href="/clubs"
              className={cn(
                "rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-md",
                "transition-all duration-300 ease-out",
                // 1. 使用 CSS 变量强制背景色
                "bg-[var(--btn-bg)]",
                // 2. 防止默认深色悬停；保持相同背景，仅提高亮度
                "hover:bg-[var(--btn-bg)] hover:brightness-110",
                // 3. 轻微上浮并加深阴影（营造高级感）
                "hover:-translate-y-[1px] hover:shadow-lg",
                // 4. 点击反馈
                "active:translate-y-0 active:scale-[0.98] active:brightness-100",
              )}
            >
              <span className="flex items-center gap-2">
                <Search size={16} />
                全国のクラブを探す
              </span>
            </Button>
          </div>

          {/* --- 移动端菜单切换 --- */}
          <button
            className="lg:hidden transition-colors p-1"
            onClick={() => setMenuOpen(true)}
            aria-label="Open Menu"
            style={{ color: navTextColor }}
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* 移动端菜单遮罩层 */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[140] transition-opacity duration-300 ease-in-out ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* 移动端侧边栏 */}
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
                  className="text-gray-300 group-hover:text-gray-900 transition-colors"
                  style={{ "--hover-color": themeColor } as React.CSSProperties}
                />
              </Link>
            ))}
          </div>

          <div className="mt-auto mb-8 space-y-4">
            <Link
              href="/clubs"
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
              className="flex items-center justify-center gap-2 w-full bg-white text-sumo-dark border border-gray-200 py-3 rounded-full font-bold transition-colors text-sm hover:text-white"
              style={
                {
                  "--hover-bg": themeColor,
                } as React.CSSProperties
              }
            >
              <Lock size={16} />
              管理者ログイン
            </Link>
            <style jsx>{`
              a[href="/manager/login"]:hover {
                background-color: var(--hover-bg);
                border-color: var(--hover-bg);
                color: white;
              }
            `}</style>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
