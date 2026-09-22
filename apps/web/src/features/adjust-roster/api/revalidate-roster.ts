import { revalidatePath } from "next/cache";

export function revalidateRoster(gameId: string) {
  revalidatePath(`/games/${gameId}/participants`);
  revalidatePath(`/games/${gameId}`);
  revalidatePath(`/games/${gameId}/draw`);
  revalidatePath("/games");
}
