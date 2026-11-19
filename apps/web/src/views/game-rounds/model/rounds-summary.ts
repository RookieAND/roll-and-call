import type { GameRoundRow } from "@roll-and-call/database/games";
import { roundEndAt } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

import { repeatPhrase, repeatWindow } from "@/entities/game";

import { roundsProgressText, type SummaryGame } from "./rounds-progress-text";

// 회차 일정 화면 위 요약 두 줄. 「총 6회 · 3회차까지 마쳤습니다」와 「지정형 · 매주 토 오후 12:00~4:00」.
export function roundsSummary({
  game,
  rounds,
  now,
}: {
  game: SummaryGame;
  rounds: readonly GameRoundRow[];
  now: Date;
}): { title: string; sub: string } {
  const finished = rounds.filter((round) => {
    const endAt = roundEndAt(round);
    return !isNil(endAt) && endAt <= now;
  });
  const lastFinished = finished.at(-1)?.roundNo;
  const total = `총 ${game.roundCount}회`;
  const progress = roundsProgressText({ game, lastFinished });
  const repeat = repeatWindow(game);
  const sub =
    game.roundScheduleKind === "coordinated"
      ? "조율형 · 한 회차씩 정합니다"
      : `지정형${repeat ? ` · ${repeatPhrase(repeat)}` : ""}`;
  return { title: `${total} · ${progress}`, sub };
}
