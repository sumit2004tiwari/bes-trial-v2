import { NextResponse } from "next/server";
import { getUserDetailFromUrn } from "@/app/backend/action/getUserDetails";
import { generateQrCodeBase64 } from "@/app/backend/helper/generate-qrcode";
import { generateBadgePdf } from "@/app/backend/badges/generate-badge";

export async function GET(req: Request, { params }: any) {
  try {
    const { urn } = params || {};
    if (!urn) {
      return NextResponse.json(
        { message: "Invalid request, urn is required", status: false },
        { status: 400 }
      );
    }
    const user = await getUserDetailFromUrn(urn);
    if (!user?.email) {
      return NextResponse.json(
        { message: "User not found", status: false },
        { status: 404 }
      );
    }
    const qrCodeUrl = await generateQrCodeBase64(urn || "");
    const pdf = await generateBadgePdf(
      user?.name,
      user?.organisation,
      qrCodeUrl,
      urn
    );
    return new NextResponse(pdf as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${urn}-visitor-badge.pdf"`,
      },
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Something went wrong", status: false },
      { status: 500 }
    );
  }
}