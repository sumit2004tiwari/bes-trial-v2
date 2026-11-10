import AdminServices from "@/app/backend/lib/services/admin-services";
import React from "react";
import AllRegistrations from "./ui/all-registrations";
export const dynamic = "force-dynamic";
export default async function page() {
  const adminServices = new AdminServices(true);
  const db = await adminServices.getMySpaceRegistrations();

  return <AllRegistrations db={(db || []) as any} />;
}
