import "server-only";

import { cache } from "react";
import {
  getEntryByIdForRequest,
  isContentfulConfigured,
} from "@/app/backend/lib/contentful";

export const getHomepageContentfulEntry = cache(async () => {
  const entryId = process.env.CONTENTFUL_HOMEPAGE_ENTRY_ID || "";
  if (entryId.length === 0 || isContentfulConfigured() === false) return null;

  const entry = await getEntryByIdForRequest(entryId);
  return entry || null;
});

