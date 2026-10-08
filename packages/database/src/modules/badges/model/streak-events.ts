import type { BadgeDraw } from "./badge-facts";
import type { BadgeEvent } from "./reached-tier";

export const STREAK_OUTCOME = { win: "win", lose: "lose" } as const;
export type StreakOutcome = (typeof STREAK_OUTCOME)[keyof typeof STREAK_OUTCOME];

// 굴린 추첨을 시간순으로 세어 같은 결과(확정 또는 대기)가 연속으로 length번에 닿은 추첨. 다른 결과가 끼면 끊긴다.
export function streakEvents({
  draws,
  length,
  outcome,
}: {
  draws: BadgeDraw[];
  length: number;
  outcome: StreakOutcome;
}): BadgeEvent[] {
  const target = outcome === STREAK_OUTCOME.win;
  let run = 0;
  for (const draw of draws.toSorted(
    (left, right) => left.drawnAt.getTime() - right.drawnAt.getTime(),
  )) {
    run = draw.picked === target ? run + 1 : 0;
    if (run === length) return [{ at: draw.drawnAt, gameId: draw.gameId }];
  }
  return [];
}
