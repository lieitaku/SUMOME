"use client";

import { useState } from "react";
import { migrateAllImages } from "@/lib/actions/migration";
import { toast } from "sonner";
import { Loader2, Database, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function MigrationPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleMigrate = async () => {
        if (!confirm("データベース内のすべての画像が WebP 形式に変換され、新しいファイルとしてアップロードされます。この処理には数分かかる場合があります。開始してもよろしいですか？")) {
            return;
        }

        setLoading(true);
        try {
            const res = await migrateAllImages();
            if (res.success) {
                setResult(res.stats);
                toast.success("画像の移行が完了しました！");
            } else {
                toast.error("移行に失敗しました: " + res.error);
            }
        } catch (error) {
            toast.error("予期しないエラーが発生しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">画像フォーマット遷移ツール</h1>
                    <p className="text-gray-500 mt-2">データベース内の既存の JPG/PNG 画像を WebP 形式に一括変換します</p>
                </div>
                <Link href="/admin/settings" className="text-sm text-gray-500 hover:text-gray-700 underline">
                    設定に戻る
                </Link>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex gap-4 items-start">
                <AlertTriangle className="text-amber-600 shrink-0" size={24} />
                <div className="text-sm text-amber-800 space-y-2">
                    <p className="font-bold text-base">操作説明：</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>システムは WebP 形式ではない画像を自動的に識別します。</li>
                        <li>画像はダウンロードされ、WebP に変換された後、Supabase に再アップロードされます。</li>
                        <li>データベース内の URL は新しい WebP アドレスに自動的に更新されます。</li>
                        <li>元の画像ファイルはストレージ内に保持されます（削除されません）。</li>
                        <li>画像数が多い場合、タイムアウトが発生する可能性があります。その場合はローカル環境での実行を推奨します。</li>
                    </ul>
                </div>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <Database size={40} />
                </div>
                
                {!result ? (
                    <div className="space-y-4">
                        <p className="text-gray-600">下のボタンをクリックして、すべての画像のスキャンと変換を開始します</p>
                        <button
                            onClick={handleMigrate}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    変換中... ページを閉じないでください
                                </>
                            ) : (
                                "一括移行を開始する"
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-xl">
                            <CheckCircle2 size={24} />
                            移行に成功しました！
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
                            <StatCard label="クラブ" value={result.clubs} />
                            <StatCard label="活動" value={result.activities} />
                            <StatCard label="広報誌" value={result.magazines} />
                            <StatCard label="バナー" value={result.banners} />
                            <StatCard label="都道府県" value={result.prefectureBanners} />
                        </div>
                        <button 
                            onClick={() => setResult(null)}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            もう一度スキャンを実行する
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string, value: number }) {
    return (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</div>
            <div className="text-2xl font-black text-gray-900 mt-1">{value} <span className="text-sm font-normal text-gray-400">件更新済み</span></div>
        </div>
    );
}
