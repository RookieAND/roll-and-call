import "server-only";
import { finishStaleCoordinatedGames } from "@roll-and-call/database/games";

// pg_cron이 하루 한 번 부른다(finish-stale-rounds). 조율형 다회차에서 다음 회차가 30일 동안 정해지지 않은 구인을 마친다.
export async function runRoundsCron() {
  const finished = await finishStaleCoordinatedGames();
  return { ok: true, finished: finished.length };
}
