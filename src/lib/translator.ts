import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * 既定はコスト重視の Flash-Lite 系。`GEMINI_MODEL` で上書き可能。
 * - `gemini-3.1-flash-lite-preview` … 公式の省コスト・高頻度向け（翻訳用途にも記載あり）
 * - `gemini-2.5-flash-lite` … 2.5 世代の安定版 Flash-Lite
 * - `gemma-4-31b-it` … Gemma（オープン系）同一 API・同一キー。品質は十分だが JSON 厳密性は Gemini より落ちることがある
 * @see https://ai.google.dev/gemini-api/docs/models
 */
const DEFAULT_MODEL = "gemini-3.1-flash-lite-preview";

/** 環境変数 AUTO_TRANSLATE_LOCALES（カンマ区切り、例: en,fr）。未設定時は en のみ。ja は含めない。 */
export function getAutoTranslateTargetLocales(): string[] {
  const raw = process.env.AUTO_TRANSLATE_LOCALES?.trim();
  if (raw) {
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter((l) => l.length > 0 && l !== "ja");
  }
  return ["en"];
}

function getClient(): GoogleGenerativeAI | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  return new GoogleGenerativeAI(key);
}

function stripCodeFences(text: string): string {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```[a-zA-Z]*\s*\n?/, "").replace(/\n?```\s*$/u, "");
  }
  return t.trim();
}

/** Gemini が説明文を付けたりフェンスを崩した場合の救済 */
function tryParseJsonObject(raw: string): unknown | null {
  const cleaned = stripCodeFences(raw.trim());
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        /* fallthrough */
      }
    }
  }
  return null;
}

const PLACEHOLDER_JA = new Set(["未設定", "—", "-"]);

