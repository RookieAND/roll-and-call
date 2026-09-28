import "server-only";
import { revalidatePath } from "next/cache";

export function revalidateReviews(gameId: string) {
  revalidatePath(`/games/${gameId}/reviews`);
  revalidatePath(`/games/${gameId}/manage`);
  revalidatePath("/me", "layout");
  revalidatePath("/u/[id]", "layout");
}
