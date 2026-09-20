import "server-only";
import { and, eq } from "drizzle-orm";

import { isAttendanceDue, PARTICIPANT_STATUS } from "@/entities/game";
import {
  AUTH_REQUIRED_MESSAGE,
  ERROR_DISPLAY,
  GAME_NOT_FOUND_MESSAGE,
  type ActionResult,
} from "@/shared/api";
import { db, games, getCurrentUser, participants } from "@/shared/server";

import { AttendanceError } from "./attendance-error";
import { revalidateAttendance } from "./revalidate-attendance";
import type { Transaction } from "./transaction";

// 출석을 건드리는 모든 길이 거치는 곳: 게임 행을 잠그고 GM 본인·세션이 끝났는지를 확인한다.
export async function guardAttendance(
  gameId: string,
  work: (transaction: Transaction, confirmedUserIds: string[]) => Promise<void>,
): Promise<ActionResult> {
  const gmId = (await getCurrentUser())?.id;
  if (!gmId) return { error: AUTH_REQUIRED_MESSAGE };

  try {
    await db.transaction(async (transaction) => {
      const [game] = await transaction
        .select()
        .from(games)
        .where(eq(games.id, gameId))
        .for("update");
      if (!game) throw new AttendanceError(GAME_NOT_FOUND_MESSAGE, ERROR_DISPLAY.page);
      if (game.gmId !== gmId) throw new AttendanceError("권한이 없습니다.");

      const confirmed = await transaction
        .select({ userId: participants.userId })
        .from(participants)
        .where(
          and(
            eq(participants.gameId, gameId),
            eq(participants.status, PARTICIPANT_STATUS.confirmed),
          ),
        );

      // 다시 여는 길도 같은 가드를 타므로 확정 시각은 빼고 "세션이 끝났는가"만 본다.
      if (!isAttendanceDue({ ...game, attendanceConfirmedAt: null }, confirmed.length)) {
        throw new AttendanceError("아직 끝나지 않은 세션입니다.");
      }

      await work(
        transaction,
        confirmed.map((member) => member.userId),
      );
    });
  } catch (error) {
    if (error instanceof AttendanceError) {
      return { error: error.message, errorDisplay: error.display };
    }
    throw error;
  }

  revalidateAttendance(gameId);
  return {};
}
