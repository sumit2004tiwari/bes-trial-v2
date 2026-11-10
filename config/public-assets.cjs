/**
 * Single source of truth for public asset folders kept out of serverless
 * function bundles. Add or remove a folder here once — next.config.mjs derives
 * `outputFileTracingExcludes` from this list automatically.
 *
 * Runtime directory listings never touch the filesystem: the whole `public`
 * tree is indexed at build time into `generated/public-assets-manifest.json`
 * by scripts/public-assets-manifest.ts, and app code reads that manifest.
 */
const PUBLIC_ASSET_FOLDERS = [
  "/Images/ImageGallery",
  "/Images/homepage_exclusive_images",
  "/Images/Slider",
  "/Images/previous_council",
  "/Images/expo2020",
  "/pdf/others",
  "/pdf/bes_election",
];

const PUBLIC_ASSET_TRACING_GLOBS = PUBLIC_ASSET_FOLDERS.map(
  (folder) => `./public${folder}/**/*`
);

module.exports = {
  PUBLIC_ASSET_FOLDERS,
  PUBLIC_ASSET_TRACING_GLOBS,
};
