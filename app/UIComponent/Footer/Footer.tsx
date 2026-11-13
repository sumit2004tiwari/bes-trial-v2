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
      <div className="footer-top"><div className="footer-brand"><Link href="/" aria-label="BES India home"><Image src="/Images/Logo/logo_new.png" alt="Broadcast Engineering Society India" width={320} height={89} sizes="225px" /></Link><p>A professional community for broadcast engineering, technical knowledge, and industry exchange.</p><span className="footer-since"></span></div>
        {footerData.map(item => <div className="footer-column" key={item.id}><h2>{item.name === "About Conference" ? "Conference" : item.name}</h2>{item.subTopic.map(link => {
          const dynamic = handleGetDynamicLink(link.id);
          const href = resourceUrl(dynamic || link.path);
          return href ? <Link key={link.id} href={href} target={link.target ?? "_self"} rel={link.target === "_blank" ? "noopener noreferrer" : undefined}>{link.name}</Link> : null;
        })}</div>)}
        <div className="footer-column"><h2>The society</h2><Link href="/about_bes/at_glance">About BES India</Link><Link href="/about_bes/membership">Membership</Link><Link href="/about_bes/executive_council">Executive Council</Link><Link href="/galleries/pictures">Event Gallery</Link><Link href="/about_bes/contact_us">Contact Us</Link></div>
      </div>
      <div className="footer-contacts">
        <section className="footer-contact" aria-labelledby="footer-conference-title">
          <h2 id="footer-conference-title">For Conference:</h2>
          <address>
            <strong>The Chairman Conference Committee</strong>
            <span>BES EXPO, 912 Surya Kiran Building</span>
            <span>19 Kasturba Gandhi Marg, New Delhi-110001</span>
            <span>Tel: <a href="tel:+911123316709">91-11-23316709</a></span>
            <span>E-mail: <a href="mailto:conference@besindia.com">conference@besindia.com</a>, <a href="mailto:bes@besindia.com">bes@besindia.com</a></span>
          </address>
        </section>
        <section className="footer-contact" aria-labelledby="footer-exhibition-title">
          <h2 id="footer-exhibition-title">For Exhibition:</h2>
          <address>
            <strong>The Coordinator BES EXPO</strong>
            <span>E-mail: <a href="mailto:bes.artiuniyal@gmail.com">bes.artiuniyal@gmail.com</a></span>
            <span><a href="mailto:exhibition@besindia.com">exhibition@besindia.com</a></span>
          </address>
        </section>
        <section className="footer-contact footer-contact-social" aria-labelledby="footer-social-title">
          <h2 id="footer-social-title">Social connect</h2>
          <SocialMediaFooter />
        </section>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Broadcast Engineering Society (India). All Rights Reserved.</span></div>
    </div></footer>
  </>;
}
