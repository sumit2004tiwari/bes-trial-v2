import React from "react";
import styles from "@/app/about_bes/content.module.css";
export default function page() {
  return (
    <div
      className={"flex flex-col max-w-[800px] p-4 " + styles.content_container}
    >
      <h2 className="text-[26px] font-bold">Who can attend?</h2>
      <div>
        <p>
          The BES EXPO conference is intended for broadcast professionals and
          senior officials from radio and television organisations in India and
          abroad, as well as scientists, researchers, and educators working in
          related fields.
        </p>
        <h3>For professionals and technical teams</h3>
        <p>Engineers, operational teams, and technology decision makers can use the conference to discuss broadcast practice with peers and consider developments relevant to their organisations. Review the conference theme and published programme to identify the sessions that match your responsibilities.</p>
        <h3>For researchers and educators</h3>
        <p>Scientists from government departments and faculty from mass communication institutes and engineering colleges can connect the discussions to their research and teaching. The conference provides a setting to hear industry perspectives and exchange questions with practitioners.</p>
        <h3>Before registering</h3>
        <p>Check the delegate fee and registration information for the current edition. Conference attendance and exhibition participation have separate information pages, so please review the details for the type of visit you are planning.</p>
      </div>
    </div>
  );
}
