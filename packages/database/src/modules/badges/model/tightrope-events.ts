import type { BadgeDraw } from "./badge-facts";
import type { BadgeEvent } from "./reached-tier";

const TIGHTROPE_LENGTH = 5;

// 추첨을 시간순으로 세어 확정과 대기가 번갈아 TIGHTROPE_LENGTH번 이어진 추첨. 같은 결과가 두 번 이어지면 끊긴다.
export function tightropeEvents(draws: BadgeDraw[]): BadgeEvent[] {
  let run = 0;
  let previous: boolean | null = null;
  for (const draw of draws.toSorted(
    (left, right) => left.drawnAt.getTime() - right.drawnAt.getTime(),
  )) {
    run = previous !== null && draw.picked !== previous ? run + 1 : 1;
    previous = draw.picked;
    if (run === TIGHTROPE_LENGTH) return [{ at: draw.drawnAt, gameId: draw.gameId }];
  }
  return [];
}
