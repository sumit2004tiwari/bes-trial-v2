import React from "react";
import Content from "./Content";

export default function page() {
  let data = null;
  const fs = require("fs");
  const path = require("path");
  try {
    let id = "page";
    data = fs.readFileSync(
      path.join(
        process.cwd(),
        "app/event_conference/other_events/seminars/htmlsdb" +
          "/" +
          id +
          ".custom.html"
      )
    );
    data = data.toString();
  } catch (e) {
    console.log(e);
  }

  return (
    <div>{data ? <Content db={data} council_data={""} /> : "Invalid Url"}</div>
  );
}
