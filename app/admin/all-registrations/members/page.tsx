import AdminServices from "@/app/backend/lib/services/admin-services";
import React from "react";
import MemberApprovalUI from "./ui/member-approvals";
export const dynamic = "force-dynamic";
export default async function page() {
  const adminServices = new AdminServices(true);
  const db = await adminServices.getAllMemberProfilesForReview();
  return <MemberApprovalUI db={(db || []) as any} />;
}