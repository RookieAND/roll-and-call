import { eq } from "drizzle-orm";

import { db } from "../client";
import { games, participants } from "../schema";
import { evaluateBadges } from "./evaluate-badges";

export async function evaluateGameBadges(gameId: string) {
  const [game] = await db.select({ gmId: games.gmId }).from(games).where(eq(games.id, gameId));
  if (!game) return;
  const members = await db
    .select({ userId: participants.userId })
    .from(participants)
    .where(eq(participants.gameId, gameId));
  await evaluateBadges([game.gmId, ...members.map((member) => member.userId)]);
}
