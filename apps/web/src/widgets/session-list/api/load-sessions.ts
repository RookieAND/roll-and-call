import {
  getGamesByGm,
  getJoinedGames,
  getRespondedGameIds,
  getResponseCounts,
} from "@/shared/server";
import { buildSessions } from "../model/session-card";

// 홈·내 세션·마이페이지가 같은 조회로 같은 카드를 만든다.
export async function loadMySessions(userId: string) {
  const [hosted, joined, respondedGameIds] = await Promise.all([
    getGamesByGm(userId),
    getJoinedGames(userId),
    getRespondedGameIds(userId),
  ]);
  const responseCounts = await getResponseCounts(hosted.map((game) => game.id));
  return buildSessions({ hosted, joined, viewerId: userId, respondedGameIds, responseCounts });
}
