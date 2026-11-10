import { NextResponse } from "next/server";

import { getVisitor, updateVisitor } from "../../action/action";

export async function POST(req: Request) {
  const secret = req.headers.get("x-internal-secret");
  console.log("Tracker endpoint called");

  if (!secret || secret !== process.env.INTERNAL_SECRET) {
    console.log("Server un authrized");
    return NextResponse.json({ error: "authorised" }, { status: 401 });
  }

  try {
    await updateVisitor();
    console.log("✅ Visitor tracked");
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error:", error?.message);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // 👉 DB update here
    let count = await getVisitor();
    return NextResponse.json({ data: { count } }, { status: 200 });
  } catch (e) {
    console.log(e?.message);
    return NextResponse.json({
      status: 500,
    });
  }
}
