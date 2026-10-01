"use server";

import { saveAttendance, setAttendanceConfirmedAt } from "@roll-and-call/database/games";
import { after } from "next/server";

import type { ActionResult } from "@/shared/api";
import { getCurrentServer, siteOrigin, syncGameReviewForumPosts } from "@/shared/server";

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
  const serverId = (await getCurrentServer()).id;
  const result = await guardAttendance({
    gameId,
    work: async (transaction, confirmedUserIds) => {
      const absent = absentUserIds.filter((userId) => confirmedUserIds.includes(userId));
      if (absent.length !== absentUserIds.length) {
        throw new AttendanceError("명단에 없는 참여자입니다.");
      }

      await saveAttendance({
        transaction,
        serverId,
        gameId,
        confirmedUserIds,
        absentUserIds: absent,
      });
      await setAttendanceConfirmedAt({
        transaction,
        serverId,
        gameId,
        attendanceConfirmedAt: new Date(),
      });
    },
  });
  if (!result.error) {
    after(() => syncGameReviewForumPosts({ serverId, gameId, siteOrigin: siteOrigin() }));
  }
  return result;
}
