"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Search, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
  if (hideHeaderPaths.includes(pathname)) return null;

  const navItems = [
    { name: "SUMOMEについて", href: "/about" },
    { name: "冊子一覧", href: "/magazines" },
    { name: "イベント", href: "/activities" },
    { name: "お問い合わせ", href: "/contact" },
  ];

  // =================================================================
  // 颜色状态逻辑 (Color Logic)
  // =================================================================

  // 1. 精确匹配列表 (Exact Match)
  // 这些页面必须完全匹配才变色 (适合像 /clubs 这样父子页面风格不统一的情况)
  const exactLightPaths = ["/clubs"];

  // 2. 前缀匹配列表 (Prefix Match) - 扩展性接口
  // 如果以后有某个栏目(比如 /company)，它和它所有的子页面都是白底黑字，就加在这里
  const prefixLightPaths = ["/clubs/search"];

  // 3. 判断逻辑
  const isLightPage =
    // 情况 A: 精确匹配
    exactLightPaths.includes(pathname || "") ||
    // 情况 B: 前缀匹配 (只要以这个开头就算)
    prefixLightPaths.some((path) => pathname?.startsWith(path));

  // 4. 样式计算
  const baseTextClass = isScrolled
    ? "text-sumo-dark"
    : isLightPage
      ? "text-sumo-brand" // 浅色页顶部：主题蓝
      : "text-white"; // 深色页顶部：白色

  const headerContainerClass = isScrolled
    ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
    : "bg-transparent py-5";

  const loginButtonClass =
    isScrolled || isLightPage
      ? "bg-sumo-brand/5 text-sumo-brand hover:bg-sumo-brand hover:text-white"
      : "bg-white/20 text-white hover:bg-white hover:text-sumo-dark";

  const dividerClass = isScrolled
    ? "bg-sumo-dark/10"
    : isLightPage
      ? "bg-sumo-brand/20"
      : "bg-white/30";

  return (
    <>
      <header
        className={`fixed top-0 w-full z-[100] transition-all duration-300 ease-in-out ${headerContainerClass}`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center h-full">
          {/* --- Logo Area --- */}
          <Link
            href="/"
            className={`group z-[110] relative flex items-center gap-4 transition-colors duration-300 ${baseTextClass}`}
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex items-baseline font-serif font-bold text-2xl tracking-widest leading-none">
              {["S", "U", "M", "O", "M", "E"].map((char, index) => {
                const rainbowColors = [
                  "#23ac47",
                  "#a35ea3",
                  "#2454a4",
                  "#df282f",
                  "#63bbe2",
                  "#f49e15",
                ];

                let charColor;
                if (isScrolled) {
                  charColor = rainbowColors[index];
                } else if (isLightPage) {
                  charColor = "#2454a4"; // Sumo Brand Blue
                } else {
                  charColor = "#ffffff";
                }

                return (
                  <span
                    key={index}
                    className="transition-colors duration-500"
                    style={{ color: charColor }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            {/* 分割线 */}
            <span
              className={`h-8 w-[1px] transition-colors duration-500 ${dividerClass}`}
            ></span>

            <div className="flex flex-col justify-center items-start h-full pt-0.5">
              <span
                className={`text-[9px] font-sans font-bold tracking-[0.2em] leading-tight transition-colors duration-500 opacity-70`}
              >
                スモウメモリー
              </span>
              <span
                className={`text-xs font-serif font-medium tracking-widest leading-tight mt-0.5 transition-colors duration-500`}
              >
                相撲の思い出
              </span>
            </div>
          </Link>

          {/* --- Desktop Navigation --- */}
          <nav className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-8 xl:gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative text-sm font-serif font-bold tracking-wide transition-colors duration-300 group py-1",
                  baseTextClass,
                )}
              >
                {item.name}
                <span
                  className={cn(
                    "absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 transition-[width] duration-300 ease-out w-0 group-hover:w-full",
                    isScrolled
                      ? "bg-sumo-dark"
                      : isLightPage
                        ? "bg-sumo-brand"
                        : "bg-white",
                  )}
                ></span>
              </Link>
            ))}
          </nav>

          {/* --- Desktop Actions --- */}
          <div className="flex items-center gap-3 md:gap-6 z-[110]">
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/manager/login"
                title="管理者ログイン"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${loginButtonClass}`}
              >
                <Lock size={16} strokeWidth={2.5} />
              </Link>

              <Button
                href="/clubs"
                variant="red"
                className="rounded-full px-6 py-2.5 text-sm shadow-md"
              >
                <span className="flex items-center gap-2">
                  <Search size={16} />
                  全国のクラブを探す
                </span>
              </Button>
            </div>

            <button
              className={`lg:hidden transition-colors p-1 ${baseTextClass}`}
              onClick={() => setMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu (省略，保持不变) */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[140] transition-opacity duration-300 ease-in-out ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-[150] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ... Mobile Menu Content ... */}
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-sumo-red transition-colors"
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
                  className="text-gray-300 group-hover:text-sumo-red transition-colors"
                />
              </Link>
            ))}
          </div>
          <div className="mt-auto mb-8 space-y-4">
            <Link
              href="/clubs"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-sumo-red text-white py-4 rounded-full font-bold shadow-lg hover:bg-black transition-colors"
            >
              <Search size={18} />
              クラブを探す
            </Link>
            <Link
              href="/manager/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-white text-sumo-dark border border-gray-200 py-3 rounded-full font-bold hover:border-sumo-brand hover:text-sumo-brand transition-colors text-sm"
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
