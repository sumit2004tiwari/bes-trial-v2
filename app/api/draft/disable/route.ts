import { NextResponse } from "next/server";
import { draftMode } from "next/headers";

import { normalizePreviewPath } from "@/app/backend/lib/contentful";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  const safePath = normalizePreviewPath(slug);
  if (!safePath) {
    return NextResponse.json(
      { message: "Invalid slug. It must start with '/'" },
      { status: 400 }
    );
  }

  const draft = await draftMode();
  draft.disable();

  return NextResponse.redirect(new URL(safePath, request.url));
}
