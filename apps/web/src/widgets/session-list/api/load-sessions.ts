import {
  getGamesByGm,
  getJoinedGames,
  getRespondedGameIds,
  getResponseCountsByGm,
} from "@/shared/server";

import { buildSessions } from "../model/build-sessions";

export async function loadMySessions(userId: string) {
  const [hosted, joined, respondedGameIds, responseCounts] = await Promise.all([
    getGamesByGm(userId),
    getJoinedGames(userId),
    getRespondedGameIds(userId),
    getResponseCountsByGm(userId),
  ]);
  return buildSessions({ hosted, joined, viewerId: userId, respondedGameIds, responseCounts });
}
