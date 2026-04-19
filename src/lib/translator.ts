import { GoogleGenerativeAI } from "@google/generative-ai";

/** Prefer 2.5-flash: some projects have free-tier quota 0 on 2.0-flash (429). */
const DEFAULT_MODEL = "gemini-2.5-flash";

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

const PLACEHOLDER_JA = new Set(["未設定", "—", "-"]);

function shouldSkipValue(v: string | null | undefined): boolean {
  const s = v?.trim() ?? "";
  return s === "" || PLACEHOLDER_JA.has(s);
}

/** フィールドキー → 各 target locale への訳文 */
export type MultiLocaleFieldResult = Record<string, Partial<Record<string, string>>>;

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
  const model = client.getGenerativeModel({ model: modelName });

  const localeList = targetLocales.join(", ");
  const prompt = `You are a professional translator for a sumo sports club / magazine website.
The following JSON object contains Japanese text values (keys: field names).
Translate each value into ALL of these locale codes: ${localeList}.
Use natural, idiomatic wording for each target language.

Output ONLY valid JSON with this exact shape:
- Top-level keys MUST match the input keys exactly (${fieldKeys.join(", ")}).
- Each value MUST be an object whose keys are exactly these locale codes: ${targetLocales.map((l) => `"${l}"`).join(", ")}.
- Each locale value is the translation of the Japanese source for that field.
Example shape: {"name":{"en":"...","fr":"..."},"description":{"en":"...","fr":"..."}}
Do not use markdown fences. Do not add commentary.

Input JSON (Japanese values):
${JSON.stringify(subset, null, 2)}`;

  const retries = options?.retries ?? 2;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = stripCodeFences(text);
      const parsed = JSON.parse(cleaned) as unknown;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Gemini response is not a JSON object");
      }
      const out: MultiLocaleFieldResult = {};
      for (const fieldKey of fieldKeys) {
        const fieldVal = (parsed as Record<string, unknown>)[fieldKey];
        if (!fieldVal || typeof fieldVal !== "object" || Array.isArray(fieldVal)) continue;
        const per: Partial<Record<string, string>> = {};
        for (const loc of targetLocales) {
          const v = (fieldVal as Record<string, unknown>)[loc];
          if (typeof v === "string" && v.trim() !== "") per[loc] = v.trim();
        }
        if (Object.keys(per).length > 0) out[fieldKey] = per;
      }
      if (Object.keys(out).length === 0 && fieldKeys.length > 0) {
        console.warn(
          "[translator] Gemini returned no usable multi-locale fields. expected fields:",
          fieldKeys,
          "snippet:",
          cleaned.slice(0, 500)
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
