import Link from "next/link";
import styles from "../content.module.css";
export default function page() {
  const fs = require("fs");
  const path = require("path");
  let data = fs.readdirSync(
    path.join(process.cwd(), "/app/about_bes/previous_council/CouncilDB")
  );
  data = data.map((item: any) => item.split(".json").shift());
  data.sort();
  data.reverse();
  return (
    <div
      className={
        "flex flex-col max-w-[800px] m-auto p-4 " + styles.content_container
      }
    >
      <h2 className="text-[26px] font-bold">Previous Council</h2>
      <div>
        <p>
          Please click the links below to get the details of the Council Members
          of the respective BES (I) Councils:
        </p>

        <ul>
          {data.map((item: any, index: any) => (
            <li key={index}>
              <Link
                href={`/about_bes/previous_council/${item}`}
                className="text-blue-500"
              >
                Council {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
