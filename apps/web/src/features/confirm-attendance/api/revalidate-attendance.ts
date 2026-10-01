import { revalidatePath } from "next/cache";

import { serverPath } from "@/shared/lib";

export function revalidateAttendance({ slug, gameId }: { slug: string; gameId: string }) {
  const gamePath = serverPath({ slug, path: `/games/${gameId}` });
  revalidatePath(`${gamePath}/attendance`);
  revalidatePath(`${gamePath}/participants`);
  revalidatePath(gamePath);
  revalidatePath(serverPath({ slug, path: "/me" }));
  revalidatePath(serverPath({ slug, path: "/me/sessions" }));
}
