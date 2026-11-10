import AdminServices from "@/app/backend/lib/services/admin-services";
import AllServiceUi from "./ui/all-service-ui";
export const dynamic = "force-dynamic";
export default async function page() {
  const adminService = new AdminServices(true);
  const allRegistrationService =
    await adminService.getAllRegistrationServices();

  return <AllServiceUi services={allRegistrationService || []} />;
}
