import BesEventConfigService from "@/app/backend/lib/services/bes-event-config-service";
import React from "react";
import BesEventConfigUI from "./ui/bes-event-config-ui";
export const dynamic = "force-dynamic";

export default async function page() {
  const service = new BesEventConfigService();
  const config = await service.getCurrentEventConfig();
  return <BesEventConfigUI initialConfig={(config || {}) as any} />;
}