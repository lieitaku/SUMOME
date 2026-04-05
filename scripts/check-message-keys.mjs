#!/usr/bin/env node
/**
 * Compare key paths in messages/ja.json vs messages/en.json (nested keys joined with ".").
 * Exits with code 1 if the sets differ. Run in CI: npm run messages:check
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function flattenKeys(obj, prefix = "") {
  /** @type {string[]} */
  const out = [];
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    throw new Error(`Expected object at "${prefix || "(root)"}"`);
  }
  for (const k of Object.keys(obj).sort()) {
    const v = obj[k];
    const p = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      out.push(...flattenKeys(v, p));
    } else {
      out.push(p);
    }
  }
  return out;
}

function loadJson(rel) {
  const raw = fs.readFileSync(path.join(root, rel), "utf8");
  return JSON.parse(raw);
}

const ja = loadJson("messages/ja.json");
const en = loadJson("messages/en.json");

const jaKeys = new Set(flattenKeys(ja));
const enKeys = new Set(flattenKeys(en));

const onlyJa = [...jaKeys].filter((k) => !enKeys.has(k)).sort();
const onlyEn = [...enKeys].filter((k) => !jaKeys.has(k)).sort();

if (onlyJa.length === 0 && onlyEn.length === 0) {
  console.log(`messages: ok (${jaKeys.size} keys in both ja and en)`);
  process.exit(0);
}

console.error("messages: ja/en key mismatch");
if (onlyJa.length) {
  console.error("\nMissing in en.json:");
  onlyJa.forEach((k) => console.error(`  - ${k}`));
}
if (onlyEn.length) {
  console.error("\nMissing in ja.json:");
  onlyEn.forEach((k) => console.error(`  - ${k}`));
}
process.exit(1);
