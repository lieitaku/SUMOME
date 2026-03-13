import React from "react";
import type { Metadata } from "next";
import Link from "@/components/ui/TransitionLink";
import { CheckCircle2, Home } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "アカウント削除完了 | SUMOME",
  robots: "noindex, nofollow",
};

export default function AccountDeletedPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-emerald-600" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            アカウントは正常に削除されました
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            ご利用ありがとうございました。
            <br />
            またのご登録をお待ちしております。
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-sumo-brand text-white rounded-xl font-bold text-sm hover:bg-sumo-dark transition-colors shadow-lg"
        >
          <Home size={18} />
          ホームへ戻る
        </Link>
      </div>
    </div>
  );
}
