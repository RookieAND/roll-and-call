import type { Game } from "@/shared/api/db";

export function isGameGm({
  gmId,
  userId,
}: {
  gmId: Game["gmId"];
  userId: string | null;
}): boolean {
  return userId !== null && gmId === userId;
}
