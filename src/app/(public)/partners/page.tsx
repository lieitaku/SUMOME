"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
    CheckCircle2,
    TrendingUp,
    ShieldCheck,
    LayoutDashboard,
    ArrowRight,
    Users,
    MousePointerClick,
    Sparkles,
    BarChart3,
    Bell,
    Search,
    Settings,
    Menu,
    FileText,
    Mail,
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
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* 左侧：文案 (保持不变) */}
                        <div className="lg:w-1/2 animate-fade-in-up">
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

                            <div className="flex flex-col sm:flex-row gap-4">
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

                        {/* 右侧：Dashboard 演示图 (重新设计：丰富内容) */}
                        <div className="lg:w-1/2 relative perspective-1000">
                            {/* 光晕背景 */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-200 to-indigo-100 rounded-3xl blur-2xl opacity-60"></div>

                            <Ceramic
                                interactive={false}
                                className="relative bg-white border border-gray-200 shadow-2xl rounded-xl overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700 p-0"
                            >
                                {/* 模拟浏览器顶栏 */}
                                <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="mx-auto w-1/2 h-4 bg-gray-200 rounded-sm opacity-50"></div>
                                </div>

                                {/* 模拟 Dashboard 界面 */}
                                <div className="flex h-[320px]">
                                    {/* 侧边栏 */}
                                    <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-6 gap-6">
                                        <div className="w-8 h-8 text-sumo-brand rounded-lg flex items-center justify-center text-white">
                                            <span className="font-bold text-xs">S</span>
                                        </div>
                                        <div className="flex flex-col gap-4 text-gray-400">
                                            <LayoutDashboard size={20} className="text-sumo-brand" />
                                            <Users size={20} />
                                            <Mail size={20} />
                                            <Settings size={20} />
                                        </div>
                                    </div>

                                    {/* 主内容区 */}
                                    <div className="flex-1 p-6 bg-white">
                                        {/* Header */}
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-lg">
                                                    管理画面
                                                </h4>
                                                <p className="text-[10px] text-gray-400">
                                                    Welcome back, Master
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="p-2 bg-gray-50 rounded-full text-gray-400">
                                                    <Search size={16} />
                                                </div>
                                                <div className="p-2 bg-gray-50 rounded-full text-gray-400 relative">
                                                    <Bell size={16} />
                                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 卡片 Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* 卡片 1: 访问量统计 */}
                                            <div className="col-span-2 bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">
                                                            Total Views
                                                        </p>
                                                        <div className="flex items-end gap-2">
                                                            <span className="text-2xl font-black text-gray-900">
                                                                8,245
                                                            </span>
                                                            <span className="text-[10px] font-bold text-green-500 flex items-center mb-1">
                                                                <TrendingUp size={10} className="mr-0.5" /> +12%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <BarChart3 size={20} className="text-blue-400" />
                                                </div>
                                                {/* 模拟图表 */}
                                                <div className="flex items-end gap-1 h-12">
                                                    {[30, 45, 35, 60, 50, 75, 65, 80, 55, 90].map(
                                                        (h, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex-1 bg-blue-200 rounded-t-sm hover:bg-blue-400 transition-colors"
                                                                style={{ height: `${h}%` }}
                                                            ></div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>

                                            {/* 卡片 2: 新申请 */}
                                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">
                                                    New Applicants
                                                </p>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-800">
                                                            Yamada T.
                                                        </p>
                                                        <p className="text-[9px] text-gray-400">
                                                            Trial Lesson
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="w-2/3 h-full bg-green-400 rounded-full"></div>
                                                </div>
                                            </div>

                                            {/* 卡片 3: 状态 */}
                                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-1">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                                <p className="text-xs font-bold text-gray-800">
                                                    Verified
                                                </p>
                                                <p className="text-[9px] text-gray-400">
                                                    Public Visible
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Ceramic>
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
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/bg/noise.png')] opacity-10 mix-blend-overlay"></div>
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
                                    className="px-10 py-5 bg-white text-[#2454a4] shadow-lg hover:shadow-xl hover:bg-gray-50 border-none"
                                >
                                    <span className="flex items-center gap-2 font-bold tracking-widest text-base">
                                        <Users size={18} />
                                        アカウント作成（無料）
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