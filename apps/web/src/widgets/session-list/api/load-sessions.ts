import {
  getGamesByGm,
  getJoinedGames,
  getRespondedGameIds,
  getResponseCountsByGm,
  getReviewedGames,
} from "@/shared/server";

import { buildSessions } from "../model/build-sessions";

export async function loadMySessions(userId: string) {
  const [hosted, joined, respondedGameIds, responseCounts, reviewedGames] = await Promise.all([
    getGamesByGm(userId),
    getJoinedGames(userId),
    getRespondedGameIds(userId),
    getResponseCountsByGm(userId),
    getReviewedGames(userId),
  ]);
  return buildSessions({
    hosted,
    joined,
    viewerId: userId,
    respondedGameIds,
    responseCounts,
    reviewedGames,
  });
}
