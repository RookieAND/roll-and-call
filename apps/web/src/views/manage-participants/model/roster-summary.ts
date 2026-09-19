import { isDeadlinePassed, RECRUIT_METHOD, type RecruitMethod } from "@/entities/game";
import { ddayKst, formatDateTime } from "@/shared/lib";

import type { ManagedMember } from "./managed-member";

const DEADLINE_WARN_DAYS = 3;

// 서버에서 계산해 날짜 경계에서 값이 갈리지 않게 한다.
export function summarizeRoster({
  confirmed,
  waiting,
  maxPlayers,
  endDate,
  recruitMethod,
  drawnAt,
  isCoordinate,
  now = new Date(),
}: {
  confirmed: ManagedMember[];
  waiting: ManagedMember[];
  maxPlayers: number;
  endDate: Date;
  recruitMethod: RecruitMethod;
  drawnAt: Date | null;
  isCoordinate: boolean;
  now?: Date;
}) {
  const passed = isDeadlinePassed(endDate, now);
  const daysLeft = ddayKst(endDate, now);
  const isLottery = recruitMethod === RECRUIT_METHOD.lottery;
  // 뽑기 전에는 확정도 대기도 없다 — 모두 같은 "신청자"다.
  const beforeDraw = isLottery && drawnAt === null;

  return {
    isLottery,
    beforeDraw,
    methodLabel: !isLottery ? "선착순" : drawnAt ? "추첨 완료" : "추첨",
    isFull: confirmed.length >= maxPlayers,
    applicantCount: confirmed.length + waiting.length,
    deadlineAt: formatDateTime(endDate),
    deadlineLabel: passed ? "마감됨" : daysLeft === 0 ? "오늘" : `D-${daysLeft}`,
    deadlineWarn: !passed && daysLeft <= DEADLINE_WARN_DAYS,
    deadlinePassed: passed,
    daysLeft: Math.max(daysLeft, 0),
    drawnAtLabel: drawnAt ? formatDateTime(drawnAt) : null,
    unsubmittedCount: isCoordinate
      ? (beforeDraw ? [...confirmed, ...waiting] : confirmed).filter(
          (member) => !member.hasAvailability,
        ).length
      : 0,
  };
}

export type RosterSummary = ReturnType<typeof summarizeRoster>;
