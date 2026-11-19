import "server-only";
import { confirmRoundAttendance } from "@roll-and-call/database/games";
import { isRoundOpen } from "@roll-and-call/database/games/model";

import type { ActionResult } from "@/shared/api";

import type { AttendanceActor } from "../model/attendance-actor";
import { ATTENDANCE_PAST_DEADLINE_MESSAGE } from "../model/attendance-messages";
import { AttendanceError } from "./attendance-error";
import { guardRound } from "./guard-round";

// 다회차 회차의 출석을 확정하거나 다시 고친다. 웹 액션과 디스코드 [완료]가 함께 쓴다. 불참 기록은 남기지 않는다.
export async function submitRoundAttendance({
  actor,
  gameId,
  roundNo,
  absentUserIds,
}: {
  actor: AttendanceActor;
  gameId: string;
  roundNo: number;
  absentUserIds: string[];
}): Promise<ActionResult> {
  return guardRound({
    actor,
    gameId,
    roundNo,
    work: async (transaction, _game, round) => {
      const now = new Date();
      if (!isRoundOpen({ round, now })) {
        throw new AttendanceError(
          round.startAt && round.startAt > now
            ? "아직 시작하지 않은 회차입니다."
            : ATTENDANCE_PAST_DEADLINE_MESSAGE,
        );
      }
      await confirmRoundAttendance({
        transaction,
        serverId: actor.serverId,
        gameId,
        roundNo,
        absentUserIds,
        at: now,
      });
    },
  });
}
