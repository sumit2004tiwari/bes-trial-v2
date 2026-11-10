import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { badgeTemplate } from "./badge-template";

const badgeBackgroundPath = path.join(
  process.cwd(),
  "app/backend/badges/assets/visitor-badge.jpg"
);

const launchBadgeBrowser = async () => {
  const isLocal = process.env.NODE_ENV !== "production";
  const localExecutablePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

  return puppeteer.launch({
    args: isLocal
      ? [
          "--headless=new",
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--no-first-run",
          "--no-default-browser-check",
        ]
      : chromium.args,
    executablePath: isLocal
      ? localExecutablePath
      : await chromium.executablePath(),
    headless: true,
    timeout: 10000,
  });
};

const renderBadgePage = async (
  name: string,
  company: string,
  qrCodeUrl: string,
  urn: string
) => {
  const backgroundBase64 = fs
    .readFileSync(badgeBackgroundPath)
    .toString("base64");
  const backgroundImage = `data:image/jpeg;base64,${backgroundBase64}`;
  const html = badgeTemplate(
    name || "",
    company || "",
    qrCodeUrl,
    urn || "",
    backgroundImage
  );

  const browser = await launchBadgeBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: 384, height: 576, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: "load" });
  await page.emulateMediaType("screen");

  return { browser, page };
};

export const generateBadgePdf = async (
  name: string,
  company: string,
  qrCodeUrl: string,
  urn: string
) => {
  const { browser, page } = await renderBadgePage(name, company, qrCodeUrl, urn);

  try {
    return await page.pdf({
      width: "4in",
      height: "6in",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
  } finally {
    await browser.close();
  }
};

export const generateBadgeImage = async (
  name: string,
  company: string,
  qrCodeUrl: string,
  urn: string
) => {
  const { browser, page } = await renderBadgePage(name, company, qrCodeUrl, urn);

  try {
    return await page.screenshot({ type: "png" });
  } finally {
    await browser.close();
  }
};

export const generateBadgeAssets = async (
  name: string,
  company: string,
  qrCodeUrl: string,
  urn: string
) => {
  const { browser, page } = await renderBadgePage(name, company, qrCodeUrl, urn);

  try {
    const [pdf, image] = await Promise.all([
      page.pdf({
        width: "4in",
        height: "6in",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
      }),
      page.screenshot({ type: "png" }),
    ]);
    return { pdf, image };
  } finally {
    await browser.close();
  }
};
