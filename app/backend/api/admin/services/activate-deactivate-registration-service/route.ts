import ErrorWithStatusCode from "@/app/_shared/custom-error/error-with-status-code";
import { decryptPayload } from "@/app/_shared/shared-payload-security";
import { RegistrationServiceType } from "@/app/backend/lib/db/models/all_registration_services.model";
import pageRevalidation from "@/app/backend/lib/revalidation";
import AdminServices from "@/app/backend/lib/services/admin-services";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request?.json();
    const payload = body?.payload;
    if (!payload)
      throw ErrorWithStatusCode.error400(
        "Invalid Request",
        false,
        "Request not found",
      );

    const decodePayload = decryptPayload(payload);
    const parsedPayload = JSON.parse(decodePayload);
    if (!parsedPayload?.service_name) {
      throw ErrorWithStatusCode.error400(
        "Invalid Request",
        false,
        "Request not found",
      );
    }
    const adminService = new AdminServices();

    let result = await adminService.activateOrDeactivateRegistrationService(
      parsedPayload?.service_name,
      !!parsedPayload?.value,
    );
    if (!result)
      return NextResponse.json(
        { message: "Invalid Service Request", status: true },
        { status: 400 },
      );
    try {
      pageRevalidation("/");
      if (
        payload.service_name === RegistrationServiceType.DELEGATE_REGISTRATIONS
      ) {
        pageRevalidation("/registrationform/delegateregistration");
      }
      if (
        payload.service_name === RegistrationServiceType.VISITOR_REGISTRATIONS
      ) {
        pageRevalidation("/registrationform/visitor");
      }
      if (payload.service_name === RegistrationServiceType.MY_SPACE) {
        pageRevalidation(
          "/event_conference/bes_expo/exibition/participation_fee",
        );
      }
    } catch (e) {
      console.error("error while revalidating the cache");
    }
    return NextResponse.json(
      { message: "Service has been Successfully updated", status: true },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { message: e?.newMessage || "Internal Server Error", status: false },
      { status: e?.statusCode || 500 },
    );
  }
}
