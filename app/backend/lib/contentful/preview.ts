import "server-only";

import crypto from "crypto";

const PREVIEW_SECRET_KEY = "CONTENTFUL_PREVIEW_SECRET";

export function assertPreviewSecretConfigured() {
  if (!process.env[PREVIEW_SECRET_KEY]) {
    throw new Error(
      `${PREVIEW_SECRET_KEY} is missing. Set it in your environment before enabling draft mode.`,
    );
  }
}

export function validatePreviewSecret(secret: string | null) {
  const expected = process.env[PREVIEW_SECRET_KEY];
  if (!secret || !expected) return false;
  const incomingBuffer = Buffer.from(secret);
  const expectedBuffer = Buffer.from(expected);
  if (incomingBuffer.length !== expectedBuffer.length) return false;

  return crypto.timingSafeEqual(incomingBuffer, expectedBuffer);
}

export function normalizePreviewPath(pathname: string | null) {
  if (!pathname) return "/";

  if (!pathname.startsWith("/")) return null;
  if (pathname.startsWith("//")) return null;

  return pathname;
}
