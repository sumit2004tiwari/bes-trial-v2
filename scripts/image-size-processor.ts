import { promises as fsp } from "fs";
import path from "path";
import sharp from "sharp";

const publicDir = path.resolve(process.cwd(), "public");
const outDir = path.resolve(process.cwd(), "generated");
const outFile = path.join(outDir, "image-sizes.json");

const IMAGE_EXTS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
  ".svg",
]);

type ImageInfo = {
  width: number;
  height: number;
  bytes: number;
};

async function walk(dir: string): Promise<string[]> {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

function parseSvgSize(xml: string): { width: number; height: number } | null {
  const attr = (name: string) => {
    const match = xml.match(
      new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i")
    );
    if (!match) return null;
    const value = parseFloat(match[1]);
    return Number.isFinite(value) ? value : null;
  };

  const width = attr("width");
  const height = attr("height");
  if (width && height) return { width, height };

  const viewBox = xml.match(/viewBox\s*=\s*["']([^"']+)["']/i);
  if (viewBox) {
    const parts = viewBox[1].trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts.every(Number.isFinite)) {
      return { width: parts[2], height: parts[3] };
    }
  }
  return null;
}

async function getImageInfo(
  filePath: string,
  ext: string,
  bytes: number
): Promise<ImageInfo | null> {
  try {
    if (ext === ".svg") {
      const xml = await fsp.readFile(filePath, "utf8");
      const size = parseSvgSize(xml);
      if (!size) return null;
      return { ...size, bytes };
    }

    const metadata = await sharp(filePath).metadata();
    if (!metadata.width || !metadata.height) return null;
    return { width: metadata.width, height: metadata.height, bytes };
  } catch (error) {
    console.warn(`⚠️  Could not read dimensions for ${filePath}:`, error);
    return null;
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
    `▶️  [image-size-processor] Start: scanning images under ${publicDir}`
  );
  const files = await walk(publicDir);
  const images = files.filter((file) =>
    IMAGE_EXTS.has(path.extname(file).toLowerCase())
  );
  console.log(`    Found ${images.length} image file(s)`);

  const map: Record<string, ImageInfo> = {};
  const concurrency = 16;
  let index = 0;
  let skipped = 0;

  const workers = Array.from({ length: Math.min(concurrency, images.length) }, async () => {
    while (index < images.length) {
      const file = images[index++];
      const ext = path.extname(file).toLowerCase();
      const stats = await fsp.stat(file);
      const info = await getImageInfo(file, ext, stats.size);
      if (!info) {
        skipped += 1;
        continue;
      }
      const webPath = "/" + path.relative(publicDir, file).split(path.sep).join("/");
      map[webPath] = info;
    }
  });
  await Promise.all(workers);

  const sorted = Object.fromEntries(
    Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  );

  await fsp.writeFile(outFile, JSON.stringify(sorted, null, 2));

  console.log(
    `🏁 [image-size-processor] Done: wrote ${Object.keys(sorted).length} image size(s) to ${outFile}` +
      (skipped > 0 ? ` (${skipped} skipped)` : "") +
      ` in ${((Date.now() - start) / 1000).toFixed(2)}s`
  );
}

main().catch((error) => {
  console.error("❌ Image size processor failed:", error);
  process.exit(1);
});