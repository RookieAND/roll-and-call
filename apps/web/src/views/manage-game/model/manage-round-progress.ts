import type { GameRoundRow } from "@roll-and-call/database/games";
import { roundEndAt } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

// 운영 관리 요약 카드의 진행 막대. 마친 회차 수와 예정 회차 수. 조기 종결이면 마친 회차에서 멈춘다.
export function manageRoundProgress({
  game,
  rounds,
  now,
}: {
  game: { roundCount: number; finishedAt: Date | null; incompleteAt: Date | null };
  rounds: readonly GameRoundRow[];
  now: Date;
}) {
  const finished = rounds.filter((round) => {
    const endAt = roundEndAt(round);
    return !isNil(endAt) && endAt <= now;
  });
  const early = !isNil(game.incompleteAt);
  const done = game.finishedAt && !early ? game.roundCount : finished.length;
  return { done, total: game.roundCount, early };
}
