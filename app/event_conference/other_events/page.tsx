import Link from "next/link";
import { Icon } from "@/app/UIComponent/design/Icons";
export default function PastEvents() {
  return <div><div className="eyebrow">Knowledge shared. Connections made.</div><h2>Explore the BES archive.</h2><p>Discover reports and highlights from previous BES exhibitions and technical seminars.</p><div className="resource-links" style={{ marginTop: 24 }}><Link href="/event_conference/other_events/expos"><div className="icon-tile"><Icon name="building" /></div><span><strong>Previous BES EXPOs</strong><small>Exhibition and conference reports</small></span><Icon name="diagonal" /></Link><Link href="/event_conference/other_events/seminars"><div className="icon-tile"><Icon name="people" /></div><span><strong>Technical seminars</strong><small>Knowledge and discussions from across the industry</small></span><Icon name="diagonal" /></Link></div></div>;
}
