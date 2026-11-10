import AdminServices from "@/app/backend/lib/services/admin-services";
import React from "react";
import AllRegistrations from "./ui/all-registrations";
export const dynamic = "force-dynamic";
export default async function page() {
  const admin = new AdminServices(true);
  const db = await admin.getAllDelegateUsers();
  return <AllRegistrations db={(db || []) as any} />;
}
