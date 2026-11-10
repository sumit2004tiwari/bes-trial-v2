import React from "react";
import styles from "@/app/about_bes/content.module.css";
export default function page() {
  return (
    <div
      className={"flex flex-col max-w-[800px] p-4 " + styles.content_container}
    >
      <h2 className="text-[26px] font-bold">About BES EXPO</h2>

      <div>
        <p>
          BES EXPO is the International Conference and Exhibition on Broadcast
          and Media Technology organised by the Broadcast Engineering Society
          (India). First held in 1995 at Hotel Taj Palace, New Delhi, the event
          brings the exhibition and technical conference together in one place.
        </p>
        <h3>A meeting place for the profession</h3>
        <p>The exhibition gives broadcast professionals an opportunity to see equipment, discuss applications with manufacturers and suppliers, and explore services across production, transmission, and media delivery. The conference creates space for a more detailed exchange of technical knowledge and industry experience.</p>
        <h3>Planning for the next edition</h3>
        <p>For BES EXPO 2027, use the exhibition and conference information in this section to plan your participation. Review the venue, floor plan, participation fees, and programme before choosing whether to visit, attend as a delegate, or exhibit.</p>
      </div>
    </div>
  );
}
