import "server-only";

import { createClient, type ContentfulClientApi } from "contentful";
import { draftMode } from "next/headers";

export interface ContentfulEnvironment {
  spaceId: string;
  environment: string;
  deliveryToken: string;
  previewToken: string;
}

const REQUIRED_KEYS = [
  "CONTENTFUL_SPACE_ID",
  "CONTENTFUL_ENVIRONMENT",
  "CONTENTFUL_DELIVERY_ACCESS_TOKEN",
  "CONTENTFUL_PREVIEW_ACCESS_TOKEN",
] as const;

export function isContentfulConfigured() {
  return REQUIRED_KEYS.every((key) => !!process.env[key]);
}

function getContentfulEnv(): ContentfulEnvironment {
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing Contentful environment variables: ${missing.join(", ")}`,
    );
  }

  return {
    spaceId: process.env.CONTENTFUL_SPACE_ID as string,
    environment: process.env.CONTENTFUL_ENVIRONMENT as string,
    deliveryToken: process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN as string,
    previewToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN as string,
  };
}

function createDeliveryClient(env: ContentfulEnvironment) {
  return createClient({
    space: env.spaceId,
    environment: env.environment,
    accessToken: env.deliveryToken,
  });
}

function createPreviewClient(env: ContentfulEnvironment) {
  return createClient({
    space: env.spaceId,
    environment: env.environment,
    accessToken: env.previewToken,
    host: "preview.contentful.com",
  });
}

let deliveryClient: ContentfulClientApi<undefined> | null = null;
let previewClient: ContentfulClientApi<undefined> | null = null;

export function getContentfulClient(preview = false) {
  const env = getContentfulEnv();

  if (preview) {
    if (!previewClient) previewClient = createPreviewClient(env);
    return previewClient;
  }

  if (!deliveryClient) deliveryClient = createDeliveryClient(env);
  return deliveryClient;
}

export async function isDraftModeEnabled() {
  const draft = await draftMode();
  return draft.isEnabled;
}

export async function getContentfulClientForRequest() {
  const preview = await isDraftModeEnabled();
  return getContentfulClient(preview);
}
