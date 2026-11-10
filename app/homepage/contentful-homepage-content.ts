import type { ResourceButton } from "@/app/UIComponent/Carousel/HomePage/Notification";
import type { AnnouncementItem, HomePageContent } from "./types";
import { getHomepageContentfulEntry } from "./contentful-homepage-entry";
import { mediaUrl, videoDefaults } from "./homepage-video";

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getBoolean(value: unknown): boolean {
  return typeof value === "boolean" ? value : false;
}

function mapAnnouncementItems(raw: unknown): AnnouncementItem[] {
  if (Array.isArray(raw) === false) return [];

  return raw
    .filter((item: any) => getString(item?.text).length > 0)
    .map((item: any) => ({
      text: getString(item?.text),
      href: getString(item?.href),
      target: getString(item?.target) || "_blank",
    }));
}

function mapResourceButtons(raw: unknown): ResourceButton[] {
  if (!Array.isArray(raw)) return [];

  const isExternalUrl = (value: string) => /^https?:\/\//i.test(value || "");

  return raw
    .map((item: unknown) => mapResourceButtonBase(item))
    .filter(
      (item) =>
        getString(item?.label).length > 0 &&
        item.url.length > 0 &&
        isExternalUrl(item.url),
    );
}

function mapResourceButtonBase(item: unknown): ResourceButton {
  const fields = (item as any)?.fields || item || {};
  const label = getString(fields?.label);

  const rawTarget = getString(fields?.target);
  const target: "_blank" | "_self" = rawTarget === "_self" ? "_self" : "_blank";

  const fileUrl = fields?.file?.fields?.file?.url
    ? `https:${fields.file.fields.file.url}`
    : fields?.file?.url
      ? `https:${fields.file.url}`
      : "";

  const url = fileUrl || getString(fields?.url);

  return {
    label,
    url,
    target,
  };
}

function getBrochureUrl(
  homepageBanner: any,
  resourceButtons: ResourceButton[],
) {
  const fromBanner = getString(
    homepageBanner?.brochureDownloadUrl || homepageBanner?.brochureLink,
  );
  if (fromBanner) return fromBanner;

  const brochureButton = resourceButtons.find((button) =>
    getString(button?.label).toLowerCase().includes("brochure"),
  );
  return brochureButton?.url || "";
}

export async function getContentfulHomepageContent(): Promise<HomePageContent | null> {
  const entry = await getHomepageContentfulEntry();
  if (!entry) return null;

  const fields = (entry as any)?.fields || {};
  const homepageBanner = fields?.homepageBanner || {};
  const resourceButtons = mapResourceButtons(
    homepageBanner?.resourceButtons || fields?.resourceButtons,
  );
  const brochureButton = mapResourceButtonBase(
    fields?.brochure || fields?.broucher,
  );
  const videoAsset = fields?.homepageVideo?.fields?.file;
  const posterAsset = fields?.homepageVideoPoster?.fields?.file;
  const captionsAsset = fields?.homepageVideoCaptions?.fields?.file;
  const videoUrl = mediaUrl(videoAsset?.url || fields?.homepageVideoUrl);
  return {
    ...(videoUrl ? { video: {
      url: videoUrl,
      title: getString(fields?.homepageVideoTitle) || videoDefaults.title,
      description: getString(fields?.homepageVideoDescription) || videoDefaults.description,
      poster: mediaUrl(posterAsset?.url) || videoDefaults.poster,
      captionsUrl: mediaUrl(captionsAsset?.url),
      contentType: ["video/mp4", "video/webm"].includes(videoAsset?.contentType) ? videoAsset.contentType : undefined,
    } } : {}),
    announcementItems: mapAnnouncementItems(fields?.announcementItems),
    announcementsEnabled: getBoolean(fields?.announcementsEnabled),
    brochureButton,
    notificationConfig: {
      title: getString(homepageBanner?.title),
      subtitle: getString(homepageBanner?.subtitle),
      venue: getString(homepageBanner?.venue),
      theme: getString(homepageBanner?.theme),
      primaryButtonText: getString(homepageBanner?.primaryButtonText),
      primaryButtonLink: getString(homepageBanner?.primaryButtonLink),
      countdownStartDateTime: getString(
        homepageBanner?.countdownStartDateTime || fields?.countdownStartDate,
      ),
      visitorButtonText: getString(homepageBanner?.visitorButtonText),
      visitorButtonLink: getString(homepageBanner?.visitorButtonLink),
      delegateButtonText: getString(homepageBanner?.delegateButtonText),
      delegateButtonLink: getString(homepageBanner?.delegateButtonLink),
      resourceButtons,
      notificationText: getString(fields?.latestUpdate),
    },
  };
}
