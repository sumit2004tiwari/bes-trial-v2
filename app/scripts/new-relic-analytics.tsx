import Script from "next/script";
import React from "react";
import { getNewRewlicScript } from "./new-relic-script";

export default function NewRelicAnalytics() {
  return (
    <Script
      id="new_relic_scipt"
      dangerouslySetInnerHTML={{ __html: getNewRewlicScript() }}
    />
  );
}
