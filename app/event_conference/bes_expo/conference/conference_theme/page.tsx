import Link from "next/link";
import styles from "@/app/about_bes/content.module.css";
import { getHomepageContent } from "@/app/homepage/get-homepage-content";
import { getStaticHomepageContent } from "@/app/homepage/static-homepage-content";

export default async function ConferenceTheme() {
  const content = await getHomepageContent();
  const theme = content.notificationConfig?.theme || getStaticHomepageContent().notificationConfig?.theme;
  return <div className={`flex flex-col max-w-[800px] p-4 ${styles.content_container}`}>
    <h2 className="text-[26px] font-bold">Conference theme</h2>
    <p><strong>{theme?.replace(/^Theme:\s*/i, "")}</strong></p>
    <p>The BES EXPO conference brings broadcast professionals together to consider how media technology is changing and what those changes mean in practice. The theme gives a shared focus to the exchange of knowledge between engineers, researchers, technology providers, and media organisations.</p>
    <h3>Connecting ideas to broadcast practice</h3>
    <p>Intelligent systems, new approaches to production and delivery, and indigenous technology raise practical questions for the industry. The conference is a setting to examine those questions alongside the experience of people working in broadcasting.</p>
    <h3>Plan the discussions you want to join</h3>
    <p>Consult the <Link href="/event_conference/bes_expo/conference/conference_schedule">conference programme</Link> for the published session details. You can also review <Link href="/event_conference/bes_expo/conference/who_can_attend">who can attend</Link> and the <Link href="/event_conference/bes_expo/conference/delegate_fee">delegate fee information</Link> before registering.</p>
  </div>;
}
