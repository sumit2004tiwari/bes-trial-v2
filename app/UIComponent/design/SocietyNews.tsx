"use client";

import { useId, useState } from "react";
import type { AnnouncementItem } from "@/app/homepage/types";
import { Icon } from "./Icons";
import { resourceUrl } from "./resource-url";

export default function SocietyNews({ items }: { items: AnnouncementItem[] }) {
  const [paused, setPaused] = useState(false);
  const trackId = useId();

  return (
    <section className="announcement-bar" aria-label="Latest announcements">
      <div className="site-container">
        <span className="announcement-label">News</span>
        <div className="announcement-window">
          <div className="announcement-track" id={trackId} data-paused={paused}>
            {[0, 1].map(group => (
              <div className="announcement-group" key={group} aria-hidden={group === 1 ? true : undefined}>
                {[0, 1, 2].map(copy => (
                  <div className="announcement-copy" key={copy} aria-hidden={copy > 0 ? true : undefined}>
                    {items.map((item, index) => {
                      const content = <><span className="announcement-dot" aria-hidden="true" />{item.text}</>;
                      return item.href ? (
                        <a className="announcement-headline" href={resourceUrl(item.href)} key={index} target={item.target || "_blank"} rel="noopener noreferrer" tabIndex={group === 0 && copy === 0 ? undefined : -1}>
                          {content}
                        </a>
                      ) : <span className="announcement-headline" key={index}>{content}</span>;
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <button className="announcement-toggle" type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? "Resume news ticker" : "Pause news ticker"} aria-controls={trackId} title={paused ? "Resume news ticker" : "Pause news ticker"}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            {paused ? <path d="m5 3 8 5-8 5Z" /> : <><rect x="4" y="3" width="3" height="10" rx=".5" /><rect x="9" y="3" width="3" height="10" rx=".5" /></>}
          </svg>
        </button>
      </div>
    </section>
  );
}
