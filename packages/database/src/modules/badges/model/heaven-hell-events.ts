import type { BadgeDraw } from "./badge-facts";
import type { BadgeEvent } from "./reached-tier";

const BEST_ROLL = 1;
const WORST_ROLL = 100;

// 가장 좋은 눈(1)과 가장 나쁜 눈(100)을 모두 굴린 순간. 늦게 나온 쪽이 근거다.
export function heavenHellEvents(draws: BadgeDraw[]): BadgeEvent[] {
  const firstOf = (roll: number) =>
    draws
      .filter((draw) => draw.roll === roll)
      .toSorted((left, right) => left.drawnAt.getTime() - right.drawnAt.getTime())[0];
  const best = firstOf(BEST_ROLL);
  const worst = firstOf(WORST_ROLL);
  if (!best || !worst) return [];
  const later = best.drawnAt.getTime() >= worst.drawnAt.getTime() ? best : worst;
  return [{ at: later.drawnAt, gameId: later.gameId }];
}
