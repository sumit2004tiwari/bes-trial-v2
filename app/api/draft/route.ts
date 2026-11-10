import { NextResponse } from "next/server";
import { draftMode } from "next/headers";

import {
  assertPreviewSecretConfigured,
  normalizePreviewPath,
  validatePreviewSecret,
} from "@/app/backend/lib/contentful";
import { redirect } from "next/navigation";
export async function GET(request: Request) {
  try {
    assertPreviewSecretConfigured();

    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const slug = searchParams.get("slug");

    if (!validatePreviewSecret(secret)) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    const safePath = normalizePreviewPath(slug);
    if (!safePath) {
      return NextResponse.json(
        { message: "Invalid slug. It must start with '/'" },
        { status: 400 },
      );
    }

    const draft = await draftMode();
    draft.enable();
    // const newUrl=new URL(slug, request.url)
    return redirect(safePath);
  } catch (error: any) {
    if (error?.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return NextResponse.json(
      { message: "Unable to enable draft mode" },
      { status: 500 },
    );
  }
}
