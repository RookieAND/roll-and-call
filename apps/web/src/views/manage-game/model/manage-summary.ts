import { isNil } from "es-toolkit";

import {
  GAME_CANCEL_KIND,
  isDeadlinePassed,
  isSessionEnded,
  isSessionInProgress,
  MANAGE_STAGE,
  plannedEndAt,
  RECRUIT_METHOD,
  splitRoster,
  type ManageStage,
} from "@/entities/game";
import { formatDate, toKst } from "@/shared/lib";
import type { GameDetailData } from "@/shared/server";

import { attendanceRoster } from "./attendance-roster";

const NO_BREAK_SPACE = " ";

// wrap이면 320px에서 넘칠 때 날짜와 시각 사이에서만 줄을 나눈다.
export type ManageStat = { label: string; value: string; danger?: boolean; wrap?: boolean };

export type ManageSummary = { stage: ManageStage; stats: ManageStat[]; cancelNote?: string };

// 위에서부터 처음 맞는 단계 하나.
export function manageSummary({
  game,
  now = new Date(),
}: {
  game: GameDetailData;
  now?: Date;
}): ManageSummary {
  const { confirmed, waiting } = splitRoster(game.participants);
  const seats: ManageStat = {
    label: "확정 인원",
    value: `${confirmed.length} / ${game.maxPlayers}명`,
  };

  if (!isNil(game.cancelledAt)) {
    const cancelNote =
      game.cancelKind === GAME_CANCEL_KIND.gm
        ? (game.cancelReason ?? "")
        : "운영진이 취소한 구인입니다";
    return { stage: MANAGE_STAGE.cancelled, stats: [], cancelNote };
  }

  if (game.recruitMethod === RECRUIT_METHOD.lottery && isNil(game.drawnAt)) {
    return {
      stage: MANAGE_STAGE.beforeDraw,
      stats: [
        { label: "모집 마감", value: formatDate(game.endDate) },
        { label: "신청", value: `${waiting.length}명` },
        { label: "뽑을 인원", value: `${Math.max(game.maxPlayers - confirmed.length, 0)}명` },
      ],
    };
  }

  if (isNil(game.confirmedAt)) {
    const overdue = isDeadlinePassed(game.endDate, now);
    return {
      stage: overdue ? MANAGE_STAGE.overdue : MANAGE_STAGE.coordinating,
      stats: [
        {
          label: "조율 마감",
          value: `${formatDate(game.endDate)}${overdue ? " 지남" : ""}`,
          danger: overdue,
        },
        seats,
      ],
    };
  }

  const start = toKst(game.confirmedAt);
  const schedule: ManageStat = {
    label: "세션 일시",
    value: `${start.format("M월 D일 (dd)").replaceAll(" ", NO_BREAK_SPACE)} ${start.format("HH:mm")}`,
    wrap: true,
  };

  if (isSessionInProgress(game, now)) {
    return {
      stage: MANAGE_STAGE.inProgress,
      stats: [
        schedule,
        seats,
        { label: "예정 종료", value: toKst(plannedEndAt(game)!).format("HH:mm") },
      ],
    };
  }

  if (isSessionEnded(game, now)) {
    const roster = attendanceRoster(game.participants);
    const attended = game.attendanceConfirmedAt
      ? roster.filter(
          (participant) => !participant.absent || !isNil(participant.absenceCancelledAt),
        ).length
      : 0;
    return {
      stage: MANAGE_STAGE.ended,
      stats: [schedule, seats, { label: "출석", value: `${attended} / ${roster.length}명` }],
    };
  }

  return {
    stage: MANAGE_STAGE.confirmed,
    stats: [schedule, seats, { label: "대기", value: `${waiting.length}명` }],
  };
}
