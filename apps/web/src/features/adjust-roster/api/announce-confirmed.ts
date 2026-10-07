import "server-only";
import { notifyDirectConfirmed, type Game, type Server } from "@/shared/server";

export async function announceConfirmed({
  server,
  game,
  userIds,
}: {
  server: Server;
  game: Game;
  userIds: readonly string[];
}) {
  await notifyDirectConfirmed({ server, gameId: game.id, userIds });
}
