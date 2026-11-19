import "server-only";
import {
  finishStaleCoordinatedGames,
  listThreadsToLock,
  markThreadLocked,
} from "@roll-and-call/database/games";
import { getServerById } from "@roll-and-call/database/servers";
import { lockDiscordThread } from "@roll-and-call/discord";
import { refreshRecruitPost } from "@roll-and-call/game-notices";

// pg_cron이 매시 15분에 부른다(finish-stale-rounds). 조율형 다회차에서 다음 회차가 30일 동안 정해지지 않은 구인을 마치고,
// 끝난 다회차의 모집 글을 마감으로 고친 뒤 구인 스레드를 잠근다. 회차 사이에는 스레드를 열어 둔다.
export async function runRoundsCron() {
  const now = new Date();
  const finished = await finishStaleCoordinatedGames(now);
  let locked = 0;
  for (const { serverId, gameId, threadId } of await listThreadsToLock({ now })) {
    try {
      const server = await getServerById(serverId);
      if (server) await refreshRecruitPost({ server, gameId });
      await lockDiscordThread(threadId!);
      await markThreadLocked({ serverId, gameId, at: now });
      locked += 1;
    } catch (error) {
      console.error("다회차 스레드 잠금 실패", { gameId, error });
    }
  }
  return { ok: true, finished: finished.length, locked };
}
