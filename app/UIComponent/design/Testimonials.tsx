"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "./Icons";
import "./testimonials.css";

const testimonials = [
  { id: "BDtraVu50bw", url: "https://youtube.com/shorts/BDtraVu50bw?si=wm6_LEj6HZxp1iFq" },
  { id: "56OQ7arLGU8", url: "https://youtube.com/shorts/56OQ7arLGU8?si=vCV9Th1Qq0WqzbY2" },
  { id: "bAULMpEPAPg", url: "https://youtube.com/shorts/bAULMpEPAPg?si=GnppGrKR8T5l25Tg" },
  { id: "HP7kd92ldZI", url: "https://youtube.com/shorts/HP7kd92ldZI?si=3-mNtewHB_dkc6FV" },
  { id: "20YVPPAjVK0", url: "https://youtube.com/shorts/20YVPPAjVK0?si=_ioSGty2yFpyB01G" },
];

export default function Testimonials() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return <section className="testimonials-section" id="testimonials" aria-labelledby="testimonials-title">
    <div className="site-container">
      <div className="testimonials-heading">
        <div className="eyebrow">Voices from BES EXPO</div>
        <h2 id="testimonials-title">Hear it from our community.</h2>
        <p>Five perspectives on the BES EXPO experience. Press play to hear their stories.</p>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((video, index) => {
          const number = String(index + 1).padStart(2, "0");
          const title = `BES EXPO testimonial ${number}`;
          const isPlaying = activeVideo === video.id;
          return <article className="testimonial-card" key={video.id} aria-labelledby={`testimonial-${video.id}`}>
            <div className="testimonial-video">
              {isPlaying ? <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0`}
                title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
              /> : <button type="button" className="testimonial-cover" aria-label={`Play ${title}`} onClick={() => setActiveVideo(video.id)}>
                <span className="testimonial-cover-index" aria-hidden="true">{number}</span>
                <Image src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" fill unoptimized
                  sizes="(max-width: 600px) 78vw, (max-width: 1000px) 30vw, 240px"
                  onError={event => { event.currentTarget.style.visibility = "hidden"; }} />
                <span className="testimonial-cover-shade" aria-hidden="true" />
                <span className="testimonial-format" aria-hidden="true">BES EXPO · STORIES</span>
                <span className="testimonial-play" aria-hidden="true"><svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor"><path d="m8 4 12 8-12 8z" /></svg></span>
                <span className="testimonial-cover-caption" aria-hidden="true">From our community<span>Watch their story</span></span>
              </button>}
            </div>
            <div className="testimonial-details">
              <h3 id={`testimonial-${video.id}`}>Testimonial {number}</h3>
              {isPlaying && <button type="button" className="testimonial-stop" aria-label={`Stop ${title}`} onClick={() => setActiveVideo(null)}>Stop video<Icon name="close" width={14} height={14} /></button>}
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="testimonial-youtube" aria-label={`Watch ${title} on YouTube (opens in a new tab)`}>Watch on YouTube<Icon name="diagonal" width={15} height={15} /></a>
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
