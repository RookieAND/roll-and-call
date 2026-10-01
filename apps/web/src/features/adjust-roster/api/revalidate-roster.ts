import { revalidatePath } from "next/cache";

import { serverPath } from "@/shared/lib";

export function revalidateRoster({ slug, gameId }: { slug: string; gameId: string }) {
  const gamePath = serverPath({ slug, path: `/games/${gameId}` });
  revalidatePath(`${gamePath}/participants`);
  revalidatePath(gamePath);
  revalidatePath(`${gamePath}/draw`);
  revalidatePath(serverPath({ slug, path: "/games" }));
}
