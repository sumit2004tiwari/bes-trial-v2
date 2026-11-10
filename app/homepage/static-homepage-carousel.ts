import { HOMEPAGE } from "@/app/Utility/Constant";
import { getSliderImages } from "@/app/Utility/lib/file";
import type { HomeCarouselSlide } from "./types";

export function getStaticHomepageCarouselSlides(): HomeCarouselSlide[] {
  const imageNames = getSliderImages(HOMEPAGE.sliderImageDir + HOMEPAGE.currentYear) || [];

  return imageNames.map((name: string) => ({
    imageUrl: `${HOMEPAGE.sliderImageDir}${HOMEPAGE.currentYear}/${name}`,
    altText: "BES Homepage Slide",
    target: "_self",
  }));
}

