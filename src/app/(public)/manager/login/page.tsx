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
  KeyRound,
  HelpCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Ceramic from "@/components/ui/Ceramic";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const LoginPage = () => {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    // ✨ 修复 1: 提交前打印数据，用于调试 (F12 Console 可见)
    console.log("Submitting login for:", email);

    // ✨ 修复 2: 前端强制校验，防止空值传给 Supabase
    if (!email || !password) {
      setErrorMsg("メールアドレスとパスワードを入力してください。");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(), // 去除首尾空格
        password: password,
      });

      if (error) {
        console.error("Login Error:", error.message);

        if (error.message.includes("Invalid login credentials")) {
          setErrorMsg("メールアドレスまたはパスワードが正しくありません。");
        } else if (error.message.includes("Email not confirmed")) {
          setErrorMsg("メールアドレスの確認が完了していません。受信トレイを確認してください。");
        } else if (error.message.includes("missing email")) {
          // 捕获具体的 missing email 错误
          setErrorMsg("メールアドレスが入力されていません。");
        } else {
          setErrorMsg(`ログインに失敗しました: ${error.message}`);
        }
      } else {
        router.refresh();
        router.push("/admin/clubs"); // 登录成功跳转
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      setErrorMsg("予期せぬエラーが発生しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans flex flex-col selection:bg-sumo-brand selection:text-white">
      {/* ==================== 1. Header ==================== */}
      <header className="relative bg-sumo-brand text-white pt-24 pb-40 md:pt-32 md:pb-48 overflow-hidden shadow-xl">
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
          LOGIN
        </div>

        <div className="container mx-auto max-w-5xl relative z-10 px-6 text-center">
          <div className="absolute top-0 left-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold tracking-widest uppercase">Home</span>
            </Link>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 mt-8 md:mt-0">
            <KeyRound size={12} className="text-sumo-gold" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">
              Secure Access
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-6 text-white drop-shadow-sm">
            管理画面ログイン
          </h1>
        </div>
      </header>

      {/* ==================== 2. Login Card ==================== */}
      <section className="relative px-4 md:px-6 z-20 -mt-24 pb-32">
        <div className="container mx-auto max-w-4xl">
          <Ceramic
            interactive={false}
            className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden p-0"
          >
            <div className="flex flex-col md:flex-row min-h-[550px]">
              {/* --- A. Left Side --- */}
              <div className="md:w-[35%] bg-[#FAFAFA] border-r border-gray-100 p-8 md:p-10 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('/images/bg/noise.png')" }}></div>

                <div className="relative z-10">
                  <div className="w-10 h-10 rounded bg-white border border-gray-200 flex items-center justify-center text-sumo-brand shadow-sm mb-6">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-sumo-dark mb-4 leading-relaxed">おかえりなさい</h3>
                  <p className="text-xs text-gray-500 leading-loose font-medium">
                    クラブの活動状況や会員情報は<br />リアルタイムで同期されています。
                  </p>
                </div>

                <div className="relative z-10 mt-12 md:mt-0">
                  <div className="w-8 h-1 bg-gray-200 mb-4"></div>
                  <Link href="#" className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-sumo-brand transition-colors">
                    <HelpCircle size={12} /> Help Center
                  </Link>
                </div>
              </div>

              {/* --- B. Right Side --- */}
              <div className="md:w-[65%] bg-white p-8 md:p-14 relative flex flex-col justify-center">
                <form onSubmit={handleLogin} className="space-y-8 max-w-sm mx-auto w-full">

                  {errorMsg && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                      <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-red-600 font-bold leading-relaxed">{errorMsg}</p>
                    </div>
                  )}

                  <div className="relative group">
                    <input
                      // ✨ 修复 3: 增加 name 和 autoComplete 属性，确保浏览器自动填充正常工作
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full py-3 bg-transparent border-b border-gray-300 focus:border-sumo-brand focus:outline-none transition-colors peer placeholder-transparent text-sumo-dark font-medium pt-5"
                      placeholder="Email"
                    />
                    <label
                      htmlFor="email"
                      className={cn(
                        "absolute left-0 transition-all duration-300 pointer-events-none uppercase tracking-wider font-bold flex items-center gap-2",
                        email ? "-top-1 text-[9px] text-sumo-brand" : "top-3 text-xs text-gray-400 peer-focus:-top-1 peer-focus:text-[9px] peer-focus:text-sumo-brand",
                      )}
                    >
                      <Mail size={12} className={cn("transition-all", email || "peer-focus:w-3 peer-focus:h-3" ? "" : "w-4 h-4")} />
                      メールアドレス
                    </label>
                  </div>

                  <div className="relative group">
                    <input
                      // ✨ 修复 3: 增加 name 和 autoComplete
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full py-3 bg-transparent border-b border-gray-300 focus:border-sumo-brand focus:outline-none transition-colors peer placeholder-transparent text-sumo-dark font-medium pt-5"
                      placeholder="Password"
                    />
                    <label
                      htmlFor="password"
                      className={cn(
                        "absolute left-0 transition-all duration-300 pointer-events-none uppercase tracking-wider font-bold flex items-center gap-2",
                        password ? "-top-1 text-[9px] text-sumo-brand" : "top-3 text-xs text-gray-400 peer-focus:-top-1 peer-focus:text-[9px] peer-focus:text-sumo-brand",
                      )}
                    >
                      <Lock size={12} className={cn("transition-all", password || "peer-focus:w-3 peer-focus:h-3" ? "" : "w-4 h-4")} />
                      パスワード
                    </label>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer group select-none">
                      <div className="relative flex items-center">
                        <input type="checkbox" className="peer appearance-none w-3.5 h-3.5 border border-gray-300 rounded-[2px] checked:bg-sumo-brand checked:border-sumo-brand transition-all" />
                        <svg className="absolute inset-0 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 14" fill="none"><path d="M3 7L5.5 9.5L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 group-hover:text-sumo-dark transition-colors uppercase tracking-wider">Remember Me</span>
                    </label>
                    <a href="#" className="text-[10px] font-bold text-gray-400 hover:text-sumo-brand transition-colors uppercase tracking-wider">Forgot Password?</a>
                  </div>

                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      showArrow={false}
                      className={cn(
                        "w-full py-4 text-xs font-bold uppercase tracking-[0.2em] shadow-lg bg-sumo-dark text-white hover:bg-sumo-brand",
                        isLoading ? "opacity-80 cursor-not-allowed" : "",
                      )}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {isLoading ? (
                          <><Loader2 size={14} className="animate-spin" /> Authenticating...</>
                        ) : (
                          <>Login <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" /></>
                        )}
                      </span>
                    </Button>
                  </div>
                </form>

                <div className="mt-12 text-center border-t border-gray-100 pt-6">
                  <p className="text-xs text-gray-500 font-medium">
                    アカウントをお持ちでない方は
                    <Link href="/signup" className="text-sumo-brand font-bold ml-2 hover:underline decoration-sumo-brand/30 underline-offset-4 transition-all">新規登録</Link>
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

export default LoginPage;