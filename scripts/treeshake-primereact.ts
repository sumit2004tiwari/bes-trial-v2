import { promises as fsp } from "fs";
import path from "path";
import { PurgeCSS } from "purgecss";

const themeCssPath = path.join(
  process.cwd(),
  "node_modules/primereact/resources/themes/lara-light-cyan/theme.css"
);
const outFile = path.join(
  process.cwd(),
  "app/account_setup/primereact-theme.min.css"
);

async function main() {
  const start = Date.now();
  console.log(
    "▶️  [treeshake-primereact] Start: purging unused PrimeReact theme CSS"
  );

  const result = await new PurgeCSS().purge({
    content: ["app/**/*.{ts,tsx}"],
    css: [themeCssPath],
    safelist: {
      standard: [
        /^p-component/,
        /^p-inputtext/,
        /^p-icon-field/,
        /^p-input-icon/,
        /^p-icon$/,
        /^p-password/,
        /^p-divider/,
        /^p-invalid/,
        /^p-input-filled/,
        /^weak$/,
        /^medium$/,
        /^strong$/,
      ],
    },
  });

  const originalBytes = (await fsp.stat(themeCssPath)).size;
  let css = (result[0]?.css ?? "").trim().replace(/@font-face\s*\{[^}]*\}/g, "");
  css = css.trim() + "\n";

  await fsp.writeFile(outFile, css);

  const savings = (100 - (css.length / originalBytes) * 100).toFixed(1);
  console.log(
    `🏁 [treeshake-primereact] Done: ${originalBytes} -> ${css.length} bytes ` +
      `(${savings}% smaller) → ${outFile} in ${((Date.now() - start) / 1000).toFixed(2)}s`
  );
}

main().catch((error) => {
  console.error("❌ treeshake-primereact failed:", error);
  process.exit(1);
});