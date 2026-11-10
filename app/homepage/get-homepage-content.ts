import type { HomePageContent } from "./types";
import { getContentfulHomepageContent } from "./contentful-homepage-content";
import { getStaticHomepageContent } from "./static-homepage-content";

const ENABLED_VALUES = new Set(["true", "1", "yes", "on"]);

function isContentfulHomepageEnabled() {
  const value = (process.env.USECONTENTSTACK || "").trim().toLowerCase();
  return ENABLED_VALUES.has(value);
}

export async function getHomepageContent(): Promise<HomePageContent> {
  if (!isContentfulHomepageEnabled()) {
    return getStaticHomepageContent();
  }

  const cmsContent = await getContentfulHomepageContent();
  if (cmsContent) return cmsContent;

  return {
    announcementsEnabled: false,
    announcementItems: [],
    notificationConfig: null,
    brochureButton: null,
  };
}
