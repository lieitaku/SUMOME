import React from "react";
import Link from "@/components/ui/TransitionLink";
import {
    Megaphone, // for News
    Camera,    // for Report
    CalendarDays, // for Event
    Code,      // for Custom
    ArrowRight, Sparkles
} from "lucide-react";
import { confirmAdmin } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function SelectTemplatePage() {
    const admin = await confirmAdmin();
    if (!admin) redirect("/manager/login");

    const templates = [
        {
            id: "news",
            title: "News (ニュース)",
            desc: "重要なお知らせやプレスリリース。テキスト主体で情報を正確に伝えます。",
            icon: <Megaphone size={32} className="text-orange-500" />,
            features: ["プレスリリース形式", "シンプルレイアウト", "速報性に最適"],
            color: "bg-orange-50/50 border-orange-200 hover:border-orange-400",
            accent: "group-hover:text-orange-600"
        },
        {
            id: "report",
            title: "Report (活動報告)",
            desc: "大会やイベントの様子を、豊富な写真とともに振り返ります。",
            icon: <Camera size={32} className="text-blue-500" />,
            features: ["ギャラリー表示", "写真キャプション", "ストーリー構成"],
            color: "bg-blue-50/50 border-blue-200 hover:border-blue-400",
            accent: "group-hover:text-blue-600"
        },
        {
            id: "event",
            title: "Event (イベント告知)",
            desc: "今後のイベント集客に。日時・場所・申込ボタンを強調します。",
            icon: <CalendarDays size={32} className="text-emerald-500" />,
            features: ["ポスター風デザイン", "開催データ強調", "参加ボタン"],
            color: "bg-emerald-50/50 border-emerald-200 hover:border-emerald-400",
            accent: "group-hover:text-emerald-600"
        },
        {
            id: "custom",
            title: "Custom (専門モード)",
            desc: "コードベースで完全なカスタマイズを行います。開発者・デザイナー向け。",
            icon: <Code size={32} className="text-purple-500" />,
            features: ["Reactコンポーネント", "自由なレイアウト", "特殊演出"],
            color: "bg-slate-50 border-purple-200 hover:border-purple-400",
            accent: "group-hover:text-purple-600"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto py-20 px-6 font-sans">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                    新規作成する記事タイプを選択
                </h1>
                <p className="text-slate-500 font-medium">
                    目的に合わせて最適なテンプレート、または作成モードを選んでください。
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {templates.map((t) => (
                    <Link
                        key={t.id}
                        href={`/admin/activities/new/${t.id}`}
                        className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full ${t.color} bg-white`}
                    >
                        {/* Icon Header */}
                        <div className="mb-6 bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                            {t.icon}
                        </div>

                        {/* Title & Desc */}
                        <div className="flex-grow">
                            <h3 className={`text-lg font-bold text-slate-800 mb-3 transition-colors ${t.accent}`}>
                                {t.title}
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
                                {t.desc}
                            </p>

                            {/* Features List */}
                            <ul className="space-y-2 mb-8">
                                {t.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <Sparkles size={10} className="text-yellow-400 fill-yellow-400" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Footer Action */}
                        <div className={`mt-auto flex items-center gap-2 text-xs font-bold text-slate-800 ${t.accent} transition-all group-hover:gap-3`}>
                            選択して次へ <ArrowRight size={14} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}