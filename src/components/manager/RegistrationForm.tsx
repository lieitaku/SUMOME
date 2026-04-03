"use client";

import React, { useState, useRef } from "react";
import Link from "@/components/ui/TransitionLink";
import { useRouter } from "@/i18n/navigation";
import { createBrowserClient } from "@supabase/ssr";
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

import { signUp, type SignUpState } from "@/lib/actions/auth-signup";
import { loginErrorToJapanese } from "@/lib/auth-error-messages";

const RegistrationForm = () => {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [state, setState] = useState<SignUpState>({});

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/partners");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setState({});

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        const email = formData.get("email") as string;

        let result: SignUpState;
        try {
            result = await signUp({}, formData);
        } catch (err) {
            console.error("Registration signUp Server Action failed:", err);
            setState({
                message: "登録処理に失敗しました。ネットワークと環境設定を確認し、もう一度お試しください。",
            });
            setIsSubmitting(false);
            return;
        }

        if (!result.success) {
            setState(result);
            setIsSubmitting(false);
            return;
        }

        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) {
                setState({
                    message: `アカウントは作成されました。${loginErrorToJapanese(loginError.message)} ログインページからサインインすることもできます。`,
                    inputs: result.inputs,
                });
                setIsSubmitting(false);
                return;
            }
        } catch (err) {
            console.error("Registration signInWithPassword failed:", err);
            setState({
                message:
                    "アカウントは作成されました。自動ログインに失敗しました。ログインページからサインインしてください。",
                inputs: result.inputs,
            });
            setIsSubmitting(false);
            return;
        }

        try {
            router.refresh();
            router.push("/admin/clubs");
        } catch (err) {
            console.error("Registration navigation failed:", err);
            setState({
                message: "ログインに成功しましたが、画面の移動に失敗しました。ページを再読み込みしてください。",
                inputs: result.inputs,
            });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#F4F5F7] font-sans flex flex-col selection:bg-sumo-brand selection:text-white">

            {/* ==================== 1. 页头区域 (Header Area) ==================== */}
            <header className="relative bg-sumo-brand text-white pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden shadow-xl">
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
                    <div className="flex justify-center mb-8">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all text-white group"
                        >
                            <ChevronLeft
                                size={12}
                                className="group-hover:-translate-x-0.5 transition-transform"
                            />
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                                戻る
                            </span>
                        </button>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-4 md:mb-6 text-white drop-shadow-sm reveal-up delay-100">
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
            <section className="relative px-4 md:px-6 z-20 -mt-16 md:-mt-24 pb-12 sm:pb-16 md:pb-24">
                <div className="container mx-auto max-w-5xl">
                    <Ceramic
                        interactive={false}
                        className="bg-white border-b-[6px] border-b-sumo-brand shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden p-0"
                    >
                        <div className="flex flex-col-reverse lg:flex-row min-h-0 lg:min-h-[700px]">

                            {/* --- A. 左侧区域（桌面）/ 下方（手机）--- */}
                            <div className="lg:w-5/12 bg-[#FAFAFA] border-r border-gray-100 p-6 md:p-14 relative overflow-hidden flex flex-col">
                                <div className="relative z-10 flex-grow">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.25em] mb-6 md:mb-10 border-b border-gray-200 pb-4">
                                        メリット
                                    </h3>

                                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-sumo-dark mb-5 md:mb-8 leading-tight">
                                        クラブ運営を、
                                        <br />
                                        もっとスマートに。
                                    </h2>

                                    <div className="space-y-4 md:space-y-8">
                                        {[
                                            {
                                                title: "検索に強い公式ページ",
                                                desc: "Web知識は不要。スマホだけで、Google検索で上位に表示される「見やすい募集ページ」が自動で作れます。",
                                            },
                                            {
                                                title: "問い合わせ・入会を自動整理",
                                                desc: "電話やメールのやり取りはもう不要。体験申し込みや質問をシステムが整理し、対応漏れをゼロにします。",
                                            },
                                            {
                                                title: "ファンを増やす広報活動",
                                                desc: "日々の稽古や大会の熱気を全国へ。手間なく発信でき、OBや支援者との強いつながりを生み出します。",
                                            },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex gap-4 group">
                                                <div className={cn(
                                                    "mt-1 w-6 h-6 rounded-full border flex items-center justify-center transition-all shadow-sm shrink-0",
                                                    "border-sumo-brand text-sumo-brand bg-white",
                                                    "md:border-gray-300 md:text-gray-300 md:bg-transparent md:group-hover:border-sumo-brand md:group-hover:text-sumo-brand md:group-hover:bg-white"
                                                )}>
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

                                <div className="relative z-10 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
                                    <div className="flex items-center gap-3 opacity-60">
                                        <ShieldCheck size={16} className="text-gray-400" />
                                        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                                            安全・プライバシー保護
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* --- B. 右侧区域: 注册表单 (Form) --- */}
                            <div className="lg:w-7/12 bg-white p-5 md:p-14 lg:p-16 relative">
                                <div className="mb-6 md:mb-10">
                                    <h3 className="text-3xl font-serif font-bold text-sumo-dark">
                                        新規アカウント作成
                                    </h3>
                                </div>

                                <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col">

                                    {state?.message && (
                                        <div className="mb-6 md:mb-8 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                            ⚠️ {state.message}
                                        </div>
                                    )}

                                    {/* 各フィールド：ラベル＋入力は密。下線の下に pb で次のラベルまで呼吸感 */}
                                    <div className="flex flex-col gap-1.5 pb-8 md:pb-6">
                                        <label htmlFor="reg-clubName" className="text-xs font-bold text-sumo-brand uppercase tracking-wider flex items-center gap-2">
                                            <Building2 size={14} /> クラブ名 <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            id="reg-clubName"
                                            name="clubName"
                                            type="text"
                                            required
                                            defaultValue={state?.inputs?.clubName}
                                            placeholder="例：東京相撲クラブ"
                                            className="w-full py-2.5 bg-transparent border-b border-gray-200 focus:outline-none focus:border-sumo-brand transition-all font-medium text-base text-sumo-dark placeholder-gray-300"
                                        />
                                        {state?.error?.clubName && (
                                            <p className="text-red-500 text-xs font-bold">{state.error.clubName[0]}</p>
                                        )}
                                    </div>

                                    <div className="group flex flex-col gap-1.5 pb-8 md:pb-6">
                                        <label htmlFor="reg-name" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                                            <User size={14} /> 代表者氏名 <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            id="reg-name"
                                            name="name"
                                            type="text"
                                            required
                                            defaultValue={state?.inputs?.name}
                                            placeholder="例：相撲 太郎"
                                            className="w-full py-2.5 bg-transparent border-b border-gray-200 focus:outline-none focus:border-sumo-brand transition-all font-medium text-base text-sumo-dark placeholder-gray-300"
                                        />
                                        {state?.error?.name && (
                                            <p className="text-red-500 text-xs font-bold">{state.error.name[0]}</p>
                                        )}
                                    </div>

                                    <div className="group flex flex-col gap-1.5 pb-8 md:pb-7">
                                        <label htmlFor="reg-email" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                                            <Mail size={14} /> メールアドレス <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            id="reg-email"
                                            name="email"
                                            type="email"
                                            required
                                            defaultValue={state?.inputs?.email}
                                            placeholder="example@sumome.jp"
                                            className="w-full py-2.5 bg-transparent border-b border-gray-200 focus:outline-none focus:border-sumo-brand transition-all font-medium text-base text-sumo-dark placeholder-gray-300"
                                        />
                                        {state?.error?.email && (
                                            <p className="text-red-500 text-xs font-bold">{state.error.email[0]}</p>
                                        )}
                                    </div>

                                    <div className="group flex flex-col gap-1.5 pb-3 md:pb-7">
                                        <label htmlFor="reg-password" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-sumo-brand transition-colors">
                                            <Lock size={14} /> パスワード <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            id="reg-password"
                                            name="password"
                                            type="password"
                                            required
                                            placeholder="8文字以上の半角英数字"
                                            className="w-full py-2.5 bg-transparent border-b border-gray-200 focus:outline-none focus:border-sumo-brand transition-all font-medium text-base text-sumo-dark placeholder-gray-300"
                                        />
                                        {state?.error?.password && (
                                            <p className="text-red-500 text-xs font-bold">{state.error.password[0]}</p>
                                        )}
                                    </div>

                                    {/* 条款与提交（モバイルは上余白を詰める） */}
                                    <div className="pt-1 md:pt-8">
                                        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
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
                                                "w-full py-4 rounded-xl text-sm font-bold uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-3",
                                                "bg-sumo-dark text-white hover:bg-sumo-brand active:scale-[0.98]",
                                                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                                            )}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" /> 登録中...
                                                </>
                                            ) : (
                                                <>
                                                    アカウントを作成
                                                    <ArrowRight
                                                        size={14}
                                                        className="group-hover:translate-x-1 transition-transform duration-300"
                                                    />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 text-center">
                                    <p className="text-sm font-medium text-gray-500">
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

export default RegistrationForm;