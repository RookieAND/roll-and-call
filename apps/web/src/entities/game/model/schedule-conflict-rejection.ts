import type { ScheduleConflict } from "@roll-and-call/database/games";
import type { TargetRound } from "@roll-and-call/database/games/model";

export const SCHEDULE_CONFLICT_REASON = "SCHEDULE_OVERLAP";

export const SCHEDULE_CONFLICT_MESSAGE = "겹치는 세션이 있어 일정을 저장할 수 없습니다.";

// GM 본인이 맡거나 확정·대기 중인 다른 구인과 겹친 회차. 이 구인의 회차 시각과 GM 자신의 다른 구인 제목이다.
export type GmOverlap = {
  targetRoundNo: number;
  startsAt: Date;
  endsAt: Date;
  gameTitle: string;
};

// GM에게는 겹친 사람과 이 구인의 회차 번호만 돌려주고, GM이 아닌 사람의 다른 구인 정보는 담지 않는다.
export type ScheduleConflictRejection = {
  error: string;
  reason: typeof SCHEDULE_CONFLICT_REASON;
  conflicts: { userId: string; role: ScheduleConflict["role"]; roundNos: number[] }[];
  gmOverlaps: GmOverlap[];
};

export function scheduleConflictRejection(
  conflicts: readonly ScheduleConflict[],
  target: readonly TargetRound[] = [],
): ScheduleConflictRejection {
  const gmOverlaps = conflicts
    .filter((conflict) => conflict.role === "gm")
    .flatMap((conflict) => conflict.overlaps)
    .flatMap(({ targetRoundNo, gameTitle }) => {
      const round = target.find((candidate) => candidate.roundNo === targetRoundNo);
      return round
        ? [{ targetRoundNo, startsAt: round.startsAt, endsAt: round.endsAt, gameTitle }]
        : [];
    });
  return {
    error: SCHEDULE_CONFLICT_MESSAGE,
    reason: SCHEDULE_CONFLICT_REASON,
    conflicts: conflicts.map(({ userId, role, roundNos }) => ({ userId, role, roundNos })),
    gmOverlaps,
  };
}

export function isScheduleConflictRejection(result: object): result is ScheduleConflictRejection {
  return "reason" in result && result.reason === SCHEDULE_CONFLICT_REASON && "gmOverlaps" in result;
}
