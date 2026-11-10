import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req: Request) {
  try {
    const secret = req.headers.get("x-internal-secret");
    const { path } = await req.json();
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    const INTERNAL_SECRET = process.env.INTERNAL_SECRET;
    // simple protection

    if (
      (secret !== WEBHOOK_SECRET && secret !== INTERNAL_SECRET) ||
      !INTERNAL_SECRET ||
      !WEBHOOK_SECRET
    ) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    // revalidate homepage
    revalidatePath(path || "/");

    return NextResponse.json({
      revalidated: true,
      path: path || "/",
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
