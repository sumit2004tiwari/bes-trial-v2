import { NextResponse } from "next/server";
import { sendMail } from "../../sendMail/mail";
import { thankYouSubmissionTemplate } from "@/app/backend/helper/mailHelper/template/thankYouSubmissionTemplate";
import { EXPO_URL, EXPO_NAME } from "@/app/config/expo";
import JwtTokenService from "@/app/backend/lib/services/jwt-service";

const THANKYOU_SEND_MAX_RETRIES = 3;
const RETRY_BACKOFF_MS = 800;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isValidType = (type: string) =>
  type === "visitor" || type === "delegate" || type === "book_my_space";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json(
      { message: "Invalid request", status: false },
      { status: 400 }
    );
  }

  const token = body?.token || "";
  if (!token) {
    return NextResponse.json(
      { message: "Invalid request, token is required", status: false },
      { status: 400 }
    );
  }

  const jwtService = new JwtTokenService();
  const isValid = await jwtService.verifyToken(token);
  if (!isValid) {
    return NextResponse.json(
      { message: "Token is invalid or expired", status: false },
      { status: 401 }
    );
  }

  const payload: any = await jwtService.decodeToken(token);
  const { type, email, name, urn } = payload || {};
  if (!email || !urn || !isValidType(type)) {
    return NextResponse.json(
      { message: "Invalid token payload", status: false },
      { status: 401 }
    );
  }

  const downloadUrl =
    type === "visitor"
      ? `${EXPO_URL}/registrationform/e-badges/download-badge`
      : undefined;

  let lastError: any = null;
  for (let attempt = 0; attempt <= THANKYOU_SEND_MAX_RETRIES; attempt++) {
    try {
      await sendMail({
        email,
        subject: `Thank you for your submission - ${EXPO_NAME}`,
        html: thankYouSubmissionTemplate({ name, urn, type, downloadUrl }),
      });
      return NextResponse.json(
        { message: "Thank you mail sent successfully", status: true },
        { status: 200 }
      );
    } catch (e) {
      lastError = e;
      console.error(
        `Attempt ${attempt + 1}/${THANKYOU_SEND_MAX_RETRIES + 1} failed to send thank you mail`,
        e?.message
      );
      if (attempt < THANKYOU_SEND_MAX_RETRIES) {
        await sleep(RETRY_BACKOFF_MS * (attempt + 1));
      }
    }
  }

  return NextResponse.json(
    {
      message: lastError?.newMessage || "Failed to send thank you mail",
      status: false,
    },
    { status: 500 }
  );
}