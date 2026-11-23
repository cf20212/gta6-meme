// gta6-meme-x-01 entry program (Node 22, standard library only).
//
// The entry itself is a post on X: a GTA 6 meme whose picture carries
// make.fun's ghost and whose text carries the bounty pitch and play code.
// This program's only job is to copy POST.json — which names that post —
// from the repository root into the output directory, where the gate
// reads it. Nothing else is judged from this program's output.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outputDir, "POST.json");

try {
  mkdirSync(outputDir, { recursive: true });
  copyFileSync(join(repoDir, "POST.json"), target);
  // Read the copy back and check it still parses as the {url} object the
  // gate expects, so a truncated copy fails loudly here instead of there.
  const parsed = JSON.parse(readFileSync(target, "utf8")) as { url?: unknown };
  if (typeof parsed.url !== "string" || parsed.url.length === 0) {
    throw new Error("POST.json in the output has no url string");
  }
  console.log(`POST.json copied to ${target} (url: ${parsed.url})`);
} catch (err) {
  console.error(`gta6-meme-x-01: ${(err as Error).message}`);
  process.exit(1);
}
