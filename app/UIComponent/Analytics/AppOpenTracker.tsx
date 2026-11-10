"use client";

import { useEffect } from "react";

import { trackEvent } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics/events";

export default function AppOpenTracker() {
  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    trackEvent(AnalyticsEvents.APP_OPEN, {
      app_mode: isStandalone ? "pwa" : "browser",
    });
  }, []);

  return null;
}
