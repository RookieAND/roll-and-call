import { getGamesByGm, getJoinedGames, getReviewedGames } from "@/shared/server";

import { buildSessions } from "../model/build-sessions";

export async function loadMySessions({ serverId, userId }: { serverId: string; userId: string }) {
  const [hosted, joined, reviewedGames] = await Promise.all([
    getGamesByGm({ serverId, userId }),
    getJoinedGames({ serverId, userId }),
    getReviewedGames({ serverId, authorId: userId }),
  ]);
  return buildSessions({
    hosted,
    joined,
    viewerId: userId,
    reviewedGames,
  });
}
