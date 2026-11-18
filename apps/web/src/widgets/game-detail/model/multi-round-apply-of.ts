import type { GameDetailData } from "@roll-and-call/database/games";

import { applySummaryLines, type RoundScheduleRound } from "@/entities/game";
import type { MultiRoundApply } from "@/features/join-game";

// 여러 번 진행하는 구인이고 회차를 읽어 왔을 때만 신청 시트에 일정 요약을 붙인다.
export function multiRoundApplyOf({
  game,
  rounds,
}: {
  game: GameDetailData;
  rounds: readonly RoundScheduleRound[] | null | undefined;
}): MultiRoundApply | undefined {
  if (game.roundCount <= 1 || !rounds) return undefined;
  return { summaryLines: applySummaryLines(game), rounds: [...rounds] };
}
