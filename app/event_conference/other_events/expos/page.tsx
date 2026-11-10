import Link from "next/link";
import styles from "@/app/about_bes/content.module.css";
export default function page() {
  const fs = require("fs");
  const path = require("path");
  let data = fs.readdirSync(
    path.join(
      process.cwd(),
      "/app/event_conference/other_events/expos/CouncilDB"
    )
  );
  data = data.map((item: any) => item.split(".custom.html").shift());
  data.sort();
  data.reverse();
  return (
    <div
      className={
        "flex flex-col max-w-[800px] m-auto p-4 " + styles.content_container
      }
    >
      <h2 className="text-[26px] font-bold">Expos</h2>
      <div>
        <p>
          Please click to get the report on the following BES EXPOS organised by
          BES(I) :
        </p>

        <ul>
          {data.map((item: any, index: any) => (
            <li key={index}>
              <Link
                href={`/event_conference/other_events/expos/${item}`}
                className="text-blue-500"
              >
                BES EXPO {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
