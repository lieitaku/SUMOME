"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  User,
  Mail,
  Lock,
  ArrowRight,
  Check,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import { cn } from "@/lib/utils";

const RegistrationPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans flex flex-col selection:bg-sumo-brand selection:text-white">
      {/* ==================== 1. Header (碧空背景) ==================== */}
      <header className="relative bg-sumo-brand text-white pt-32 pb-48 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-sumo-brand to-[#2454a4]"></div>
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/2 right-10 -translate-y-1/2 text-[15vw] font-black text-white opacity-[0.03] select-none pointer-events-none leading-none mix-blend-overlay tracking-tighter font-sans">
          JOIN
        </div>

        <div className="container mx-auto max-w-6xl relative z-10 px-6 text-center">
          {/* Back Button */}
          <div className="absolute top-0 left-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              <ChevronLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="text-xs font-bold tracking-widest uppercase">
                Home
              </span>
            </Link>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 reveal-up mt-8 md:mt-0">
            <span className="w-1.5 h-1.5 rounded-full bg-sumo-bg"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">
              Partnership Program
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-6 text-white drop-shadow-sm reveal-up delay-100">
            新規クラブ登録
          </h1>

          <p className="text-white/80 font-medium tracking-wide max-w-xl mx-auto leading-relaxed reveal-up delay-200">
            SUMOMEと共に、相撲の未来を創りましょう。
            <br className="hidden md:inline" />
            登録は無料。数分で完了します。
          </p>
        </div>
      </header>

      {/* ==================== 2. Registration Card (纯白瓷) ==================== */}
      <section className="relative px-4 md:px-6 z-20 -mt-24 pb-32">
        <div className="container mx-auto max-w-5xl">
          <Ceramic
            interactive={false}
            className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden p-0"
          >
            <div className="flex flex-col lg:flex-row min-h-[700px]">
              {/* --- A. Left Side: Invitation (淡雅灰白) --- */}
              <div className="lg:w-5/12 bg-[#FAFAFA] border-r border-gray-100 p-10 md:p-14 relative overflow-hidden flex flex-col">
                {/* 纸张纹理 */}
                <div
                  className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
                  style={{ backgroundImage: "url('/images/bg/noise.png')" }}
                ></div>

                <div className="relative z-10 flex-grow">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.25em] mb-10 border-b border-gray-200 pb-4">
                    Benefits
                  </h3>

                  <h2 className="text-3xl font-serif font-bold text-sumo-dark mb-8 leading-tight">
                    クラブ運営を、
                    <br />
                    もっとスマートに。
                  </h2>

                  <div className="space-y-8">
                    {[
                      {
                        title: "専用ページ作成",
                        desc: "SEOに強い、魅力的なクラブ紹介ページを自動生成。",
                      },
                      {
                        title: "体験・入会管理",
                        desc: "申し込み状況を一元管理し、対応漏れを防ぎます。",
                      },
                      {
                        title: "情報発信",
                        desc: "活動報告や大会結果を、全国の相撲ファンへ届けます。",
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-4 group">
                        <div className="mt-1 w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-300 group-hover:border-sumo-brand group-hover:text-sumo-brand group-hover:bg-white transition-all shadow-sm">
                          <Check size={12} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-700 mb-1 group-hover:text-sumo-brand transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-500 leading-relaxed font-medium">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 底部信赖标识 */}
                <div className="relative z-10 mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-3 opacity-60">
                    <ShieldCheck size={16} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                      Secure & Private
                    </span>
                  </div>
                </div>
              </div>

              {/* --- B. Right Side: The Form (纯白书写区) --- */}
              <div className="lg:w-7/12 bg-white p-8 md:p-14 lg:p-16 relative">
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-sumo-dark mb-1">
                      アカウント作成
                    </h3>
                    <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">
                      Create New Account
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-100">
                    1/1
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Club Name */}
                  <div className="group relative">
                    <label
                      className={cn(
                        "absolute left-0 transition-all duration-300 pointer-events-none font-bold uppercase tracking-wider flex items-center gap-2",
                        focusedField === "club" || true // 保持 Label 在上方比较稳妥，或者做成 Floating Label
                          ? "-top-5 text-[10px] text-sumo-brand"
                          : "top-3 text-xs text-gray-400",
                      )}
                    >
                      <Building2 size={12} /> クラブ名{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="例：東京相撲クラブ"
                      onFocus={() => setFocusedField("club")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-sumo-brand transition-all font-medium text-sumo-dark placeholder-gray-300"
                    />
                  </div>

                  {/* Representative Name */}
                  <div className="group relative">
                    <label className="absolute -top-5 left-0 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                      <User size={12} /> 代表者氏名{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="例：相撲 太郎"
                      className="w-full py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-sumo-brand transition-all font-medium text-sumo-dark placeholder-gray-300"
                    />
                  </div>

                  {/* Email */}
                  <div className="group relative">
                    <label className="absolute -top-5 left-0 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                      <Mail size={12} /> メールアドレス{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="example@sumome.jp"
                      className="w-full py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-sumo-brand transition-all font-medium text-sumo-dark placeholder-gray-300"
                    />
                  </div>

                  {/* Password */}
                  <div className="group relative">
                    <label className="absolute -top-5 left-0 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                      <Lock size={12} /> パスワード{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="8文字以上の半角英数字"
                      className="w-full py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-sumo-brand transition-all font-medium text-sumo-dark placeholder-gray-300"
                    />
                  </div>

                  {/* Terms & Button */}
                  <div className="pt-8">
                    <p className="text-[10px] text-gray-400 mb-6 leading-relaxed">
                      <span className="block mb-2">
                        ご登録の前に必ずご確認ください：
                      </span>
                      <Link
                        href="#"
                        className="underline hover:text-sumo-brand mx-1"
                      >
                        利用規約
                      </Link>
                      および
                      <Link
                        href="#"
                        className="underline hover:text-sumo-brand mx-1"
                      >
                        プライバシーポリシー
                      </Link>
                      に同意したものとみなされます。
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "w-full group relative overflow-hidden py-4 bg-sumo-dark text-white text-xs font-bold uppercase tracking-[0.2em] rounded shadow-lg transition-all",
                        isSubmitting
                          ? "opacity-80 cursor-not-allowed"
                          : "hover:bg-sumo-brand hover:-translate-y-1 hover:shadow-xl",
                      )}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {isSubmitting ? "Processing..." : "Create Account"}
                        {!isSubmitting && (
                          <ArrowRight
                            size={14}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        )}
                      </span>
                    </button>
                  </div>
                </form>

                {/* Login Link */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-xs font-medium text-gray-500">
                    アカウントをお持ちの方は
                    <Link
                      href="/manager/login"
                      className="text-sumo-brand font-bold ml-2 hover:underline tracking-wide"
                    >
                      こちらからログイン
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </Ceramic>
        </div>
      </section>
    </div>
  );
};

export default RegistrationPage;
