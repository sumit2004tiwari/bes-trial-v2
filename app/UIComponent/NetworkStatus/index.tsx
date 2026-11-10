"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Alert, Snackbar } from "@mui/material";
import { ENVIROMENT } from "../../backend/constant";

function triggerSwSync() {
  navigator.serviceWorker?.controller?.postMessage({ type: "SYNC_NOW" });
}

async function getPendingCount(): Promise<number> {
  if (!navigator.serviceWorker?.controller) return 0;
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = (event) => {
      resolve(event.data?.pendingCount ?? 0);
    };
    navigator.serviceWorker.controller.postMessage(
      { type: "GET_PENDING_COUNT" },
      [channel.port2]
    );
  });
}

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(false);
  const [showBackOnline, setShowBackOnline] = useState(false);
  const [showSyncing, setShowSyncing] = useState(false);
  const [showSynced, setShowSynced] = useState(false);
  const syncingRef = useRef(false);

  const triggerSync = useCallback(async () => {
    if (syncingRef.current) return;
    const count = await getPendingCount();
    if (count === 0) return;
    syncingRef.current = true;
    setShowSyncing(true);
    triggerSwSync();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (!navigator.onLine) return;
      setShowOffline(false);
      setShowBackOnline(true);
      setTimeout(() => setShowBackOnline(false), 4000);
      triggerSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    const handleSwMessage = (event: MessageEvent) => {
      if (event.data?.type === "SYNC_COMPLETE") {
        syncingRef.current = false;
        setShowSyncing(false);
        setShowSynced(true);
        setTimeout(() => setShowSynced(false), 4000);
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    navigator.serviceWorker?.addEventListener("message", handleSwMessage);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      navigator.serviceWorker?.removeEventListener("message", handleSwMessage);
    };
  }, [triggerSync]);

  return (
    <>
      <Snackbar
        open={showOffline}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 7 }}
      >
        <Alert
          severity="warning"
          variant="filled"
          sx={{ width: "100%" }}
          onClose={() => setShowOffline(false)}
        >
          You are offline. Some features may be unavailable.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showSyncing}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 7 }}
      >
        <Alert severity="info" variant="filled" sx={{ width: "100%" }}>
          Syncing pending changes...
        </Alert>
      </Snackbar>

      <Snackbar
        open={showBackOnline}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 7 }}
        onClose={() => setShowBackOnline(false)}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Back online!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showSynced}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 7 }}
        onClose={() => setShowSynced(false)}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          All changes synced!
        </Alert>
      </Snackbar>
    </>
  );
}
