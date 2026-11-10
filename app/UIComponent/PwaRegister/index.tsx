"use client";

import { SerwistProvider } from "@serwist/next/react";

const ENABLE_CACHING =
  process.env.DISABLE_CACHING !== "true" &&
  process.env.NODE_ENV === "production";

export default function PwaRegister({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SerwistProvider
      swUrl="/sw.js"
      disable={!ENABLE_CACHING}
      register={ENABLE_CACHING}
      cacheOnNavigation={ENABLE_CACHING}
      reloadOnOnline={ENABLE_CACHING}
    >
      {children}
    </SerwistProvider>
  );
}
