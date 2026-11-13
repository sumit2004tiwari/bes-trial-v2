"use client";
import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import type { HomeCarouselSlide } from "@/app/homepage/types";
import { Icon } from "./Icons";
import { resourceUrl } from "./resource-url";

export default function HeroVisual({ slides }: { slides: HomeCarouselSlide[] }) {
  const fallback: HomeCarouselSlide[] = [{ imageUrl: "/Images/homepage_exclusive_images/9J4A7583.jpg", altText: "Broadcast professionals at a BES EXPO conference" }];
  const images = slides.length ? slides : fallback;
  const imageId = useId();
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const root = useRef<HTMLElement>(null);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const suppressClickUntil = useRef(0);
  const activeIndex = index % images.length;
  const slide = images[activeIndex];
  const hasNavigation = images.length > 1;
  const rotating = hasNavigation && !reducedMotion && !hovered && !focused && visible && pageVisible;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    preference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    if (root.current) observer.observe(root.current);
    return () => {
      preference.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => setIndex(current => (current + 1) % images.length), 4500);
    return () => window.clearInterval(timer);
  }, [rotating, images.length, index]);
  const move = (direction: number) => setIndex(current => (current + direction + images.length) % images.length);
  const picture = <Image key={slide.imageUrl} src={slide.imageUrl} alt={slide.altText || "BES EXPO broadcast and media technology event"} fill sizes="(max-width: 899px) 100vw, calc((100vw - 16px) / 2)" priority className="hero-photo" draggable={false} />;

  return <figure
    ref={root}
    className="hero-visual"
    aria-label="BES EXPO event photographs"
    aria-roledescription={hasNavigation ? "carousel" : undefined}
    tabIndex={hasNavigation ? 0 : undefined}
    onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
    onPointerLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false); }}
    onKeyDown={event => {
      if (!hasNavigation || event.target !== event.currentTarget) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1);
      }
    }}
    onPointerDown={event => {
      if (!hasNavigation || event.pointerType === "mouse" || (event.target as Element).closest("button")) return;
      gesture.current = { x: event.clientX, y: event.clientY };
    }}
    onPointerCancel={() => { gesture.current = null; }}
    onPointerUp={event => {
      const start = gesture.current;
      gesture.current = null;
      if (!start) return;
      const distance = event.clientX - start.x;
      if (Math.abs(distance) > 48 && Math.abs(distance) > Math.abs(event.clientY - start.y) * 1.25) {
        suppressClickUntil.current = Date.now() + 500;
        move(distance < 0 ? 1 : -1);
      }
    }}
    onClickCapture={event => {
      if (Date.now() < suppressClickUntil.current) {
        event.preventDefault();
        event.stopPropagation();
      }
    }}
  >
    <div className="hero-image-wrap" id={imageId}>
      {slide.clickUrl ? <a href={resourceUrl(slide.clickUrl)} target={slide.target || "_self"} rel={slide.target === "_blank" ? "noopener noreferrer" : undefined} className="hero-image-link">{picture}</a> : picture}

      {hasNavigation && <div className="hero-slide-controls">
        <button type="button" aria-label="Previous event photo" aria-controls={imageId} onClick={() => move(-1)}><Icon name="arrow" style={{ transform: "rotate(180deg)" }} /></button>
        <button type="button" aria-label="Next event photo" aria-controls={imageId} onClick={() => move(1)}><Icon name="arrow" /></button>
      </div>}
    </div>
    <figcaption className="hero-photo-caption">
      <div className="hero-caption-copy"><span>THE BES EXPO EXPERIENCE</span><strong>Ideas. Connections.<br />A shared future.</strong></div>
    </figcaption>
  </figure>;
}
