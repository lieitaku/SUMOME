"use client";

import React, { useActionState } from "react";
import Link from "@/components/ui/TransitionLink";
import {
  Building2,
  User,
  Mail,
  Lock,
  ArrowRight,
  Check,
  ShieldCheck,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import { cn } from "@/lib/utils";

// 引入后端 Action 和类型定义
import { signUp, type SignUpState } from "@/lib/actions/auth-signup";

const initialState: SignUpState = {
  message: "",
  error: {},
  inputs: {
    clubName: "",
    name: "",
    email: "",
  }
};

const RegistrationPage = () => {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans flex flex-col selection:bg-sumo-brand selection:text-white">

      {/* ==================== 1. 页头区域 (Header Area) ==================== */}
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

      {/* ==================== 2. 注册卡片区域 (Registration Card) ==================== */}
      <section className="relative px-4 md:px-6 z-20 -mt-24 pb-32">
        <div className="container mx-auto max-w-5xl">
          <Ceramic
            interactive={false}
            className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden p-0"
          >
            <div className="flex flex-col lg:flex-row min-h-[700px]">

              {/* --- A. 左侧区域 (保持不变) --- */}
              <div className="lg:w-5/12 bg-[#FAFAFA] border-r border-gray-100 p-10 md:p-14 relative overflow-hidden flex flex-col">
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

                <div className="relative z-10 mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-3 opacity-60">
                    <ShieldCheck size={16} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                      Secure & Private
                    </span>
                  </div>
                </div>
              </div>

              {/* --- B. 右侧区域: 注册表单 (Form) --- */}
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

                <form action={formAction} className="space-y-8">

                  {state?.message && (
                    <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                      ⚠️ {state.message}
                    </div>
                  )}

                  {/* 字段 1: 俱乐部名称 */}
                  <div className="group relative">
                    <label className="absolute -top-5 left-0 text-[10px] font-bold text-sumo-brand uppercase tracking-wider flex items-center gap-2">
                      <Building2 size={12} /> クラブ名 <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="clubName"
                      type="text"
                      required
                      defaultValue={state?.inputs?.clubName}
                      placeholder="例：東京相撲クラブ"
                      className="w-full py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-sumo-brand transition-all font-medium text-sumo-dark placeholder-gray-300"
                    />
                    {state?.error?.clubName && (
                      <p className="text-red-500 text-[10px] mt-1 font-bold">{state.error.clubName[0]}</p>
                    )}
                  </div>

                  {/* 字段 2: 代表者姓名 */}
                  <div className="group relative">
                    <label className="absolute -top-5 left-0 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                      <User size={12} /> 代表者氏名 <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      defaultValue={state?.inputs?.name}
                      placeholder="例：相撲 太郎"
                      className="w-full py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-sumo-brand transition-all font-medium text-sumo-dark placeholder-gray-300"
                    />
                    {state?.error?.name && (
                      <p className="text-red-500 text-[10px] mt-1 font-bold">{state.error.name[0]}</p>
                    )}
                  </div>

                  {/* 字段 3: 邮箱 */}
                  <div className="group relative">
                    <label className="absolute -top-5 left-0 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                      <Mail size={12} /> メールアドレス <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      // ✨ 关键修复：设置 defaultValue 实现回显
                      defaultValue={state?.inputs?.email}
                      placeholder="example@sumome.jp"
                      className="w-full py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-sumo-brand transition-all font-medium text-sumo-dark placeholder-gray-300"
                    />
                    {state?.error?.email && (
                      <p className="text-red-500 text-[10px] mt-1 font-bold">{state.error.email[0]}</p>
                    )}
                  </div>

                  {/* 字段 4: 密码 (注意：密码字段不设置 defaultValue，这是安全标准) */}
                  <div className="group relative">
                    <label className="absolute -top-5 left-0 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                      <Lock size={12} /> パスワード <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="password"
                      type="password"
                      required
                      placeholder="8文字以上の半角英数字"
                      className="w-full py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-sumo-brand transition-all font-medium text-sumo-dark placeholder-gray-300"
                    />
                    {state?.error?.password && (
                      <p className="text-red-500 text-[10px] mt-1 font-bold">{state.error.password[0]}</p>
                    )}
                  </div>

                  {/* 条款与提交 */}
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
                      disabled={isPending}
                      className={cn(
                        "w-full py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-3",
                        "bg-sumo-dark text-white hover:bg-sumo-brand active:scale-[0.98]",
                        isPending ? "opacity-70 cursor-not-allowed" : ""
                      )}
                    >
                      {isPending ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight
                            size={14}
                            className="group-hover:translate-x-1 transition-transform duration-300"
                          />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-xs font-medium text-gray-500">
                    アカウントをお持ちの方は
                    <Link
                      href="/login"
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