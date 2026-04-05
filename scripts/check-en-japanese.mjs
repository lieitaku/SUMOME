/**
 * Flags likely Japanese/CJK characters left in messages/en.json values.
 * Excludes keys that intentionally keep Japanese (see allow list).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const enPath = path.join(__dirname, "../messages/en.json");

const CJK = /[\u3040-\u30ff\u3400-\u9fff]/;

const KEY_ALLOW = (key) =>
  key.includes("inquiryStorage_") ||
  key.includes(".shin") ||
  key.includes(".gi") ||
  key.includes(".tai") ||
  key === "LocaleSwitcher.ja";

function flatten(obj, prefix = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) out.push(...flatten(v, p));
    else if (typeof v === "string") out.push([p, v]);
  }
  return out;
}

const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
const issues = [];
for (const [key, value] of flatten(en)) {
  if (KEY_ALLOW(key)) continue;
  if (CJK.test(value)) issues.push(`${key}: ${value.slice(0, 80)}${value.length > 80 ? "…" : ""}`);
}

if (issues.length) {
  console.error("en.json values contain CJK (possible stray Japanese):\n");
  for (const line of issues) console.error(line);
  process.exit(1);
}
console.log("en.json: no unexpected CJK in values");
