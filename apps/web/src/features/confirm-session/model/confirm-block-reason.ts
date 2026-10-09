import { AWAITING_RESULT_PHRASE, awaitingResultMethod } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

import {
  isSessionStarted,
  SCHEDULE_MODE,
  type RecruitMethod,
  type ScheduleMode,
} from "@/entities/game";
import { GAME_CANCELLED_MESSAGE, GAME_NOT_FOUND_RESULT, type ActionResult } from "@/shared/api";

import { coordinateRangeError } from "./coordinate-range-error";
import { fixedAfterDeadlineError } from "./fixed-after-deadline-error";

export const CONFIRM_FORBIDDEN_MESSAGE = "확정 권한이 없습니다.";

// 세션 시간을 정하거나 바꿀 수 없는 이유. 정할 수 있으면 null. 잠근 구인 행으로 판단한다.
export function confirmBlockReason(
  {
    game,
    userId,
    startsAt,
  }: {
    game:
      | {
          cancelledAt: Date | null;
          gmId: string;
          scheduleMode: ScheduleMode;
          recruitMethod: RecruitMethod;
          drawnAt: Date | null;
          selectionFinishedAt: Date | null;
          confirmedAt: Date | null;
          endDate: Date;
          rangeStart: string | null;
          rangeEnd: string | null;
          windowStartHour: number;
          windowEndHour: number;
        }
      | undefined;
    userId: string;
    startsAt: Date;
  },
  now: Date = new Date(),
): ActionResult | null {
  if (!game) return GAME_NOT_FOUND_RESULT;
  if (!isNil(game.cancelledAt)) return { error: GAME_CANCELLED_MESSAGE };
  if (game.gmId !== userId) return { error: CONFIRM_FORBIDDEN_MESSAGE };
  const isFixed = game.scheduleMode === SCHEDULE_MODE.fixed;
  const awaiting = awaitingResultMethod(game);
  if (!isFixed && awaiting) {
    return { error: `${AWAITING_RESULT_PHRASE[awaiting]} 세션 시간을 정할 수 있습니다.` };
  }
  if (isNil(game.confirmedAt) && isFixed) return { error: "세션 시간이 없는 구인입니다." };
  if (isSessionStarted(game, now)) return { error: "시작한 세션은 시간을 바꿀 수 없습니다." };
  if (startsAt.getTime() < now.getTime()) return { error: "지난 시각으로는 정할 수 없습니다." };
  return isFixed
    ? fixedAfterDeadlineError({ game, startsAt })
    : coordinateRangeError({ game, startsAt });
}
