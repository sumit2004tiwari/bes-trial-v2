import AdminServices from "@/app/backend/lib/services/admin-services";
import React from "react";
import AllVisitors from "./ui/all-visitors";
export const dynamic = "force-dynamic";
export default async function page() {
  const adminServices = new AdminServices(true);
  const db = await adminServices.getAllVisitorDetails();
  return <AllVisitors db={(db || []) as any} />;
}
