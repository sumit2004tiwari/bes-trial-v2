import type { HomePageVideo } from "./types";

// Accept public files and HTTPS media, including Contentful asset URLs.
export function mediaUrl(value: unknown): string {
  if (typeof value !== "string") return "";
  const url = value.trim();
  if (url.startsWith("//")) return mediaUrl(`https:${url}`);
  if (url.startsWith("/") && !url.includes("\\") && !/[\u0000-\u0020]/.test(url)) return url;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && !parsed.username && !parsed.password ? parsed.href : "";
  } catch {
    return "";
  }
}

export const videoDefaults = {
  title: "A closer look at BES EXPO",
  description: "Get to know BES EXPO through our event film. Explore the exhibition, conference, and participation information below to plan your time with the broadcast and media community.",
  poster: "/Images/homepage/bes-video-poster.jpg",
};

export function getHomepageVideoFallback(): HomePageVideo {
  return {
    ...videoDefaults,
    url: mediaUrl(process.env.HOMEPAGE_VIDEO_URL) || "/besvideo.mp4",
    poster: mediaUrl(process.env.HOMEPAGE_VIDEO_POSTER) || videoDefaults.poster,
    captionsUrl: mediaUrl(process.env.HOMEPAGE_VIDEO_CAPTIONS),
    aspectRatio: process.env.HOMEPAGE_VIDEO_URL ? undefined : 480 / 848,
  };
}
