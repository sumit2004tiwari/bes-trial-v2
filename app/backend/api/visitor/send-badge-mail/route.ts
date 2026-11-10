import { NextResponse } from "next/server";
import { sendMail } from "../../sendMail/mail";
import { generateBadgeAssets } from "@/app/backend/badges/generate-badge";
import { generateQrCodeBase64 } from "@/app/backend/helper/generate-qrcode";
import { visitorBadgeTemplate } from "@/app/backend/helper/mailHelper/template/visitorBadgeTemplate";
import { EXPO_URL, EXPO_NAME } from "@/app/config/expo";
import JwtTokenService from "@/app/backend/lib/services/jwt-service";

const BADGE_SEND_MAX_RETRIES = 3;
const RETRY_BACKOFF_MS = 800;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const sendBadgeMail = async ({
  name,
  organisation,
  email,
  urn,
}: any) => {
  const qrCodeUrl = await generateQrCodeBase64(urn || "");
  const { pdf, image } = await generateBadgeAssets(
    name,
    organisation,
    qrCodeUrl,
    urn
  );

  return sendMail({
    email,
    subject: `Your ${EXPO_NAME} visitor badge`,
    html: visitorBadgeTemplate({
      name,
      urn,
      badgeImage: `data:image/png;base64,${image.toString("base64")}`,
      downloadUrl: `${EXPO_URL}/registrationform/e-badges/download-badge`,
    }),
    attachments: [
      {
        filename: `${urn}-visitor-badge.pdf`,
        content: pdf,
      },
    ],
  });
};

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
      { message: "Badge token is invalid or expired", status: false },
      { status: 401 }
    );
  }

  const payload: any = await jwtService.decodeToken(token);
  const { email, urn, name, mobile, organisation } = payload || {};
  if (!email || !urn) {
    return NextResponse.json(
      { message: "Invalid badge token payload", status: false },
      { status: 401 }
    );
  }

  let lastError: any = null;
  for (let attempt = 0; attempt <= BADGE_SEND_MAX_RETRIES; attempt++) {
    try {
      await sendBadgeMail({ name, mobile, organisation, email, urn });
      return NextResponse.json(
        { message: "Badge mail sent successfully", status: true },
        { status: 200 }
      );
    } catch (e) {
      lastError = e;
      console.error(
        `Attempt ${attempt + 1}/${BADGE_SEND_MAX_RETRIES + 1} failed to send badge mail`,
        e?.message
      );
      if (attempt < BADGE_SEND_MAX_RETRIES) {
        await sleep(RETRY_BACKOFF_MS * (attempt + 1));
      }
    }
  }

  return NextResponse.json(
    {
      message: lastError?.newMessage || "Failed to send badge mail",
      status: false,
    },
    { status: 500 }
  );
}