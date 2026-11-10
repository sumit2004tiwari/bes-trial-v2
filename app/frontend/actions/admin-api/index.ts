import { fetchApiHub } from "..";

export const activateAndDeactivateRegistrationService = async (
  payload: string
) => {
  return await fetchApiHub(
    "/backend/api/admin/services/activate-deactivate-registration-service",
    "POST",
    {
      payload,
    }
  );
};
