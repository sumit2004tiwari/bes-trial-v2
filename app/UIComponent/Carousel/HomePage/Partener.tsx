import Image from "next/image";
import { getImageSize } from "@/app/Utility/lib/image-sizes";
import { Icon } from "@/app/UIComponent/design/Icons";
const partners = [
  { href: "https://mib.gov.in/", src: "/Images/homepage/MIB_Logo.png", alt: "Ministry of Information and Broadcasting" },
  { href: "https://www.meity.gov.in/", src: "/Images/homepage/meity.jpg", alt: "Ministry of Electronics and Information Technology" },
  { href: "https://prasarbharati.gov.in/doordarshan/", src: "/Images/homepage/doordarshan.png", alt: "Doordarshan" },
  { href: "https://www.abu.org.my/", src: "/Images/homepage/abu_1.jpg", alt: "Asia-Pacific Broadcasting Union" },
  { href: "http://www.aesindia.org", src: "/Images/homepage/aes.png", alt: "Audio Engineering Society India" },
  { href: "", src: "/Images/homepage/aimbda.jpg", alt: "AIMBDA" },
];
export default function Partener() {
  return (
    <section className="partners-section" aria-labelledby="partners-title">
      <div className="site-container">
        <div className="section-heading partners-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-rule" />Our supporting organisations</div>
            <h2 id="partners-title">Approved &amp; supported by</h2>
          </div>
          <p>The institutions and industry associations supporting BES EXPO.</p>
        </div>
        <ul className="partners-row" tabIndex={0} aria-label="Supporting organisations">
          {partners.map(partner => {
            const size = getImageSize(partner.src) || { width: 180, height: 100 };
            const content = <>
              {partner.href && <span className="partner-arrow"></span>}
              <span className="partner-logo">
                <Image src={partner.src} alt="" width={size.width} height={size.height} sizes="128px" />
              </span>
              <span className="partner-caption">
                <span>{partner.alt}</span>
              </span>
            </>;
            return (
              <li key={partner.src}>
                {partner.href ? (
                  <a className="partner-card" rel="noopener noreferrer">
                    {content}
                  </a>
                ) : <div className="partner-card">{content}</div>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
