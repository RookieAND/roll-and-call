import {
  getGamesByGm,
  getJoinedGames,
  getRespondedGameIds,
  getResponseCountsByGm,
  getReviewedGames,
} from "@/shared/server";

import { buildSessions } from "../model/build-sessions";

export async function loadMySessions({ serverId, userId }: { serverId: string; userId: string }) {
  const [hosted, joined, respondedGameIds, responseCounts, reviewedGames] = await Promise.all([
    getGamesByGm({ serverId, userId }),
    getJoinedGames({ serverId, userId }),
    getRespondedGameIds({ serverId, userId }),
    getResponseCountsByGm({ serverId, gmId: userId }),
    getReviewedGames({ serverId, authorId: userId }),
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
