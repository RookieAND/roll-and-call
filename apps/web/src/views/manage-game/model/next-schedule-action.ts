import type { GameRoundRow } from "@roll-and-call/database/games";
import { isNil } from "es-toolkit";

// 조율형이고 다음 회차 일정이 없을 때 Callout에 붙는 [n회차 일정 잡기]. 목록 줄 안에는 버튼을 두지 않는다.
export function nextScheduleAction({
  game,
  rounds,
  now,
}: {
  game: {
    id: string;
    roundScheduleKind: string;
    finishedAt: Date | null;
    cancelledAt: Date | null;
  };
  rounds: readonly GameRoundRow[];
  now: Date;
}): { label: string; href: string } | null {
  const next = rounds.find((round) => !isNil(round.startAt) && round.startAt > now);
  const unscheduled = rounds.find((round) => isNil(round.startAt));
  const canSchedule =
    game.roundScheduleKind === "coordinated" && isNil(game.finishedAt) && isNil(game.cancelledAt);
  if (!canSchedule || next || !unscheduled) return null;
  return {
    label: `${unscheduled.roundNo}회차 일정 잡기`,
    href: `/games/${game.id}/rounds/${unscheduled.roundNo}/schedule`,
  };
}
