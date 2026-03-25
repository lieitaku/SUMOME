"use client";

import React, { useState } from "react";
import Link from "@/components/ui/TransitionLink";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  ArrowRight,
  Lock,
  Mail,
  ChevronLeft,
  ShieldCheck,
  HelpCircle,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import { cn } from "@/lib/utils";
import { loginErrorToJapanese } from "@/lib/auth-error-messages";

const LoginForm = () => {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/partners");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("メールアドレスとパスワードを入力してください。");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMsg("メールアドレスまたはパスワードが正しくありません。");
        } else if (error.message.includes("Email not confirmed")) {
          setErrorMsg("メールアドレスの確認が完了していません。受信トレイを確認してください。");
        } else if (error.message.includes("missing email")) {
          setErrorMsg("メールアドレスが入力されていません。");
        } else {
          setErrorMsg(loginErrorToJapanese(error.message));
        }
      } else {
        router.refresh();
        router.push("/admin/clubs");
      }
    } catch {
      setErrorMsg("予期せぬエラーが発生しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F4F5F7] font-sans flex flex-col selection:bg-sumo-brand selection:text-white">
      {/* ==================== Hero（Registration と同系統） ==================== */}
      <header className="relative bg-sumo-brand text-white pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-linear-to-b from-sumo-brand to-[#2454a4]" />
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute top-1/2 right-10 -translate-y-1/2 text-[15vw] font-black text-white opacity-[0.03] select-none pointer-events-none leading-none mix-blend-overlay tracking-tighter font-sans">
          LOGIN
        </div>

        <div className="container mx-auto max-w-6xl relative z-10 px-6 text-center">
          <div className="flex justify-center mb-8">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all text-white group"
            >
              <ChevronLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase">戻る</span>
            </button>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-4 md:mb-6 text-white drop-shadow-sm">
            管理画面ログイン
          </h1>

          <p className="text-white/80 font-medium tracking-wide max-w-xl mx-auto leading-relaxed text-sm md:text-base px-1">
            登録済みのメールアドレスとパスワードでサインインしてください。
            <br className="hidden md:inline" />
            クラブ情報の編集・お問い合わせの確認が行えます。
          </p>
        </div>
      </header>

      {/* ==================== カード（左：ウェルカム／右：フォーム。モバイルはフォームを上に） ==================== */}
      <section className="relative px-4 md:px-6 z-20 -mt-16 md:-mt-24 pb-12 sm:pb-16 md:pb-24">
        <div className="container mx-auto max-w-5xl">
          <Ceramic
            interactive={false}
            className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden p-0"
          >
            <div className="flex flex-col md:flex-row min-h-0 md:min-h-[520px]">
              {/* --- A. 左：おかえりなさい（モバイルはログインフォームの上） --- */}
              <div className="md:w-[38%] bg-[#FAFAFA] border-b border-gray-100 md:border-b-0 md:border-r md:border-gray-100 p-6 md:p-10 lg:p-12 relative overflow-hidden flex flex-col justify-between">
                {/* モバイル：カード右上のヘルプ */}
                <button
                  type="button"
                  onClick={() => setShowHelp(true)}
                  className="absolute top-4 right-4 z-20 md:hidden inline-flex items-center gap-1.5 rounded-full border border-gray-200/90 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 shadow-sm backdrop-blur-sm hover:border-sumo-brand/40 hover:text-sumo-brand transition-colors"
                >
                  <HelpCircle size={12} className="shrink-0" aria-hidden />
                  ヘルプ
                </button>

                <div className="relative z-10 pr-18 md:pr-0">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sumo-brand shadow-sm mb-5 md:mb-6">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-sumo-dark mb-3 md:mb-4 leading-relaxed">
                    おかえりなさい
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-medium">
                    クラブの活動状況や会員情報は
                    <br className="hidden sm:inline" />
                    リアルタイムで同期されています。
                  </p>
                </div>

                {/* デスクトップ：従来どおり下部 */}
                <div className="relative z-10 mt-8 hidden md:mt-10 md:block pt-6 border-t border-gray-200">
                  <div className="w-8 h-1 bg-gray-200 mb-4" />
                  <button
                    type="button"
                    onClick={() => setShowHelp(true)}
                    className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-sumo-brand transition-colors"
                  >
                    <HelpCircle size={12} className="shrink-0" />
                    ヘルプ
                  </button>
                </div>
              </div>

              {/* --- B. 右：フォーム（Registration と同じラベル＋下線・組み間余白） --- */}
              <div className="md:w-[62%] bg-white p-5 md:p-12 lg:p-14 relative flex flex-col justify-center">
                <div className="mb-6 md:mb-10">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-sumo-dark">ログイン</h3>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col max-w-sm w-full md:max-w-md md:mx-auto">
                  {errorMsg && (
                    <div className="mb-6 md:mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                      <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-red-600 font-bold leading-relaxed">{errorMsg}</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5 pb-8 md:pb-6">
                    <label
                      htmlFor="email"
                      className="text-xs font-bold text-sumo-brand uppercase tracking-wider flex items-center gap-2"
                    >
                      <Mail size={14} /> メールアドレス
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-2.5 bg-transparent border-b border-gray-200 focus:border-sumo-brand focus:outline-none transition-colors text-base font-medium text-sumo-dark placeholder-gray-300"
                      placeholder="example@sumome.jp"
                    />
                  </div>

                  <div className="group flex flex-col gap-1.5 pb-6 md:pb-8">
                    <label
                      htmlFor="password"
                      className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors"
                    >
                      <Lock size={14} /> パスワード
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-2.5 bg-transparent border-b border-gray-200 focus:border-sumo-brand focus:outline-none transition-colors text-base font-medium text-sumo-dark placeholder-gray-300"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <div className="relative flex items-center shrink-0">
                        <input
                          type="checkbox"
                          className="peer appearance-none w-3.5 h-3.5 border border-gray-300 rounded-[2px] checked:bg-sumo-brand checked:border-sumo-brand transition-all"
                        />
                        <svg
                          className="absolute inset-0 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                          viewBox="0 0 14 14"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M3 7L5.5 9.5L11 4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        ログイン状態を保持
                      </span>
                    </label>
                    <a
                      href="#"
                      className="text-xs font-bold text-gray-400 hover:text-sumo-brand transition-colors uppercase tracking-wider sm:text-right"
                    >
                      パスワードをお忘れですか？
                    </a>
                  </div>

                  <div className="pt-5 md:pt-8">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={cn(
                        "w-full py-4 rounded-xl text-sm font-bold uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-3",
                        "bg-sumo-dark text-white hover:bg-sumo-brand active:scale-[0.98]",
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      )}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          ログイン中...
                        </>
                      ) : (
                        <>
                          ログイン
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 text-center">
                  <p className="text-sm font-medium text-gray-500">
                    アカウントをお持ちでない方は
                    <Link
                      href="/manager/entry"
                      className="text-sumo-brand font-bold ml-2 hover:underline decoration-sumo-brand/30 underline-offset-4 transition-all"
                    >
                      新規登録
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </Ceramic>
        </div>
      </section>

      {showHelp && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold text-sumo-dark flex items-center gap-2">
                <HelpCircle size={20} className="text-sumo-brand" />
                ログインのヘルプ
              </h3>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="p-2 rounded-xl text-gray-500 hover:bg-sumo-brand/10 hover:text-sumo-brand transition-colors"
                aria-label="閉じる"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 text-sm text-gray-600">
              <p className="leading-relaxed">
                管理画面にログインするには、登録済みのメールアドレスとパスワードを入力してください。
              </p>
              <p className="leading-relaxed">
                パスワードをお忘れの場合は、「パスワードをお忘れですか？」のリンクからパスワード再設定を行ってください。
              </p>
              <p className="leading-relaxed">
                アカウントをお持ちでない方は、新規登録ページからアカウントを作成してください。
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="px-5 py-2.5 bg-sumo-brand text-white text-sm font-bold rounded-xl hover:brightness-110 transition-all"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
