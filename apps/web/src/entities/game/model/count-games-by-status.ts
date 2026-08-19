import type { Game } from "@/shared/api/db";
import { deriveGameStatus } from "./derive-game-status";
import type { GameStatus } from "./status";

export function countGamesByStatus({
  games,
  status,
}: {
  games: (Pick<Game, "maxPlayers" | "endDate"> & { participants: unknown[] })[];
  status: GameStatus;
}): number {
  return games.filter(
    (g) =>
      deriveGameStatus({
        maxPlayers: g.maxPlayers,
        endDate: g.endDate,
        participantCount: g.participants.length,
      }) === status,
  ).length;
}
