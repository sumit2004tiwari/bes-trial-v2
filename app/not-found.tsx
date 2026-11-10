import Link from "next/link";
import { Icon } from "./UIComponent/design/Icons";
export default function NotFound() {
  return <div className="site-container" style={{ paddingBlock: 60 }}><div className="empty-state"><div className="eyebrow">404 · Page not found</div><h2 style={{ marginTop: 15 }}>Let’s get you back on track.</h2><p>The page you’re looking for may have moved. Explore BES EXPO or return to the homepage to continue.</p><div className="hero-actions"><Link href="/" className="button button-primary">Back to home<Icon name="arrow" /></Link><Link href="/about_bes/contact_us" className="button button-outline">Contact BES</Link></div></div></div>;
}
