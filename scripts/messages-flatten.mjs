#!/usr/bin/env node
/**
 * Flatten messages/*.json to TSV (key\tvalue) for batch translation workflows.
 * Usage:
 *   node scripts/messages-flatten.mjs ja > messages/ja.flat.tsv
 *   node scripts/messages-flatten.mjs en > messages/en.flat.tsv
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const locale = process.argv[2] || "ja";
if (!["ja", "en"].includes(locale)) {
  console.error("Usage: messages-flatten.mjs <ja|en>");
  process.exit(2);
}

const file = path.join(root, `messages/${locale}.json`);
const data = JSON.parse(fs.readFileSync(file, "utf8"));

/** @param {unknown} obj @param {string} prefix */
function walk(obj, prefix) {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) return;
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    const p = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      walk(v, p);
    } else {
      const line = typeof v === "string" ? v : JSON.stringify(v);
      const escaped = line.replace(/\t/g, " ").replace(/\r?\n/g, "\\n");
      process.stdout.write(`${p}\t${escaped}\n`);
    }
  }
}

walk(data, "");
