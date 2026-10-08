import { isNil } from "es-toolkit";

import { isSessionStarted, SCHEDULE_MODE } from "@/entities/game";
import { GAME_CANCELLED_MESSAGE } from "@/shared/api";
import type { Game } from "@/shared/server";

import { isMinPlayersRaise } from "./is-min-players-raise";
import { MIN_PLAYERS_RAISE_MESSAGE } from "./min-players-raise-message";
import { pastScheduleError } from "./past-schedule-error";
import type { toGameColumns } from "./to-game-columns";

export const EDIT_FORBIDDEN_MESSAGE = "수정 권한이 없습니다.";

type EditBlock = { error: string; field?: string };

type LockedGame = Pick<
  Game,
  | "gmId"
  | "kind"
  | "cancelledAt"
  | "confirmedAt"
  | "scheduleMode"
  | "recruitMethod"
  | "windowStartHour"
  | "windowEndHour"
  | "drawnAt"
  | "minPlayers"
  | "endDate"
>;

// 잠근 행과 들어온 값으로 수정 저장을 막을 이유를 고른다. 순서가 곧 우선순위다.
export function editBlockReason(
  {
    game,
    userId,
    columns,
    rosterCount,
    confirmedCount,
  }: {
    game: LockedGame | undefined;
    userId: string;
    columns: ReturnType<typeof toGameColumns>;
    rosterCount: number;
    confirmedCount: number;
  },
  now: Date = new Date(),
): EditBlock | null {
  if (!game || game.gmId !== userId) return { error: EDIT_FORBIDDEN_MESSAGE };
  if (!isNil(game.cancelledAt)) return { error: GAME_CANCELLED_MESSAGE };
  if (isSessionStarted(game, now)) return { error: "시작한 세션은 고칠 수 없습니다." };

  if (columns.maxPlayers < confirmedCount) {
    return {
      error: `확정 참여자가 ${confirmedCount}명이라 정원을 ${confirmedCount}명보다 줄일 수 없습니다.`,
      field: "maxPlayers",
    };
  }
  if (rosterCount > 0 && isMinPlayersRaise({ saved: game.minPlayers, next: columns.minPlayers })) {
    return { error: MIN_PLAYERS_RAISE_MESSAGE, field: "minPlayers" };
  }
  // 조율 응답·확정 명단이 일정 방식·시간대에, 확정 순서가 모집 방식에 묶여 있어 신청자가 있으면 못 바꾼다.
  if (rosterCount > 0) {
    if (columns.kind !== game.kind) {
      return {
        error: "신청자가 있어 구분은 바꿀 수 없습니다. 참여자 관리에서 명단을 비운 뒤 바꿔 주세요.",
        field: "kind",
      };
    }
    if (columns.scheduleMode !== game.scheduleMode) {
      return {
        error:
          "신청자가 있어 일정 방식은 바꿀 수 없습니다. 참여자 관리에서 명단을 비운 뒤 바꿔 주세요.",
        field: "scheduleMode",
      };
    }
    if (columns.recruitMethod !== game.recruitMethod) {
      return {
        error:
          "신청자가 있어 모집 방식은 바꿀 수 없습니다. 참여자 관리에서 명단을 비운 뒤 바꿔 주세요.",
        field: "recruitMethod",
      };
    }
    if (
      game.scheduleMode === SCHEDULE_MODE.coordinate &&
      (columns.windowStartHour !== game.windowStartHour ||
        columns.windowEndHour !== game.windowEndHour)
    ) {
      return {
        error:
          "신청자가 있어 조율 시간대는 바꿀 수 없습니다. 참여자 관리에서 명단을 비운 뒤 바꿔 주세요.",
        field: "windowStartHour",
      };
    }
  }

  const endDateChanged = columns.endDate.getTime() !== game.endDate.getTime();
  if (!isNil(game.drawnAt) && endDateChanged) {
    return { error: "추첨을 마친 구인은 모집 마감을 바꿀 수 없습니다.", field: "endDate" };
  }

  const confirmedAtChanged =
    columns.scheduleMode === SCHEDULE_MODE.fixed &&
    columns.confirmedAt?.getTime() !== game.confirmedAt?.getTime();
  return pastScheduleError(
    {
      endDate: endDateChanged ? columns.endDate : undefined,
      confirmedAt: confirmedAtChanged ? columns.confirmedAt : undefined,
    },
    now,
  );
}
