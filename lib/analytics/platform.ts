export function getPlatform(): "android" | "ios" | "desktop" | "unknown" {
  if (typeof window === "undefined") {
    return "unknown";
  }

  const ua = navigator.userAgent;

  if (/android/i.test(ua)) {
    return "android";
  }

  if (
    /iPad|iPhone|iPod/.test(ua) ||
    ((navigator as Navigator & { maxTouchPoints?: number }).platform ===
      "MacIntel" &&
      navigator.maxTouchPoints > 1)
  ) {
    return "ios";
  }

  return "desktop";
}
