import Link from "next/link";
import { Icon } from "../../design/Icons";
export default function UnavailableServiceMessage() {
  return <div className="site-container"><div className="empty-state"><div className="icon-tile"><Icon name="calendar" width={28} height={28} /></div><h2>Registration isn’t available right now.</h2><p>Please check back for registration updates, or contact the BES team for help with your participation.</p><div className="hero-actions"><Link href="/about_bes/contact_us" className="button button-primary">Contact our team<Icon name="arrow" /></Link><Link href="/" className="button button-outline">Back to home</Link></div></div></div>;
}
