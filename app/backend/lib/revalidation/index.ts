import { revalidatePath } from "next/cache";

export default async function pageRevalidation(path: string) {
  revalidatePath(path || "/");
}
