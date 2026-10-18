import {
  getGamesByGm,
  getJoinedGames,
  getRespondedGameIds,
  getResponseCountsByGm,
} from "@roll-and-call/database/games";
import { getReviewedGames } from "@roll-and-call/database/reviews";

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
