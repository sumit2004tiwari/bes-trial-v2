import React from "react";
import styles from "@/app/about_bes/content.module.css";
export default function page() {
  return (
    <div
      className={"flex flex-col max-w-[800px] p-4 " + styles.content_container}
    >
      <h2 className="text-[26px] font-bold">BES Bank Details</h2>
      <div className="py-1"></div>
      <div>
        <table>
          <tbody>
            <tr>
              <th className="pr-4 text-left">Name of Account: </th>
              <td>Broadcast Engineering Society (India)</td>
            </tr>
            <tr>
              <th className="text-left">Account Number: </th>
              <td>520101263652900</td>
            </tr>
            <tr>
              <th className="pr-2 text-left">Name of Bank: </th>
              <td>Union Bank Of India</td>
            </tr>
            <tr>
              <th className="pr-2 text-left">Branch: </th>
              <td>Lodhi Complex Branch, CGO Complex, Lodhi Road, New Delhi</td>
            </tr>
            <tr>
              <th className="pr-2 text-left">IFSC Code: </th>
              <td>UBIN0903710</td>
            </tr>
            <tr>
              <th className="pr-2 text-left">SWIFT Code: </th>
              <td>UBININBBNBC</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
