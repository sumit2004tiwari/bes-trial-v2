import Link from "next/link";
import Image from "next/image";
import footerData from "./Utility/footerdb.json";
import { handleGetDynamicLink } from "@/app/Utility/helper/helper";
import { Toaster } from "react-hot-toast";
import SocialMediaFooter from "../social-media/social-media-footer";
import { resourceUrl } from "../design/resource-url";

export default function Footer() {
  return <>
    <Toaster position="top-center" toastOptions={{ duration: 5000, style: { background: "#fff", color: "#142b45", borderRadius: 12 }, success: { duration: 5000 } }} />
    <footer className="site-footer"><div className="site-container">
      <div className="footer-top"><div className="footer-brand"><Link href="/" aria-label="BES India home"><Image src="/Images/Logo/logo_new.png" alt="Broadcast Engineering Society India" width={320} height={89} sizes="225px" /></Link><p>A professional community for broadcast engineering, technical knowledge, and industry exchange.</p><span className="footer-since">Established in 1987 · New Delhi, India</span><SocialMediaFooter /></div>
        {footerData.map(item => <div className="footer-column" key={item.id}><h2>{item.name === "About Conference" ? "Conference" : item.name}</h2>{item.subTopic.map(link => {
          const dynamic = handleGetDynamicLink(link.id);
          const href = resourceUrl(dynamic || link.path);
          return href ? <Link key={link.id} href={href} target={link.target ?? "_self"} rel={link.target === "_blank" ? "noopener noreferrer" : undefined}>{link.name}</Link> : null;
        })}</div>)}
        <div className="footer-column"><h2>The society</h2><Link href="/about_bes/at_glance">About BES India</Link><Link href="/about_bes/membership">Membership</Link><Link href="/about_bes/executive_council">Executive council</Link><Link href="/galleries/pictures">Event gallery</Link><Link href="/about_bes/contact_us">Contact us</Link><a href="mailto:bes@besindia.com">bes@besindia.com</a></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Broadcast Engineering Society (India). All rights reserved.</span><span>Advancing broadcast & media technology.</span></div>
    </div></footer>
  </>;
}
