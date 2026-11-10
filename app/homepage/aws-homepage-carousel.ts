import "server-only";

import crypto from "crypto";
import type { HomeCarouselSlide } from "./types";

type S3ObjectItem = {
  key: string;
  lastModified: string;
};

function sha256(value: string) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function hmac(key: Buffer | string, value: string) {
  return crypto.createHmac("sha256", key).update(value, "utf8").digest();
}

function getSigningKey(secret: string, dateStamp: string, region: string, service: string) {
  const kDate = hmac(`AWS4${secret}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  return hmac(kService, "aws4_request");
}

function getDates() {
  const now = new Date();
  const iso = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const amzDate = `${iso.slice(0, 8)}T${iso.slice(9, 15)}Z`;
  const dateStamp = amzDate.slice(0, 8);
  return { amzDate, dateStamp };
}

function decodeXml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function parseListBucketXml(xml: string): S3ObjectItem[] {
  const items: S3ObjectItem[] = [];
  const contentsRegex = /<Contents>([\s\S]*?)<\/Contents>/g;
  let match: RegExpExecArray | null = null;

  while ((match = contentsRegex.exec(xml)) !== null) {
    const chunk = match[1] || "";
    const keyMatch = chunk.match(/<Key>([\s\S]*?)<\/Key>/);
    const lmMatch = chunk.match(/<LastModified>([\s\S]*?)<\/LastModified>/);

    if (!keyMatch?.[1]) continue;
    items.push({
      key: decodeXml(keyMatch[1]),
      lastModified: lmMatch?.[1] || "",
    });
  }

  return items;
}

function isImageKey(key: string) {
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(key);
}

function normalizePrefix(prefix: string) {
  if (!prefix) return "";
  return prefix.endsWith("/") ? prefix : `${prefix}/`;
}

function joinUrl(base: string, key: string) {
  const normalizedBase = base.replace(/\/+$/, "");
  const encodedKey = key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${normalizedBase}/${encodedKey}`;
}

async function listS3ObjectsV2(params: {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  prefix?: string;
  maxKeys?: number;
}) {
  const {
    bucket,
    region,
    accessKeyId,
    secretAccessKey,
    sessionToken = "",
    prefix = "",
    maxKeys = 1000,
  } = params;

  const host = `${bucket}.s3.${region}.amazonaws.com`;
  const endpoint = `https://${host}/`;
  const canonicalUri = "/";
  const query = new URLSearchParams({
    "list-type": "2",
    "max-keys": String(maxKeys),
  });
  if (prefix) query.set("prefix", prefix);

  const sortedQuery = Array.from(query.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  const { amzDate, dateStamp } = getDates();
  const payloadHash = sha256("");

  const headers: Record<string, string> = {
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
  if (sessionToken) headers["x-amz-security-token"] = sessionToken;

  const sortedHeaderEntries = Object.entries(headers).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  const canonicalHeaders = sortedHeaderEntries
    .map(([k, v]) => `${k}:${v.trim()}\n`)
    .join("");
  const signedHeaders = sortedHeaderEntries.map(([k]) => k).join(";");

  const canonicalRequest = [
    "GET",
    canonicalUri,
    sortedQuery,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    sha256(canonicalRequest),
  ].join("\n");

  const signingKey = getSigningKey(secretAccessKey, dateStamp, region, "s3");
  const signature = crypto
    .createHmac("sha256", signingKey)
    .update(stringToSign, "utf8")
    .digest("hex");

  const authorization = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(`${endpoint}?${sortedQuery}`, {
    method: "GET",
    headers: {
      ...headers,
      Authorization: authorization,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`S3 list failed (${response.status}): ${body}`);
  }

  return response.text();
}

export async function getAwsHomepageCarouselSlides(): Promise<HomeCarouselSlide[]> {
  const enabled = (process.env.USEAWS || "").trim().toLowerCase();
  if (!["true", "1", "yes", "on"].includes(enabled)) return [];

  const bucket = process.env.AWS_S3_BUCKET || "";
  const region = process.env.AWS_REGION || "";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
  const sessionToken = process.env.AWS_SESSION_TOKEN || "";
  const prefix = normalizePrefix(process.env.AWS_S3_CAROUSEL_PREFIX || "homepage/carousel");
  const cdnBase = (process.env.AWS_CDN_BASE_URL || "").trim();

  if (!bucket || !region || !accessKeyId || !secretAccessKey) return [];

  try {
    const xml = await listS3ObjectsV2({
      bucket,
      region,
      accessKeyId,
      secretAccessKey,
      sessionToken,
      prefix,
      maxKeys: 1000,
    });

    const objects = parseListBucketXml(xml)
      .filter((item) => item.key && !item.key.endsWith("/"))
      .filter((item) => isImageKey(item.key))
      .sort((a, b) => {
        const at = new Date(a.lastModified || 0).getTime();
        const bt = new Date(b.lastModified || 0).getTime();
        return at - bt;
      });

    const base =
      cdnBase || `https://${bucket}.s3.${region}.amazonaws.com`;

    return objects.map((item) => ({
      imageUrl: joinUrl(base, item.key),
      altText: item.key.split("/").pop() || "Homepage Slide",
      target: "_self",
    }));
  } catch (error) {
    console.error("AWS carousel read failed:", error);
    return [];
  }
}

