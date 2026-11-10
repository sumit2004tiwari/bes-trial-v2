import sizesJson from "@/generated/image-sizes.json";

export type ImageSizeInfo = {
  width: number;
  height: number;
  bytes: number;
};

const IMAGE_SIZES = sizesJson as Record<string, ImageSizeInfo>;

export function getImageSize(src: string): ImageSizeInfo | null {
  if (!src) return null;
  const webPath = src.split("?")[0].split("#")[0];
  return IMAGE_SIZES[webPath] ?? null;
}