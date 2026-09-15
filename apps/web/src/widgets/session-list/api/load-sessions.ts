import {
  getGamesByGm,
  getJoinedGames,
  getRespondedGameIds,
  getResponseCounts,
} from "@/shared/server";

import { buildSessions } from "../model/build-sessions";

export async function loadMySessions(userId: string) {
  const [hosted, joined, respondedGameIds] = await Promise.all([
    getGamesByGm(userId),
    getJoinedGames(userId),
    getRespondedGameIds(userId),
  ]);
  const responseCounts = await getResponseCounts(hosted.map((game) => game.id));
  return buildSessions({ hosted, joined, viewerId: userId, respondedGameIds, responseCounts });
}
