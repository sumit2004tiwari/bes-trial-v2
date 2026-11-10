import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const secret = req.headers.get("x-webhook-secret");
    console.log("This is webhook secret", { secret });
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (secret !== WEBHOOK_SECRET || !WEBHOOK_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    const entryId = body?.sys?.id;
    let path = "";
    if (entryId === process.env.CONTENTFUL_HOMEPAGE_ENTRY_ID) {
      revalidatePath(path || "/");
      path += ",/";
    }
    if (entryId === process.env.CONTENTFUL_GLOBAL_BROCHURE_ENTRY_ID) {
      revalidatePath("/", "layout");
      path += ",layout:/";
    }
    return NextResponse.json({
      revalidated: !!path,
      path: path,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
