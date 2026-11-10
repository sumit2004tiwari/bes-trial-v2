import type { HomeCarouselSlide } from "./types";
import { getHomepageContentfulEntry } from "./contentful-homepage-entry";

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getPositiveNumber(value: unknown): number | undefined {
  return typeof value === "number" && value > 0 ? value : undefined;
}

function normalizeTarget(value: string): "_blank" | "_self" {
  return value === "_blank" ? "_blank" : "_self";
}

function normalizeImageUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("//")) return `https:${url}`;
  return url;
}

function mapCarouselSlides(raw: unknown): HomeCarouselSlide[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item: any) => {
      const rawImageUrl = getString(
        item?.imageUrl || item?.image || item?.url || item?.fields?.file?.url
      );
      const imageUrl = normalizeImageUrl(rawImageUrl);
      const altText = getString(
        item?.altText || item?.alt || item?.fields?.title || item?.title
      );
      const clickUrl = getString(item?.clickUrl || item?.link || item?.href);
      const target = normalizeTarget(getString(item?.target));
      const width = getPositiveNumber(
        item?.width || item?.fields?.file?.details?.image?.width
      );
      const height = getPositiveNumber(
        item?.height || item?.fields?.file?.details?.image?.height
      );
      return { imageUrl, altText, clickUrl, target, width, height };
    })
    .filter((item) => item.imageUrl.length > 0);
}

export async function getContentfulHomepageCarouselSlides(): Promise<
  HomeCarouselSlide[]
> {
  const entry = await getHomepageContentfulEntry();
  if (!entry) return [];

  const fields = (entry as any)?.fields || {};
  return mapCarouselSlides(
    fields?.homepageCarousel || fields?.homepageCarouselSlides || [],
  );
}
