# LOGO / Favicon 置き場

このプロジェクトでは、favicon を `src/app/icon.svg` で生成する想定にしています（Next.js App Router のファイル規約）。

## favicon を差し替える手順

1. `src/app/icon.svg` を、あなたの SUMOME ロゴに置き換えます。
2. 次に iOS のホーム画面アイコン等を追加したい場合は、`apple-icon` 相当のファイルも用意してください（必要に応じて）。
3. Vercel に再デプロイします。

## 推奨サイズ

- favicon: 32x32 もしくは 48x48 相当の見た目になるように（SVG はスケールされます）
- 文字を含む場合は、主要ブラウザで小さく表示されても読めるデザインにしてください

