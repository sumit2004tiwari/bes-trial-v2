"use client";

import { useEffect, useRef, useState } from "react";

const videoUrl = "/besexpolandscapeVideo.mp4";

export default function EventFilm() {
  const player = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = player.current;
    if (!video) return;

    let inView = false;
    let disposed = false;
    video.muted = true;
    video.defaultMuted = true;

    const syncPlayback = () => {
      if (inView && !document.hidden && !disposed) {
        // Native controls remain available if the browser blocks autoplay.
        void video.play().then(() => {
          if (!inView || document.hidden || disposed) video.pause();
        }).catch(() => {});
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.2;
      syncPlayback();
    }, { threshold: [0, 0.2] });

    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, []);

  return (
    <section className="event-film" aria-label="BES EXPO video">
      <div className="film-player">
        <video
          ref={player}
          controls
          muted
          loop
          playsInline
          preload="metadata"
          width={848}
          height={480}
          aria-label="BES EXPO event film"
          onError={() => setFailed(true)}
        >
          <source src={videoUrl} type="video/mp4" onError={() => setFailed(true)} />
          Your browser does not support embedded video. <a href={videoUrl}>Open the BES EXPO video</a>.
        </video>
        {failed && <div className="film-error" role="status">
          <p>The video could not be loaded. Please try again.</p>
          <button type="button" className="button button-gold" onClick={() => {
            setFailed(false);
            player.current?.load();
            void player.current?.play().catch(() => {});
          }}>Retry video</button>
          <a href={videoUrl} className="text-link-light">Open video directly</a>
        </div>}
      </div>
    </section>
  );
}
