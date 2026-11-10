import React from "react";
import styles from "@/app/about_bes/content.module.css";
export default function page() {
  return (
    <div
      className={"flex flex-col max-w-[800px] p-4 " + styles.content_container}
    >
      <h2 className="text-[26px] font-bold">Delegate Fee</h2>
      <br />
      <h5 className="text-[22px] font-bold">Delegate fee is as follows</h5>
      <br />
      <div>
        <h6 className="font-bold text-[18px]"> All sessions – 2 days</h6>{" "}
        <p style={{ margin: 0, marginBottom: 10 }}>
          Indian companies: Rs. 8,000
          <br /> Foreign companies: US$ 150 <br />
        </p>{" "}
        <h6 className="font-bold text-[18px]"> Three sessions – 1 day</h6>
        <p style={{ margin: 0 }}>
          Indian companies: Rs. 4,000 <br />
          Foreign companies: US$ 75
        </p>
        <p>
          {" "}
          BES Life Fellows, Life Members, Associate Members, Student Members,
          Affiliates and delegates sponsored by Govt. deptts., PSUs and Life
          Corporate Member organisations can avail 50% concession in delegate
          fee.
        </p>
        <p>
          <strong>
            Delegate fee for BES members over the age of 60 years is Rs. 2,000
            only for all sessions.
          </strong>
        </p>
      </div>
    </div>
  );
}
