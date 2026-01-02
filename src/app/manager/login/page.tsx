"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock, Mail, ChevronLeft } from "lucide-react";
import Button from "@/components/ui/Button";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // 模拟登录请求
    setTimeout(() => {
      setIsLoading(false);
      alert("登录成功 (演示模式)");
      // 这里未来会跳转到 /manager/dashboard
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* ==================== Left Side: Visual Anchor ==================== */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-sumo-dark overflow-hidden">
        {/* 背景大图 */}
        <Image
          src="/images/bg/manager-login.jpg" // 随便找一张之前的图，或者用 unsplash
          alt="Manager Login"
          fill
          className="object-contain opacity-60 mix-blend-overlay grayscale"
        />
        {/* 纹理叠加 */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url('/images/bg/washi.png')" }}
        ></div>

        {/* 文字内容 */}
        <div className="relative z-10 p-20 flex flex-col justify-between h-full text-white">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
            >
              <ChevronLeft size={20} />
              トップページに戻る
            </Link>
            <h1 className="text-4xl font-serif font-bold leading-tight">
              未来の力士を、
              <br />
              ここから育てる。
            </h1>
          </div>

          <div className="border-l-2 border-sumo-gold pl-6">
            <p className="text-lg font-serif italic text-white/80">
              "The sumo ring is a sacred place where discipline meets passion."
            </p>
          </div>
        </div>
      </div>

      {/* ==================== Right Side: Login Form ==================== */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-20 relative">
        {/* 移动端返回按钮 */}
        <div className="lg:hidden absolute top-8 left-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-sumo-dark"
          >
            <ChevronLeft size={20} />
            戻る
          </Link>
        </div>

        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-12">
            <p className="text-sumo-gold text-xs font-bold tracking-[0.2em] mb-3 uppercase">
              MANAGER LOGIN
            </p>
            <h2 className="text-3xl font-serif font-bold text-sumo-dark">
              管理画面へログイン
            </h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {/* Email Input */}
            <div className="group relative">
              <div className="absolute top-3 left-0 text-gray-400 group-focus-within:text-sumo-gold transition-colors">
                <Mail size={20} />
              </div>
              <input
                type="email"
                required
                placeholder="メールアドレス"
                className="w-full pl-10 pr-4 py-3 bg-transparent border-b border-gray-300 focus:outline-none focus:border-sumo-gold transition-all text-sumo-dark placeholder:text-gray-300 font-medium"
              />
            </div>

            {/* Password Input */}
            <div className="group relative">
              <div className="absolute top-3 left-0 text-gray-400 group-focus-within:text-sumo-gold transition-colors">
                <Lock size={20} />
              </div>
              <input
                type="password"
                required
                placeholder="パスワード"
                className="w-full pl-10 pr-4 py-3 bg-transparent border-b border-gray-300 focus:outline-none focus:border-sumo-gold transition-all text-sumo-dark placeholder:text-gray-300 font-medium"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-sumo-dark">
                <input type="checkbox" className="accent-sumo-gold" />
                <span>ログイン状態を保持</span>
              </label>
              <a
                href="#"
                className="text-sumo-gold hover:underline hover:text-sumo-red transition-colors"
              >
                パスワードをお忘れですか？
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sumo-dark text-white font-bold py-4 rounded-sm shadow-lg hover:bg-sumo-red hover:shadow-xl transition-all duration-300 disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isLoading ? "認証中..." : "ログイン"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-12 text-center text-sm text-gray-500">
            アカウントをお持ちでない方は
            <br className="md:hidden" />
            <Link
              href="/manager/entry"
              className="text-sumo-dark font-bold underline ml-1 hover:text-sumo-gold decoration-sumo-gold/50 underline-offset-4"
            >
              新規掲載登録（無料）
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
