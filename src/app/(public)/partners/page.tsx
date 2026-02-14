"use client";

import React, { useEffect } from "react";
import Link from "@/components/ui/TransitionLink";
import {
    ShieldCheck,
    LayoutDashboard,
    Users,
    MousePointerClick,
    Sparkles,
    FileText,
    PenTool,
} from "lucide-react";

import Ceramic from "@/components/ui/Ceramic";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// 品牌蓝
const BRAND_BLUE = "#2454a4";

const PartnersPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div
            className="min-h-screen bg-[#F4F5F7] font-sans selection:text-white"
            style={{ "--selection-bg": BRAND_BLUE } as React.CSSProperties}
        >
            <style jsx global>{`
        ::selection {
          background-color: var(--selection-bg);
        }
      `}</style>

            {/* ==================== 1. B2B Hero Section ==================== */}
            <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-white">
                {/* 背景装饰 */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-2/3 h-full bg-blue-50/50 skew-x-[-12deg] translate-x-1/4"></div>
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                            backgroundSize: "40px 40px",
                        }}
                    ></div>
                </div>

                <div className="container mx-auto max-w-6xl px-6 relative z-10">
                    <div className="flex flex-col items-center max-w-2xl mx-auto text-center">
                        {/* Hero 文案 */}
                        <div className="animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-6 border border-blue-100">
                                <Sparkles size={12} />
                                For Club Owners
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-gray-900 leading-[1.1] mb-6">
                                あなたの道場を、<br />
                                <span className="text-[#2454a4]">もっと世界へ。</span>
                            </h1>

                            <p className="text-lg text-gray-500 font-medium leading-relaxed mb-8">
                                SUMOMEは、日本最大級の相撲クラブ検索プラットフォームです。
                                <br className="hidden md:inline" />
                                クラブの魅力を発信し、新しい仲間やファンとの出会いを創出します。
                                掲載・管理ツールはすべて
                                <span className="font-black text-sumo-red">無料</span>です。
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    href="/manager/entry"
                                    className="px-8 py-4 bg-[#2454a4] text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                                >
                                    <span className="flex items-center gap-2 font-bold tracking-widest">
                                        無料で掲載を始める
                                    </span>
                                </Button>
                                <Link
                                    href="#features"
                                    className="px-8 py-4 bg-white border border-gray-200 text-gray-600 font-bold tracking-widest rounded-sm hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-center"
                                >
                                    機能を見る
                                </Link>
                            </div>

                            <p className="mt-4 text-xs text-gray-400 font-medium">
                                ※ 登録には審査があります。最短3分で申請完了。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 2. Why SUMOME? (保持不变) ==================== */}
            <section id="features" className="py-24 px-6 relative z-10">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                            選ばれる3つの理由
                        </h2>
                        <p className="text-gray-500">
                            道場運営の負担を減らし、成果を最大化する機能が揃っています。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <Ceramic
                            interactive={false}
                            className="bg-white p-8 border-b-[4px]"
                            style={{ borderBottomColor: BRAND_BLUE }}
                        >
                            <div className="w-12 h-12 bg-blue-50 text-[#2454a4] rounded-xl flex items-center justify-center mb-6">
                                <MousePointerClick size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                圧倒的な集客力
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                相撲に関心のあるユーザーが集まるプラットフォームだから、
                                一般的なSNSやHPよりも高い確率で入会に繋がります。
                            </p>
                        </Ceramic>

                        {/* Feature 2 */}
                        <Ceramic
                            interactive={false}
                            className="bg-white p-8 border-b-[4px]"
                            style={{ borderBottomColor: BRAND_BLUE }}
                        >
                            <div className="w-12 h-12 bg-blue-50 text-[#2454a4] rounded-xl flex items-center justify-center mb-6">
                                <LayoutDashboard size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                簡単ページ作成
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                専門知識は不要。ブログを書くような感覚で、
                                魅力的なクラブ紹介ページや募集要項を作成・更新できます。
                            </p>
                        </Ceramic>

                        {/* Feature 3 */}
                        <Ceramic
                            interactive={false}
                            className="bg-white p-8 border-b-[4px]"
                            style={{ borderBottomColor: BRAND_BLUE }}
                        >
                            <div className="w-12 h-12 bg-blue-50 text-[#2454a4] rounded-xl flex items-center justify-center mb-6">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                信頼性の向上
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                SUMOMEの公式認証マークが付与されることで、
                                保護者や初心者の方にも安心して選んでいただけるようになります。
                            </p>
                        </Ceramic>
                    </div>
                </div>
            </section>

            {/* ==================== 3. Steps (流程指引) ==================== */}
            <section className="py-24 bg-white border-y border-gray-100">
                <div className="container mx-auto max-w-6xl px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                            掲載までの流れ
                        </h2>
                        <p className="text-gray-500">
                            わずか3ステップで、あなたのクラブページが完成します。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Step 1 */}
                        <div className="relative group">
                            <div className="bg-[#F8FAFC] rounded-2xl p-8 border border-gray-100 h-full relative z-10 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-full bg-sumo-brand text-white font-black flex items-center justify-center text-lg mb-6 shadow-md">
                                    1
                                </div>
                                <div className="mb-4 text-sumo-brand">
                                    <MousePointerClick size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    アカウント作成
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    メールアドレスと基本情報を入力して、無料の管理者アカウントを作成します。
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative group">
                            <div className="bg-[#F8FAFC] rounded-2xl p-8 border border-gray-100 h-full relative z-10 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-full bg-sumo-brand text-white font-black flex items-center justify-center text-lg mb-6 shadow-md">
                                    2
                                </div>
                                <div className="mb-4 text-sumo-brand">
                                    <PenTool size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    クラブ情報の入力
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    道場の写真、稽古スケジュール、指導方針などを専用フォームに入力します。
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative group">
                            <div className="bg-[#F8FAFC] rounded-2xl p-8 border border-gray-100 h-full relative z-10 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-full bg-sumo-brand text-white font-black flex items-center justify-center text-lg mb-6 shadow-md">
                                    3
                                </div>
                                <div className="mb-4 text-sumo-brand">
                                    <FileText size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    審査・公開
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    運営事務局による簡単な確認後、サイトに即時公開されます。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 4. Bottom CTA ==================== */}
            <section className="py-32 px-6">
                <div className="container mx-auto max-w-4xl">
                    <Ceramic
                        interactive={false}
                        className="bg-[#2454a4] text-white p-12 md:p-16 text-center border-none shadow-2xl relative overflow-hidden"
                    >
                        {/* 背景光效 */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-serif font-black mb-6">
                                今すぐ、掲載を始めましょう
                            </h2>
                            <p className="text-blue-100 mb-10 max-w-lg mx-auto leading-relaxed">
                                初期費用・月額費用は一切かかりません。
                                <br />
                                あなたの道場の魅力を、全国へ届けませんか？
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button
                                    href="/manager/entry"
                                    className="px-6 sm:px-10 py-4 sm:py-5 bg-white text-[#2454a4] shadow-lg hover:shadow-xl hover:bg-gray-50 border-none"
                                >
                                    <span className="flex items-center gap-2 font-bold tracking-widest text-sm sm:text-base whitespace-nowrap">
                                        <Users className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" />
                                        アカウント作成
                                    </span>
                                </Button>
                            </div>
                            <p className="mt-6 text-xs text-blue-200 opacity-80">
                                Already have an account?{" "}
                                <Link
                                    href="/manager/login"
                                    className="underline hover:text-white font-bold"
                                >
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </Ceramic>
                </div>
            </section>
        </div>
    );
};

export default PartnersPage;