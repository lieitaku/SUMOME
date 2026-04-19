import { after } from "next/server";

/**
 * Server Action 内で「レスポンス送信後も確実に実行」したい処理用。
 * 単に `void fn()` だとサーバーレス環境でプロセス終了により翻訳が落ちることがある。
 * @see https://nextjs.org/docs/app/api-reference/functions/after
 */
export function scheduleAfterResponse(task: () => Promise<void>): void {
  try {
    after(() =>
      task().catch((e) => {
        console.error("[scheduleAfterResponse]", e);
      })
    );
  } catch {
    void task().catch((e) => {
      console.error("[scheduleAfterResponse] fallback", e);
    });
  }
}
