"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // 核心逻辑：定义哪些页面需要 "dark" (白字) 主题
  // 比如：关于页、活动页的头部背景是深色的，所以 Header 文字要是白色的
  const darkThemePaths = ["/about", "/photo", "/activities", "/clubs"];

  // 判断逻辑：
  // 1. 如果当前路径在名单里 -> dark
  // 2. 或者当前路径是以 /clubs 开头的 (比如 /clubs/tokyo) -> 也可以设为 dark (视设计而定)
  const isDarkTheme =
    darkThemePaths.includes(pathname) || pathname.startsWith("/clubs/");

  // 最终主题：如果滚动了，强制变回 light (黑字白底)；否则使用路径判断的主题
  const currentTheme = isScrolled ? "light" : isDarkTheme ? "dark" : "light";

  const navItems = [
    { name: "SUMOMEについて", href: "/about" },
    { name: "冊子一覧", href: "/blog" },
    { name: "イベント", href: "/photo" },
    { name: "お問い合わせ", href: "/contact" },
  ];

  // 1. 监听滚动
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. 路由变化时关闭菜单
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // 3. 锁定 Body 滚动条
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

  // --- 样式逻辑 ---
  const getTextColor = () => {
    if (isScrolled) return "text-sumo-dark";
    return currentTheme === "dark" ? "text-white" : "text-sumo-dark";
  };

  const getBorderColor = () => {
    if (isScrolled) return "border-sumo-dark/20";
    return currentTheme === "dark" ? "border-white/30" : "border-sumo-dark/20";
  };

  const headerPadding = isScrolled ? "py-3" : "py-5";
  const headerBg = isScrolled
    ? "bg-white/95 backdrop-blur-md shadow-sm"
    : "bg-transparent";

  const navTextColor = getTextColor();
  const borderColor = getBorderColor();

  return (
    <>
      <header
        className={`fixed top-0 w-full z-[100] transition-all duration-300 ease-in-out ${headerPadding} ${headerBg}`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center h-full">
          {/* Logo */}
          <Link
            href="/"
            className={`text-2xl font-serif font-bold tracking-widest z-[110] relative transition-colors duration-300 ${navTextColor}`}
            onClick={() => setMenuOpen(false)}
          >
            SUMOME
          </Link>

          {/* ================= Desktop Navigation ================= */}
          <nav className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-8 xl:gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                // ✨ 修复核心：在这里添加了 font-serif
                // 这样无论是在哪个页面，导航菜单都会强制使用衬线体 (Noto Serif JP)
                className={`nav-link text-sm font-serif font-bold tracking-wide transition-colors hover:text-sumo-red ${navTextColor}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-6 z-[110]">
            {/* Desktop Search Button */}
            <div className="hidden lg:block">
              <Link
                href="/clubs"
                className="inline-flex items-center gap-2 bg-sumo-red text-white px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all hover:bg-white hover:text-sumo-red shadow-md border border-transparent hover:border-sumo-red"
              >
                <Search size={16} />
                全国のクラブを探す
              </Link>
            </div>

            {/* Mobile Search Button (Capsule) */}
            <div className="lg:hidden">
              <Link
                href="/clubs"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${navTextColor} ${borderColor} hover:bg-sumo-red hover:border-sumo-red hover:text-white`}
              >
                <Search size={14} />
                <span className="text-xs font-bold tracking-widest">探す</span>
              </Link>
            </div>

            {/* Hamburger Icon */}
            <button
              className={`lg:hidden transition-colors p-1 ${navTextColor}`}
              onClick={() => setMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* ==================== Mobile Menu Overlay & Drawer ==================== */}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[140] transition-opacity duration-300 ease-in-out ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Right Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-[150] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-sumo-red transition-colors"
              aria-label="Close Menu"
            >
              <X size={28} />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                // Mobile menu 之前已经加了 font-serif，这里保持不变
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

          {/* Footer Button */}
          <div className="mt-auto mb-8">
            <Link
              href="/clubs"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-sumo-dark text-white py-4 rounded-full font-bold shadow-lg hover:bg-sumo-red transition-colors"
            >
              <Search size={18} />
              クラブを探す
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
