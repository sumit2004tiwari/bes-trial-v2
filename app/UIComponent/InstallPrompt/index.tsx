"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Slide, IconButton } from "@mui/material";
import { Download, Close, IosShare } from "@mui/icons-material";
import { trackEvent } from "@/lib/analytics";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { getPlatform } from "@/lib/analytics/platform";
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("install-prompt-dismissed") === "1";
  });
  const [isIos, setIsIos] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const hasPrompt = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleAppInstalled = () => {
      trackEvent(AnalyticsEvents.PWA_INSTALLED, {
        platform: getPlatform(),
      });

      setIsInstalled(true);
      setDeferredPrompt(null);
    };
    const isIosDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIos(isIosDevice);

    const isStandalone =
      (navigator as any).standalone ||
      window.matchMedia("(display-mode: standalone)").matches;
    setIsInstalled(isStandalone);
    if (isStandalone) return;
    if (isIosDevice) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      hasPrompt.current = true;
      setShowFallback(false);
      trackEvent(AnalyticsEvents.INSTALL_PROMPT_SHOWN, {
        platform: getPlatform(),
      });
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", handleAppInstalled);

    const timer = setTimeout(() => {
      if (!hasPrompt.current) setShowFallback(true);
    }, 10000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    trackEvent(AnalyticsEvents.INSTALL_PROMPT_DISMISSED, {
      platform: getPlatform(),
      source: "custom_banner",
    });
    sessionStorage.setItem("install-prompt-dismissed", "1");
    setDismissed(true);
  };

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    trackEvent(AnalyticsEvents.INSTALL_BUTTON_CLICKED, {
      platform: getPlatform(),
    });
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      trackEvent(AnalyticsEvents.INSTALL_PROMPT_ACCEPTED, {
        platform: getPlatform(),
      });
      setDeferredPrompt(null);
    } else {
      trackEvent(AnalyticsEvents.INSTALL_PROMPT_DISMISSED, {
        platform: getPlatform(),
        source: "native_prompt",
      });
    }
  }, [deferredPrompt]);
  useEffect(() => {
    if (!isInstalled && isIos && !dismissed) {
      trackEvent(AnalyticsEvents.INSTALL_PROMPT_SHOWN, {
        platform: "ios",
      });
    }
  }, [dismissed, isInstalled, isIos]);
  if (isInstalled) return null;
  if (dismissed) return null;

  const pill: React.CSSProperties = {
    width: "min(460px, calc(100vw - 24px))",
    borderRadius: "999px",
    background: "rgba(16, 17, 48, 0.88)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow:
      "0 0 0 1px rgba(247,0,104,0.3), 0 12px 40px rgba(0,0,0,0.6), 0 0 28px rgba(247,0,104,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 9px 9px 14px",
    fontFamily: "Poppins, sans-serif",
  };

  const iconCircle: React.CSSProperties = {
    flexShrink: 0,
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f70068 0%, #441066 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 14px rgba(247,0,104,0.55)",
  };

  const installBtn: React.CSSProperties = {
    flexShrink: 0,
    padding: "7px 18px",
    borderRadius: "999px",
    border: "none",
    background: "linear-gradient(135deg, #f70068 0%, #441066 100%)",
    color: "#fff",
    fontFamily: "Poppins, sans-serif",
    fontWeight: 600,
    fontSize: 12,
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxShadow: "0 0 16px rgba(247,0,104,0.5)",
    letterSpacing: "0.3px",
  };

  const closeBtn = {
    color: "rgba(255,255,255,0.3)",
    "&:hover": { color: "#fff", background: "rgba(255,255,255,0.07)" },
  };

  const title: React.CSSProperties = {
    margin: 0,
    color: "#fff",
    fontWeight: 600,
    fontSize: 13,
    lineHeight: 1.3,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const subtitle: React.CSSProperties = {
    margin: 0,
    marginTop: 2,
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const slideContainer = {
    position: "fixed" as const,
    top: 12,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    zIndex: 1400,
    pointerEvents: "none" as const,
  };

  if (isIos) {
    return (
      <Slide direction="down" in mountOnEnter unmountOnExit>
        <div style={slideContainer}>
          <div style={{ ...pill, pointerEvents: "auto" }}>
            <div style={iconCircle}>
              <IosShare sx={{ color: "#fff", fontSize: 18 }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={title}>Install BesIndia App</p>
              <p style={subtitle}>
                Tap{" "}
                <strong style={{ color: "rgba(255,255,255,0.75)" }}>
                  Share ⎋
                </strong>{" "}
                → &quot;Add to Home Screen&quot;
              </p>
            </div>
            <IconButton size="small" onClick={handleDismiss} sx={closeBtn}>
              <Close sx={{ fontSize: 16 }} />
            </IconButton>
          </div>
        </div>
      </Slide>
    );
  }

  if (deferredPrompt) {
    return (
      <Slide direction="down" in mountOnEnter unmountOnExit>
        <div style={slideContainer}>
          <div style={{ ...pill, pointerEvents: "auto" }}>
            <div style={iconCircle}>
              <Download sx={{ color: "#fff", fontSize: 18 }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={title}>Install BesIndia App</p>
              <p style={subtitle}>Offline access &amp; better experience</p>
            </div>
            <button onClick={handleInstall} style={installBtn}>
              Install
            </button>
            <IconButton size="small" onClick={handleDismiss} sx={closeBtn}>
              <Close sx={{ fontSize: 16 }} />
            </IconButton>
          </div>
        </div>
      </Slide>
    );
  }

  if (showFallback) {
    return (
      <Slide direction="down" in mountOnEnter unmountOnExit>
        <div style={slideContainer}>
          <div style={{ ...pill, pointerEvents: "auto" }}>
            <div style={iconCircle}>
              <Download sx={{ color: "#fff", fontSize: 18 }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={title}>Install BesIndia App</p>
              <p style={subtitle}>
                Open browser menu → &quot;Add to Home Screen&quot;
              </p>
            </div>
            <IconButton size="small" onClick={handleDismiss} sx={closeBtn}>
              <Close sx={{ fontSize: 16 }} />
            </IconButton>
          </div>
        </div>
      </Slide>
    );
  }

  return null;
}
