import { ADMIN_RECEIVER_MAIL } from "@/app/backend/constant";
import { visitorUserDetailsTemplate } from "@/app/backend/helper/mailHelper/template/visitorTemplate";
import DelegateUser from "@/app/backend/models/delegate_registration.model";
import emailVerification from "@/app/backend/models/email_verification.model";
import { NextResponse } from "next/server";
import { sendMail } from "../../sendMail/mail";
import mongoConnection from "@/app/backend/lib/db/db-config";
import AllRegistrationTypeServices from "@/app/backend/lib/services/all-registration-type-service";
import { RegistrationServiceType } from "@/app/backend/lib/db/models/all_registration_services.model";
import ErrorWithStatusCode from "@/app/_shared/custom-error/error-with-status-code";
import JwtTokenService from "@/app/backend/lib/services/jwt-service";

export async function POST(req: any) {
  try {
    await mongoConnection.connect();
    let json = await req.json();
    const {
      name,
      organisation,
      department,
      mobile,
      email,
      query,
      session_type,
      payment_type,
      bank_name,
      transaction_no,
      amount,
      other_details,
      otp,
      address,
    } = json;
    const registrationService = new AllRegistrationTypeServices();
    const isServiceRunning =
      await registrationService.checkIsServiceActiveByName(
        RegistrationServiceType.DELEGATE_REGISTRATIONS
      );
    if (!isServiceRunning)
      throw ErrorWithStatusCode.error500("Service is not running");
    let emailResult = await emailVerification.findOne({
      email,
      otpCode: otp,
    });
    if (
      !emailResult ||
      !emailResult?.isVerified ||
      emailResult?.hasOtpExpired
    ) {
      return NextResponse.json(
        {
          message: "Otp has been expired please try again after sometime",
          status: false,
        },
        { status: 401 }
      );
    }
    let user = await DelegateUser.findOne({
      $or: [{ email: email }, { mobile: mobile }],
    });
    if (user) {
      return NextResponse.json(
        {
          message: "Email or mobile is already register with us",
          status: false,
        },
        { status: 409 }
      );
    } else {
      let newUser = new DelegateUser({
        name,
        organisation,
        department,
        mobile,
        email,
        query,
        session_type,
        payment_type,
        bank_name,
        transaction_no,
        amount,
        other_details,
        postal_address: address,
      });
      await newUser.save();
      try {
        await emailVerification.findOneAndUpdate(
          { email },
          { hasOtpExpired: true }
        );
      } catch (e) {
        console.error("while updating otp", e?.message);
      }
      let visitorTemplate = visitorUserDetailsTemplate(
        {
          name,
          organisation,
          department,
          mobile,
          email,
          query,
          session_type,
          payment_type,
          bank_name,
          transaction_no,
          amount,
          other_details,
          "postal Address": address,
        },
        "New Registration for Delegate"
      );
      await sendMail({
        email: ADMIN_RECEIVER_MAIL,
        subject: `New User (Delegate) Registered`,
        html: visitorTemplate,
      });
      const jwtService = new JwtTokenService();
      const thankYouToken = await jwtService.createToken(
        {
          type: "delegate",
          email,
          name,
          urn: String(newUser.tracking_id),
        },
        "40s"
      );
      return NextResponse.json(
        {
          message: "User is created",
          status: true,
          tracking_id: newUser.tracking_id,
          thankYouToken,
        },
        { status: 201 }
      );
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "something went wrong", status: false },
      { status: 500 }
    );
  }
}
