import "server-only";
import {
  listParticipantUserIds,
  lockGame,
  withTransaction,
  type Transaction,
} from "@roll-and-call/database/web";
import { after } from "next/server";

import { isAttendanceDue, PARTICIPANT_STATUS } from "@/entities/game";
import {
  AUTH_REQUIRED_MESSAGE,
  ERROR_DISPLAY,
  GAME_NOT_FOUND_MESSAGE,
  type ActionResult,
} from "@/shared/api";
import { evaluateGameBadges, getCurrentServer, getCurrentUser } from "@/shared/server";

import { AttendanceError } from "./attendance-error";
import { revalidateAttendance } from "./revalidate-attendance";

// 출석을 건드리는 모든 길이 거치는 곳: 게임 행을 잠그고 GM 본인·세션이 끝났는지를 확인한다.
export async function guardAttendance({
  gameId,
  work,
}: {
  gameId: string;
  work: (transaction: Transaction, confirmedUserIds: string[]) => Promise<void>;
}): Promise<ActionResult> {
  const gmId = (await getCurrentUser())?.id;
  if (!gmId) return { error: AUTH_REQUIRED_MESSAGE };
  const serverId = (await getCurrentServer()).id;

  try {
    await withTransaction(async (transaction) => {
      const game = await lockGame({ transaction, serverId, gameId });
      if (!game) throw new AttendanceError(GAME_NOT_FOUND_MESSAGE, ERROR_DISPLAY.page);
      if (game.gmId !== gmId) throw new AttendanceError("권한이 없습니다.");

      const confirmedUserIds = await listParticipantUserIds({
        transaction,
        serverId,
        gameId,
        status: PARTICIPANT_STATUS.confirmed,
      });

      // 다시 여는 길도 같은 가드를 타므로 확정 시각은 빼고 "세션이 끝났는가"만 본다.
      if (
        !isAttendanceDue({
          game: { ...game, attendanceConfirmedAt: null },
          confirmedCount: confirmedUserIds.length,
        })
      ) {
        throw new AttendanceError("아직 끝나지 않은 세션입니다.");
      }

      await work(transaction, confirmedUserIds);
    });
  } catch (error) {
    if (error instanceof AttendanceError) {
      return { error: error.message, errorDisplay: error.display };
    }
    throw error;
  }

  revalidateAttendance(gameId);
  after(() => evaluateGameBadges({ serverId, gameId }));
  return {};
}
