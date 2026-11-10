import React from "react";
import styles from "../content.module.css";
export default function Content() {
  return (
    <div
      className={
        "flex flex-col max-w-[800px] m-auto p-4 " + styles.content_container
      }
    >
      <h2 className="text-[26px] font-bold">Aims & Objectives</h2>
      <h3 className="text-[18px] font-bold mt-2">
        The aims & objectives of the Broadcast Engineering Society (India) are:
      </h3>
      <div>
        <p>
          To promote and encourage education, research and training in broadcast
          engineering by way of organising conferences/ seminars/ lectures/
          symposiums/ workshop and exhibitions in various disciplines of
          broadcasting and cooperate with other learned bodies for participation
          in similar activities.
        </p>
        <ol className="order_list">
          <li>
            To project interests of broadcast engineering profession at National
            and International levels.
          </li>

          <li>
            To open doors for new technologies through exhibitions and
            conferences.
          </li>

          <li>
            To provide platform for interaction with broadcast professionals and
            broadcasting industries around the World.
          </li>

          <li>
            {" "}
            To encourage broadcast professionals by various awards for the
            contribution in various disciplines of broadcasting.
          </li>
        </ol>
      </div>
    </div>
  );
}
