import React from "react";
import styles from "@/app/about_bes/content.module.css";
export default function page() {
  return (
    <div
      className={"flex flex-col max-w-[800px] p-4 " + styles.content_container}
    >
      <h2 className="text-[26px] font-bold">Call for Papers</h2>
      <div>
        <p>
          Broadcast professionals interested in presenting a paper in the
          conference may send a synopsis of the paper to Chairman Conference
          Committee at{" "}
          <strong>
            <a
              className="text-blue-500 cursor-pointer "
              href="mailto:conference@besindia.com"
            >
              conference@besindia.com
            </a>{" "}
          </strong>
          and{" "}
          <strong>
            {" "}
            <a
              className="text-blue-500 cursor-pointer"
              href="mailto:bes@besindia.com"
            >
              bes@besindia.com
            </a>
          </strong>
        </p>
      </div>
    </div>
  );
}
