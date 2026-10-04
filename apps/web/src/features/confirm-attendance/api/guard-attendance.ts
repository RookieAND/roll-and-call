import "server-only";
import { listParticipantUserIds, lockGame } from "@roll-and-call/database/games";
import { withTransaction, type Transaction } from "@roll-and-call/database/transaction";
import { after } from "next/server";

import { isAttendanceDue, isAttendancePastDeadline, PARTICIPANT_STATUS } from "@/entities/game";
import {
  ERROR_DISPLAY,
  GAME_CANCELLED_MESSAGE,
  GAME_NOT_FOUND_MESSAGE,
  type ActionResult,
} from "@/shared/api";
import {
  type Game,
  evaluateGameBadges,
  getActingMember,
  notMemberError,
  revalidateGamePaths,
} from "@/shared/server";

import { ATTENDANCE_PAST_DEADLINE_MESSAGE } from "../model/attendance-messages";
import type { AttendanceRoster } from "../model/attendance-roster";
import { AttendanceError } from "./attendance-error";

// 출석을 건드리는 모든 길이 거치는 곳: 게임 행을 잠그고 GM 본인·세션이 끝났는지를 확인한다.
// 명단은 지금 확정 + 세션 중 불참으로 내보낸 사람이다.
export async function guardAttendance({
  gameId,
  work,
}: {
  gameId: string;
  // game은 잠근 행이다(출석 확정 시각을 쓰기 전 값).
  work: (transaction: Transaction, roster: AttendanceRoster, game: Game) => Promise<void>;
}): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server } = member;
  const gmId = member.user.id;
  const serverId = server.id;

  try {
    await withTransaction(async (transaction) => {
      const game = await lockGame({ transaction, serverId, gameId });
      if (!game) throw new AttendanceError(GAME_NOT_FOUND_MESSAGE, ERROR_DISPLAY.page);
      if (game.gmId !== gmId) throw new AttendanceError("권한이 없습니다.");
      if (game.cancelledAt) throw new AttendanceError(GAME_CANCELLED_MESSAGE);

      const confirmedUserIds = await listParticipantUserIds({
        transaction,
        serverId,
        gameId,
        status: PARTICIPANT_STATUS.confirmed,
      });
      const removedUserIds = await listParticipantUserIds({
        transaction,
        serverId,
        gameId,
        status: PARTICIPANT_STATUS.removed,
      });

      if (isAttendancePastDeadline({ ...game, now: new Date() })) {
        throw new AttendanceError(ATTENDANCE_PAST_DEADLINE_MESSAGE);
      }
      // 다시 고친 뒤 확정하는 길도 같은 가드를 타므로 확정 시각은 빼고 "세션이 끝났는가"만 본다.
      if (
        !isAttendanceDue({
          game: { ...game, attendanceConfirmedAt: null },
          confirmedCount: confirmedUserIds.length,
        })
      ) {
        throw new AttendanceError("아직 끝나지 않은 세션입니다.");
      }

      await work(transaction, { confirmedUserIds, removedUserIds }, game);
    });
  } catch (error) {
    if (error instanceof AttendanceError) {
      return { error: error.message, errorDisplay: error.display };
    }
    throw error;
  }

  revalidateGamePaths({ slug: server.slug, gameId });
  after(() => evaluateGameBadges({ serverId, gameId }));
  return {};
}
