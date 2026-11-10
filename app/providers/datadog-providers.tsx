"use client";

import { useEffect } from "react";
import { datadogRum } from "@datadog/browser-rum";
import { reactPlugin } from "@datadog/browser-rum-react";

let initialized = false;

export default function DatadogProvider() {
  useEffect(() => {
    if (initialized) return;

    datadogRum.init({
      applicationId: process.env.NEXT_PUBLIC_DD_APP_ID!,
      clientToken: process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN!,
      site: "datadoghq.com",

      service: "besindia",
      env: process.env.NEXT_PUBLIC_ENVIROMENT || "dev",
      version: "1.0.0",

      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,

      trackResources: true,
      trackUserInteractions: true,
      trackLongTasks: true,
    });

    datadogRum.startSessionReplayRecording();

    initialized = true;
  }, []);

  return null;
}
