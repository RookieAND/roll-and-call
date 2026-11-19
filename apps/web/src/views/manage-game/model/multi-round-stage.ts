import type { GameRoundRow } from "@roll-and-call/database/games";
import { roundEndAt } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

export type MultiRoundStage = { label: string; tone: "primary" | "gray"; note: string | null };

// 다회차 운영 관리의 단계 배지. 끝났거나 아직 1회차 전이면 null이라 단발과 같은 단계를 쓴다.
export function multiRoundStage({
  game,
  rounds,
  now,
}: {
  game: { roundCount: number; roundScheduleKind: string; finishedAt: Date | null; cancelledAt: Date | null };
  rounds: readonly GameRoundRow[];
  now: Date;
}): MultiRoundStage | null {
  if (game.finishedAt || game.cancelledAt) return null;
  const started = rounds.filter((round) => !isNil(round.startAt) && round.startAt <= now);
  if (started.length === 0) return null;
  const current = started.find((round) => {
    const endAt = roundEndAt(round);
    return !isNil(endAt) && endAt > now;
  });
  if (current) {
    return { label: `${current.roundNo}/${game.roundCount}회차 진행 중`, tone: "primary", note: null };
  }
  const nextScheduled = rounds.some((round) => !isNil(round.startAt) && round.startAt > now);
  const note =
    game.roundScheduleKind === "coordinated" && !nextScheduled
      ? "다음 회차 일정을 잡아 주세요."
      : null;
  return { label: "다음 회차 대기", tone: "gray", note };
}
