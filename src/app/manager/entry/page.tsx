"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  User,
  Building2,
  Mail,
  Lock,
} from "lucide-react";
import WaveDivider from "@/components/home/WaveDivider";
import Button from "@/components/ui/Button";

const RegistrationPage = () => {
  return (
    <div className="bg-sumo-bg min-h-screen font-sans flex flex-col">
      {/* ==================== 1. Benefit Header (权益引导) ==================== */}
      <section className="relative pt-32 pb-48 bg-sumo-dark text-white overflow-hidden">
        {/* 背景纹理 */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay z-0"
          style={{
            backgroundImage: "url('/images/bg/washi.png')",
            backgroundRepeat: "repeat",
          }}
        ></div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <p className="text-sumo-gold text-xs font-bold tracking-[0.2em] mb-4 uppercase">
            FREE REGISTRATION
          </p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-10">
            クラブオーナー・管理者の方へ
          </h1>

          {/* 三大权益 - 使用玻璃拟态卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
            {[
              "クラブ専用ページの作成・編集",
              "体験申し込みの管理・返信",
              "活動報告・イベントの掲載",
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-sm p-4 flex items-center justify-center gap-3 text-sm font-bold shadow-lg"
              >
                <CheckCircle2
                  className="text-sumo-gold flex-shrink-0"
                  size={20}
                />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 2. Registration Form (悬浮卡片) ==================== */}
      <section className="relative px-4 pb-20">
        <div className="container mx-auto max-w-2xl relative z-10 -mt-24">
          <div className="bg-white rounded-sm shadow-2xl overflow-hidden relative">
            {/* 顶部金色装饰条 */}
            <div className="h-2 w-full bg-sumo-gold"></div>

            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-serif font-bold text-sumo-dark text-center mb-8">
                アカウント作成
              </h2>

              <form className="space-y-6">
                {/* 俱乐部名称 */}
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    クラブ名
                  </label>
                  <div className="relative">
                    <Building2
                      className="absolute top-3 left-0 text-gray-300 group-focus-within:text-sumo-gold transition-colors"
                      size={20}
                    />
                    <input
                      type="text"
                      className="w-full pl-8 py-3 bg-transparent border-b border-gray-300 focus:outline-none focus:border-sumo-gold transition-all"
                      placeholder="例：東京相撲クラブ"
                    />
                  </div>
                </div>

                {/* 代表者姓名 */}
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    代表者氏名
                  </label>
                  <div className="relative">
                    <User
                      className="absolute top-3 left-0 text-gray-300 group-focus-within:text-sumo-gold transition-colors"
                      size={20}
                    />
                    <input
                      type="text"
                      className="w-full pl-8 py-3 bg-transparent border-b border-gray-300 focus:outline-none focus:border-sumo-gold transition-all"
                      placeholder="例：相撲 太郎"
                    />
                  </div>
                </div>

                {/* 邮箱 */}
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    メールアドレス
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute top-3 left-0 text-gray-300 group-focus-within:text-sumo-gold transition-colors"
                      size={20}
                    />
                    <input
                      type="email"
                      className="w-full pl-8 py-3 bg-transparent border-b border-gray-300 focus:outline-none focus:border-sumo-gold transition-all"
                      placeholder="example@sumome.jp"
                    />
                  </div>
                </div>

                {/* 密码 */}
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    パスワード
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute top-3 left-0 text-gray-300 group-focus-within:text-sumo-gold transition-colors"
                      size={20}
                    />
                    <input
                      type="password"
                      className="w-full pl-8 py-3 bg-transparent border-b border-gray-300 focus:outline-none focus:border-sumo-gold transition-all"
                      placeholder="8文字以上の半角英数字"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full bg-sumo-red text-white font-bold py-4 rounded-sm shadow-lg hover:bg-red-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    無料で登録する
                  </button>
                  <p className="text-xs text-gray-400 mt-4 text-center">
                    ご登録により、
                    <a href="#" className="underline">
                      利用規約
                    </a>
                    および
                    <a href="#" className="underline">
                      プライバシーポリシー
                    </a>
                    に同意したものとみなされます。
                  </p>
                </div>
              </form>
            </div>

            {/* 底部登录引导 */}
            <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
              <p className="text-sm text-gray-600">
                すでにアカウントをお持ちですか？
                <Link
                  href="/manager/login"
                  className="text-sumo-dark font-bold ml-2 hover:text-sumo-gold underline"
                >
                  ログインはこちら
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegistrationPage;
