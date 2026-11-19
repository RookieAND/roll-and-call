import { isNil } from "es-toolkit";

import type { MultiRoundGame } from "@/entities/game";

export type SummaryGame = MultiRoundGame & { finishedAt: Date | null; incompleteAt: Date | null };

// 요약 첫 줄의 진행 부분. 조기 종결·모두 끝남·진행 중·시작 전.
export function roundsProgressText({
  game,
  lastFinished,
}: {
  game: SummaryGame;
  lastFinished: number | undefined;
}) {
  if (game.incompleteAt) return `${lastFinished ?? 1}회차에서 마쳤습니다`;
  if (game.finishedAt) return "모두 마쳤습니다";
  return isNil(lastFinished) ? "아직 시작하지 않았습니다" : `${lastFinished}회차까지 마쳤습니다`;
}
