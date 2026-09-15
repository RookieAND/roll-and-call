import { isDeadlinePassed } from "@/entities/game";
import { ddayKst, formatDateTime } from "@/shared/lib";

import type { ManagedMember } from "./managed-member";

const DEADLINE_WARN_DAYS = 3;

// 서버에서 계산해 날짜 경계에서 값이 갈리지 않게 한다.
export function summarizeRoster({
  confirmed,
  maxPlayers,
  endDate,
  isCoordinate,
  now = new Date(),
}: {
  confirmed: ManagedMember[];
  maxPlayers: number;
  endDate: Date;
  isCoordinate: boolean;
  now?: Date;
}) {
  const passed = isDeadlinePassed(endDate, now);
  const daysLeft = ddayKst(endDate, now);

  return {
    isFull: confirmed.length >= maxPlayers,
    deadlineAt: formatDateTime(endDate),
    deadlineLabel: passed ? "기한 지남" : daysLeft === 0 ? "오늘" : `D-${daysLeft}`,
    deadlineWarn: !passed && daysLeft <= DEADLINE_WARN_DAYS,
    unsubmittedCount: isCoordinate
      ? confirmed.filter((member) => !member.hasAvailability).length
      : 0,
  };
}

export type RosterSummary = ReturnType<typeof summarizeRoster>;
