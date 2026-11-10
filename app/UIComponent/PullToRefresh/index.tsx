"use client";

import { useState, useRef, useEffect } from "react";
import { CircularProgress } from "@mui/material";

const THRESHOLD = 80;
const MAX_PULL = 150;
const DAMPING = 0.5;

export default function PullToRefresh({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchState = useRef({ startY: 0, pulling: false });
  const pullDistRef = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    pullDistRef.current = pullDistance;
  }, [pullDistance]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      if (refreshing) return;
      if (el.scrollTop > 0) return;
      touchState.current = { startY: e.touches[0].clientY, pulling: false };
    };

    const onMove = (e: TouchEvent) => {
      if (refreshing) return;
      if (el.scrollTop > 0) return;
      const diff = e.touches[0].clientY - touchState.current.startY;
      if (diff <= 0) return;
      touchState.current.pulling = true;
      setPullDistance(Math.min(diff * DAMPING, MAX_PULL));
      e.preventDefault();
    };

    const onEnd = () => {
      if (!touchState.current.pulling) return;
      touchState.current.pulling = false;
      if (pullDistRef.current >= THRESHOLD) {
        setRefreshing(true);
        setPullDistance(48);
        setTimeout(() => window.location.reload(), 300);
      } else {
        setPullDistance(0);
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [refreshing]);

  const indicatorH = refreshing ? 48 : pullDistance;

  const indicatorStyle: React.CSSProperties = {
    height: indicatorH,
    opacity: refreshing ? 1 : Math.min(pullDistance / THRESHOLD, 1),
    overflow: "hidden",
    transition:
      pullDistance === 0 || refreshing
        ? "height 0.3s ease, opacity 0.3s ease"
        : "none",
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ overscrollBehaviorY: "contain" }}
    >
      <div style={indicatorStyle} className="flex items-center justify-center">
        {refreshing ? (
          <CircularProgress size={24} sx={{ color: "#2563eb" }} />
        ) : pullDistance >= THRESHOLD ? (
          <span className="text-sm text-gray-600 font-medium select-none">
            Release to refresh
          </span>
        ) : pullDistance > 0 ? (
          <span
            className="text-2xl text-gray-400 select-none"
            style={{
              transform: `rotate(${(pullDistance / THRESHOLD) * 180}deg)`,
              transition: "transform 0.1s",
              display: "inline-block",
            }}
          >
            ↓
          </span>
        ) : null}
      </div>
      <div className="flex flex-col h-full">{children}</div>
    </div>
  );
}
