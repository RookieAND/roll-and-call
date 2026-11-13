import type { ScheduleConflict } from "@roll-and-call/database/games";

export const SCHEDULE_CONFLICT_REASON = "SCHEDULE_OVERLAP";

// 임시 문구: 시안 요청서의 「GM 시간 겹침」 확인 창 문구가 시안에 반영되면 그대로 바꾼다.
export const SCHEDULE_CONFLICT_MESSAGE = "겹치는 세션이 있어 일정을 저장할 수 없습니다.";

// GM에게는 겹친 사람과 이 구인의 회차 번호만 돌려주고, 그 사람의 다른 구인 정보는 담지 않는다.
export type ScheduleConflictRejection = {
  error: string;
  reason: typeof SCHEDULE_CONFLICT_REASON;
  conflicts: { userId: string; role: ScheduleConflict["role"]; roundNos: number[] }[];
};

export function scheduleConflictRejection(
  conflicts: readonly ScheduleConflict[],
): ScheduleConflictRejection {
  return {
    error: SCHEDULE_CONFLICT_MESSAGE,
    reason: SCHEDULE_CONFLICT_REASON,
    conflicts: conflicts.map(({ userId, role, roundNos }) => ({ userId, role, roundNos })),
  };
}
