import "server-only";
import { revalidatePath } from "next/cache";

import { serverPath } from "@/shared/lib";

export function revalidateReviews({ slug, gameId }: { slug: string; gameId: string }) {
  const gamePath = serverPath({ slug, path: `/games/${gameId}` });
  revalidatePath(`${gamePath}/reviews`);
  revalidatePath(`${gamePath}/manage`);
  revalidatePath(serverPath({ slug, path: "/me" }), "layout");
  revalidatePath("/[server]/users/[id]", "layout");
}
