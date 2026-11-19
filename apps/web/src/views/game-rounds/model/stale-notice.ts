import type { GameRoundRow } from "@roll-and-call/database/games";
import { roundEndAt, STALE_ROUND_DAYS } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

const DAY_MS = 86_400_000;
// 자동 종결까지 이 날수 이하로 남으면 경고로 강조한다.
const STALE_WARNING_DAYS = 7;
const WAITING_NOTICE = {
  text: `다음 회차를 정하지 않고 ${STALE_ROUND_DAYS}일이 지나면 자동으로 마칩니다.`,
  warning: false,
};

// 조율형에서 일정이 정해진 회차가 모두 끝나 다음 회차를 기다릴 때의 안내. 기다리는 회차가 없으면 null이다.
export function staleNotice({
  rounds,
  now,
}: {
  rounds: readonly GameRoundRow[];
  now: Date;
}): { text: string; warning: boolean } | null {
  const scheduled = rounds.filter((round) => !isNil(round.startAt));
  if (scheduled.length === rounds.length) return null;
  if (scheduled.length === 0) {
    return WAITING_NOTICE;
  }
  const lastEnd = Math.max(...scheduled.map((round) => roundEndAt(round)!.getTime()));
  if (lastEnd > now.getTime()) {
    return WAITING_NOTICE;
  }
  const daysLeft = Math.max(
    Math.ceil((lastEnd + STALE_ROUND_DAYS * DAY_MS - now.getTime()) / DAY_MS),
    0,
  );
  if (daysLeft > STALE_WARNING_DAYS) {
    return WAITING_NOTICE;
  }
  return { text: `${daysLeft}일 뒤 자동으로 마칩니다.`, warning: true };
}
