"use server";

import { and, eq, inArray, notInArray } from "drizzle-orm";
import { after } from "next/server";

import type { ActionResult } from "@/shared/api";
import { games, participants, siteOrigin, syncGameReviewForumPosts } from "@/shared/server";

import { AttendanceError } from "./attendance-error";
import { guardAttendance } from "./guard-attendance";

// 확정 참여자 전원을 다시 쓴다. 기본값이 참석이라 목록에 없는 사람은 absent를 되돌린다.
export async function confirmAttendance({
  gameId,
  absentUserIds,
}: {
  gameId: string;
  absentUserIds: string[];
}): Promise<ActionResult> {
  const result = await guardAttendance({
    gameId,
    work: async (transaction, confirmedUserIds) => {
      const absent = absentUserIds.filter((userId) => confirmedUserIds.includes(userId));
      if (absent.length !== absentUserIds.length) {
        throw new AttendanceError("명단에 없는 참여자입니다.");
      }

      const scope = and(
        eq(participants.gameId, gameId),
        inArray(participants.userId, confirmedUserIds),
      );
      await transaction
        .update(participants)
        .set({ absent: false })
        .where(absent.length === 0 ? scope : and(scope, notInArray(participants.userId, absent)));
      if (absent.length > 0) {
        await transaction
          .update(participants)
          .set({ absent: true })
          .where(and(eq(participants.gameId, gameId), inArray(participants.userId, absent)));
      }

      await transaction
        .update(games)
        .set({ attendanceConfirmedAt: new Date() })
        .where(eq(games.id, gameId));
    },
  });
  if (!result.error) after(() => syncGameReviewForumPosts({ gameId, siteOrigin: siteOrigin() }));
  return result;
}
