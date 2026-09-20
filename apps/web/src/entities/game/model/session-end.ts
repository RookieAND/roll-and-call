import { playMinutes } from "@/shared/lib";
import type { Game } from "@/shared/server";

export function sessionEndsAt({
  confirmedAt,
  playMinutes: minutes,
}: Pick<Game, "confirmedAt" | "playMinutes">): Date | null {
  if (!confirmedAt) return null;
  return new Date(new Date(confirmedAt).getTime() + playMinutes(minutes) * 60 * 1000);
}
