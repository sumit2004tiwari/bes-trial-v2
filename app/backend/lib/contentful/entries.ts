import "server-only";

import type { Entry, EntryCollection, EntrySkeletonType } from "contentful";
import { getContentfulClient, isDraftModeEnabled } from "./client";

export interface ContentfulQueryOptions {
  contentType: string;
  preview?: boolean;
  query?: Record<string, unknown>;
}

export async function getEntries<
  T extends EntrySkeletonType = EntrySkeletonType,
>({
  contentType,
  preview = false,
  query = {},
}: ContentfulQueryOptions): Promise<EntryCollection<T, undefined, string>> {
  const client = getContentfulClient(preview);

  return client.getEntries<T>({
    content_type: contentType,
    ...query,
  });
}

export async function getEntriesForRequest<
  T extends EntrySkeletonType = EntrySkeletonType,
>({ contentType, query = {} }: Omit<ContentfulQueryOptions, "preview">) {
  const preview = await isDraftModeEnabled();
  return getEntries<T>({ contentType, preview, query });
}

export async function getEntryBySlug<
  T extends EntrySkeletonType = EntrySkeletonType,
>({
  contentType,
  slug,
  slugField = "slug",
  preview = false,
}: {
  contentType: string;
  slug: string;
  slugField?: string;
  preview?: boolean;
}): Promise<Entry<T, undefined, string> | null> {
  const response = await getEntries<T>({
    contentType,
    preview,
    query: {
      [`fields.${slugField}`]: slug,
      limit: 1,
    },
  });

  return response.items[0] || null;
}

export async function getEntryById<
  T extends EntrySkeletonType = EntrySkeletonType,
>(
  entryId: string,
  preview = false,
): Promise<Entry<T, undefined, string> | null> {
  const client = getContentfulClient(preview);
  try {
    return await client.getEntry<T>(entryId);
  } catch (e) {
    console.error("something went wrong fetching entry by id", {
      entryId,
      error: e,
      message: e?.message,
    });
    return null;
  }
}

export async function getEntryByIdForRequest<
  T extends EntrySkeletonType = EntrySkeletonType,
>(entryId: string) {
  const preview = await isDraftModeEnabled();
  return getEntryById<T>(entryId, preview);
}

export async function getEntryBySlugForRequest<
  T extends EntrySkeletonType = EntrySkeletonType,
>({
  contentType,
  slug,
  slugField = "slug",
}: {
  contentType: string;
  slug: string;
  slugField?: string;
}) {
  const preview = await isDraftModeEnabled();
  return getEntryBySlug<T>({ contentType, slug, slugField, preview });
}
