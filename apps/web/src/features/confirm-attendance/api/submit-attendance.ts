import "server-only";
import {
  listAttendanceRows,
  markAttendanceConfirmed,
  saveAttendance,
} from "@roll-and-call/database/games";
import { gmAttendanceNotices, type AttendanceAbsence } from "@roll-and-call/database/games/model";
import { createNotifications } from "@roll-and-call/database/notifications";
import { isNull } from "es-toolkit";
import { after } from "next/server";

import type { ActionResult } from "@/shared/api";
import { siteOrigin, syncGameReviewForumPosts } from "@/shared/server";

import { absencesError } from "../model/absences-error";
import type { AttendanceActor } from "../model/attendance-actor";
import { AttendanceError } from "./attendance-error";
import { guardAttendance } from "./guard-attendance";

// 명단 전원을 다시 쓴다. 기본값이 참석이라 absences에 없는 사람은 참석이고, 내보낸 사람은 확정으로 돌아온다.
// 불참 기록·취소 알림은 같은 트랜잭션에서 넣는다.
export async function submitAttendance({
  actor,
  gameId,
  absences,
}: {
  actor: AttendanceActor;
  gameId: string;
  absences: AttendanceAbsence[];
}): Promise<ActionResult> {
  const { serverId } = actor;
  const result = await guardAttendance({
    gameId,
    userIds: absences.map((absence) => absence.userId),
    actor,
    work: async (transaction, { confirmedUserIds, removedUserIds }, game) => {
      const rosterUserIds = [...confirmedUserIds, ...removedUserIds];
      const error = absencesError({ absences, rosterUserIds });
      if (!isNull(error)) throw new AttendanceError(error);

      const changes = await saveAttendance({
        transaction,
        serverId,
        gameId,
        rosterUserIds,
        absences,
      });
      await markAttendanceConfirmed({ transaction, serverId, gameId, at: new Date() });
      const rows = await listAttendanceRows({
        transaction,
        serverId,
        gameId,
        userIds: rosterUserIds,
      });
      await createNotifications({
        executor: transaction,
        serverId,
        actorId: game.gmId,
        notifications: gmAttendanceNotices({
          game: { id: gameId, title: game.title },
          rows,
          changes,
        }),
      });
    },
  });
  if (!result.error) {
    after(() => syncGameReviewForumPosts({ serverId, gameId, siteOrigin: siteOrigin() }));
  }
  return result;
}
