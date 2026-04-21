"use client";

import React, { useState, useTransition } from "react";
import { flushSync } from "react-dom";
import { Save, UserPlus, Trash2, Loader2, Languages, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { createStaffAccount, updateMyProfile, updatePassword, deleteMyAccount } from "@/lib/actions/users";
import {
  getBatchTranslationTargets,
  runOneBatchTranslation,
  revalidateAfterBatchTranslation,
} from "@/lib/actions/translations";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

// --- Profile Form ---
export function ProfileForm({ initialName }: { initialName: string }) {
    const [isPending, startTransition] = useTransition();

    return (
        <form action={(formData) => {
            startTransition(async () => {
                const res = await updateMyProfile(formData);
                if (res.error) toast.error(res.error);
                else toast.success("プロフィールを更新しました");
            });
        }} className="space-y-4">
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">表示名</label>
                <input
                    name="name"
                    defaultValue={initialName} // ✨ 回显当前名字
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                    placeholder="名前を入力..."
                />
            </div>
            <div className="flex justify-end">
                <button disabled={isPending} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors disabled:opacity-50">
                    <Save size={14} /> {isPending ? "更新中..." : "更新する"}
                </button>
            </div>
        </form>
    );
}

// --- Password Form ---
export function PasswordForm() {
    const [isPending, startTransition] = useTransition();

    return (
        <form action={(formData) => {
            startTransition(async () => {
                const res = await updatePassword(formData);
                if (res.error) toast.error(res.error);
                else {
                    toast.success("パスワードを変更しました");
                    // 实际上这里最好清空一下输入框，但在 Server Action 模式下如果不刷新页面比较麻烦，暂时这样即可
                }
            });
        }} className="space-y-4">
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">新しいパスワード</label>
                <input name="password" type="password" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium" placeholder="8文字以上" />
            </div>
            <div className="flex justify-end">
                <button disabled={isPending} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors disabled:opacity-50">
                    <Save size={14} /> {isPending ? "変更中..." : "パスワード変更"}
                </button>
            </div>
        </form>
    );
}

// --- Create Staff Form ---
export function CreateStaffForm() {
    const [isPending, startTransition] = useTransition();

    return (
        <form action={(formData) => {
            startTransition(async () => {
                const res = await createStaffAccount(formData);
                if (res.error) toast.error(res.error);
                else toast.success("管理者アカウントを作成しました");
            });
        }} className="space-y-5">
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">名前</label>
                <input name="name" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-sumo-brand text-sm font-medium" placeholder="山田 太郎" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">メールアドレス</label>
                <input name="email" type="email" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-sumo-brand text-sm font-medium" placeholder="colleague@sumo.com" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">初期パスワード</label>
                <input name="password" type="password" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-sumo-brand text-sm font-medium" placeholder="8文字以上" />
            </div>

            <button disabled={isPending} className="w-full bg-sumo-brand text-white py-3.5 rounded-xl font-bold hover:bg-sumo-dark transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <UserPlus size={18} />
                {isPending ? "作成中..." : "管理者アカウントを作成"}
            </button>
        </form>
    );
}

const CONFIRM_WORD = "削除";

// --- Image Migration Card ---
export function ImageMigrationCard() {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">画像フォーマット遷移</h2>
                    <p className="text-xs text-gray-400">古い画像をWebPに変換します</p>
                </div>
            </div>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                サイトの読み込み速度を向上させるため、アップロード済みの画像を最新のフォーマット（WebP）に一括変換するツールです。
            </p>
            <Link
                href="/admin/settings/migration"
                className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
            >
                ツールを開く
            </Link>
        </div>
    );
}
export function DeleteAccountForm({
    role,
    canDelete,
    blockReason,
}: {
    role: "ADMIN" | "OWNER";
    canDelete: boolean;
    blockReason?: string;
}) {
    const [confirmValue, setConfirmValue] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canDelete || confirmValue !== CONFIRM_WORD) {
            if (confirmValue !== CONFIRM_WORD) toast.error(`「${CONFIRM_WORD}」と入力して確認してください。`);
            return;
        }
        startTransition(async () => {
            const res = await deleteMyAccount();
            if (res?.error) {
                toast.error(res.error);
            }
            // 成功時は deleteMyAccount 内で redirect される
        });
    };

    if (!canDelete && blockReason) {
        return (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm font-bold text-amber-800">{blockReason}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">
                    確認のため「{CONFIRM_WORD}」と入力
                </label>
                <input
                    type="text"
                    value={confirmValue}
                    onChange={(e) => setConfirmValue(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium placeholder-gray-400"
                    placeholder={CONFIRM_WORD}
                    disabled={isPending}
                />
            </div>
            <button
                type="submit"
                disabled={isPending || confirmValue !== CONFIRM_WORD}
                className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                {isPending ? "削除中..." : "アカウントを削除する"}
            </button>
        </form>
    );
}

/** 実際に Gemini を叩いたレコードのあとに空ける待機（RPM 対策） */
const BATCH_ITEM_DELAY_MS = 4500;
/** 既に訳が揃って API をスキップした場合は短くてよい */
const BATCH_SKIP_DELAY_MS = 80;

/** 管理者：クラブ・雑誌の機械翻訳を一括実行（既存訳はスキップ） */
export function BatchTranslateCard() {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [progress, setProgress] = useState({ current: 0, total: 0, label: "" });
  const [lastError, setLastError] = useState<string | null>(null);

  const pct =
    progress.total > 0 ? Math.min(100, Math.round((progress.current / progress.total) * 100)) : 0;
  const indeterminate = phase === "running" && progress.total === 0;

  const startBatch = () => {
    setLastError(null);
    flushSync(() => {
      setPhase("running");
      setProgress({
        current: 0,
        total: 0,
        label: "サーバーから対象一覧を取得しています…",
      });
    });

    void (async () => {
      const res = await getBatchTranslationTargets();
      if ("error" in res) {
        setLastError(res.error);
        toast.error(res.error);
        setPhase("idle");
        return;
      }
      const items = "items" in res && Array.isArray(res.items) ? res.items : [];
      if (items.length === 0) {
        toast.message("翻訳対象のクラブ・フォトブック・活動がありません。");
        setPhase("idle");
        return;
      }

      flushSync(() => {
        setProgress({ current: 0, total: items.length, label: "準備中…" });
      });

      let successCount = 0;
      let skippedCount = 0;
      let translatedCount = 0;
      const failureLines: string[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemLabel = `${item.type === "club" ? "クラブ" : item.type === "magazine" ? "フォトブック" : "活動"}: ${item.label}`;
        flushSync(() => {
          setProgress({
            current: i,
            total: items.length,
            label: `処理中: ${i + 1}/${items.length}（${itemLabel}）`,
          });
        });
        const one = await runOneBatchTranslation(item.type, item.id);
        if ("error" in one) {
          failureLines.push(`${itemLabel}: ${one.error}`);
        } else {
          successCount += 1;
          if (one.skipped) skippedCount += 1;
          else translatedCount += 1;
        }
        flushSync(() => {
          setProgress({
            current: i + 1,
            total: items.length,
            label: `処理中: ${i + 1}/${items.length}（${itemLabel}）`,
          });
        });
        if (i < items.length - 1) {
          const delay =
            "error" in one
              ? BATCH_SKIP_DELAY_MS
              : one.skipped
                ? BATCH_SKIP_DELAY_MS
                : BATCH_ITEM_DELAY_MS;
          await new Promise((r) => setTimeout(r, delay));
        }
      }

      const rev = await revalidateAfterBatchTranslation();
      if ("error" in rev) {
        setLastError(rev.error);
        toast.error(rev.error);
        setPhase("idle");
        return;
      }

      const failCount = failureLines.length;
      if (failCount > 0) {
        const summary =
          `成功 ${successCount} 件（新規翻訳 ${translatedCount}・スキップ ${skippedCount}）・失敗 ${failCount} 件（全 ${items.length} 件）。` +
          (failureLines.length > 0
            ? `\n失敗例（最大5件）:\n${failureLines.slice(0, 5).join("\n")}`
            : "");
        setLastError(summary);
        toast.warning(`一括処理完了: 成功 ${successCount} / 失敗 ${failCount}`);
      } else {
        setLastError(null);
        toast.success(
          skippedCount === items.length
            ? `すべて既に翻訳済みでした（${skippedCount} 件スキップ）。`
            : `一括翻訳が完了しました（新規 ${translatedCount} 件・スキップ ${skippedCount} 件）。`
        );
      }
      setPhase("done");
    })();
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
          <Languages size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">多言語機械翻訳（一括）</h2>
          <p className="text-xs text-gray-400">まだ訳がない箇所だけ、まとめて補います</p>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-6 leading-relaxed space-y-2">
        <p>
          「翻訳を開始する」を押すと、クラブ・フォトブック・活動を順に確認し、足りない訳だけを自動で追加します。すでに訳がある内容は変わりません。
        </p>
        <p className="text-gray-400">
          完了まで時間がかかることがあります。処理中はこの画面を開いたままお待ちください。終わると、公開サイトの表示が更新されます。
        </p>
      </div>

      {lastError && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-xs font-bold text-red-800 whitespace-pre-wrap break-words">
          {lastError}
        </div>
      )}

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <span>進捗</span>
          <span>
            {phase === "running" || phase === "done"
              ? indeterminate
                ? "取得中…"
                : `${progress.current} / ${progress.total}`
              : "—"}
          </span>
        </div>
        <div className="h-3 rounded-full bg-gray-100 overflow-hidden border border-gray-200/80 shadow-inner">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r transition-[width] duration-500 ease-out",
              indeterminate
                ? "from-violet-400 via-fuchsia-400 to-amber-300 animate-pulse"
                : "from-violet-500 via-fuchsia-500 to-amber-400"
            )}
            style={{
              width: indeterminate ? "100%" : phase === "idle" ? "0%" : `${pct}%`,
            }}
          />
        </div>
        <p className="text-[11px] text-gray-600 font-medium min-h-[2.5rem] leading-snug">
          {phase === "running" ? (
            <>
              <Sparkles className="inline w-3.5 h-3.5 text-violet-500 mr-1 align-text-bottom" />
              {progress.label || "処理中…"}
            </>
          ) : phase === "done" ? (
            <span className="text-emerald-600 font-bold">
              完了しました。公開ページに反映済みです。
              {lastError ? "（一部失敗あり。上記を確認してください）" : ""}
            </span>
          ) : (
            <span className="text-gray-400">準備ができたら、下のボタンを押してください。</span>
          )}
        </p>
      </div>

      <button
        type="button"
        disabled={phase === "running"}
        onClick={() => {
          if (phase === "done") {
            setPhase("idle");
            setProgress({ current: 0, total: 0, label: "" });
            setLastError(null);
            return;
          }
          startBatch();
        }}
        className={cn(
          "lg:mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-xs transition-colors",
          phase === "running"
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : phase === "done"
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-gray-900 text-white hover:bg-gray-800"
        )}
      >
        {phase === "running" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            処理中…
          </>
        ) : phase === "done" ? (
          "もう一度実行"
        ) : (
          <>
            <Languages size={16} />
            翻訳を開始する
          </>
        )}
      </button>
    </div>
  );
}