import type { GameRoundRow } from "@roll-and-call/database/games";
import { roundEndAt } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

import { repeatPhrase, repeatWindow } from "@/entities/game";

import { roundsProgressText, type SummaryGame } from "./rounds-progress-text";

// 회차 일정 화면 위 요약. 진행 카드는 마친 회차 수와 예정 회차 수, 배지는 진행 방식과 반복 규칙이다.
export function roundsSummary({
  game,
  rounds,
  now,
}: {
  game: SummaryGame;
  rounds: readonly GameRoundRow[];
  now: Date;
}): {
  title: string;
  sub: string;
  finishedCount: number;
  total: number;
  early: boolean;
  badges: string[];
} {
  const finished = rounds.filter((round) => {
    const endAt = roundEndAt(round);
    return !isNil(endAt) && endAt <= now;
  });
  const lastFinished = finished.at(-1)?.roundNo;
  const total = `총 ${game.roundCount}회`;
  const progress = roundsProgressText({ game, lastFinished });
  const repeat = repeatWindow(game);
  const coordinated = game.roundScheduleKind === "coordinated";
  const badges = coordinated
    ? ["조율형", "한 회차씩 정합니다"]
    : ["지정형", ...(repeat ? [repeatPhrase(repeat)] : [])];
  const early = !isNil(game.incompleteAt);
  let finishedCount = finished.length;
  if (early) finishedCount = lastFinished ?? 1;
  else if (game.finishedAt) finishedCount = game.roundCount;
  return {
    title: `${total} · ${progress}`,
    sub: badges.join(" · "),
    finishedCount,
    total: game.roundCount,
    early,
    badges,
  };
}
