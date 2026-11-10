import Link from "next/link";
import styles from "../content.module.css";

export default function Content() {
  return <div className={`flex flex-col max-w-[800px] m-auto p-4 ${styles.content_container}`}>
    <h2 className="text-[26px] font-bold">BES India at a glance</h2>
    <p>The Broadcast Engineering Society (India) was established in 1987 and is registered with the Registrar of Societies, Delhi. Headquartered in New Delhi, the Society brings together professionals and organisations with an interest in the advancement of broadcast engineering and related sciences.</p>
    <h3>Knowledge shared through practice</h3>
    <p>The Society conducts conferences, seminars, tutorials, and exhibitions to support the exchange of technical knowledge. Its quarterly technical journal, <em>BES Review</em>, and other publications give members another way to engage with developments in the profession.</p>
    <p>BES also recognises technical innovation and excellence through the BES Awards, presented to individuals for outstanding contributions to broadcast engineering.</p>
    <h3>A national professional community</h3>
    <p>The Society has 12 local chapters across the country, with over 2,500 Life Fellows and Members and 37 leading organisations as Corporate Members. Local chapters and Society activities provide opportunities to stay in contact with colleagues and share professional experience.</p>
    <h3>The annual BES EXPO</h3>
    <p>BES EXPO is the Society’s international conference and exhibition, held annually in New Delhi. Exhibitors, delegates, and visitors from India and abroad take part in an event built around a theme relevant to broadcasting.</p>
    <p>BES EXPO events have been approved by the Ministry of Information & Broadcasting, Government of India, and endorsed by the International Association of Broadcast Manufacturers (IABM) and DRM. Support has included Prasar Bharati, ABU, UNESCO, the Society of Broadcast Engineers (USA), the Ministry of Communications & IT, and IGNOU.</p>
    <p>To learn how you can take part, explore <Link href="/about_bes/membership">Society membership</Link>, read the <Link href="/about_bes/aim_and_objective">aims and objectives</Link>, or visit the <Link href="/event_conference/bes_expo/exibition/history">BES EXPO information</Link>.</p>
  </div>;
}
