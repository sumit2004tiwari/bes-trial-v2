"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HomePageVideo } from "@/app/homepage/types";
import { Icon } from "./Icons";

export default function EventFilm({ video }: { video: HomePageVideo }) {
  const [failed, setFailed] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(video.aspectRatio || 16 / 9);
  const player = useRef<HTMLVideoElement>(null);
  return (
    <section className="event-film" data-portrait={aspectRatio < 1} aria-labelledby="event-film-title">
      <div className="site-container film-layout">
        <div className="film-introduction">
          <span className="eyebrow">Inside the event</span>
          <h2 id="event-film-title">{video.title}</h2>
          <p>{video.description}</p>
          <Link href="/galleries/pictures" className="text-link">Browse the event photographs<Icon name="arrow" /></Link>
        </div>
        <figure className="film-figure">
          <div className="film-player" style={{ aspectRatio }}>
            {video.url ? <>
              <video key={video.url} ref={player} controls playsInline preload="none" crossOrigin={video.captionsUrl?.startsWith("https:") ? "anonymous" : undefined} poster={video.poster} aria-label={video.title} aria-describedby="film-caption" onLoadedMetadata={event => { const el = event.currentTarget; if (el.videoWidth && el.videoHeight) setAspectRatio(el.videoWidth / el.videoHeight); }} onError={() => setFailed(true)}>
                <source src={video.url} type={video.contentType} onError={() => setFailed(true)} />
                {video.captionsUrl && <track kind="captions" src={video.captionsUrl} srcLang="en" label="English" default />}
                Your browser does not support embedded video. <a href={video.url}>Open the event film</a>.
              </video>
              {failed && <div className="film-error" role="status"><p>The film could not be loaded. Please try again.</p><button type="button" className="button button-gold" onClick={() => { setFailed(false); player.current?.load(); }}>Retry video</button><a href={video.url} className="text-link-light">Open video directly<Icon name="diagonal" /></a></div>}
            </> : <Image src={video.poster} alt={`${video.title} — film cover`} fill sizes="(max-width: 560px) 90vw, 520px" unoptimized />}
          </div>
          <figcaption id="film-caption"></figcaption>
        </figure>
      </div>
    </section>
  );
}
