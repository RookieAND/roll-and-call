import {
  isDeadlinePassed,
  RECRUIT_METHOD,
  recruitMethodLabel,
  type RecruitMethod,
} from "@/entities/game";
import { ddayKst, formatDateTime } from "@/shared/lib";

import type { ManagedMember } from "./managed-member";

// 서버에서 계산해 날짜 경계에서 값이 갈리지 않게 한다.
export function summarizeRoster({
  confirmed,
  waiting,
  maxPlayers,
  endDate,
  recruitMethod,
  drawnAt,
  rolled = false,
  isCoordinate,
  now = new Date(),
}: {
  confirmed: ManagedMember[];
  waiting: ManagedMember[];
  maxPlayers: number;
  endDate: Date;
  recruitMethod: RecruitMethod;
  drawnAt: Date | null;
  // 굴렸지만 GM이 아직 결과를 적용하지 않았다. 명단은 뽑기 전 그대로다.
  rolled?: boolean;
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
    awaitingApply: beforeDraw && rolled,
    // 1d100 도입 전에 뽑은 글은 굴린 값이 없어 결과 페이지가 없다.
    hasDrawResult: drawnAt !== null && rolled,
    recruitMethod,
    methodLabel: isLottery && drawnAt ? "추첨 완료" : recruitMethodLabel(recruitMethod),
    isFull: confirmed.length >= maxPlayers,
    // 뽑기 전에는 추첨에 들어갈 사람만 신청으로 센다. 직접 확정한 사람은 확정 목록에 따로 선다.
    applicantCount: beforeDraw ? waiting.length : confirmed.length + waiting.length,
    // 뽑기 전에 확정에 있는 사람은 GM이 직접 넣은 사람이다. 추첨은 남은 자리만 뽑는다.
    preConfirmedCount: beforeDraw ? confirmed.length : 0,
    drawCount: Math.max(maxPlayers - (beforeDraw ? confirmed.length : 0), 0),
    deadlineAt: formatDateTime(endDate),
    deadlineLabel: passed ? "마감됨" : daysLeft === 0 ? "오늘" : `D-${daysLeft}`,
    deadlinePassed: passed,
    daysLeft: Math.max(daysLeft, 0),
    drawnAtLabel: drawnAt ? formatDateTime(drawnAt) : null,
    unsubmittedCount: isCoordinate
      ? confirmed.filter((member) => !member.hasAvailability).length
      : 0,
  };
}

export type RosterSummary = ReturnType<typeof summarizeRoster>;
