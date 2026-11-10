import type { ResourceButton } from "@/app/UIComponent/Carousel/HomePage/Notification";
import { cache } from "react";
import {
  getEntryByIdForRequest,
  isContentfulConfigured,
} from "@/app/backend/lib/contentful";
import { getStaticHomepageContent } from "./static-homepage-content";

const ENABLED_VALUES = new Set(["true", "1", "yes", "on"]);
const DEFAULT_GLOBAL_BROCHURE_ENTRY_ID = "7uoEkB0UELMLkHz3dA5LHp";

function isContentfulHomepageEnabled() {
  const value = (process.env.USECONTENTSTACK || "").trim().toLowerCase();
  return ENABLED_VALUES.has(value);
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function mapResourceButton(item: unknown): ResourceButton | null {
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
  if (!label || !url) return null;

  return {
    label,
    url,
    target,
  };
}

const getGlobalBrochureEntry = cache(async () => {
  const entryId =
    process.env.CONTENTFUL_GLOBAL_BROCHURE_ENTRY_ID ||
    DEFAULT_GLOBAL_BROCHURE_ENTRY_ID;

  if (!entryId || !isContentfulConfigured()) return null;
  return getEntryByIdForRequest(entryId);
});

export async function getGlobalBrochureButton(): Promise<ResourceButton | null> {
  if (!isContentfulHomepageEnabled()) {
    return getStaticHomepageContent().brochureButton || null;
  }

  const entry = await getGlobalBrochureEntry();
  if (!entry) return null;

  const fields = (entry as any)?.fields || {};
  return mapResourceButton(fields);
}
