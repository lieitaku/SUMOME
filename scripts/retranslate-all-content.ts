import "./bootstrap-env";

/**
 * 既存のクラブ・広報誌・活動について、DB の日文から機械翻訳を一括再実行する。
 *
 * 使用（プロジェクト直下で `.env` / `.env.local` を読み込み）:
 *   npx tsx scripts/retranslate-all-content.ts
 *   npx tsx scripts/retranslate-all-content.ts --only-missing
 *
 * --only-missing … 各レコードの日文フィールドに対し、AUTO_TRANSLATE_LOCALES の
 *   全キーが translations に揃っている場合はスキップ（API 節約）。
 *
 * 要: GEMINI_API_KEY、任意で AUTO_TRANSLATE_LOCALES / GEMINI_MODEL
 */
import { prisma } from "../src/lib/db";
import {
  buildActivityJaPayload,
  buildClubJaPayload,
  buildMagazineJaPayload,
  translateAndPersistActivity,
  translateAndPersistClub,
  translateAndPersistMagazine,
} from "../src/lib/auto-translate-on-save";
import { translationDocCoversPayload } from "../src/lib/document-translations";
import { getAutoTranslateTargetLocales } from "../src/lib/translator";

const DELAY_MS = 4500;

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const onlyMissing = process.argv.includes("--only-missing");

  if (!process.env.GEMINI_API_KEY?.trim()) {
    console.error("GEMINI_API_KEY が未設定です。中止します。");
    process.exit(1);
  }

  const targetLocales = getAutoTranslateTargetLocales();
  if (targetLocales.length === 0) {
    console.error("AUTO_TRANSLATE_LOCALES が空です。中止します。");
    process.exit(1);
  }

  const clubs = await prisma.club.findMany({
    where: { slug: { not: "official-hq" } },
    select: {
      id: true,
      slug: true,
      translations: true,
      name: true,
      description: true,
      city: true,
      address: true,
      target: true,
      schedule: true,
      representative: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  console.log(`Clubs: ${clubs.length} 件 (--only-missing=${onlyMissing})`);
  for (const c of clubs) {
    const payload = buildClubJaPayload(c);
    const keys = Object.keys(payload);
    if (keys.length === 0) {
      console.log(`  club ${c.slug} ... skip (日文フィールドなし)`);
      continue;
    }
    if (
      onlyMissing &&
      translationDocCoversPayload(c.translations, keys, targetLocales)
    ) {
      console.log(`  club ${c.slug} ... skip (既に全 locale あり)`);
      continue;
    }
    process.stdout.write(`  club ${c.slug} ... `);
    await translateAndPersistClub(c.id, { skipCacheRevalidation: true });
    console.log("ok");
    await sleep(DELAY_MS);
  }

  const mags = await prisma.magazine.findMany({
    select: {
      id: true,
      slug: true,
      translations: true,
      title: true,
      description: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  console.log(`Magazines: ${mags.length} 件`);
  for (const m of mags) {
    const payload = buildMagazineJaPayload(m);
    const keys = Object.keys(payload);
    if (keys.length === 0) {
      console.log(`  magazine ${m.slug} ... skip (日文フィールドなし)`);
      continue;
    }
    if (
      onlyMissing &&
      translationDocCoversPayload(m.translations, keys, targetLocales)
    ) {
      console.log(`  magazine ${m.slug} ... skip (既に全 locale あり)`);
      continue;
    }
    process.stdout.write(`  magazine ${m.slug} ... `);
    await translateAndPersistMagazine(m.id, { skipCacheRevalidation: true });
    console.log("ok");
    await sleep(DELAY_MS);
  }

  const acts = await prisma.activity.findMany({
    select: {
      id: true,
      slug: true,
      translations: true,
      title: true,
      content: true,
      customRoute: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  console.log(`Activities: ${acts.length} 件`);
  for (const a of acts) {
    const payload = buildActivityJaPayload({
      title: a.title,
      content: a.content,
      customRoute: a.customRoute,
    });
    const keys = Object.keys(payload);
    if (keys.length === 0) {
      console.log(`  activity ${a.slug} ... skip (日文フィールドなし)`);
      continue;
    }
    if (
      onlyMissing &&
      translationDocCoversPayload(a.translations, keys, targetLocales)
    ) {
      console.log(`  activity ${a.slug} ... skip (既に全 locale あり)`);
      continue;
    }
    process.stdout.write(`  activity ${a.slug} ... `);
    await translateAndPersistActivity(a.id, { skipCacheRevalidation: true });
    console.log("ok");
    await sleep(DELAY_MS);
  }

  console.log("完了");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
