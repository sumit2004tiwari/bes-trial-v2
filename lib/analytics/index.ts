import type { AnalyticsEventParams } from "./types";
import { getClientGeo } from "./geo";

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params?: AnalyticsEventParams,
    ) => void;
  }
}

/**
 * Sends an event to Google Analytics.
 * Safe to call anywhere in Client Components.
 */
export function trackEvent(eventName: string, params?: AnalyticsEventParams) {
  if (typeof window === "undefined") {
    return;
  }

  if (!window.gtag) {
    return;
  }

  window.gtag("event", eventName, params);
}

/**
 * Sends a form-submitted event to Google Analytics, attaching
 * the client geolocation (from the bes_client_geo cookie) if present.
 */
export function trackFormCompleted(
  formName: string,
  extra?: AnalyticsEventParams,
) {
  const geo = getClientGeo();

  trackEvent(formName, {
    ...(extra || {}),
    ...(geo?.country ? { geo_country: geo.country } : {}),
    ...(geo?.region ? { geo_region: geo.region } : {}),
    ...(geo?.city ? { geo_city: geo.city } : {}),
    ...(geo?.latitude ? { geo_latitude: geo.latitude } : {}),
    ...(geo?.longitude ? { geo_longitude: geo.longitude } : {}),
  });
}
