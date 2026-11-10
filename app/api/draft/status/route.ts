import { NextResponse } from "next/server";

import { isDraftModeEnabled } from "@/app/backend/lib/contentful";

export async function GET() {
  const enabled = await isDraftModeEnabled();
  return NextResponse.json({ draftMode: enabled }, { status: 200 });
}
