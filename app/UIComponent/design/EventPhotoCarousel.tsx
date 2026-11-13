"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "./Icons";
import "./event-photo-carousel.css";

const photos = [
  { file: "WhatsApp Image 2026-01-31 at 16.38.35 (1).jpeg", title: "On the exhibition floor", alt: "BES EXPO 2026 visitors and exhibitors gathered around a technology demonstration" },
  { file: "WhatsApp Image 2026-01-31 at 16.38.35 (3).jpeg", title: "Technology in conversation",alt: "Delegates discussing equipment at an exhibition stand at BES EXPO 2026" },
  { file: "WhatsApp Image 2026-01-31 at 16.38.36 (1).jpeg", title: "Meet the industry", alt: "Broadcast professionals meeting beside a BECIL exhibition stand at BES EXPO 2026" },
  { file: "WhatsApp Image 2026-01-31 at 16.37.19 (2).jpeg", title: "Celebrating the community", alt: "A guest being honoured on stage at BES EXPO 2026" },
  { file: "WhatsApp Image 2026-01-31 at 16.37.19.jpeg", title: "Together on stage",  alt: "Guests and BES representatives together on the BES EXPO 2026 stage" },
  { file: "WhatsApp Image 2026-01-31 at 16.38.27.jpeg", title: "Connections that continue", alt: "BES EXPO 2026 attendees greeting each other on the exhibition floor" },
];

export default function EventPhotoCarousel() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const root = useRef<HTMLElement>(null);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const suppressClickUntil = useRef(0);
  const stageId = useId();
  const rotating = playing && !reducedMotion && !hovered && !focused && visible && pageVisible;
  const move = (amount: number) => setActive(current => (current + amount + photos.length) % photos.length);

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
    const timer = window.setInterval(() => move(1), 4500);
    return () => window.clearInterval(timer);
  }, [rotating, active]);

  return <section ref={root} className="event-memories" aria-labelledby="memories-title" aria-roledescription="carousel"
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false); }}
    onKeyDown={event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1);
      }
    }}>
    <div className="site-container event-memories-heading">
      <h2 id="memories-title">BES EXPO-2026 Conference Sessions.</h2>
      <p>Revisit the event, people, and conversations from our last event.</p>
    </div>

    <div id={stageId} className="event-memories-stage"
      onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onPointerDown={event => {
        if (event.pointerType === "mouse") return;
        gesture.current = { x: event.clientX, y: event.clientY };
        (event.target as Element).setPointerCapture(event.pointerId);
      }}
      onPointerCancel={() => { gesture.current = null; }}
      onPointerUp={event => {
        const start = gesture.current;
        gesture.current = null;
        if (!start) return;
        const dx = event.clientX - start.x;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(event.clientY - start.y) * 1.25) {
          suppressClickUntil.current = Date.now() + 500;
          move(dx < 0 ? 1 : -1);
        }
      }}
      onClickCapture={event => {
        if (Date.now() < suppressClickUntil.current) { event.preventDefault(); event.stopPropagation(); }
      }}>
      {photos.map((photo, index) => {
        let offset = (index - active + photos.length) % photos.length;
        if (offset > photos.length / 2) offset -= photos.length;
        const distance = Math.abs(offset);
        return <button key={photo.file} type="button" className="event-memory-card"
          style={{ "--offset": offset, "--distance": distance, zIndex: photos.length - distance } as CSSProperties}
          data-active={index === active} data-hidden={distance > 2}
          aria-label={`Show photo ${index + 1}: ${photo.title}`} aria-current={index === active ? "true" : undefined}
          aria-hidden={distance > 2 ? true : undefined} tabIndex={index === active ? 0 : -1}
          onClick={() => setActive(index)}>
          <Image src={`/Images/ImageGallery/2026/${photo.file}`} alt={photo.alt} fill
            sizes="(max-width: 600px) 72vw, (max-width: 1000px) 38vw, 420px" draggable={false} />
          <span className="event-memory-shade" aria-hidden="true" />
          <span className="event-memory-label"><small>BES EXPO 2026</small><strong>{photo.title}</strong></span>
        </button>;
      })}
    </div>

    <div className="site-container event-memories-bottom">
      {/* <div className="event-memory-description" aria-live={rotating ? "off" : "polite"} aria-atomic="true">
        <p>{photos[active].description}</p>
        <span className="sr-only">Photo {active + 1} of {photos.length}: {photos[active].title}.</span>
      </div> */}
      <div className="event-memories-controls">
        <button type="button" className="event-memory-arrow" aria-label="Previous memory" aria-controls={stageId} onClick={() => move(-1)}><Icon name="arrow" style={{ transform: "rotate(180deg)" }} /></button>
        <div className="event-memory-dots" aria-label="Choose an event memory">{photos.map((photo, index) =>
          <button key={photo.file} type="button" aria-label={`Go to memory ${index + 1}: ${photo.title}`} aria-controls={stageId}
            aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)}><span /></button>
        )}</div>
        <button type="button" className="event-memory-arrow" aria-label="Next memory" aria-controls={stageId} onClick={() => move(1)}><Icon name="arrow" /></button>
        {/* <button type="button" className="event-memory-play" aria-label={playing && !reducedMotion ? "Pause photo rotation" : "Play photo rotation"}
          aria-controls={stageId} disabled={reducedMotion} title={reducedMotion ? "Automatic rotation is off for reduced motion" : undefined}
          onClick={() => setPlaying(value => !value)}>
          {playing && !reducedMotion ? <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M5 4h3v12H5zM12 4h3v12h-3z" /></svg> : <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="m6 3 11 7-11 7z" /></svg>}
        </button> */}
      </div>
      {/* <Link href="/galleries/pictures?selectedValue=2026" className="text-link event-memory-gallery">Explore the 2026 gallery<Icon name="arrow" /></Link> */}
    </div>
  </section>;
}
