import type { HomeCarouselSlide } from "./types";
import { getAwsHomepageCarouselSlides } from "./aws-homepage-carousel";
import { getContentfulHomepageCarouselSlides } from "./contentful-homepage-carousel";
import { getStaticHomepageCarouselSlides } from "./static-homepage-carousel";

const ENABLED_VALUES = new Set(["true", "1", "yes", "on"]);

function isAwsEnabled() {
  const value = (process.env.USEAWS || "").trim().toLowerCase();
  return ENABLED_VALUES.has(value);
}

function isContentfulEnabled() {
  const value = (process.env.USECONTENTSTACK || "").trim().toLowerCase();
  return ENABLED_VALUES.has(value);
}

export async function getHomepageCarouselSlides(): Promise<
  HomeCarouselSlide[]
> {
  if (isAwsEnabled()) {
    const awsSlides = await getAwsHomepageCarouselSlides();
    return awsSlides;
  }

  if (isContentfulEnabled()) {
    const cmsSlides = await getContentfulHomepageCarouselSlides();
    return cmsSlides;
  }

  return getStaticHomepageCarouselSlides();
}
