"use client";
import { useId, useRef, useState } from "react";
import Image from "next/image";
import type { HomeCarouselSlide } from "@/app/homepage/types";
import { Icon } from "./Icons";
import { resourceUrl } from "./resource-url";

export default function HeroVisual({ slides }: { slides: HomeCarouselSlide[] }) {
  const fallback: HomeCarouselSlide[] = [{ imageUrl: "/Images/homepage_exclusive_images/9J4A7583.jpg", altText: "Broadcast professionals at a BES EXPO conference" }];
  const images = slides.length ? slides : fallback;
  const imageId = useId();
  const [index, setIndex] = useState(0);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const suppressClickUntil = useRef(0);
  const activeIndex = index % images.length;
  const slide = images[activeIndex];
  const hasNavigation = images.length > 1;
  const move = (direction: number) => setIndex(current => (current + direction + images.length) % images.length);
  const picture = <Image key={slide.imageUrl} src={slide.imageUrl} alt={slide.altText || "BES EXPO broadcast and media technology event"} fill sizes="(max-width: 899px) 100vw, calc((100vw - 16px) / 2)" priority className="hero-photo" draggable={false} />;

  return <figure
    className="hero-visual"
    aria-label="BES EXPO event photographs"
    aria-roledescription={hasNavigation ? "carousel" : undefined}
    tabIndex={hasNavigation ? 0 : undefined}
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
      <span className="hero-image-tag"><span aria-hidden="true" />Inside BES EXPO</span>
      {hasNavigation && <div className="hero-slide-controls">
        <button type="button" aria-label="Previous event photo" aria-controls={imageId} onClick={() => move(-1)}><Icon name="arrow" style={{ transform: "rotate(180deg)" }} /></button>
        <button type="button" aria-label="Next event photo" aria-controls={imageId} onClick={() => move(1)}><Icon name="arrow" /></button>
      </div>}
    </div>
    <figcaption className="hero-photo-caption">
      <div className="hero-caption-copy"><span>THE BES EXPO EXPERIENCE</span><strong>Ideas. Connections.<br />A shared future.</strong></div>
      {hasNavigation && <div className="hero-slide-pagination">
        <span className="hero-slide-count" aria-live="polite" aria-atomic="true"><span className="sr-only">Photo </span>{String(activeIndex + 1).padStart(2, "0")}<span aria-hidden="true"> / </span><span className="sr-only"> of </span>{String(images.length).padStart(2, "0")}</span>
        <div className="hero-slide-dots" aria-label="Choose event photo">{images.map((image, position) => <button key={`${image.imageUrl}-${position}`} type="button" aria-label={`Show event photo ${position + 1}`} aria-current={position === activeIndex ? "true" : undefined} aria-controls={imageId} onClick={() => setIndex(position)} />)}</div>
      </div>}
    </figcaption>
  </figure>;
}
