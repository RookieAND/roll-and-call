import type { ScheduleConflictRejection } from "@/entities/game";

export const CONFLICT_LINE_LIMIT = 3;

export function hasGmOverlap(conflict: ScheduleConflictRejection) {
  return conflict.gmOverlaps.length > 0 || conflict.conflicts.some((entry) => entry.role === "gm");
}

// 겹친 참여자 줄. GM 본인 겹침은 칸 오류로 따로 보인다.
export function conflictLines({
  conflict,
  nicknames,
  showRoundNos,
}: {
  conflict: ScheduleConflictRejection;
  nicknames: Record<string, string>;
  showRoundNos: boolean;
}) {
  const people = conflict.conflicts.filter((entry) => entry.role !== "gm");
  return {
    lines: people.slice(0, CONFLICT_LINE_LIMIT).map((entry) => {
      const prefix = showRoundNos ? `${entry.roundNos.join("·")}회차 · ` : "";
      return {
        text: `${prefix}${nicknames[entry.userId] ?? "참여자"}님은 이 시간에 다른 세션이 있습니다.`,
        waiting: entry.role === "waiting",
      };
    }),
    moreCount: Math.max(0, people.length - CONFLICT_LINE_LIMIT),
    hasWaiting: people.some((entry) => entry.role === "waiting"),
  };
}
