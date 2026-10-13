import { groupBy } from "es-toolkit";

import type { BadgeDraw } from "./badge-facts";
import { kstMonthKey } from "./kst-month-key";
import type { BadgeEvent } from "./reached-tier";

const TEN_TRIES = 10;

// 같은 달(KST)에 추첨 구인 10곳에 신청한 사람. 사건은 그 달 10번째 추첨의 시각이다.
export function tenTriesEvents(draws: BadgeDraw[]): BadgeEvent[] {
  const byMonth = groupBy(draws, (draw) => kstMonthKey(draw.drawnAt));
  return Object.values(byMonth)
    .filter((monthDraws) => monthDraws.length >= TEN_TRIES)
    .map((monthDraws) => {
      const tenth = monthDraws.toSorted(
        (left, right) => left.drawnAt.getTime() - right.drawnAt.getTime(),
      )[TEN_TRIES - 1]!;
      return { at: tenth.drawnAt, gameId: tenth.gameId };
    })
    .toSorted((left, right) => left.at.getTime() - right.at.getTime())
    .slice(0, 1);
}
