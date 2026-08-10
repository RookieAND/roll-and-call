import type { Game } from "@/shared/api/db";

export type GameStatus = "recruiting" | "closed" | "confirmed";

export function deriveGameStatus(
  game: Pick<Game, "confirmedAt" | "maxPlayers" | "endDate">,
  participantCount: number,
): GameStatus {
  if (game.confirmedAt) return "confirmed";
  const full = participantCount >= game.maxPlayers;
  const expired = new Date(game.endDate).getTime() < Date.now();
  return full || expired ? "closed" : "recruiting";
}

export const gameStatusLabel: Record<GameStatus, string> = {
  recruiting: "모집중",
  closed: "모집마감",
  confirmed: "일정확정",
};
