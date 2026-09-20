import { revalidatePath } from "next/cache";

export function revalidateAttendance(gameId: string) {
  revalidatePath(`/games/${gameId}/attendance`);
  revalidatePath(`/games/${gameId}/participants`);
  revalidatePath(`/games/${gameId}`);
  revalidatePath("/me");
  revalidatePath("/me/sessions");
}
