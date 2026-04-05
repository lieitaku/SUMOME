import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const prefDir = join(root, "src/data/prefectures");
const introsPath = join(prefDir, "intros-en.json");

const ids = readdirSync(prefDir)
  .filter((f) => f.endsWith(".ts") && !["index.ts", "intros-en.ts"].includes(f))
  .map((f) => f.replace(/\.ts$/, ""));

const data = JSON.parse(readFileSync(introsPath, "utf8"));
let err = 0;
for (const id of ids) {
  const row = data[id];
  if (!row?.introTitleEn?.trim() || !row?.introTextEn?.trim()) {
    console.error(`Missing EN intro for slug: ${id}`);
    err++;
  }
}
const extra = Object.keys(data).filter((k) => !ids.includes(k));
if (extra.length) {
  console.error("Unexpected keys in intros-en.json (no matching prefecture file):", extra.join(", "));
  err++;
}
if (err) process.exit(1);
console.log(`prefecture intros-en OK (${ids.length} prefectures)`);
