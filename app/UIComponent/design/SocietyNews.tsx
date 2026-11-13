import type { AnnouncementItem } from "@/app/homepage/types";
import { resourceUrl } from "./resource-url";

export default function SocietyNews({ items }: { items: AnnouncementItem[] }) {
  return (
    <section className="announcement-bar" aria-label="Latest announcements">
      <div className="site-container">
        <span className="announcement-label">News</span>
        <div className="announcement-window">
          <div className="announcement-track">
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
      </div>
    </section>
  );
}
