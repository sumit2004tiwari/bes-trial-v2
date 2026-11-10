import { promises as fsp } from "fs";
import path from "path";

const publicDir = path.resolve(process.cwd(), "public");
const outDir = path.resolve(process.cwd(), "generated");
const outFile = path.join(outDir, "public-assets-manifest.json");

function toWebPath(dir: string): string {
  const rel = path.relative(publicDir, dir).split(path.sep).join("/");
  return rel ? `/${rel}` : "/";
}

async function indexDir(
  dir: string,
  index: Record<string, string[]>
): Promise<void> {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  const names: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    names.push(entry.name);
  }

  index[toWebPath(dir)] = names.sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );

  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith(".")) {
      await indexDir(path.join(dir, entry.name), index);
    }
  }
}

async function ensureOutDir() {
  const exists = await fsp
    .access(outDir)
    .then(() => true)
    .catch(() => false);
  if (!exists) {
    await fsp.mkdir(outDir, { recursive: true });
    console.log(`📁 Created output directory: ${outDir}`);
  }
}

async function main() {
  const start = Date.now();
  await ensureOutDir();
  console.log(
    `▶️  [public-assets-manifest] Start: indexing ${publicDir}`
  );

  const index: Record<string, string[]> = {};
  await indexDir(publicDir, index);

  const sorted = Object.fromEntries(
    Object.entries(index).sort(([a], [b]) => a.localeCompare(b))
  );

  await fsp.writeFile(outFile, JSON.stringify(sorted, null, 2));

  const entryCount = Object.values(sorted).reduce((n, v) => n + v.length, 0);
  console.log(
    `🏁 [public-assets-manifest] Done: indexed ${Object.keys(sorted).length} director(ies) / ${entryCount} entry(ies) to ${outFile} in ${((Date.now() - start) / 1000).toFixed(2)}s`
  );
}

main().catch((error) => {
  console.error("❌ Public assets manifest failed:", error);
  process.exit(1);
});
