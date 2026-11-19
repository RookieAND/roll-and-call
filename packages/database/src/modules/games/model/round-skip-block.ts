import { isRoundOpen } from "./is-round-open";
import { ROUND_COUNT_MIN } from "./round-limits";

type Moment = Date | string | null;

export type RoundSkipBlock = "closed" | "too_few_rounds" | "finished_game" | null;

// 회차 생략을 막는 이유. 회차 시작부터 종료 24시간 뒤까지만 생략한다.
// 지정형은 생략하면 예정 회차 수가 줄어 단발(1회)이 되면 단발 동기화가 회차를 덮으므로 2회 아래로는 줄이지 않는다.
export function roundSkipBlock({
  game,
  round,
  now,
}: {
  game: {
    roundCount: number;
    roundScheduleKind: "designated" | "coordinated";
    finishedAt: Moment;
    cancelledAt: Moment;
  };
  round: { startAt: Moment; plannedEndAt: Moment; endedAt: Moment };
  now: Date;
}): RoundSkipBlock {
  if (game.cancelledAt || game.finishedAt) return "finished_game";
  if (!isRoundOpen({ round, now })) return "closed";
  if (game.roundScheduleKind === "designated" && game.roundCount - 1 < ROUND_COUNT_MIN) {
    return "too_few_rounds";
  }
  return null;
}
