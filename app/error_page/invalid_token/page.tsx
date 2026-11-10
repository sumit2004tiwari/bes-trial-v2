import Link from "next/link";
import { Icon } from "@/app/UIComponent/design/Icons";
export default function InvalidTokenPage() {
  return <div className="site-container"><div className="empty-state"><div className="icon-tile"><Icon name="mail" /></div><h2>This link is no longer valid.</h2><p>Your account link may have expired. Open member login and choose Forgot Password to request a new link.</p><Link href="/?action=login" className="button button-primary">Open member login<Icon name="arrow" /></Link></div></div>;
}
