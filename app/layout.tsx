import type { Metadata } from "next";
import "./globals.css";
import "./design-system.css";
import "./homepage/editorial.css";
import "./UIComponent/design/event-countdown.css";
import "./reading-content.css";

import Navbar from "./UIComponent/Navbar/Navbar";
import Header1 from "./UIComponent/Navbar/Header1";
import Footer from "./UIComponent/Footer/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { ENVIROMENT } from "./backend/constant";
import type { ReactNode } from "react";
import ClientWrapper from "./UIComponent/cient-wrapper";
import DownloadBrochureButton from "./UIComponent/buttons/download-brochure";
import { getHomepageContent } from "./homepage/get-homepage-content";
import { getStaticHomepageContent } from "./homepage/static-homepage-content";
import EventCountdown from "./UIComponent/design/EventCountdown";
import { getGlobalBrochureButton } from "./homepage/get-global-brochure-button";
import { headers, cookies } from "next/headers";
import { GoogleAnalytics } from "@next/third-parties/google";
import AppOpenTracker from "./UIComponent/Analytics/AppOpenTracker";
// ✅ Global Expo SEO Config
import {
  EXPO_NAME,
  EXPO_DESCRIPTION,
  EXPO_URL,
  EXPO_OG_IMAGE,
} from "./config/expo";
import NewRelicAnalytics from "./scripts/new-relic-analytics";
import PwaRegister from "./UIComponent/PwaRegister";
import InstallPrompt from "./UIComponent/InstallPrompt";
import NetworkStatus from "./UIComponent/NetworkStatus";
import PullToRefresh from "./UIComponent/PullToRefresh";
import AnnouncementModal from "./UIComponent/AnnouncementModal";
import CountryProvider from "./UIComponent/context-provider/country-provider";
import PageFrame from "./UIComponent/design/PageFrame";

// ✅ GLOBAL SEO (applies to ALL pages — no modification needed anywhere)
export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
  title: {
    default: EXPO_NAME,
    template: `%s | ${EXPO_NAME}`,
  },
  description: EXPO_DESCRIPTION,

  keywords: [
    // English Keywords
    "BES Expo",
    "BES Expo -- 2027",
    "besindia",
    "bes india",
    "Broadcast Engineering Society Expo",
    "Broadcast Engineering Society",
    "Broadcast Technology",
    "Media Technology Expo",
    "OTT Technology",
    "AV Technology",
    "Broadcast India",
    "Broadcast Industry",
    "Pragati Maidan Expo",
    "Tech In Broadcast",
    "AV Expo India",
    "Satellite Technology",
    "IPTV India",
    "OTT India",
    "AI in Media",
    "Broadcast Conference India",
    "Media Tech Exhibition",
    "New Business Ideas",
    "Business Opportunities",
    "Broadcasting Technology",
    "TV Technology",
    "Film Technology",
    "Mobile Broadcasting",
    "Digital Media Expo",

    // Hindi Keywords
    "ब्रॉडकास्ट इंजीनियरिंग एक्सपो",
    "बीईएस एक्सपो",
    "बीईएस एक्सपो 2027",
    "प्रगति मैदान प्रदर्शनी",
    "मीडिया टेक्नोलॉजी",
    "इंडिया टेक एक्सपो",
    "ब्रॉडकास्ट इंडिया",
    "ब्रॉडकास्ट इंडिया 2025",
  ],

  alternates: {
    canonical: EXPO_URL,
  },

  openGraph: {
    title: EXPO_NAME,
    description: EXPO_DESCRIPTION,
    url: EXPO_URL,
    siteName: EXPO_NAME,
    images: [
      {
        url: EXPO_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: EXPO_NAME,
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: EXPO_NAME,
    description: EXPO_DESCRIPTION,
    images: [EXPO_OG_IMAGE],
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const requestHeaders = await headers();
  const geoCookie = (await cookies()).get("bes_client_geo")?.value;
  let detectedCountry: string | undefined;
  if (geoCookie) {
    try {
      const geo = JSON.parse(geoCookie);
      detectedCountry = geo?.country?.toLowerCase?.();
    } catch {
      detectedCountry = undefined;
    }
  }
  const nextUrl =
    requestHeaders.get("next-url") || requestHeaders.get("x-pathname");
  let pathname = "";
  if (nextUrl) {
    try {
      pathname = new URL(nextUrl, "http://localhost").pathname;
    } catch {
      pathname = nextUrl.startsWith("/") ? nextUrl : "";
    }
  }
  const isHomePage = pathname === "/";

  const homepageContent = await getHomepageContent();
  const configuredCountdown = homepageContent?.notificationConfig?.countdownStartDateTime;
  const countdownStart = configuredCountdown && Number.isFinite(Date.parse(configuredCountdown))
    ? configuredCountdown
    : getStaticHomepageContent().notificationConfig.countdownStartDateTime;
  const brochureButton = isHomePage
    ? homepageContent?.brochureButton
    : await getGlobalBrochureButton();

  return (
    <html lang="en" className="h-full">
      <head>{ENVIROMENT === "production" && <NewRelicAnalytics />}</head>
      <body className="h-full overflow-hidden">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {/* <Suspense> */}
        <PwaRegister>
          <CountryProvider country={detectedCountry}>
            <ClientWrapper>
            <AppOpenTracker />
            <Navbar logo={<Header1 />} />

            <PullToRefresh className="overflow-auto inner_page scroll-smooth">
              <div className="body_page">
                <NetworkStatus />
                <EventCountdown from={countdownStart} />
                <PageFrame>{children}</PageFrame>
              </div>
              {!!brochureButton?.label && (
                <DownloadBrochureButton
                  href={brochureButton.url || ""}
                  label={brochureButton.label}
                  target={brochureButton.target}
                />
              )}
              <Footer />
            </PullToRefresh>
          </ClientWrapper>
          </CountryProvider>
        </PwaRegister>
        {/* </Suspense> */}
        {/* <AnnouncementModal /> */}
        {ENVIROMENT === "production" && process.env.VERCEL === "1" && <Analytics />}
        {ENVIROMENT === "production" && process.env.VERCEL === "1" && <SpeedInsights />}
        {/* {ENVIROMENT === "production" && <DatadogProvider />} */}
        {/* {process.env.NODE_ENV === "production" && <InstallPrompt />} */}
      </body>
      {ENVIROMENT === "production" && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
