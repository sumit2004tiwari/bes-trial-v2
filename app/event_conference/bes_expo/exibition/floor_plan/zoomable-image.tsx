"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  aspectRatio?: string;
  minZoom?: number;
  maxZoom?: number;
};

type View = { scale: number; x: number; y: number };

export default function ZoomableImage({
  src,
  alt,
  aspectRatio = "1241 / 1754",
  minZoom = 1,
  maxZoom = 5,
}: Props) {
  const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const viewStart = useRef<View>({ scale: 1, x: 0, y: 0 });
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);
  const zoomActiveRef = useRef(zoomActive);
  zoomActiveRef.current = zoomActive;

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const reset = useCallback(() => {
    setView({ scale: 1, x: 0, y: 0 });
    setZoomActive(false);
  }, []);

  const zoomTo = useCallback(
    (nextScale: number, px: number, py: number) => {
      setView((prev) => {
        const scale = clamp(nextScale, minZoom, maxZoom);
        if (scale === prev.scale) return prev;
        if (scale === 1) return { scale: 1, x: 0, y: 0 };
        const ratio = scale / prev.scale;
        return {
          scale,
          x: prev.x - px * (ratio - 1),
          y: prev.y - py * (ratio - 1),
        };
      });
    },
    [minZoom, maxZoom]
  );

  const zoomAtEvent = useCallback(
    (nextScale: number, clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      zoomTo(
        nextScale,
        clientX - rect.left - rect.width / 2,
        clientY - rect.top - rect.height / 2
      );
    },
    [zoomTo]
  );

  const zoomAtCenter = useCallback(
    (nextScale: number) => zoomTo(nextScale, 0, 0),
    [zoomTo]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const isZoomGesture = e.ctrlKey;
      if (!zoomActiveRef.current && !isZoomGesture) return;
      e.preventDefault();
      if (isZoomGesture) setZoomActive(true);
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      setView((prev) => {
        const scale = clamp(prev.scale * factor, minZoom, maxZoom);
        if (scale === prev.scale) return prev;
        if (scale === 1) return { scale: 1, x: 0, y: 0 };
        const rect = el.getBoundingClientRect();
        const px = e.clientX - rect.left - rect.width / 2;
        const py = e.clientY - rect.top - rect.height / 2;
        const ratio = scale / prev.scale;
        return {
          scale,
          x: prev.x - px * (ratio - 1),
          y: prev.y - py * (ratio - 1),
        };
      });
    };

    const preventGesture = (e: Event) => e.preventDefault();

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("gesturestart", preventGesture);
    el.addEventListener("gesturechange", preventGesture);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("gesturestart", preventGesture);
      el.removeEventListener("gesturechange", preventGesture);
    };
  }, [minZoom, maxZoom]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (view.scale <= 1) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY };
    viewStart.current = view;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setView({
      scale: viewStart.current.scale,
      x: viewStart.current.x + (e.clientX - dragStart.current.x),
      y: viewStart.current.y + (e.clientY - dragStart.current.y),
    });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.currentTarget as HTMLElement).hasPointerCapture?.(e.pointerId)) {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    }
    setDragging(false);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 2) return;
    const [a, b] = [e.touches[0], e.touches[1]];
    pinchStart.current = {
      dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
      scale: view.scale,
    };
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 2 || !pinchStart.current) return;
    const [a, b] = [e.touches[0], e.touches[1]];
    const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    const next = clamp(
      (dist / pinchStart.current.dist) * pinchStart.current.scale,
      minZoom,
      maxZoom
    );
    if (next > 1) setZoomActive(true);
    setView((prev) => (next === 1 ? { scale: 1, x: 0, y: 0 } : { ...prev, scale: next }));
  };

  const onTouchEnd = () => {
    pinchStart.current = null;
  };

  const onDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (view.scale > 1) {
      reset();
    } else {
      setZoomActive(true);
      zoomAtEvent(maxZoom / 2, e.clientX, e.clientY);
    }
  };

  const ctrlBtn =
    "flex h-8 w-8 items-center justify-center rounded-full text-lg font-semibold text-white transition-colors hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio,
          overflow: "hidden",
          touchAction: zoomActive ? "none" : "pan-y",
        }}
        className={
          (dragging
            ? "cursor-grabbing"
            : view.scale > 1
              ? "cursor-grab"
              : "cursor-zoom-in")
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onDoubleClick={onDoubleClick}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
            transformOrigin: "center center",
            transition: dragging ? "none" : "transform 0.15s ease-out",
            willChange: "transform",
            touchAction: "none",
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            draggable={false}
            sizes="(max-width: 800px) 100vw, 800px"
            style={{ objectFit: "contain", userSelect: "none" }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-full bg-black/80 px-1.5 py-1 shadow-lg ring-1 ring-white/10">
        <button
          type="button"
          aria-label="Zoom out"
          className={ctrlBtn}
          onClick={() => {
            setZoomActive(true);
            zoomAtCenter(view.scale - 0.5);
          }}
          disabled={view.scale <= minZoom}
        >
          −
        </button>
        <span className="min-w-[3rem] select-none text-center text-xs font-medium tabular-nums text-white/90">
          {Math.round(view.scale * 100)}%
        </span>
        <button
          type="button"
          aria-label="Zoom in"
          className={ctrlBtn}
          onClick={() => {
            setZoomActive(true);
            zoomAtCenter(view.scale + 0.5);
          }}
          disabled={view.scale >= maxZoom}
        >
          +
        </button>
        <span className="mx-0.5 h-5 w-px bg-white/20" />
        <button
          type="button"
          aria-label="Reset zoom"
          className={ctrlBtn}
          onClick={reset}
          disabled={!zoomActive && view.scale === 1 && view.x === 0 && view.y === 0}
        >
          ⟲
        </button>
      </div>
    </div>
  );
}
