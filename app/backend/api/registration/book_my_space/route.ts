import { ADMIN_RECEIVER_MAIL } from "@/app/backend/constant";
import { NextResponse } from "next/server";
import { sendMail } from "../../sendMail/mail";
import BookMySpace from "@/app/backend/models/book_my_space.model";
import SpaceTypeScheme from "@/app/backend/models/space_type_scheme";
import { v4 as uuidv4 } from "uuid";
import { bookMySpaceTemplate } from "@/app/backend/helper/mailHelper/template/book_my_space_template";
import emailVerification from "@/app/backend/models/email_verification.model";
import mongoConnection from "@/app/backend/lib/db/db-config";
import AllRegistrationTypeServices from "@/app/backend/lib/services/all-registration-type-service";
import { RegistrationServiceType } from "@/app/backend/lib/db/models/all_registration_services.model";
import ErrorWithStatusCode from "@/app/_shared/custom-error/error-with-status-code";
import JwtTokenService from "@/app/backend/lib/services/jwt-service";

interface BookMySpaceRequestBody {
  name: string;
  about_expo?: string;
  designation?: string;
  company: string;
  city: string;
  country: string;
  mobile: string;
  email: string;
  otp: string;
  space_type: string; // "row" | "shell"
  gst_number: string;
  postal_address: string;
  area_required: string;
}

function generateTrackingId(prefix = "EXPO"): string {
  const uuid = uuidv4().replace(/-/g, "").slice(0, 12).toUpperCase(); // 12 characters from UUID
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // e.g., 20250603
  return `${prefix}-${date}-${uuid}`;
}

export async function POST(req: Request) {
  try {
    await mongoConnection.connect();
    const json: BookMySpaceRequestBody = await req.json();

    const {
      name,
      about_expo,
      designation,
      company: organisation,
      city,
      country,
      mobile,
      email,
      otp,
      space_type,

      gst_number,
      postal_address,
      area_required,
    } = json;
    const registrationService = new AllRegistrationTypeServices();
    const isServiceRunning =
      await registrationService.checkIsServiceActiveByName(
        RegistrationServiceType.MY_SPACE
      );
    if (!isServiceRunning)
      throw ErrorWithStatusCode.error500("Service is not running");
    const existingUser = await BookMySpace.findOne({
      $or: [{ email }, { mobile }],
    });
    const space_sqm = Number(area_required) || 0;
    if (existingUser) {
      return NextResponse.json(
        { message: "Email or mobile is already registered", status: false },
        { status: 409 }
      );
    }

    const emailResult = await emailVerification.findOne({
      email,
      otpCode: otp,
    });

    if (!emailResult || !emailResult.isVerified || emailResult.hasOtpExpired) {
      return NextResponse.json(
        { message: "OTP has expired or is invalid", status: false },
        { status: 401 }
      );
    }

    // Pricing
    const scheme = await SpaceTypeScheme.findOne({
      type: space_type,
      is_active: true,
    }).lean();
    if (!scheme) {
      return NextResponse.json(
        { message: "Invalid space type selected", status: false },
        { status: 400 }
      );
    }

    if (
      !scheme.minimum_space_rquired &&
      scheme.minimum_space_rquired > space_sqm
    ) {
      return NextResponse.json(
        {
          message: `Minimum area required is ${scheme.minimum_space_rquired} sqm.`,
          status: false,
        },
        { status: 400 }
      );
    }
    const basePrice = scheme.price_per_sqm * space_sqm;
    const taxRate = scheme.tax_rate ?? 18;
    const taxAmount = (basePrice * taxRate) / 100;
    const totalAmount = basePrice + taxAmount;
    const trackingId = generateTrackingId();

    const newUser = new BookMySpace({
      name,
      about_expo,
      designation,
      organisation,
      city,
      country,
      postal_address,
      gst_number,

      mobile,
      email,
      space_type,
      space_sqm,
      total_space_price: basePrice,
      tax_rate: taxRate,
      total_gst_amount: taxAmount,
      total_price_with_gst: totalAmount,
      tracking_id: trackingId,
      space_scheme: scheme,
      selected_space_scheme: scheme,
    });

    await newUser.save();

    const visitorTemplate = bookMySpaceTemplate(
      {
        Name: name,
        "How did you hear about the expo?": about_expo,
        Designation: designation,
        Organisation: organisation,
        City: city,
        Country: country,
        Mobile: mobile,
        Email: email,
        Address: postal_address,
        GST_Number: gst_number,
        "Space Type": scheme?.name,
        "Selected Area (sqm)": space_sqm,
        "Base Price": `₹${basePrice}`,
        "GST (%)": `${taxRate}%`,
        "GST Amount": `₹${taxAmount}`,
        "Total Amount": `₹${totalAmount}`,
        "Tracking ID": trackingId,
      },
      "New Registration for BookMySpace"
    );

    try {
      await sendMail({
        email: ADMIN_RECEIVER_MAIL,
        subject: `New User Registered [${trackingId}]`,
        html: visitorTemplate,
      });
    } catch (e) {
      console.error("❌ Error while sending admin mail:", e);
    }

    const jwtService = new JwtTokenService();
    const thankYouToken = await jwtService.createToken(
      { type: "book_my_space", email, name, urn: trackingId },
      "40s"
    );
    return NextResponse.json(
      {
        message: "User registered successfully",
        status: true,
        tracking_id: trackingId,
        thankYouToken,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { message: "Something went wrong", status: false },
      { status: 500 }
    );
  }
}
