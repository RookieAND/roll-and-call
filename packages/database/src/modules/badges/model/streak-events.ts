import type { BadgeDraw } from "./badge-facts";
import type { BadgeEvent } from "./reached-tier";

// 굴린 추첨을 시간순으로 세어 연속으로 확정된 횟수가 length에 닿은 추첨. 대기로 끝난 추첨이 끼면 끊긴다.
export function winStreakEvents({
  draws,
  length,
}: {
  draws: BadgeDraw[];
  length: number;
}): BadgeEvent[] {
  let run = 0;
  for (const draw of draws.toSorted(
    (left, right) => left.drawnAt.getTime() - right.drawnAt.getTime(),
  )) {
    run = draw.picked ? run + 1 : 0;
    if (run === length) return [{ at: draw.drawnAt, gameId: draw.gameId }];
  }
  return [];
}
