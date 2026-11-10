import Image from "next/image";
import { OTHERPAGE } from "@/app/Utility/Constant";
import { Icon } from "@/app/UIComponent/design/Icons";
export default function Content({ db }: { db: { id: number; name: string; design: string; email?: string; img?: string }[] }) {
  return <div className="council-content"><div className="eyebrow">Leadership & service</div><h2>Executive Council {OTHERPAGE.currentCouncil}</h2><p>The people guiding the society and its commitment to broadcast engineering.</p><div className="council-grid">{db.map(member => <article className="council-card" key={member.id}><div className="council-portrait">{member.img ? <Image src={`/Images/excecutive_council/${member.img.toLowerCase() === "archana.jpg" ? "archana.jpg" : member.img}`} alt={member.name} fill sizes="(max-width: 767px) 100px, 160px" /> : <Icon name="people" width={46} height={46} />}</div><span>{member.design}</span><h3>{member.name}</h3>{member.email && <a href={`mailto:${member.email}`}><Icon name="mail" width={15} height={15} /><span>{member.email}</span></a>}</article>)}</div></div>;
}
