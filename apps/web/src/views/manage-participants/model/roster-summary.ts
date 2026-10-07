import { isNull } from "es-toolkit";

import {
  canDrawLottery,
  isDeadlinePassed,
  RECRUIT_METHOD,
  recruitMethodLabel,
  type RecruitMethod,
} from "@/entities/game";
import { ddayKst } from "@/shared/lib";

import { deadlineLabel } from "./deadline-label";
import type { ManagedMember } from "./managed-member";

// 서버에서 계산해 날짜 경계에서 값이 갈리지 않게 한다. confirmed에는 불참으로 내보낸 사람이 들어 있지 않다.
export function summarizeRoster({
  confirmed,
  waiting,
  maxPlayers,
  minPlayers = null,
  endDate,
  recruitMethod,
  drawnAt,
  hasRolls = false,
  started,
  capacityRaised,
  now = new Date(),
}: {
  confirmed: ManagedMember[];
  waiting: ManagedMember[];
  maxPlayers: number;
  minPlayers?: number | null;
  endDate: Date;
  recruitMethod: RecruitMethod;
  drawnAt: Date | null;
  // 추첨에서 굴린 값이 있다. 신청자 없이 마감된 추첨 글과 1d100 도입 전 추첨은 값이 없다.
  hasRolls?: boolean;
  started: boolean;
  capacityRaised: boolean;
  now?: Date;
}) {
  const passed = isDeadlinePassed(endDate, now);
  const daysLeft = ddayKst(endDate, now);
  const isLottery = recruitMethod === RECRUIT_METHOD.lottery;
  const beforeDraw = isLottery && isNull(drawnAt);
  const noApplicantsClosed =
    isLottery &&
    passed &&
    !hasRolls &&
    waiting.length === 0 &&
    (beforeDraw || confirmed.length === 0);

  return {
    isLottery,
    beforeDraw,
    drawn: !isNull(drawnAt),
    // 1d100 도입 전에 뽑은 글과 신청자 없이 마감된 글은 굴린 값이 없어 결과 표가 없다.
    hasDrawResult: !isNull(drawnAt) && hasRolls,
    noApplicantsClosed,
    recruitMethod,
    methodLabel: isLottery && drawnAt ? "추첨 완료" : recruitMethodLabel(recruitMethod),
    isFull: confirmed.length >= maxPlayers,
    started,
    capacityRaised,
    // 신청자(직접 확정 포함)가 최소 인원에 못 미쳐 지금 추첨할 수 없을 때의 최소 인원. 그 밖에는 null이다.
    blockedMinPlayers:
      beforeDraw &&
      !canDrawLottery({
        minPlayers,
        confirmedCount: confirmed.length,
        applicantCount: waiting.length,
      })
        ? minPlayers
        : null,
    // 뽑기 전에는 추첨에 들어갈 사람만 신청으로 센다. 직접 확정한 사람은 확정 목록에 따로 선다.
    applicantCount: waiting.length,
    // 뽑기 전에 확정에 있는 사람은 GM이 직접 넣은 사람이다. 추첨은 남은 자리만 뽑는다.
    drawCount: Math.max(maxPlayers - (beforeDraw ? confirmed.length : 0), 0),
    deadlineAt: endDate,
    deadlineLabel: deadlineLabel({ passed, daysLeft }),
    deadlinePassed: passed,
    drawnAt,
  };
}

export type RosterSummary = ReturnType<typeof summarizeRoster>;
