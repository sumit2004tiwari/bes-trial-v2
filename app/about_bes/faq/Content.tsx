import React from "react";
import styles from "../content.module.css";
export default function Content() {
  return (
    <div
      className={
        "flex flex-col max-w-[800px] m-auto p-4 " + styles.content_container
      }
    >
      <h2 className="text-[26px] font-bold">Background</h2>
      <div>
        <p>
          A small but most dedicated group of Broadcast Engineers of India felt
          the necessity of projecting the interests of Broadcast Engineers at
          national and international level. They decided to promote the
          advancement, dissemination of knowledge and practice in the field of
          Broadcasting and related sciences. Their determination finally came as
          the establishment of Broadcast Engineering Society in 1987 when it got
          registered with the Registrar of Societies, Delhi Administration on
          8th April 1987. To achieve its goals with the specific aims &
          objectives, the dedicated members of the Society started organising,
          seminars/lectures/workshops/symposium, which gained momentum, and more
          and more fellow broadcast engineers joined hands. With the keen
          interest and sincerity of members, not only the membership base of the
          society widened but also the Society could become an International
          body, which now organises an international event, popularly known as
          BES EXPO, every year
        </p>
      </div>
    </div>
  );
}
