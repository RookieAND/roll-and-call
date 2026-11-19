import { isNil } from "es-toolkit";

import { roundEndAt } from "./round-end-at";
import { STALE_ROUND_DAYS } from "./stale-round-days";

const DAY_MS = 86_400_000;

type Moment = Date | string | null;

type StaleRound = { startAt: Moment; plannedEndAt: Moment; endedAt: Moment };

// 조율형 구인에서 일시가 정해진 회차가 모두 끝났고, 마지막 종료로부터 30일이 지났는데 다음 회차 일시가 없으면 true.
// 일시가 정해진 회차가 하나도 없거나(1회차 조율 중) 앞으로 열릴 회차가 있으면 기다린다.
export function isStaleCoordinatedGame({
  rounds,
  now,
}: {
  rounds: readonly StaleRound[];
  now: Date;
}): boolean {
  const scheduled = rounds.filter((round) => !isNil(round.startAt));
  if (scheduled.length === 0 || scheduled.length === rounds.length) return false;
  const endTimes = scheduled.map((round) => roundEndAt(round)!.getTime());
  const lastEnd = Math.max(...endTimes);
  if (lastEnd > now.getTime()) return false;
  return now.getTime() - lastEnd >= STALE_ROUND_DAYS * DAY_MS;
}