function shouldSkipValue(v: string | null | undefined): boolean {
  const s = v?.trim() ?? "";
  return s === "" || PLACEHOLDER_JA.has(s);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** 1 回の batch 内での generateContent 再試行回数（0 始まりなので +1 回）。RPM 節約のため控えめに。 */
const BATCH_INNER_RETRIES = 1;

/** フィールドキー → 各 target locale への訳文 */
export type MultiLocaleFieldResult = Record<string, Partial<Record<string, string>>>;

function fieldLocalesComplete(
  per: Partial<Record<string, string>> | undefined,
  locales: string[]
): boolean {
  if (!per) return false;
  return locales.every((loc) => typeof per[loc] === "string" && per[loc]!.trim() !== "");
}

/**
 * 複数フィールドをまとめて送ると、Gemini が JSON のトップレベルキーを欠落させることがある。
 * 方針: 最大 2 回の batch（2 回目は空なら全文再試行、部分なら欠損キーのみ）→ まだ欠ける場合のみフィールド単位（間隔付き）。
 */
export async function translateJaFieldsToTargetLocalesWithGapRetry(
  input: Record<string, string>,
  targetLocales: string[],
  options?: { retries?: number }
): Promise<MultiLocaleFieldResult> {
  const keys = Object.keys(input).filter((k) => !shouldSkipValue(input[k]));
  if (keys.length === 0 || targetLocales.length === 0) return {};

  const innerOpts = { ...options, retries: options?.retries ?? BATCH_INNER_RETRIES };

  let merged = await translateJaFieldsToTargetLocales(input, targetLocales, innerOpts);

  const anyIncomplete = (): boolean =>
    keys.some((k) => !fieldLocalesComplete(merged[k], targetLocales));

  const isEmpty = Object.keys(merged).length === 0;
  const needsSecondBatch = isEmpty || anyIncomplete();

  if (needsSecondBatch) {
    await sleep(2000);
    if (isEmpty) {
      const retryFull = await translateJaFieldsToTargetLocales(input, targetLocales, innerOpts);
      merged = retryFull;
    } else {
      const incompleteKeys = keys.filter((k) => !fieldLocalesComplete(merged[k], targetLocales));
      const subInput: Record<string, string> = {};
      for (const k of incompleteKeys) subInput[k] = input[k]!;
      const second = await translateJaFieldsToTargetLocales(subInput, targetLocales, innerOpts);
      merged = { ...merged, ...second };
    }
  }

  const still = keys.filter((k) => !fieldLocalesComplete(merged[k], targetLocales));
  if (still.length === 0) return merged;

  const oneByOne: Record<string, string> = {};
  for (const k of still) oneByOne[k] = input[k]!;
  const sequential = await translateJaFieldsSequentially(oneByOne, targetLocales, innerOpts);
  return { ...merged, ...sequential };
}

/** フィールドを 1 つずつ翻訳してマージ（batch 後も欠損がある場合のフォールバック）。RPM 対策でフィールド間に待機。 */
async function translateJaFieldsSequentially(
  input: Record<string, string>,
  targetLocales: string[],
  options?: { retries?: number }
): Promise<MultiLocaleFieldResult> {
  const out: MultiLocaleFieldResult = {};
  let first = true;
  for (const [key, val] of Object.entries(input)) {
    if (shouldSkipValue(val)) continue;
    if (!first) {
      await sleep(1500);
    }
    first = false;
    const part = await translateJaFieldsToTargetLocales({ [key]: val }, targetLocales, options);
    Object.assign(out, part);
  }
  return out;
}

/**
 * 日文の JSON 片を、指定 locales へ一度に翻訳（1 回の Gemini 呼び出し）。
 * 未設定 GEMINI_API_KEY 時は空オブジェクト。
 */
export async function translateJaFieldsToTargetLocales(
  input: Record<string, string>,
  targetLocales: string[],
  options?: { retries?: number }
): Promise<MultiLocaleFieldResult> {
  const fieldKeys = Object.keys(input).filter((k) => !shouldSkipValue(input[k]));
  if (fieldKeys.length === 0 || targetLocales.length === 0) return {};

  const client = getClient();
  if (!client) {
    console.warn("[translator] GEMINI_API_KEY is not set; skipping auto-translation.");
    return {};
  }

  const subset: Record<string, string> = {};
  for (const k of fieldKeys) subset[k] = input[k]!;

  const modelName = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;

  const localeList = targetLocales.join(", ");
  const prompt = `You are a professional translator for a sumo sports club / magazine website.
The following JSON object contains Japanese text values (keys: field names).
Translate each value into ALL of these locale codes: ${localeList}.
Use natural, idiomatic wording for each target language.

Output ONLY valid JSON with this exact shape:
- Top-level keys MUST match the input keys exactly (${fieldKeys.join(", ")}). Do not omit any key; every input key must appear in the output.
- Each value MUST be an object whose keys are exactly these locale codes: ${targetLocales.map((l) => `"${l}"`).join(", ")}.
- Each locale value is the translation of the Japanese source for that field.
Example shape: {"name":{"en":"...","fr":"..."},"description":{"en":"...","fr":"..."}}
Do not use markdown fences. Do not add commentary.
${
    fieldKeys.includes("schedule")
      ? `
If the key "schedule" is present, its value is a JSON string describing weekly practice times (array of {day, time, note?}). Translate Japanese text inside day/time/note while keeping the string parseable as JSON (escape quotes as needed). Preserve the array structure.`
      : ""
  }

Input JSON (Japanese values):
${JSON.stringify(subset, null, 2)}`;

  const generateWithModel = (jsonMime: boolean) =>
    client.getGenerativeModel({
      model: modelName,
      generationConfig: jsonMime
        ? { responseMimeType: "application/json", maxOutputTokens: 8192 }
        : { maxOutputTokens: 8192 },
    });

  const retries = options?.retries ?? 2;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      let result;
      try {
        result = await generateWithModel(true).generateContent(prompt);
      } catch (apiErr) {
        console.warn("[translator] JSON mime request failed, retrying without responseMimeType:", apiErr);
        result = await generateWithModel(false).generateContent(prompt);
      }
      let text = "";
      try {
        text = result.response.text();
      } catch (textErr) {
        const raw = result.response as {
          promptFeedback?: { blockReason?: string; blockReasonMessage?: string };
          candidates?: { finishReason?: string; finishMessage?: string }[];
        };
        console.warn(
          "[translator] response.text() failed:",
          textErr,
          "block:",
          raw.promptFeedback,
          "finish:",
          raw.candidates?.[0]?.finishReason
        );
        throw textErr;
      }
      if (!text?.trim()) {
        try {
          result = await generateWithModel(false).generateContent(prompt);
          text = result.response.text();
        } catch {
          throw new Error("Empty Gemini response text");
        }
      }
      const parsed = tryParseJsonObject(text);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Gemini response is not a JSON object");
      }
      const out: MultiLocaleFieldResult = {};
      for (const fieldKey of fieldKeys) {
        const fieldVal = (parsed as Record<string, unknown>)[fieldKey];
        if (!fieldVal || typeof fieldVal !== "object" || Array.isArray(fieldVal)) continue;
        const raw = fieldVal as Record<string, unknown>;
        /** Gemini が "EN" 等と返す場合に targetLocales（小文字）へ合わせる */
        const byLower: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(raw)) {
          byLower[k.toLowerCase()] = v;
        }
        const per: Partial<Record<string, string>> = {};
        for (const loc of targetLocales) {
          const v = byLower[loc] ?? raw[loc];
          if (typeof v === "string" && v.trim() !== "") per[loc] = v.trim();
        }
        if (Object.keys(per).length > 0) out[fieldKey] = per;
      }
      if (Object.keys(out).length === 0 && fieldKeys.length > 0) {
        console.warn(
          "[translator] Gemini returned no usable multi-locale fields. expected fields:",
          fieldKeys,
          "snippet:",
          text.slice(0, 500)
        );
      }
      return out;
    } catch (e) {
      lastErr = e;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  console.error("[translator] Gemini multi-locale translate failed after retries:", lastErr);
  return {};
}
